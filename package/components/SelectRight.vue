<template>
  <div class="selectRight">
    <div class="company" style="cursor: pointer" @click="backLastFn">
      <img class="left" src="../assets/images/left.png" alt="" />
      <span class="companyTitle">{{ basic.structureOptions.name }}</span>
    </div>
    <div class="strctureLevel">
      <div class="structureItem" v-for="(item, index) in levelList" :key="index">
        <p @click="clickLevelItemFn(item, index)" :style="{
          color: levelList.length - 1 == index ? '#121416' : '#737475',
          cursor: levelList.length - 1 == index ? 'not-allowed' : 'pointer',
        }">
          {{ item.name }}
        </p>
        <span>&nbsp;/&nbsp;</span>
      </div>
    </div>
    <div class="chooseMain">
      <el-checkbox v-model="checkAll" @change="changeCheckAll" class="strcuctCheckBox">全选</el-checkbox>
      <el-checkbox-group v-model="checkList" @change="changeFn">
        <el-checkbox v-for="(item) in structrueList" :key="item.iid" :label="item.iid"
          :disabled="item.memberNum == 0" class="strcuctCheckBox"> 
          <div class="groupItem">
            <p class="groupItemName">
              {{ item.mechanismName }}({{ item.memberNum }})
            </p>
            <div class="itemLine"></div>
            <img class="itemImg" src="../assets/images/structure.svg" alt="" :style="{
              cursor:
                checkList.findIndex((itemin) => item.iid == itemin) !==
                  -1 || item.memberNum == 0
                  ? 'not-allowed'
                  : 'pointer',
            }" @click.stop="itemNextFn(item)" />
            <span class="itemNext" :style="{
              cursor:
                checkList.findIndex((itemin) => item.iid == itemin) !==
                  -1 || item.memberNum == 0
                  ? 'not-allowed'
                  : 'pointer',
            }" @click.stop="itemNextFn(item)">下级</span>
          </div>
        </el-checkbox>
        <el-checkbox :label="item.id" v-for="(item) in structruePersonList" :key="item.id" :disabled="item.disabled"
          class="personCheckBox">
          <div class="memberItem">
            <img class="memberImg" :src="item.icon ? item.icon : '../assets/images/ic_default_avatar.png'" :onerror="errorImage"
              alt="" />
            <div class="memberNameItem">
              <p class="memberName" v-if="item.remark">
                {{ item.remark }}
              </p>
              <p class="memberPosition" v-if="item.userPosition">
                {{ item.userPosition }}
              </p>
            </div>
          </div>
        </el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import { baseUrl } from '../config.js'
