import axios from "axios";
import instance from "../../env";
import { useEffect } from "react";
import api from "./api";

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}
  
function timeDelay(k) {
    const base_interval = 0.5
    const base_multiplier = 1.5
    const retry_interval = ((base_interval * (base_multiplier ** (k - 1))) * 1000)
    const max = k === 5 ? 500 : retry_interval
    return retry_interval + randomInt(0, max)
}
  
function wait(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay))
}

let _retry_count = 0
let _retry = null

export function resetRetry() {
    _retry_count = 0
}

const axiosHttpClient = async (url, method, data) => {
    const { baseURL, headers, urlTimeout } = instance();

    let response = await axios({
        baseURL: baseURL + api[url],
        timeout: urlTimeout,
        method,
        headers,
        transformRequest: [function (data, headers) {
            // Do whatever you want to transform the data
            data = JSON.stringify(data);
            return data;
        }],
        
        // `transformResponse` allows changes to the response data to be made before
        // it is passed to then/catch
        transformResponse: [function (data) {
            // Do whatever you want to transform the data
            data = JSON.parse(data);
            return data;
        }],
        data
    })

    return response;
}


// useEffect(() => {
//     const requestIntercept = axiosHttpClient.interceptors.request.use(
//         config => {
//             if(!config.headers['Authorization']){
//                 config.headers['Authorization'] = `Bearer ${sessionStorage.getItem('auth-token')}`;
//             }
//             return config;
//         }, (error) => Promise.reject(error)
//     );

//     const responseIntercept = axiosHttpClient.interceptors.response.use((resp) => resp, async (err) => {

//         const origReqConfig = err.config;
        
//         if(err.response.status >= 500 && _retry_count < 4) {
//             _retry_count++;
//             return wait(timeDelay(_retry_count)).then(() => instance.request(origReqConfig))
//         }
    
//         if(err.response.status === 401 && origReqConfig.headers.hasOwnProperty('Authorization')) {
//             const rtoken = localStorage.getItem('refresh-token') || ''
//             if(rtoken && _retry_count < 4) {
                
//                 _retry_count++;
    
//                 delete origReqConfig.headers['Authorization']
    
//                 _retry = refresh(rtoken)
//                     .finally(() => _retry = null)
//                     .catch(error => Promise.reject(error))
                
//                 return _retry.then((token) => {
//                     origReqConfig.headers['Authorization'] = `Bearer ${token}`
//                     return instance.request(origReqConfig)
//                 })
//             }
//         }
//         return Promise.reject(err)
//     });

//     return (() => {
//         axiosHttpClient.interceptors.request.eject(requestIntercept);
//         axiosHttpClient.interceptors.response.eject(responseIntercept);
//     })

// }, [])

// useEffect(() => {}, [refresh]);



// const refresh = async (rtoken) => {
    
//     let _rtoken = ''
//     let _token = ''

//     try {
//         let response = await axiosHttpClient('/refresh-token', 'post', {
//             refreshToken: rtoken
//         });

//         _rtoken = response.data.rtoken
//         _token = response.data.token
      
//         localStorage.setItem('refresh-token', _rtoken)
//         sessionStorage.setItem('auth-token', _token)
//     } catch(error) {
//         console.log(error)
//     } finally {
//         return _token
//     }
// }

export default axiosHttpClient;