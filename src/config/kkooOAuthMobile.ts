/** KKOO Account OAuth — mobile app client (Flutter). */
export const mobileOAuthClientId = 'kkoo_buyers_app'

export const mobileOAuthRedirectUri =
  typeof window !== 'undefined'
    ? `${window.location.origin}/mobile/oauth/callback`
    : 'https://kkooapp.co.tz/mobile/oauth/callback'

export const mobileOAuthDefaultScope = 'openid profile phone email offline_access buyer'
