<template>
  <div class="main">
    <!-- <p class="title">我的群组</p> -->
  <div v-show="!showMember" class="group">
    <div class="title" style="cursor: pointer" @click="backLastFn">
        <img class="left" src="../assets/images/left.png" alt="" />
        <span class="myTitle">我的群组</span>
    </div>
    <div class="groupList">
      <div class="groupMain groupMain1" v-for="(item) in groupList" 
          :key="item.iid"
          :label="item.iid" @click="() => {
            groupMemberList = [];
            getGroupMembers(item.iid,item.groupName)
          }
          ">
            <div class="groupItem">
              <img class="groupImg" :src="item.groupNick" alt="" />
              <div class="groupMes" >
                <p class="groupName">{{item.groupName}}</p>
                <p class="groupNum">{{item.memberNum}}人</p>
              </div>
            </div>
      </div>
    </div>
    <!-- <el-checkbox-group v-model="checkList" @change="changeFn">
      <el-checkbox
        v-for="(item) in groupList" 
        :key="item.iid"
        :label="item.iid"
      >
        <div class="groupMain">
          <div class="groupItem">
            <img class="groupImg" :src="item.groupNick" alt="" />
            <div class="groupMes" >
              <p class="groupName">{{item.groupName}}</p>
              <p class="groupNum">{{item.memberNum}}人</p>
            </div>
          </div>
        </div>
      </el-checkbox>
    </el-checkbox-group> -->

  </div>
    
    <div v-show="showMember" class="groupMember">
      <div class="title" style="cursor: pointer" @click="showMember = false">
        <img class="left" src="../assets/images/left.png" alt="" />
        <span class="myTitle">{{groupName}}</span>
    </div>
    <el-checkbox class="strcuctCheckBox" v-model="checkAll" @change="changeCheckAll">全选</el-checkbox>
    <el-checkbox-group v-model="checkList" @change="changeFn">
      <el-checkbox
            :label="item.imUserId"
            v-for="(item,index) in groupMemberList"
            :key="index"
            :disabled="item.imUserId === myId || item.disabled"
            class="personCheckBox"
          >
            <div class="memberItem">
              <img
                class="memberImg"
                :src="item.icon ? item.icon : '../assets/images/ic_default_avatar.png'"
                alt=""
              />
              <div class="memberNameItem">
                <p class="memberName" v-if="item.imRealName">
                  {{ item.imRealName }}
                </p>
                <!-- <p class="memberPosition" v-if="item.userPosition">
                  {{ item.userPosition }}
                </p> -->
              </div>
            </div>
          </el-checkbox>
    </el-checkbox-group>

    </div>
  </div>
  
</template>
<script>
import http from "../services/addressBook";
import message from "../services/message";

