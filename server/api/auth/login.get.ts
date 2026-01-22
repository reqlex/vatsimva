export default defineEventHandler((event) => {
  // Generate state for CSRF protection
  const state = generateState()
  setState(event, state)

  // Build authorization URL and redirect
  const authUrl = buildAuthorizationUrl(state)
  return sendRedirect(event, authUrl)
})
