import axios from "axios";
import { baseUrl } from '../config.js'
class HTTP {
    static get(url, data) {
        return HTTP.request(url, data, 'GET');
    }

    static post(url, data) {
        return HTTP.request(url, data, 'POST');
    }
    /**
     * Http request
    */
    static request(url, data, method)
     {
        return new Promise((resolve, reject) => {
            let requestUrl = baseUrl.serverUrl + url;
            axios({
                method: method,
                url: requestUrl,
                params: data || {}
            }).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        });
    }
}
export default HTTP