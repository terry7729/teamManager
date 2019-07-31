<template>
  <div class="login">
    <div class="banner">
      <img :src="banner" alt />
      <div class="login_box">
        <cube-input v-model="phone" :clearable="clearable" placeholder="请输入手机号" autofocus></cube-input>
        <cube-input
          v-model="pwd"
          :clearable="clearable"
          placeholder="请输入登录密码"
          :eye="true"
          type="password"
        ></cube-input>
        <p :class="shakeflag ? 'warning2' : 'warning1'" v-show="textErr">{{textErr}}</p>
        <van-button type="info" @click="_login" :loading="loginLoad">登 陆</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import { Style, Input } from "cube-ui";
import md5 from "js-md5";
import Button from "vant/lib/button";
import Toast from "vant/lib/toast";
import "vant/lib/button/style";
import "vant/lib/toast/style";
import { stringify } from "querystring";
export default {
  name: "login",
  components: {
    "cube-input": Input,
    "van-button": Button
  },
  data() {
    return {
      banner: require("../assets/img/banner@2x.png"),
      phone: "17886518458",
      pwd: "abc123456",
      loginLoad: false, //按钮loading
      shakeflag: false, //密码错误红字动画
      textErr: "",
      clearable: {
        visible: true,
        blurHidden: false
      }
    };
  },
  methods: {
    _login() {
      let vm = this;
      let phoneReg = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/;
      if (!phoneReg.test(vm.phone)) {
        vm.shakeMsg("请输入正确的手机号");
        return;
      }
      if (!vm.pwd) {
        vm.shakeMsg("请输入登录密码");
        return;
      }
      let data = {
        username: vm.phone,
        password: md5(`Bochat2019${vm.pwd}001`)
      };
      vm.loginLoad = true;
      vm.$axios({ method: "post", url: "/login", data: data })
        .then(res => {
          vm.loginLoad = false;
          let code = res.data.retcode;
          if (code == 0) {
            sessionStorage.setItem("token", res.data.data.token);
            Toast("登陆成功");
            vm.$router.replace({ path: "/personal" });
          } else {
            vm.shakeMsg(res.data.msg);
          }
        })
        .catch(err => {
          vm.loginLoad = false;
        });
    },
    shakeMsg(msg) {
      this.textErr = msg;
      this.shakeflag = true;
      setTimeout(() => {
        this.shakeflag = false;
      }, 1000);
    }
  },
  mounted() {
    sessionStorage.removeItem("token");
  }
};
</script>
<style lang="scss" scoped>
.login {
  .banner {
    position: relative;
    img {
      height: 4rem;
      width: 100%;
    }
    .login_box {
      position: absolute;
      width: 90%;
      height: 5.14rem;
      left: 50%;
      margin-left: -45%;
      bottom: -4.5rem;
      background: #fff;
      padding: 0.5rem 0.3rem 0 0.3rem;
      box-sizing: border-box;
      border-radius: 0.2rem;
      .cube-input {
        margin: 0.3rem 0;
      }
      .warning1 {
        color: #fc3939;
        text-align: left;
        font-size: 0.24rem;
        margin: 0.3rem 0;
        height: 0.5rem;
      }
      .warning2 {
        color: #fc3939;
        text-align: left;
        font-size: 0.24rem;
        margin: 0.3rem 0;
        height: 0.5rem;
        animation: shake 1s;
        -o-animation: shake 1s;
        -webkit-animation: shake 1s;
        -moz-animation: shake 1s;
      }
      @keyframes shake {
        0%,
        100% {
          transform: translateX(0);
        }
        10%,
        30%,
        50%,
        70%,
        90% {
          transform: translateX(-5px);
        }
        20%,
        40%,
        60%,
        80% {
          transform: translateX(5px);
        }
      }
      .van-button--info {
        background-color: #4f79fe;
        border-color: #4f79fe;
        width: 100%;
        border-radius: 0.5rem;
        font-size: 0.32rem;
        height: 0.9rem;
      }
    }
  }
  .cube-input::after {
    border: none;
    outline: none;
  }
  .cube-input {
    height: 0.9rem;
    font-size: 0.28rem;
  }
  .cube-input_active::after {
    border-left: none;
    border-right: none;
    border-top: none;
    border-bottom: 2px solid #4f79fe;
    transition: border-color 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
}
</style>






