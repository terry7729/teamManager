<template>
  <div class="personal">
    <div id="content">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="暂无更多数据"
          @load="onLoad"
          :offset="0"
        >
          <div class="banner" :style="{backgroundImage: `url('${banner}')`}">
            <div class="flex-x-end">
              <van-button type="default" @click="quit">退出登录</van-button>
            </div>
            <div class="flex-y-center header">
              <div>
                <img :src="userInfo.headImg" alt />
              </div>
              <div>{{userInfo.userNickName}}</div>
            </div>
            <div class="flex-x-between info">
              <div>手机号:&nbsp;{{userInfo.phone | formatPhone}}</div>
              <div>注册时间:&nbsp;{{userInfo.userCreateTime | formatTime}}</div>
            </div>
            <!-- 中间白色框 -->
            <div class="count_box flex-x-center">
              <div class="flex-y-center">
                <span>
                  {{userInfo.memberCount}}
                  <span>人</span>
                </span>
                <span>团队成员</span>
              </div>
              <div class="flex-y-center">
                <span>
                  {{userInfo.activeRate}}
                  <span>%</span>
                </span>
                <span>
                  活跃率
                  <span>
                    <img :src="mark" alt @click="showDialog(1)" />
                  </span>
                </span>
                <transition name="fadein">
                  <div
                    class="dialog"
                    :style="{backgroundImage: `url('${dialog}')`}"
                    v-if="dialog1"
                  >团队成员近7天活跃率</div>
                </transition>
              </div>
              <div class="flex-y-center">
                <span>
                  {{userInfo.wealthScore}}
                  <span>分</span>
                </span>
                <span>
                  财富评分
                  <span>
                    <img :src="mark" alt @click="showDialog(2)" />
                  </span>
                </span>
                <transition name="fadein">
                  <div class="dialog" :style="{backgroundImage: `url('${dialog}')`}" v-if="dialog2">
                    <p style="margin:0.2rem 0">财富评分越高代表</p>持有资产越多
                    <p></p>
                  </div>
                </transition>
              </div>
            </div>
          </div>
          <div class="my_team flex-x-between">
            <div style="font-weight:bold">我的队员</div>
            <div style="color:#3C6AFE" class="flex-x-center" @click="toAnalysis">
              综合分析
              <van-icon name="arrow" />
            </div>
          </div>
          <van-sticky>
            <div class="tabs flex-x-between">
              <div
                class="flex-x-center"
                v-for="(item,index) in tabsArr"
                :key="index"
                :class="{active:active == item.name}"
                @click="tabclick(item)"
              >
                {{item.name}}
                <van-icon
                  :class="item.arrowActive?'left-rotate' : 'right-rotate'"
                  name="arrow-down"
                  v-if="index!=0"
                />
              </div>
            </div>
          </van-sticky>
          <div class="tab_table">
            <p style="color:#999999;margin-top:2rem" v-if="myTeamMate.length==0"></p>
            <div
              class="tab_item flex-x-between"
              v-for="(item,index) in myTeamMate"
              :key="index"
              v-else
            >
              <div class="flex-x-start">
                <span>
                  <img :src="item.headImg" alt />
                </span>
                <span>{{item.userNickName}}</span>
              </div>
              <div>{{item.memberCount}}</div>
              <div>{{item.wealthScore}}</div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>
