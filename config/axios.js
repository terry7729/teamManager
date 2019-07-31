import axios from 'axios'
import app from '../src/main'
import { Dialog } from 'vant';
axios.interceptors.request.use(
    config => {
        config.baseURL = process.env.API_ROOT;
        if (sessionStorage.getItem('token')) {
            config.headers.Authorization = sessionStorage.getItem('token')
        }
        return config
    },
    err => {
        return Promise.reject(err);
    }
)

axios.interceptors.response.use(response => {
    switch (response.data.retcode) {
        case 500106:
            Dialog.alert({
                message: '登录超时,请重新登陆'
            }).then(() => {
                app.$router.replace({ path: '/' })
            });
            break

    }
    return response;
},
    error => {
        return Promise.reject(error);
    }
)

export default axios
