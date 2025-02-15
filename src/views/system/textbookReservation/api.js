import request from '@/utils/request'

export function pageQuery(query) {
  return request({
    url: '/textbookOrder/pageQuery',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/textbookOrder',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/textbookOrder/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/textbookOrder/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/textbookOrder/' + id,
    method: 'put',
    data: obj
  })
}

export function batch(obj) {
  return request({
    url: '/textbookOrder/batch',
    method: 'post',
    data: obj
  })
}