export default {
  name: "SelectGroup",
  props:['chooseMemeberList','chooseMemebers','meetingObj'],
  data() {
    return {
      groupList: [],
      checkOptionsItem:[],
      myId: "",
      checkList:[],
      lastcheckList: [], //上一次选择列表
      groupMemberList: [],
      showMember: false,
      groupName: "",
      checkAll:false,
    };
  },
  watch: {
    checkList(val) {
      this.checkAll = this.checkOptionsItem.length && this.checkOptionsItem.length == val.filter(item => this.checkOptionsItem.find(option => option.id == item)).length ? true : false 
    },
    "checkOptionsItem.length"(val) {
      this.checkAll = val && this.checkList.filter(item => this.checkOptionsItem.find(option => option.id == item)).length == val ? true : false
    }
  },
  methods: {
    changeCheckAll(val) {
      this.checkList = val ? this.checkOptionsItem.map(item => item.id) : []
      if (val) {
        this.checkOptionsItem.map((item) => {
          if (
            this.chooseMemeberList.findIndex(
              (itemin) => itemin.id == item.id
            ) == -1
          ) {
              this.$emit('changeMemsum', true , 1)
            this.$emit('changeMemlist','add',item)
          }
        })
      } else {
        this.checkOptionsItem.map((item) => {
          if (
            this.chooseMemeberList.findIndex(
              (itemin) => itemin.id == item.id
            ) != -1
          ) {
            let indexin = this.chooseMemeberList.findIndex(
              (itemin) => itemin.id == item.id
            )
            
              this.$emit('changeMemsum', false , 1)
            this.$emit('changeMemlist','delete',indexin)
          }
        })
      }
      this.lastcheckList = this.checkList
    },
    getGroupMembers(groupId,groupName) {
      let paramas = {
        myId: this.myId,
        groupId,
        pageNo: this.groupMemberList.length,
        pageSize: 100,
      };
      message
        .getGroupMembers(paramas)
        .then((res) => {
          if (res.data.code == 200) {
            if (res.data.data.list) {
              this.groupMemberList = this.groupMemberList.concat(res.data.data.list);
              this.groupMemberList.forEach((item, index) => {
                if (
                this.chooseMemebers.findIndex(
                  (itemin) => item.imUserId == itemin.identity
                ) != -1 
              ) {
                this.groupMemberList[index].disabled = true
              }
            })
              this.getGroupMembers(groupId,groupName);
            } else {
              this.groupName = groupName
              this.checkList = [...this.checkList]
              this.checkOptionsItem = this.groupMemberList.map(item => ({name: item.imRealName,
              id: item.imUserId,
              type: 2,})).filter(item => item.id != this.myId)
              let newArray = this.checkOptionsItem.filter((item1) => !this.chooseMemebers.some((item2) => item1.id === item2.identity));
              this.checkOptionsItem = newArray
              this.showMember = true
            }
          } else {
            console.log(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteMem(item){
      let indexin = this.checkList.findIndex((itemin) => item.id == itemin);
      if(indexin !==-1 ){
        this.checkList.splice(indexin, 1);
        // if(item.type !== 2){
        //   this.getAllUserIdsByGroups(item.id.split(" "), 2);
        // }
      }
    },
    backLastFn() {
      this.$emit('changeIsRight',0);
    },
    changeFn() {
      //添加数据
      if (
        this.lastcheckList &&
        this.lastcheckList.length < this.checkList.length
      ) {
        this.checkList.map((item) => {
          const index = this.chooseMemeberList.findIndex(
            (itemin) => itemin.id == item
          )
          if (index < 0) {
            let optionIndex = this.checkOptionsItem.findIndex(
              (itemin) => itemin.id == item
            )
            this.$emit('changeMemlist','add',this.checkOptionsItem[optionIndex])
            // if (this.checkOptionsItem[optionIndex].type == 2) {
              this.$emit('changeMemsum', true , 1)
            // } else {
            //   this.getAllUserIdsByGroups(
            //     item.split(' '),
            //     1,
            //     this.chooseMemeberList.length - 1
            //   )
            // }
          }
        })
        this.lastcheckList = this.checkList
      }
      //删除数据
      else {
        let deleteItem
        this.lastcheckList.map((item, index) => {
          let indexin = this.checkList.findIndex((itemin) => itemin == item)
          if (indexin < 0) {
            deleteItem = this.lastcheckList[index]
            return
          }
        })
        let chooseMemberIndex = this.chooseMemeberList.findIndex(
          (item) => item.id == deleteItem
        )
        // if (this.chooseMemeberList[chooseMemberIndex].type == 2) {
          this.$emit('changeMemsum', false , 1)
        // } else {
        //   this.getAllUserIdsByGroups(deleteItem.split(' '), 2)
        // }
        this.$emit('changeMemlist','delete',chooseMemberIndex)
        this.lastcheckList = this.checkList
      }
    },
    getMyGroupFn() {
      let paramas = {
        userId: this.myId,
      };
      http
        .getMyGroup(paramas)
        .then((res) => {
          if (res.data.code == 200) {
            this.groupList = this.groupList.concat(res.data.data.group);
            this.groupList.forEach((item,index)=>{
              this.checkOptionsItem.push({
                name: item.groupName,
                id: item.iid,
                type: 3,
              })
            })
          } else {
            console.log(res.message);
          }
        })
        .catch((res) => console.log(res));
    },
    getGroupMySelfFn() {
      let paramas = {
        userId: this.myId,
      };
      http
        .getGroupMySelf(paramas)
        .then((res) => {
          if (res.data.code == 200) {
            this.groupList = res.data.data.group;
            this.getMyGroupFn();
          } else {
            console.log(res.message);
          }
        })
        .catch((res) => console.log(res));
    },
    // clickMyGroupFn(item) {
    //   this.$busMeeting.$emit("jumpGroupId", item.iid);
    // },
  },
  created() {
    this.myId = this.meetingObj.userId;
    this.getGroupMySelfFn();
    this.checkList=[];
    if(this.chooseMemeberList.length){
      this.chooseMemeberList.forEach((item,index)=>{
        if(item.type==3 || item.type === 2){
          this.checkList.push(item.id);
        }   
      })
    } 
  },
};
</script>
<style lang="less" scoped>
.main {
  height: 100%;
  display: flex;
  flex-direction: column;
  .title {
    padding: 18px 24px 8px 24px;
    .left {
      width: 9px;
      height: 9px;
    }
    .myTitle {
      font-size: 16px;
      color: #000000;
      font-weight: 600;
      margin-left: 6px;
    }
  }
  // .title {
  //   font-size: 15px;
  //   color: rgba(0, 0, 0, 0.85);
  //   letter-spacing: 0;
  //   line-height: 24px;
  //   font-weight: 500;
  //   padding: 16px;
  //   margin-bottom: 0 !important;
  // }
  .groupMain {
    padding: 0 16px 0 8px;
    cursor: default;
    height: calc(100% - 56px);
    // overflow-y: scroll;
    scrollbar-width: none;
    .groupItem:hover{
      background: #eff0f1;
    }
    .groupItem {
      display: flex;
      // padding: 10px 8px;
      // background: #fff;
      border-radius: 4px;
      cursor: pointer;
      .groupImg {
        width: 36px;
        height: 36px;
        border-radius: 6px;
        margin-right: 12px;
      }
      .groupMes {
        p {
          margin-bottom: 0 !important;
        }
        .groupName {
          font-size: 14px;
          line-height: 20px;
          color: #000;
          width: 180px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .groupNum {
          font-size: 12px;
          color: #999;
          line-height: 17px;
        }
      }
    }
  }
  .groupMain1 {
    height: unset;
    padding: 8px 24px;
  }
  .groupMain:hover {
    background-color: #eff0f1;
  }
  .groupMember,.group {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
  .groupList {
    height: 100%;
    overflow-y: scroll;
  }
  .personCheckBox,.strcuctCheckBox{
    padding: 8px 16px 8px 24px;
    ::v-deep .el-checkbox__label {
    padding-left: 8px;
    font-size: 14px;
    color: #000000;
    width: 100%;
  }
  }
  .strcuctCheckBox {
    padding: 14px 16px 14px 24px;
  }
  .memberItem {
    display: flex;
    align-items: center;
    .memberImg {
      border-radius: 4px;
      width: 36px;
      height: 36px;
    }
    .memberNameItem {
      margin-left: 8px;
      p {
        margin-bottom: 0 !important;
      }
      .memberName {
        color: 000;
      }
      .memberPosition {
        color: #999;
        font-size: 12px;
      }
    }
  }
}
::v-deep .el-checkbox-group{
  height: calc(100% - 49px);
    overflow-y: scroll;
}
 ::v-deep .el-checkbox {
    display: flex;
    align-items: center;
    padding: 8px 16px 8px 24px;
    margin: 0;
  }
  ::v-deep .el-checkbox:hover{
    background: #eff0f1;
  }
  ::v-deep .el-checkbox__inner {
    border-radius: 15%;
    border: 1px solid #eff0f1;
    width: 18px;
    height: 18px;
  }
  ::v-deep .el-checkbox__inner::after {
    height: 8px;
    left: 6px;
    top: 3px;
  }
  ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner{
    background-color: #007fff;
  }
  ::v-deep .el-checkbox__input.is-disabled .el-checkbox__inner {
    background-color: #ddd;
  }
  ::v-deep .el-checkbox__label {
    padding-left: 0;
    font-size: 14px;
    color: #000000;
    width: 100%;
  }
</style>
