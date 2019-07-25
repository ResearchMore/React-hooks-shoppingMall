import axios from 'axios';
import { toast } from 'js/utils'
const debug = process.env.NODE_ENV === 'production'
axios.interceptors.request.use(config => {
    try {
        let token = localStorage.getItem('token')
        if (!debug) {
            config.url = '/api' + config.url
        }
        if (token) {
            config.headers.Authorization = token
        } else {
            // window.location.href = '/#/login'
        }
        return config;
    } catch (error) {
        window.location.href = '/#/login'
    }
}, (error) => {
    return Promise.reject(error);
});

axios.interceptors.response.use(
    response => {
        return response
    },
    error => {
        if (error.response) {
            if (error.response.status === 401) {
                localStorage.clear()
                isShowLoading(true,'none')    // 隐藏loading
                toast('请先登录','error')
                window.location.href = '/#/login'
            } else if(error.response.status === 504 ||error.response.status === 404) {
                isShowLoading(true,'none')    // 隐藏loading
                toast('服务器超时','error')
            } 
        }
        return Promise.reject(error.response.data)   // 返回接口返回的错误信息
    })


// 默认请求成功状态
export default (url, type = 'post', isShowLoadings = true) => {

    // 返回axios
    return params => {
        isShowLoading(isShowLoadings,'block')   // 显示loading
        return axios[type](url, type === 'get' ? { params } : params).then(res => {
            isShowLoading(isShowLoadings,'none')    // 请求成功隐藏loading
            const { status, data } = res;
            // 正确状态处理
            if (status === 200 && data.code === 10000) {
                window.SUCCESS = Number(data.code)
                return data;
            } else if (data.code === 20001) {  // token过期或者未登录
                window.location.href = '/#/login'
                localStorage.clear()
                isShowLoading(isShowLoadings,'none')    // 隐藏loading
            } else if (data.code === 10002) {    // 接口其他提示信息
                toast(data.msg,'error')
                return data
            }
            // 错误物理请求处理
        }).catch(err => {
            // toast('请求错误','error')
            return Promise.reject(err)   // 返回接口返回的错误信息
        })
    }
}
const isShowLoading = (loadings,style) => {
    let loading;
    if (loadings) {
        loading = document.querySelector('#loadding');
        loading.style.display = style;
    }
}
