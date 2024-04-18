import axios from 'axios'
import { jpassConfig } from '../common/config.js'
const { httpRequestJpaas, APP_ID } = jpassConfig
const requestJpaas = {

    //Jpaas签名
    createSignJpaas: function (params = {}) {
        return new Promise((resolved, rejected) => {
            axios({
                method: 'post',
                url: `${httpRequestJpaas}createsign.do`,
                data: params
              }).then(function (data) {
                if (data.data.success) {
                    const { sign } = data.data.data;
                    resolved(sign)
                } else {
                    rejected(data)
                }
            })
            .catch(function (error) {
                rejected(error);
            });
        })
    },
    getDataFromJpaas: function (params = {}) {
        return new Promise((resolved, rejected) => {
            axios({
                method: 'post',
                url: `${httpRequestJpaas}gateway.do`,
                data: params
              }).then(function (data) {
                if (data.data.code == 200 && data.data.success == true) {
                        let { data: response } = data.data
                    //JMAS jmportal接口相关
                    const { result = 'true' } = response
                        if (result == 'true' || result == 'success') {
                        resolved(response)
                    } else {
                        rejected(response)
                    }
                } else {
                    rejected(data)
                }
            })
            .catch(function (error) {
                rejected(error);
            });
        })
    },
    getData: function ({ interface_id = '', app_id = APP_ID, params = {} } = {}) {
        let baseParams = new URLSearchParams()
            baseParams.append('version', '1.0')
            baseParams.append('charset', 'UTF-8')
            baseParams.append('origin', '1')
            baseParams.append('timestamp', new Date().getTime())
            baseParams.append('interface_id', interface_id)
            baseParams.append('app_id', app_id)
            baseParams.append('biz_content', JSON.stringify(params))
        return new Promise((resolved, rejected) => {
            requestJpaas.createSignJpaas(baseParams).then(sign => {
            baseParams.append('sign', sign)
            return requestJpaas.getDataFromJpaas(baseParams)
            }).then(response => {
                resolved(JSON.parse(response))
            }).catch(error => {
                rejected(error);
            })
        })
    },
}
export default requestJpaas