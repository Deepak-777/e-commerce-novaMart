// Firebase HTTPS functions — Stripe Checkout (test mode) + Firestore orders.
//
// Configure secret key (pick one):
//   firebase functions:config:set stripe.secret="sk_test_..."
//   or set STRIPE_SECRET_KEY in the Cloud Functions runtime env (Firebase Console).
//
// Deploy: firebase deploy --only functions

const functions = require('firebase-functions')
const admin = require('firebase-admin')
const stripeSecret =
  functions.config().stripe?.secret ||
  process.env.STRIPE_SECRET_KEY ||
  ''

const stripe = stripeSecret ? require('stripe')(stripeSecret) : null

admin.initializeApp()

const db = admin.firestore()
const PENDING = 'pendingOrders'

function cors(req, res) {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
  res.set('Access-Control-Max-Age', '3600')
}

/**
 * POST /createCheckoutSession
 * Body: { items, userId, appUrl, shipping?, tax? }
 * items: { title, price, quantity, image? }[]
 * Returns: { sessionId, url }
 */
exports.createCheckoutSession = functions.https.onRequest(async (req, res) => {
  cors(req, res)
  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return
  }
  
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed. Use POST.' })
    return
  }

  if (!stripe) {
    res.status(500).json({
      error:
        'Stripe is not configured. Set stripe.secret via firebase functions:config:set or STRIPE_SECRET_KEY.',
    })
    return
  }

  try {
    const { items, userId, appUrl, shipping = 0, tax = 0 } = req.body || {}

    if (!userId) {
      res.status(400).json({ error: 'userId is required' })
      return
    }
    if (!items?.length) {
      res.status(400).json({ error: 'No items provided' })
      return
    }

    const baseUrl = (appUrl || '').replace(/\/$/, '') || 'http://localhost:5173'

    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: Math.max(1, Number(item.quantity) || 1),
    }))

    const ship = Number(shipping) || 0
    const tx = Number(tax) || 0
    if (ship > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'Shipping' },
          unit_amount: Math.round(ship * 100),
        },
        quantity: 1,
      })
    }
    if (tx > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'Estimated tax' },
          unit_amount: Math.round(tx * 100),
        },
        quantity: 1,
      })
    }

    const subtotal = items.reduce(
      (s, i) => s + Number(i.price) * Math.max(1, Number(i.quantity) || 1),
      0
    )
    const total = subtotal + ship + tx

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      client_reference_id: userId,
      metadata: { userId },
    })

    // Persist cart snapshot for post-payment order creation (metadata alone cannot hold full cart).
    await db.collection(PENDING).doc(session.id).set({
      userId,
      items,
      total,
      shipping: ship,
      tax: tx,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    res.status(200).json({ sessionId: session.id, url: session.url })
  } catch (err) {
    console.error('createCheckoutSession:', err)
    res.status(500).json({ error: err.message || 'Checkout failed' })
  }
})

/**
 * POST /finalizeCheckoutSession
 * Headers: Authorization: Bearer <Firebase ID token>
 * Body: { sessionId }
 * Verifies Stripe payment, writes orders/{...}, deletes pending doc.
 */
exports.finalizeCheckoutSession = functions.https.onRequest(async (req, res) => {
  cors(req, res)
  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  if (!stripe) {
    res.status(500).json({ error: 'Stripe is not configured.' })
    return
  }

  try {
    const authHeader = req.headers.authorization || ''
    const m = authHeader.match(/^Bearer\s+(.+)$/i)
    if (!m) {
      res.status(401).json({ error: 'Missing Authorization bearer token' })
      return
    }
    const decoded = await admin.auth().verifyIdToken(m[1])
    const uid = decoded.uid

    const { sessionId } = req.body || {}
    if (!sessionId) {
      res.status(400).json({ error: 'sessionId is required' })
      return
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== 'paid') {
      res.status(400).json({ error: 'Payment not completed' })
      return
    }

    const pendingRef = db.collection(PENDING).doc(sessionId)
    const pendingSnap = await pendingRef.get()

    // Idempotent: success page / retries may call finalize after order already exists
    const existing = await db
      .collection('orders')
      .where('stripeSessionId', '==', sessionId)
      .limit(1)
      .get()
    if (!existing.empty) {
      const doc = existing.docs[0]
      if (doc.data().userId !== uid) {
        res.status(403).json({ error: 'Order does not belong to this user' })
        return
      }
      res.status(200).json({ ok: true, orderId: doc.id, alreadyFinalized: true })
      return
    }

    if (!pendingSnap.exists) {
      res.status(404).json({ error: 'Pending order not found (session expired or invalid)' })
      return
    }

    const pending = pendingSnap.data()
    if (pending.userId !== uid) {
      res.status(403).json({ error: 'Order does not belong to this user' })
      return
    }

    const stripeTotal = (session.amount_total || 0) / 100
    const orderRef = await db.collection('orders').add({
      userId: uid,
      items: pending.items,
      total: stripeTotal,
      stripeSessionId: sessionId,
      status: 'paid',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    await pendingRef.delete()

    res.status(200).json({ ok: true, orderId: orderRef.id })
  } catch (err) {
    console.error('finalizeCheckoutSession:', err)
    res.status(500).json({ error: err.message || 'Finalize failed' })
  }
})
