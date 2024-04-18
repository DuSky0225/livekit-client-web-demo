import Vue from 'vue'
// import VueStorage from 'vue-ls'
// import defaultSettings from '@/config/defaultSettings'
import Antd, { message, notification } from 'ant-design-vue'
// import 'ant-design-vue/dist/antd.less'
import 'ant-design-vue/dist/antd.css'

message.config({
  top: '60px'
})

notification.config({
  top: '60px'
})

Vue.use(Antd)
// Vue.use(VueStorage, defaultSettings.storageOptions)
