<template>
  <div class="selectSearch">
    <div
      class="searchItem"
      ref="searchItemRef"
      @mouseenter="mouseenterFn(index)"
      @mouseleave="mouseleaveFn(index)"
      @click="addMemberFn(item)"
      v-for="(item, index) in searchMemberList"
      :key="index"
    >
      <img
        class="searchImg"
        :src="item.icon ? item.icon : '../assets/images/ic_default_avatar.png'"
        :onerror="errorImage"
        alt=""
      />
      <div class="searchMes">
        <p class="searchAllName">
          <span class="searchName">{{ item.name }}</span>
          <span class="searchNickname">(昵称：{{ item.userName }})</span>
        </p>
        <p v-if="item.userPosition" class="searchPosition">
          {{ item.userPosition }}
        </p>
        <p
          ref="searchGroup"
          :class="item.isShow ? 'notsearchGroup' : 'searchGroup'"
        >
          <span>{{ getOrganization(item.hierarchicalOrganization) }}</span>
          <img
            @click.stop="isShowChangeFn(index)"
            v-if="item.isShow"
            src="../assets/images/showmore.svg"
            alt=""
          />
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'selectSearch',
  props: ['searchMemberList'],
  data() {
    return {
      errorImage:
        ' this.src=" ' + require('../assets/images/ic_default_avatar.png') + ' " ',
    }
  },
  methods: {
    isShowChangeFn(index) {
      this.$emit('showChange', index)
    },
    mouseenterFn(index) {
      this.$refs.searchItemRef[index].style.background = '#F2F2F2'
    },
    mouseleaveFn(index) {
      this.$refs.searchItemRef[index].style.background = '#fff'
    },
    addMemberFn(item) {
      this.$emit('addMember', item)
    },
    getOrganization(data) {
      if (data) {
        let dataj = JSON.parse(data)
        let organization = dataj[0]
        dataj.forEach((item, index) => {
          if (index != 0) {
            organization = organization + '-' + item
          }
        })
        return organization
      } else {
        return ''
      }
    },
  },
  watch: {
    searchMemberList: {
      handler() {
        this.$nextTick(() => {
          this.searchMemberList.forEach((item, index) => {
            if (
              !item.isChange &&
              this.$refs.searchGroup[index] &&
              this.$refs.searchGroup[index].offsetHeight > 20
            ) {
              this.$emit('changeShow', index, true)
            }
          })
        })
      },
      immediate: true,
    },
  },
  created() {},
  mounted() {},
}
</script>
<style lang="less" scoped>
.searchItem {
  display: flex;
  align-items: start;
  padding: 11px 9px 15px;
  border-bottom: 1px solid #eff0f1;
  background: #fff;
  .searchImg {
    width: 46px;
    height: 46px;
    border-radius: 8px;
  }
}
.searchMes {
  flex: 1;
  margin-left: 10px;
  p {
    margin-bottom: 0 !important;
  }
  .searchAllName {
    .searchName {
      font-size: 14px;
      color: #000;
    }
    .searchNickname {
      font-size: 12px;
      color: #000;
    }
  }
  .searchPosition {
    font-size: 12px;
    color: #747679;
  }
  .searchGroup {
    font-size: 12px;
    color: #ad9c9f;
  }
  .notsearchGroup {
    font-size: 12px;
    color: #ad9c9f;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      width: 205px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    img {
      width: 16px;
      height: 16px;
    }
  }
}
</style>