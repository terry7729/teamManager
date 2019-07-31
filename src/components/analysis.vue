<template>
  <div class="analysis">
    <!-- title -->
    <div class="title flex-x-start">
      <span>我的团队</span>
      <van-icon name="arrow" />
      <span>{{$route.query.userNickName}}</span>
      <van-icon name="arrow" />
      <span>综合分析</span>
    </div>
    <!-- 财富评分 -->
    <div class="wealth_point flex-x-between">
      <!-- 左 圆形统计图 -->
      <div class="circle_chart flex-y-end">
        <p>财富评分</p>
        <div id="pie_chart" style="width: 100%;height: 100%;"></div>
      </div>
      <!-- 右 详细数据列表 -->
      <div class="list_detail flex-x-between">
        <div class="list1">
          <p>分数</p>
          <ul>
            <li>
              <span class="blue"></span>
              <span>0-5.0分</span>
            </li>
            <li>
              <span class="light-blue"></span>
              <span>5.1-7.0分</span>
            </li>
            <li>
              <span class="orange"></span>
              <span>7.1-9.0分</span>
            </li>
            <li>
              <span class="yellow"></span>
              <span>9.1-10分</span>
            </li>
            <li>
              <span class="red"></span>
              <span>10分</span>
            </li>
          </ul>
        </div>
        <div class="list2">
          <p>占比</p>
          <ul>
            <li>
              <span>{{PointData.ProportionOne}}%</span>
            </li>
            <li>
              <span>{{PointData.ProportionTwo}}%</span>
            </li>
            <li>
              <span>{{PointData.ProportionThr}}%</span>
            </li>
            <li>
              <span>{{PointData.ProportionFou}}%</span>
            </li>
            <li>
              <span>{{PointData.ProportionFiv}}%</span>
            </li>
          </ul>
        </div>
        <div class="list3">
          <p>人数</p>
          <ul>
            <li>
              <span>{{PointData.CountOne}}人</span>
            </li>
            <li>
              <span>{{PointData.CountTwo}}人</span>
            </li>
            <li>
              <span>{{PointData.CountThr}}人</span>
            </li>
            <li>
              <span>{{PointData.CountFou}}人</span>
            </li>
            <li>
              <span>{{PointData.CountFiv}}人</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <van-tabs type="card" v-model="datatype" @click="tabclick">
      <van-tab title="日" name="0"></van-tab>
      <van-tab title="周" name="1"></van-tab>
      <van-tab title="月" name="2"></van-tab>
    </van-tabs>
    <div class="line_chart1">
      <div id="line_chart1" style="width: 100%;height: 100%;"></div>
    </div>
    <div class="line_chart2">
      <div id="line_chart2" style="width: 100%;height: 100%;"></div>
    </div>
  </div>
