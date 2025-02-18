import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/jwt/token',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: 'user/userInfo',
    method: 'get',
    params: { token }
  })
}

export function logout(token) {
  return request({
    url: '/user/logout',
    method: 'post',
    params: {
      token
    }
  })
}
