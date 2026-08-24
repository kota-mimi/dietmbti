type EventParams = Record<string, string | number | boolean | undefined>

export function trackEvent(eventName: string, params: EventParams = {}) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', eventName, {
    ...params,
    transport_type: 'beacon',
  })
}
