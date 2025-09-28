const TokenKey = 'access_token'

// 获取 
export function getToken() {
  return localStorage.getItem(TokenKey)
}

// 设置
export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

// 移除
export function removeToken() {
  return localStorage.removeItem(TokenKey)
}

// 清除所有认证信息
export function clearAuthInfo() {
  removeToken()
}