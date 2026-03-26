import request from './request'

export function get(url, params) {
  return request({
    url,
    method: 'get',
    params
  })
}

export function post(url, data) {
  return request({
    url,
    method: 'post',
    data
  })
}
/*
https://jsonplaceholder.typicode.com/users

import { get, post } from '@/api/http'// GET
get('/user', { id: 1 }).then(res => {
  console.log(res)
})

// POST
post('/login', {
  username: 'admin',
  password: '123456'
})
*/