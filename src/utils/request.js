import axios from 'axios'
import { Message, MessageBox, Notification } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 禁用IE下get请求缓存
axios.defaults.headers.get['Cache-Control'] = 'no-cache'
axios.defaults.headers.get.Pragma = 'no-cache'

// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'  尝试阻止发送OPTIONS请求

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 500000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      config.headers.Authorization = getToken() // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
   * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
   */
  response => {
    const res = response.data

    if (res.status && res.status === 30101) {
      Notification.warning({
        title: '提示',
        message: res.message,
        duration: 2 * 1000
      })
    } else if (res.status && res.status !== 200 && res.status !== 501) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    const response = error.response
    if (response === undefined) {
      Message({
        message: '服务请求超时！',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
    const info = response.data
    if (response.status === 401 || info.status === 40101) {
      MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
    }
    if (response.status === 403) {
      Notification.warning({
        title: '禁止',
        message: info.message,
        type: 'error',
        duration: 2 * 1000
      })
      return Promise.reject('error')
    }
    if (response.status === 504) {
      Message({
        message: '后端服务异常，请联系管理员！',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
    Message({
      message: info.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
