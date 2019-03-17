import axios from 'axios';

let base = '';//域名
export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };


export const httpPost = params => {
    axios.post('url',params)
         .then(res => {
             if(res.ack == 'success'){
                return res.data;
             }else{
                alert('error');//res.msg
             }
        });
};
export const httpGet = params => {
    axios.post('url',params)
         .then(res => {
             if(res.ack == 'success'){
                return res.data;
             }else{
                alert('error');//res.msg
             }
        });
};