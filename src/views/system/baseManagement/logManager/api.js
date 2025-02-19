import request from '@/utils/request'

export function pageQuery(query) {
  return request({
    url: '/textbookOperate/pageQuery',
    method: 'get',
    params: query
  })
}
export function getObj(id) {
  return request({
    url: '/textbookOperate/' + id,
    method: 'get'
  })
}

