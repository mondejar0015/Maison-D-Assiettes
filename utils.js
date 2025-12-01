// Utility functions
export function formatCurrency(n) {
  return "$ " + Number(n).toLocaleString();
}

export function truncateText(text, maxLength = 50) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function calculateCartTotal(cart) {
  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const shipping = cart.length ? 150 : 0;
  return {
    subtotal,
    shipping,
    total: subtotal + shipping
  };
}