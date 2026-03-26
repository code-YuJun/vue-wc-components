import axios from 'axios'

// 创建实例
const service = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000
})

// 请求拦截
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截
service.interceptors.response.use(
  (response) => {
    const res = response.data
    // 根据你后端结构调整
    if (res) {
      return Promise.resolve(res)
    }
    return res
  },
  (error) => {
    console.error(error.message || 'Network Error')
    return Promise.reject(error)
  }
)

export default service