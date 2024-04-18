import HTTP from '../tools/request.js'
const { get, post } = HTTP
export default {
    // //获取群组详细信息
    // getGroupDetails(paramas) {
    //     return get('/front/group/groupDetail', paramas)
    // },
    // //清空群聊消息
    // getEmptyList(paramas) {
    //     return post('/front/app/emptyList', paramas)
    // },
    //获取好友主页信息
    getMemberDetails(paramas) {
        return post('/front/user/mainPage', paramas)
    },
    //获取群组成员
    getGroupMembers(paramas) {
        return get('/front/group/groupMemberList', paramas)
    },
    // //修改群名称
    // getModifyGroupName(paramas) {
    //     return post('/front/group/modifyGroupName', paramas)
    // },
    // //群组消息免打扰
    // getGroupNotMesCall(paramas) {
    //     return get('/front/group/setGroupDisturb', paramas)
    // },
    // //私聊消息免打扰
    // getMemberNotMesCall(paramas) {
    //     return post('/front/user/setPrivateChatDisturb', paramas)
    // },
    // //删除消息列表
    // getRemoveChat(paramas) {
    //     return post('/front/app/removeChatList', paramas)
    // },
    // //退出群聊
    // getQuitGroup(paramas) {
    //     return post('/front/group/quitGroup', paramas)
    // },
    // //解散群聊
    // getDismissGroup(paramas) {
    //     return post('/front/group/dissolveGroup', paramas)
    // },
    // //特别关注
    // getSpecialAttention(paramas) {
    //     return post('/front/relation/specialAttention', paramas)
    // },
    // //备注接口
    // getRemark(paramas) {
    //     return post('/front/relation/modifyRemark', paramas)
    // },
    // 关键词搜索--用户
    getSearch(paramas) {
        return get('/front/user/search', paramas)
    },
    // // 关键词搜索--群组
    // getSearchMember(paramas) {
    //     return get('/front/group/search', paramas)
    // },
    // //创建群组
    // getCreateGroup(paramas) {
    //     return post('/front/group/createGroup', paramas)
    // },
    // //文件预览
    // yl(paramas) {
    //     return post('/front/app/getPreviewPath', paramas)
    // },
    // //获取该层级下的所有成员
    // getAllUserIdsByGroups(paramas) {
    //     return post('/front/user/getAllUserIdsByGroups', paramas)
    // },
    // // 获取该层级下的所有成员
    // getInviteMember(paramas) {
    //     return post('/front/group/inviteMembers', paramas)
    // },
    // //撤回消息
    // msgCh(paramas) {
    //     return post('/front/app/withDrawMessage', paramas)
    // },
    // //踢出群成员
    // getRemoveMembers(paramas) {
    //     return post('/front/group/removeMembers', paramas)
    // },
    // //所有被设置为免打扰
    // getAllDisturbId(paramas) {
    //     return post('/front/app/getAllDisturbId', paramas)
    // },
    //  //文件归集
    //  getQueryFileList(paramas) {
    //     return post('/front/app/queryFileList', paramas)
    // },
}