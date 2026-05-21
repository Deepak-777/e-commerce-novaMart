// src/utils/helpers.js

/** Format a number as USD currency */
export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

/** Format a Firestore Timestamp or JS Date for display */
export const formatDate = (value) => {
  const date = value?.toDate ? value.toDate() : new Date(value)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(date)
}

/** Merge class strings, filtering falsy values */
export const cn = (...classes) => classes.filter(Boolean).join(' ')

/** Capitalise first letter of each word */
export const titleCase = (str) =>
  str.replace(/\b\w/g, (c) => c.toUpperCase())

/** Generate star string from numeric rating */
export const starRating = (rating) => {
  const full  = Math.floor(rating)
  const half  = rating % 1 >= 0.5 ? 1 : 0
  const empty = 5 - full - half
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty)
}
