import request from '@/utils/request'

export function pageQuery(query) {
  return request({
    url: '/user/pageQuery',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/user',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/user/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/user/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/user/' + id,
    method: 'put',
    data: obj
  })
}

export function passwordReset(data) {
  return request({
    url: '/user/passwordReset',
    method: 'post',
    data
  })
}
