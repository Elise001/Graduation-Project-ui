import request from '@/utils/request'

export function textbookReservationQuery(query) {
  return request({
    url: '/textbookOrder/textbookReservationQuery',
    method: 'get',
    params: query
  })
}

export function collectQuery(query) {
  return request({
    url: '/textbookOrder/collectQuery',
    method: 'get',
    params: query
  })
}

export function refundQuery(query) {
  return request({
    url: '/textbookOrder/refundQuery',
    method: 'get',
    params: query
  })
}

export function paymentQuery(query) {
  return request({
    url: '/textbookOrder/paymentQuery',
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

export function studentSure(data) {
  return request({
    url: '/textbookOrder/studentSure',
    method: 'post',
    data
  })
}

export function orderStatus01(data) {
  return request({
    url: '/textbookOrder/orderStatus01',
    method: 'post',
    data
  })
}

export function orderStatus02(data) {
  return request({
    url: '/textbookOrder/orderStatus02',
    method: 'post',
    data
  })
}
export function orderStatus03(data) {
  return request({
    url: '/textbookOrder/orderStatus03',
    method: 'post',
    data
  })
}

export function orderStatus04(data) {
  return request({
    url: '/textbookOrder/orderStatus04',
    method: 'post',
    data
  })
}

export function orderStatus05(data) {
  return request({
    url: '/textbookOrder/orderStatus05',
    method: 'post',
    data
  })
}

export function orderStatus06(data) {
  return request({
    url: '/textbookOrder/orderStatus06',
    method: 'post',
    data
  })
}

export function orderStatus07(data) {
  return request({
    url: '/textbookOrder/orderStatus07',
    method: 'post',
    data
  })
}