import httpAddress from '../services/addressBook'
export default {
  name: 'SelectRight',
  props: ['groupMemberList', 'chooseMemeberList', 'fixedMemberList', "chooseMemebers","basic","meetingObj"],
  data() {
    return {
      levelList: [],
      pid: '', //第一级为整个公司架构
      checkAll: false,
      checkList: [],
      lastcheckList: [], //上一次选择列表
      structruePersonList: [],
      checkOptions: [], //全部选项
      checkOptionsItem: [], //全部选项id，name信息
      structrueList: [],
      isItemNext: false,
      errorImage:
        ' this.src=" ' + require("../assets/images/ic_default_avatar.png") + ' " ',
    }
  },
  methods: {
    deleteMem(item) {
      let indexin = this.checkList.findIndex((itemin) => item.id == itemin);
      if (indexin !== -1) {
        this.checkList.splice(indexin, 1);
        if (item.type !== 2) {
          this.getAllUserIdsByGroups(item.id.split(" "), 2);
        }
      }
    },
    backLastFn() {
      this.$emit('changeIsRight', 0);
    },
    changeCheckAll(val) {
      this.checkList = val ? this.checkOptions : []
      if (val) {
        this.checkOptionsItem.map((item) => {
          if (
            this.chooseMemeberList.findIndex(
              (itemin) => itemin.id == item.id
            ) == -1
          ) {
            if (item.type == 1) {
              let data = this.chooseMemeberList
                ? this.chooseMemeberList.length
                : 0
              this.getAllUserIdsByGroups(item.id.split(' '), 1, data)
            } else {
              this.$emit('changeMemsum', true, 1)
            }
            this.$emit('changeMemlist', 'add', item)
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
            if (this.chooseMemeberList[indexin].type == 1) {
              this.$emit('changeMemsum', false, this.chooseMemeberList[indexin].userIds.length)
            } else {
              this.$emit('changeMemsum', false, 1)
            }
            this.$emit('changeMemlist', 'delete', indexin)
          }
        })
      }
      this.lastcheckList = this.checkList
    },
    changeFn() {
      if (this.isItemNext) {
        return
      }
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
            this.$emit('changeMemlist', 'add', this.checkOptionsItem[optionIndex])
            if (this.checkOptionsItem[optionIndex].type == 2) {
              this.$emit('changeMemsum', true, 1)
            } else {
              this.getAllUserIdsByGroups(
                item.split(' '),
                1,
                this.chooseMemeberList.length - 1
              )
            }
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
        if (this.chooseMemeberList[chooseMemberIndex].type == 2) {
          this.$emit('changeMemsum', false, 1)
        } else {
          this.getAllUserIdsByGroups(deleteItem.split(' '), 2)
        }
        this.$emit('changeMemlist', 'delete', chooseMemberIndex)
        this.lastcheckList = this.checkList
      }
    },
    itemNextFn(item) {
      if (
        this.checkList.findIndex((itemin) => item.iid == itemin) !== -1 ||
        item.memberNum == 0
      ) {
        return
      }
      this.isItemNext = true
      setTimeout(() => {
        this.isItemNext = false
      }, 0)
      if (
        this.checkList.findIndex((itemin) => item.iid == itemin) !== -1 ||
        item.memberNum == 0
      ) {
        return
      }
      this.levelList.push({
        pid: item.iid,
        name: item.mechanismName,
      })
      this.pid = item.iid
      this.getStructrueFn()
    },
    clickLevelItemFn(item, i) {
      this.levelList = this.levelList.filter((item, index) => index <= i)
      this.pid = item.pid
      this.checkAll = false
      this.getStructrueFn()
    },
    //indata:1为添加，2为删减，3为获取成员
    getAllUserIdsByGroups(memberIds, indata, index) {
      let url = baseUrl.serverUrl + "/front/user/getAllUserIdsByGroups";
      axios({
        url: url,
        method: "post",
        // params: '必须是一个无格式对象 query参数',
        data: memberIds,
        // headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then((res) => {
          if (res.data.code == 200) {
            if (!res.data.data) {
              return;
            }
            let num = res.data.data.userIds.length;
            if (indata == 1) {
              this.$emit('changeMemsum', true, num)
              this.$emit('changeMemlist', 'userIds', index, res.data.data.userIds)
            } else if (indata == 2) {
              this.$emit('changeMemsum', false, num)
            } else {
              this.memberIds.concat(res.data.data.userIds);
            }
          } else {
            console.log(res.data.message);
          }
        })
        .catch((res) => {
          console.log(res);
        });
    },
    getStructruePersonFn() {
      if (this.pid == 0) {
        this.structruePersonList = []
        return
      }
      let paramas = {
        // groupId: this.pid,
        // myId: this.myId,
        pid:this.pid,
        userId: this.myId,
      }
      httpAddress
        .getStructruePerson(paramas)
        .then((res) => {
          // console.log(res);
          if (res.data.success) {
            this.structruePersonList = res.data.data
            if (!this.structruePersonList) {
              return
            }
            // console.log(this.groupMemberList);
            this.structruePersonList.forEach((item, index) => {
              if (
                this.groupMemberList.findIndex(
                  (itemin) => itemin.imUserId == item.id
                ) != -1 || this.chooseMemebers.findIndex(
                  (itemin) => itemin.identity == item.id
                ) != -1 ||
                this.myId == item.id
              ) {
                this.structruePersonList[index].disabled = true
              } else {
                this.structruePersonList[index].disabled = false
                this.checkOptions.push(item.id)
                this.checkOptionsItem.push({
                  name: item.remark,
                  id: item.id,
                  type: 2,
                })
              }
            })
            let newArray = this.checkOptionsItem.filter((item1) => !this.chooseMemebers.some((item2) => item1.id === item2.identity));
            this.checkOptionsItem = newArray
          } else {
            // alert(res.data.message)
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getStructrueFn() {
      this.structrueList = []
      let paramas = {
        pid: this.pid,
        userId: this.myId,
      }
      httpAddress
        .getStructrue(paramas)
        .then((res) => {
          // console.log(res);
          if (res.data.code == 200) {
            this.structrueList = res.data.data
            this.structrueList.forEach((item) => {
              // console.log(item);
              if (item.memberNum == 0) return
              this.checkOptions.push(item.iid)
              this.checkOptionsItem.push({
                name: item.mechanismName,
                id: item.iid,
                type: 1, //1为组织，2为个人
              })
            })
            this.getStructruePersonFn()
          } else {
            console.log(res)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
  watch: {
    pid(newd, oldd) {
      if (newd != oldd) {
        this.checkOptions = []
        this.checkOptionsItem = []
      }
    },
    checkList: {
      handler() {
        this.$nextTick(() => {
          this.checkAll = (this.checkOptions.length !== 0 && this.checkOptions.length == this.checkList.length) ? true : false
        })
      },
    },
    checkOptions: {
      handler() {
        this.checkList = []
        this.lastcheckList = []
        this.chooseMemeberList.forEach((item) => {
          this.checkOptions.forEach((itemin) => {
            if (itemin == item.id) {
              this.checkList.push(item.id)
            }
          })
        })
        this.$nextTick(() => {
          this.checkAll = (this.checkOptions.length !== 0 && this.checkOptions.length == this.checkList.length) ? true : false;
        })
      },
    },
    basic: {
      handler(newV,oldV) {
        if(newV && newV.structureOptions && newV.structureOptions.pid) {
          this.pid = newV.structureOptions.pid
          this.levelList = JSON.parse(JSON.stringify(newV.structureOptions.levelList))
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.myId = this.meetingObj.userId;
    this.checkList = [];
    if (this.chooseMemeberList.length) {
      this.chooseMemeberList.forEach((item, index) => {
        if (item.type !== 3) {
          this.checkList.push(item.id);
        }
      })
    }
  },
  mounted() {
    this.getStructrueFn()
  },
}
</script>
<style lang="less" scoped>
.selectRight {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.company {
  padding: 18px 24px 8px 24px;
  .left {
    width: 9px;
    height: 9px;
  }

  .companyTitle {
    font-size: 16px;
    color: #000000;
    font-weight: 600;
    margin-left: 6px;
  }
}

.strctureLevel {
  display: flex;
  flex-flow: wrap;
  padding: 0 24px;
}

.structureItem {
  display: flex;
  font-weight: 500;

  p {
    font-size: 14px;
    color: #000000;
  }

  span {
    font-size: 14px;
    color: #dadbdc;
  }
}

.chooseMain {
  scrollbar-width: none;
  flex: 1;
  overflow-y: scroll;
  overflow-x: hidden;
}

::v-deep .el-checkbox {
  display: flex;
  align-items: center;
  margin: 0;
}

.strcuctCheckBox {
  padding: 14px 16px 14px 24px;
}

.personCheckBox {
  padding: 8px 16px 8px 24px;
}

::v-deep .el-checkbox:hover {
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

::v-deep .el-checkbox__input.is-disabled .el-checkbox__inner {
  background-color: #ddd;
}

::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #007fff;
}

::v-deep .el-checkbox__label {
  padding-left: 8px;
  font-size: 14px;
  color: #000000;
  width: 100%;
}

.groupItem {
  display: flex;
  align-items: center;

  .groupItemName {
    font-size: 14px;
    color: #000000;
    line-height: 20px;
    flex: 1;
    margin: 0 !important;
  }

  .itemLine {
    border-right: 1px solid #eff0f1;
    height: 16px;
  }

  .itemImg {
    width: 11px;
    height: 14px;
    margin: 0 4px 0 7px;
  }

  .itemNext {
    font-size: 14px;
    color: #999999;
    line-height: 20px;
  }
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
</style>