<script>
import { Icon, Button, Dialog, Sticky, PullRefresh, List ,Toast} from "vant";
import "vant/lib/button/style";
import "vant/lib/dialog/style";
import "vant/lib/toast/style";
import qs from "querystring";
export default {
  name: "personal",
  components: {
    "van-button": Button,
    "van-icon": Icon,
    "van-sticky": Sticky,
    "van-pull-refresh": PullRefresh,
    "van-list": List,
    [Dialog.Component.name]: Dialog.Component
  },
  filters: {
    formatTime: function(value) {
      if (value) {
        return value.split(" ")[0];
      }
    },
    formatPhone: function(value) {
      if (value) {
        return value.slice(0, 3) + "****" + value.slice(-4);
      }
    }
  },
  data() {
    return {
      banner: require("../assets/img/Space_banner@2x.png"),
      mark: require("../assets/img/Doubt_icon@2x.png"),
      dialog: require("../assets/img/Active_Help_frame@2x.png"),
      dialog1: false,
      dialog2: false,
      userInfo: {},
      tabsArr: [
        { name: "默认排序", arrowActive: false },
        { name: "团队人数", arrowActive: false },
        { name: "财富评分", arrowActive: false }
      ],
      active: "默认排序",
      arrowActive: false,
      pageSize: 10,
      currentPage: 1,
      isLoading: false, //下拉刷新的加载动画
      loading: false, //上拉加载更多图标
      finished: false, //上拉结束没有数据
      myTeamMate: []
    };
  },
  methods: {
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.currentPage = 1;
        this._getTeamInfo();
      }, 500);
    },
    //上拉加载
    onLoad() {
      this._getTeamInfo();
      this.currentPage++;
    },
    // 退出
    quit() {
      Dialog.confirm({
        title: "",
        message: "确定要退出登录吗？"
      })
        .then(() => {
          this.$axios({
            method: "post",
            url: "/api/user/logout"
          }).then(res => {
            if (res.data.retcode == 0) {
              Toast('已退出登录')
              this.$router.replace({
                path: "/"
              });
            }
          });
        })
        .catch(() => {
          // on cancel
        });
    },
    tabclick(item) {
      let vm = this;
      vm.active = item.name;
      if (item.name == "默认排序") {
        // 获取默认排序
        if (vm.tabsArr[1].arrowActive || vm.tabsArr[2].arrowActive) {
          vm._getTeamInfo();
        }
        //复原icon 变为降序
        vm.tabsArr.map(item => {
          item.arrowActive = false;
        });
      } else {
        // arrowActivea为false 箭头往下 true网上
        item.arrowActive = !item.arrowActive;
        let attr = item.name == "团队人数" ? "memberCount" : "wealthScore";
        vm.myTeamMate.sort(vm.compare(attr, item));
      }
    },
    // 排序
    compare(attr, item) {
      return function(x, y) {
        var min = x[attr];
        var max = y[attr];
        return item.arrowActive ? min - max : max - min;
      };
    },
    // 获取信息
    _getTeamInfo() {
      let vm = this;
      let data = {
        pageSize: vm.pageSize,
        currentPage: vm.currentPage
      };
      vm.$axios({
        method: "post",
        url: "/app/teamInfo/getTeamInfo",
        data: qs.stringify(data)
      }).then(res => {
        if (res.data.retcode == 0) {
          vm.loading = false;
          vm.userInfo = res.data.data; //用户信息
          let listdata = res.data.data.memberList.items; //成员列表
          if (!listdata.length) {
            vm.finished = true;
            vm.loading = false;
            return;
          }
          if (vm.currentPage >= 2) {
            vm.myTeamMate = vm.myTeamMate.concat(listdata);
          } else {
            vm.finished = false;
            vm.isLoading = false;
            vm.myTeamMate = listdata;
          }
        }
      });
    },
    toAnalysis() {
      this.$router.push({
        path: "/analysis",
        query: {
          userNickName: this.userInfo.userNickName,
          groupId:this.userInfo.id
        }
      });
    },
    toggle1() {
      this.dialog1 = true;
      setTimeout(() => {
        this.dialog1 = false;
      }, 2000);
    },
    toggle2() {
      this.dialog2 = true;
      setTimeout(() => {
        this.dialog2 = false;
      }, 2000);
    },
    showDialog(item) {
      item == 1 ? this.toggle1() : this.toggle2();
    }
  },
  mounted() {
    // this._getTeamInfo();
    // console.log(this.userInfo)
  }
};
</script>
<style lang="scss" scoped>
.personal {
  #content {
    padding-bottom: 30px;
  }
  .banner {
    position: relative;
    height: 4.6rem;
    width: 100%;
    background-size: 100% 100%;
    padding: 3% 5% 3% 5%;
    box-sizing: border-box;
    .header {
      font-size: 0.3rem;
      color: #fff;
      & div:nth-child(1) {
        width: 1.6rem;
        height: 1.6rem;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        padding: 0.1rem;
        box-sizing: border-box;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      & div:nth-child(2) {
        margin: 0.2rem 0;
      }
    }
    .info {
      font-size: 0.26rem;
      color: #fff;
      padding: 0 0.1rem 0 0.1rem;
      margin: 0.1rem 0;
      div {
        white-space: nowrap;
        margin: 5px;
      }
    }
    .van-button--default {
      color: #fff;
      background: none;
      border: 0.5px solid #a0b2fe;
      height: 0.5rem;
      line-height: 0.5rem;
      border-radius: 3px;
      font-size: 0.26rem;
    }
    .van-button--normal {
      padding: 0 10px;
    }
    .count_box {
      position: absolute;
      width: 90%;
      height: 1.7rem;
      left: 50%;
      margin-left: -45%;
      bottom: -1.2rem;
      background: #fff;
      padding: 0.1rem 0.1rem 0 0.1rem;
      box-sizing: border-box;
      border-radius: 0.2rem;
      box-shadow: 2px 2px 10px #e5e5e5;
      div {
        margin: 0 0.5rem;
        position: relative;
        span:nth-child(1) {
          font-weight: bold;
          font-size: 0.35rem;
          span {
            font-size: 0.25rem;
          }
        }
        span:nth-child(2) {
          white-space: nowrap;
          color: #999999;
          font-size: 0.26rem;
          margin: 0.26rem 0;
          display: inline-block;
          cursor: pointer;
          img {
            width: 0.26rem;
            height: 0.26rem;
            margin-left: 0.1rem;
          }
        }
      }
      .dialog {
        position: absolute;
        height: 2.2rem;
        width: 3.5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background-size: 100% 100%;
        bottom: -1.6rem;
        left: -1.3rem;
        font-size: 0.26rem;
        margin: 0 0;
        z-index: 99999 !important;
      }
    }
  }
  .my_team {
    margin-top: 1.5rem;
    height: 0.9rem;
    border-top: 0.5px solid #eeeeee;
    border-bottom: 0.5px solid #eeeeee;
    font-size: 0.28rem;
    padding: 0 0.3rem;
  }
  .tabs {
    height: 0.7rem;
    padding: 0 0.3rem;
    font-size: 0.28rem;
    color: #999999;
    background: #fff;
  }
  .tab_table {
    padding: 0 0.3rem;
    font-size: 0.28rem;
    .tab_item {
      margin: 0.5rem 0;
      div:nth-child(1) {
        width: 3rem;
        align-items: center;
        span:nth-child(1) {
          margin-right: 0.2rem;
          img {
            width: 0.6rem;
            height: 0.6rem;
            border-radius: 50%;
          }
        }
      }
      div:nth-child(2) {
        width: 3rem;
        display: flex;
        justify-content: flex-start;
      }
      div:nth-child(3) {
        width: 1rem;
        display: flex;
        justify-content: flex-start;
      }
    }
  }
  .active {
    color: #3c6afe;
  }
  // 逆时针
  .left-rotate {
    -moz-transform: rotate(-180deg);
    -o-transform: rotate(-180deg);
    -webkit-transform: rotate(-180deg);
    transform: rotate(-180deg);
    transition: all 0.6s;
  }
  // 顺时针
  .right-rotate {
    -moz-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
    transition: all 0.6s;
  }
  // 弹框淡入淡出
  .fadein-enter,
  .fadein-leave-to {
    opacity: 0;
  }
  .fadein-enter-to,
  .fadein-leave {
    opacity: 1;
  }
  .fadein-enter-active,
  .fadein-leave-active {
    transition: all 0.8s;
  }
}
</style>






