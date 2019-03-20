import axios from 'axios';
import qs from 'qs';

// let base = '';//域名
let base = 'http://192.168.2.108:4449';//域名
export const requestLogin = params => { return axios.get(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };


const axiosP = axios.create({
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    withCredentials: true
});
export const httpGet = (url, data) => {
    return new Promise((resolve, reject) => {
        axiosP.get(base + url,{params:data})
            .then(res => {
                if (res.data.code == 200) {                        
                    resolve(res.data);
                } else {
                    console.log(res);
                    alert(res.data.msg);
                }
            })
            .catch(err => {
                reject(
                    console.log(err, '网络错误，get请求失败'),
                    alert('网络错误，get请求失败')
                )
            })
    })
}
export const httpPost = (url, data) => {
    return new Promise((resolve, reject) => {
        axiosP.post(base + url, qs.stringify(data))
            .then(res => {
                // console.log(1, res)
                if (res.data.code == 200) {                        
                    resolve(res.data);
                } else {
                    console.log(res);
                    resolve(res.data);
                    alert(res.data.msg);
                }
            })
            .catch(err => {
                reject(
                    console.log(err, '网络错误，post请求失败'),
                    alert('网络错误，post请求失败')
                )
            })
    })
}