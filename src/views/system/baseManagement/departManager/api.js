import request from '@/utils/request'

export function pageQuery(query) {
  return request({
    url: '/depart/pageQuery',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/depart',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/depart/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/depart/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/depart/' + id,
    method: 'put',
    data: obj
  })
}
