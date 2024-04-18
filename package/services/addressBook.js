import HTTP from '../tools/request.js'
const {get} = HTTP
export default {
  //我的群组接口
  getMyGroup(paramas){
    return get('/front/group/groupByJoined',paramas)
  },
  //我创建的群组接口
  getGroupMySelf(paramas){
    return get('/front/group/groupByMySelf',paramas)
  },
  //获取组织架构
  getStructrue(paramas){
    // return get('/front/user/getUcenterGroup',paramas) //老接口
    return get('/front/mechanism/getMechanismList',paramas)
  },
  //获取组织架构下的人
  getStructruePerson(paramas){
    // return get('/front/user/getUserByGroupId',paramas) //老接口
    return get('/front/mechanism/getUserByMechanismId',paramas)
  },
}