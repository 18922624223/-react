import request from './AxiosInterceptors'; 
import { getToken } from './Token'; 

export function loginValidate(data) {
  return request({
    url: '/admin/login/validate',
    method: 'post', 
    data 
  });
}

export function checkToken() {
  return request({
    url: '/admin/login/checkToken',
    method: 'post',
    data: { token: getToken() }  
  });
}