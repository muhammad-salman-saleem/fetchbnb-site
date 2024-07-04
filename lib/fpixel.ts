export const FB_PIXEL_ID = "708476074009563"

export const pageview = () => {
  window.fbq('track', 'PageView')
}

// https://developers.facebook.com/docs/facebook-pixel/advanced/
export const event = (name: any, options: any = {}) => {
  window.fbq('track', name, options)
}