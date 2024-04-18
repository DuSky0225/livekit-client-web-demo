import axios from "axios";
import { baseUrl } from '../common/config.js'
export default {
    getData(url,params) {
        return new Promise((resolve, reject) => {            
            axios({
                method : 'POST',
                url : baseUrl.serverUrl + url,
                params : params || {}
            }).then(res => {
                if(res.data.code==200){
                    resolve(res.data);
                }else{
                    reject(res.data)
                }
                
            }).catch(err => {
                reject(err);
            })
        });
    },
}