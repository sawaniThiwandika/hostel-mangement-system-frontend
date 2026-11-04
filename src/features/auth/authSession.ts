export function isAuthenticated() {
  return Boolean(sessionStorage.getItem('hostel-access-token'))
}

export function endSession() {
  sessionStorage.removeItem('hostel-access-token')
  sessionStorage.removeItem('hostel-refresh-token')
}
