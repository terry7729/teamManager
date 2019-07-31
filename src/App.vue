<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view />
    </transition>
  </div>
</template>

<script>
import { close } from 'fs';
export default {
  name: "App",
  data() {
    return {
      transitionName: ""
    };
  },
  created() {
    console.log('created')
    var isPC = function() {
      var userAgentInfo = navigator.userAgent.toLowerCase();
      var Agents = new Array(
        "android",
        "iphone",
        "symbianOS",
        "windows phone",
        "ipad",
        "ipod"
      );
      var flag = true;
      for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = false;
          break;
        }
      }
      return flag;
    };

    if (isPC()) {
      document.documentElement.style.fontSize = "67px";
      document.body.style.maxWidth = "500px";
    } else {
      document.documentElement.style.fontSize =
      document.documentElement.clientWidth / 7.5 + "px";
    }
  },
  watch: {
    $route(to, from) {
      to.meta.index < from.meta.index
        ? (this.transitionName = "slide-right")
        : (this.transitionName = "slide-left");
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: .26rem;
  height: 100%;
  /* margin-top: 60px; */
}
html{
  height: 100%;
}
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 0.3s;
  position: absolute;
  width: 100%;
  left: 0;
}
.slide-right-enter {
  transform: translateX(-100%);
}
.slide-right-leave-active {
  transform: translateX(100%);
}
.slide-left-enter {
  transform: translateX(100%);
}
.slide-left-leave-active {
  transform: translateX(-100%);
}
</style>
