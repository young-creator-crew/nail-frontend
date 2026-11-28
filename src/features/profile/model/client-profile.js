import { getProfile, updateProfile } from "../../../shared/api/services/profileApi"
import { getSessionUser, setSessionUser } from "../../../shared/auth/session"

export function resolveProfileUserId(user) {
  return user?.id ?? user?.idNailUser ?? user?.idUser ?? null
}

export function validateProfileResponse(profile) {
  if (!profile || typeof profile.name !== "string" || typeof profile.email !== "string"
    || (profile.phone != null && typeof profile.phone !== "string")) {
    throw new Error("A API retornou dados de perfil inválidos.")
  }
  return profile
}

function updateProfileSession(userId, profile) {
  const currentSession = getSessionUser()
  if (resolveProfileUserId(currentSession) !== userId) {
    throw new Error("A sessão mudou durante a operação. Entre novamente.")
  }
  setSessionUser({
    ...currentSession,
    ...profile,
    id: resolveProfileUserId(profile) ?? userId,
    userType: currentSession.userType ?? profile.userType,
  })
}

export async function loadClientProfile(userId, config = {}) {
  const profile = validateProfileResponse(await getProfile(userId, config))
  if (config.signal?.aborted) throw new Error("Carregamento de perfil cancelado.")
  updateProfileSession(userId, profile)
  return profile
}

export async function saveClientProfile(userId, draft) {
  const name = draft.name.trim()
  const email = draft.email.trim()
  if (!name) throw new Error("Informe seu nome.")
  if (!email) throw new Error("Informe seu e-mail.")
  const session = getSessionUser()
  if (!userId || resolveProfileUserId(session) !== userId) {
    throw new Error("Não foi possível identificar o usuário da sessão. Entre novamente.")
  }

  const result = validateProfileResponse(await updateProfile(userId, {
    name,
    email,
    phone: draft.phone.trim() || null,
  }))
  updateProfileSession(userId, result)
  return result
}
