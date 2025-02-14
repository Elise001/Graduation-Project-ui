import request from '@/utils/request'

export function pageQuery(query) {
  return request({
    url: '/textbookManager/pageQuery',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/textbookManager',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/textbookManager/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/textbookManager/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/textbookManager/' + id,
    method: 'put',
    data: obj
  })
}

export function add(obj) {
  return request({
    url: '/textbookManager/add',
    method: 'post',
    data: obj
  })
}
