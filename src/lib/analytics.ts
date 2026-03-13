/**
 * Analytics event tracking.
 * Wire to GA4, Plausible, or similar in production.
 * Usage: trackEvent("add_to_cart", { product_id: "..." })
 */
export function trackEvent(
  name: string,
  props?: Record<string, string | number | boolean>
) {
  if (typeof window === "undefined") return;
  // Example: window.gtag?.("event", name, props);
  // Or: window.plausible?.(name, { props });
  if (process.env.NODE_ENV === "development") {
    console.debug("[Analytics]", name, props);
  }
}
