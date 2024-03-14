import axios from "axios";
import instance from "../../env";

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
        baseURL: baseURL + url,
        timeout: urlTimeout,
        method,
        headers,
        transformRequest: [function (data, headers) {
            // Do whatever you want to transform the data
    
            return data;
        }],
        
        // `transformResponse` allows changes to the response data to be made before
        // it is passed to then/catch
        transformResponse: [function (data) {
            // Do whatever you want to transform the data
    
            return data;
        }],
        data
    })

    return response;
}

axiosHttpClient.interceptors.response.use((resp) => resp, async (err) => {

    const origReqConfig = err.config
    
    if(err.response.status >= 500 && _retry_count < 4) {

        _retry_count++;

        return wait(timeDelay(_retry_count)).then(() => instance.request(origReqConfig))

    }

    if(err.response.status === 401 && origReqConfig.headers.hasOwnProperty('Authorization')) {

        const rtoken = localStorage.getItem('refresh-token') || ''
        if(rtoken && _retry_count < 4) {
            
            _retry_count++;

            delete origReqConfig.headers['Authorization']

            _retry = refresh(rtoken)
                .finally(() => _retry = null)
                .catch(error => Promise.reject(error))
            
            return _retry.then((token) => {
                origReqConfig.headers['Authorization'] = `Bearer ${token}`
                return instance.request(origReqConfig)
            })

        }

    }
    
    return Promise.reject(err)
})

const refresh = async (rtoken) => {
    
    let _rtoken = ''
    let _token = ''

    const params = { rtoken: rtoken }
    const headers = { headers: { 'x-api-key': process.env.REACT_APP_API_KEY, }}

    try {

        const response = await axios.post(`${process.env.REACT_APP_API_BASEURL}/refresh3.php`, params, headers)

        _rtoken = response.data.rtoken
        _token = response.data.token
      
        localStorage.setItem('refresh-token', _rtoken)
        sessionStorage.setItem('auth-token', _token)
        
    } catch(error) {

        console.log(error)

    } finally {
      
        return _token

    }

}

export default axiosHttpClient;