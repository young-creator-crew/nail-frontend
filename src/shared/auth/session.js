const SESSION_KEY = "nail-user"

export function getSessionUser() {
  try {
    window.localStorage.removeItem(SESSION_KEY)
    const value = window.sessionStorage.getItem(SESSION_KEY)
    return value ? JSON.parse(value) : null
  } catch {
    return null
  }
}

export function setSessionUser(user) {
  window.localStorage.removeItem(SESSION_KEY)
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(user))
  window.dispatchEvent(new Event("nail-session-change"))
}

export function clearSessionUser() {
  window.localStorage.removeItem(SESSION_KEY)
  window.sessionStorage.removeItem(SESSION_KEY)
  window.dispatchEvent(new Event("nail-session-change"))
}
