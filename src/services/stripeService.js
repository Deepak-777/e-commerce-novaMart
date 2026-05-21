// src/services/stripeService.js
// Stripe Checkout with Node.js backend (Express + Stripe)

export async function checkout(cartItems, opts = {}) {
  const { userId, shipping = 0, tax = 0 } = opts;

  if (!userId) {
    throw new Error("You must be signed in to checkout.");
  }

  if (!cartItems || !cartItems.length) {
    throw new Error("Your cart is empty.");
  }

  try {
    const response = await fetch(
      "http://localhost:4242/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems,
          userId,
          shipping,
          tax,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Checkout server error:", data);

      throw new Error(
        data.error || `Checkout failed (${response.status})`
      );
    }

    if (!data.url) {
      throw new Error("No Stripe checkout URL returned.");
    }

    // Redirect user to Stripe Checkout page
    window.location.href = data.url;

  } catch (error) {
    console.error("Stripe checkout error:", error);

    if (
      error.message.includes("Failed to fetch") ||
      error.message.includes("NetworkError")
    ) {
      throw new Error(
        "Could not connect to backend server. Make sure your Node.js backend is running on port 4242."
      );
    }

    throw error;
  }
}