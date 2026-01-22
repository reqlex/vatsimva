import type { VatsimTokenResponse, VatsimUser, User, VatsimPilotStatistics } from '~/types/auth'

const VATSIM_SCOPES = ['full_name', 'email', 'vatsim_details', 'country']

interface VatsimConfig {
  oauthUrl: string
  clientId: string
  clientSecret: string
  redirectUri: string
}

function getVatsimConfig(): VatsimConfig {
  const config = useRuntimeConfig()
  return {
    oauthUrl: config.vatsimOauthUrl,
    clientId: config.vatsimClientId,
    clientSecret: config.vatsimClientSecret,
    redirectUri: config.vatsimRedirectUri
  }
}

export function buildAuthorizationUrl(state: string): string {
  const { oauthUrl, clientId, redirectUri } = getVatsimConfig()

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: VATSIM_SCOPES.join(' '),
    state
  })

  return `${oauthUrl}/oauth/authorize?${params.toString()}`
}

export async function exchangeCodeForToken(code: string): Promise<VatsimTokenResponse> {
  const { oauthUrl, clientId, clientSecret, redirectUri } = getVatsimConfig()

  const response = await $fetch<VatsimTokenResponse>(`${oauthUrl}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code
    }).toString()
  })

  return response
}

export async function fetchVatsimUser(accessToken: string): Promise<VatsimUser> {
  const { oauthUrl } = getVatsimConfig()

  const response = await $fetch<{ data: VatsimUser }>(`${oauthUrl}/api/user`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  })

  return response.data
}

export function transformVatsimUser(vatsimUser: VatsimUser): User {
  return {
    cid: vatsimUser.cid,
    firstName: vatsimUser.personal.name_first,
    lastName: vatsimUser.personal.name_last,
    fullName: vatsimUser.personal.name_full,
    email: vatsimUser.personal.email,
    country: vatsimUser.personal.country.name,
    rating: vatsimUser.vatsim.rating.short,
    pilotRating: vatsimUser.vatsim.pilotrating.short,
    division: vatsimUser.vatsim.division.name
  }
}

export async function refreshAccessToken(refreshToken: string): Promise<VatsimTokenResponse> {
  const { oauthUrl, clientId, clientSecret } = getVatsimConfig()

  const response = await $fetch<VatsimTokenResponse>(`${oauthUrl}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken
    }).toString()
  })

  return response
}

export async function fetchVatsimStatistics(cid: string): Promise<VatsimPilotStatistics> {
  const { oauthUrl } = getVatsimConfig()

  const response = await $fetch<VatsimPilotStatistics>(`${oauthUrl}/api/ratings/pilot/${cid}`, {
    headers: {
      'Accept': 'application/json'
    }
  })

  return response
}