</template>
<script>
import { Icon, Tab, Tabs } from "vant";
import "vant/lib/tabs/style";
import echarts from "echarts";
import qs from "querystring";
export default {
  name: "analysis",
  components: {
    "van-icon": Icon,
    "van-tabs": Tabs,
    "van-tab": Tab
  },
  data() {
    return {
      pie_chart: "",
      line_chart1: "",
      line_chart2: "",
      datatype: "0",
      PointData: {}
    };
  },
  mounted() {
    // this.DrawLineChart1();
    // this.DrawLineChart2();
    this.pie_chart = echarts.init(document.getElementById("pie_chart"));
    this.line_chart1 = echarts.init(document.getElementById("line_chart1"));
    this.line_chart2 = echarts.init(document.getElementById("line_chart2"));
    this._getData();
  },
  methods: {
    DrawPieChart(data) {
      this.pie_chart.setOption({
        series: [
          {
            name: "财富评分",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data
          }
        ],
        color: ["#3665FE", "#6D91FF", "#FF7353", "#F8B551", "#FFEC6D"]
      });
    },
    DrawLineChart1(data, date) {
      this.line_chart1.setOption({
        title: {
          text: "新增人数",
          left: "center",
          textStyle: {
            //文字颜色
            color: "#3665fe",
            fontStyle: "normal",
            fontWeight: "bold",
            fontFamily: "sans-serif",
            fontSize: 13
          }
        },
        tooltip: {
          formatter: function(params) {
            let date =
              params.name.split(".")[0] +
              "月" +
              params.name.split(".")[1] +
              "日</br>";
            let count = "新增: " + params.value + "人";
            return date + count;
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: date,
          axisLabel: {
            show: true,
            textStyle: {
              color: "#666666"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#e5e5e5",
              width: 0.5
            }
          }
        },
        //y轴
        yAxis: {
          min: 0,
          max: 60,
          type: "value",
          axisLabel: {
            show: true,
            textStyle: {
              color: "#666666"
            }
          },
          // 线
          axisLine: {
            show: false
          },
          //刻度线
          axisTick: {
            show: false
          }
        },
        series: [
          {
            name: "新增人数",
            type: "line",
            stack: "总量",
            data: data,
            itemStyle: {
              borderWidth: 2,
              color: "#3665FE"
            }
          }
        ]
      });
    },
    DrawLineChart2(data, date) {
      this.line_chart2.setOption({
        title: {
          text: "团队活跃率",
          left: "center",
          textStyle: {
            //文字颜色
            color: "#F8B551",
            fontStyle: "normal",
            fontWeight: "bold",
            fontFamily: "sans-serif",
            fontSize: 13
          }
        },
        tooltip: {
          formatter: function(params) {
            let date =
              params.name.split(".")[0] +
              "月" +
              params.name.split(".")[1] +
              "日</br>";
            let count = "活跃率: " + params.value + "%";
            return date + count;
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: date,
          axisLabel: {
            show: true,
            textStyle: {
              color: "#666666"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#e5e5e5",
              width: 0.5
            }
          }
        },
        //y轴
        yAxis: {
          min: 0,
          max: 60,
          type: "value",
          axisLabel: {
            show: true,
            textStyle: {
              color: "#666666"
            }
          },
          // 线
          axisLine: {
            show: false
          },
          //刻度线
          axisTick: {
            show: false
          }
        },
        series: [
          {
            name: "新增人数",
            type: "line",
            stack: "总量",
            data: data,
            itemStyle: {
              borderWidth: 2,
              color: "#F8B551"
            }
          }
        ]
      });
    },
    _getData() {
      let vm = this;
      let data = {
        type: vm.datatype,
        groupId: vm.$route.query.groupId
      };
      vm.$axios({
        method: "post",
        url: "/module/teamAnalysis/teamAnalysisList",
        data: qs.stringify(data)
      }).then(res => {
        if (res.data.retcode == 0) {
          let data = res.data.data;
          vm.PointData = data;
          let PieData = [
            { value: data.ProportionOne },
            { value: data.ProportionTwo },
            { value: data.ProportionThr },
            { value: data.ProportionFou },
            { value: data.ProportionFiv }
          ];
          let lineData1 = [];
          let lineData2 = [];
          let date = [];
          data.list.map(item => {
            lineData1.push(item.memberCount); //折线图数据1
            lineData2.push(item.activeRate); //折线图数据2
            date.push(item.createTime.slice(-4).replace("-", ".")); //时间
          });
          vm.DrawPieChart(PieData);
          vm.DrawLineChart1(lineData1, date);
          vm.DrawLineChart2(lineData2, date);
        }
      });
    },
    tabclick(item){
        this._getData()
    }
  }
};
</script>
<style>
.van-tabs__nav--card {
  margin: 0 0 !important;
}
.van-tabs__nav--card .van-tab.van-tab--active {
  background-color: #3665fe;
}
.van-tabs__nav--card .van-tab {
  border-right: 0.5px solid #3665fe;
  color: #3665fe;
  line-height: 0.7rem;
}
.van-tabs__nav--card {
  border: 0.5px solid #3665fe;
  height: 0.7rem;
}
.van-tabs--card > .van-tabs__wrap {
  height: 0.7rem;
}
.van-tabs {
  margin-top: 0.5rem;
}
</style>
<style lang="scss" scoped>
.analysis {
  padding: 0.5rem 0.5rem 0 0.5rem;
  height: 100%;
  .title {
    color: #999999;
    span {
      margin: 0rem 0.05rem;
    }
    span:not(:last-child) {
      color: #3665fe;
    }
  }
  .wealth_point {
    margin-top: 0.5rem;
    align-items: flex-end;
    .circle_chart {
      width: 3.5rem;
      height: 3.5rem;
      p {
        color: #3665fe;
      }
    }
    .list_detail {
      width: 50%;
      .list1,
      .list2,
      .list3 {
        p {
          color: #999999;
        }
        ul {
          text-align: left;
          li {
            margin: 0.2rem 0;
            display: flex;
            align-items: center;
            font-size: 0.24rem;
          }
        }
      }
      .list1 {
        ul li {
          span:nth-child(1) {
            width: 0.16rem;
            height: 0.16rem;
            display: inline-block;
            border-radius: 2px;
            margin: 0 0.2rem;
          }
        }
      }
    }
  }
  .line_chart1,
  .line_chart2 {
    height: 5rem;
    width: 100%;
    margin-top: 0.3rem;
  }
  .blue {
    background: #3665fe;
  }
  .light-blue {
    background: #6d91ff;
  }
  .orange {
    background: #f8b551;
  }
  .yellow {
    background: #ffec6d;
  }
  .red {
    background: #ff7353;
  }
}
</style>

