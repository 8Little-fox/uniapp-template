<template>
  <uni-popup ref="popup" type="bottom">
    <view class="pBoxUp">
      <view class="textCenter f32 psTitle border-bottom">请选择上门取件时间</view>
      <view class="shopPopup bgff justify-between default-flex">
        <view class="f30 t666 lBox">
          <view
            v-for="(item,index) in jmhDay"
            @click="selectLDate(item)"
            :class="sLDate===item.formatDate?'ed':''"
            class="boxLDate"
            :key="index"
          >{{item.desc}}({{item.name}})</view>
        </view>
        <view class="rWrapper">
          <view
            v-for="(item,index) in timeList"
            @click="selectRDate(item)"
            :class="[sRightDate==item.time?'ed':'',item.disabled?'disabled-text':'']"
            :key="index"
            class="rBox"
          >{{item.time}}{{item.disabled?' (超出取件时间)':''}}</view>
          <view
            class="empty f28 text-center"
            style="color: #999;margin-top: 40rpx;"
            v-if="timeList.length<1"
          >今天没有时间了,看看明天吧</view>
        </view>
      </view>
      <!-- <view class="cancelButton" @click="close()">
							取消
      </view>-->
    </view>
  </uni-popup>
</template>
<script>
	import { getDate } from "@/utils/timeselect.js";

export default {
  name: "distributionBox",
  data() {
    return {
      door_time: "",
      sRightDate: "",
      sLDate: "",
      jmhDay: [],
      timeList: [
        { disabled: false, time: "9:00-11:00", id: 1 },
        { disabled: false, time: "11:00-13:00", id: 2 },
        { disabled: false, time: "13:00-15:00", id: 3 },
        { disabled: false, time: "15:00-17:00", id: 4 },
        { disabled: false, time: "17:00-19:00", id: 5 },
        { disabled: false, time: "19:00-20:00", id: 6 }
      ]
    };
  },
  methods: {
    close() {
      this.$refs.popup.close();
    },
    getWeekDate(day) {
      var weeks = new Array(
        "周日",
        "周一",
        "周二",
        "周三",
        "周四",
        "周五",
        "周六"
      );
      var week = weeks[day];
      return week;
    },
    //获取当前日期的下一天日期
    getNextDay() {
      var day = this.getWeekDate(new Date().getDay());
      var newDate = /\d{4}-\d{1,2}-\d{1,2}/g.exec(new Date());
      var isDay = getDate().fullDate;
      var nextDay = this.getWeekDate(
        new Date(new Date().getTime() + 24 * 60 * 60 * 1000).getDay()
      );
      var nDate = getDate(new Date(new Date().getTime() + 24 * 60 * 60 * 1000))
        .fullDate;
      console.log(nDate);
      var HDay = this.getWeekDate(
        new Date(new Date().getTime() + 48 * 60 * 60 * 1000).getDay()
      );
      var hDate = getDate(new Date(new Date().getTime() + 48 * 60 * 60 * 1000))
        .fullDate;
      let d1 = hDate.substr(hDate.indexOf("-") + 1);
      this.sLDate = isDay;
      this.selectLDate(1);
      this.jmhDay = [
        { name: day, id: 1, formatDate: isDay, desc: "今天" },
        { name: nextDay, id: 2, formatDate: nDate, desc: "明天" },
        {
          name: HDay,
          id: 3,
          formatDate: hDate,
          desc:
            d1.substr(0, d1.indexOf("-")) +
            "月" +
            d1.substr(d1.indexOf("-") + 1) +
            "日"
        }
      ];
    },
    showBox() {
      this.$refs.popup.open();
    },
    selectRDate(item) {
      if (item.disabled) {
        return;
      }
      this.sRightDate = item.time;
      this.door_time = this.sLDate + " " + item.time;
      this.$refs.popup.close();
      this.$emit("update:getTime", this.door_time);
    },
    selectLDate(val) {
      console.log(val);
      if (val != 1) {
        this.$set(this, "sLDate", val.formatDate);
        // this.sLDate=val.formatDate;
        console.log("this.sLDate", this.sLDate);
      }
      let t = [
        { disabled: false, time: "9:00-11:00", id: 1 },
        { disabled: false, time: "11:00-13:00", id: 2 },
        { disabled: false, time: "13:00-15:00", id: 3 },
        { disabled: false, time: "15:00-17:00", id: 4 },
        { disabled: false, time: "17:00-19:00", id: 5 },
        { disabled: false, time: "19:00-20:00", id: 6 }
      ];
      if (val.desc == "今天" || val == 1) {
        console.log(new Date().getHours());
        if (new Date().getHours() < 9) {
          this.timeList = t;
        } else if (new Date().getHours() < 11) {
          t[0].disabled = true;
          this.timeList = t;
        } else if (new Date().getHours() < 13) {
          t[0].disabled = true;
          t[1].disabled = true;
          this.timeList = t;
        } else if (new Date().getHours() < 15) {
          t[0].disabled = true;
          t[1].disabled = true;
          t[2].disabled = true;
          this.timeList = t;
        } else if (new Date().getHours() < 17) {
          t[0].disabled = true;
          t[1].disabled = true;
          t[2].disabled = true;
          t[3].disabled = true;
          this.timeList = t;
        } else if (new Date().getHours() < 19) {
          t[0].disabled = true;
          t[1].disabled = true;
          t[2].disabled = true;
          t[3].disabled = true;
          t[4].disabled = true;
          this.timeList = t;
        }
        console.log("最终的时间列表");
        console.log(this.timeList);
      } else {
        this.timeList = t;
      }
      this.sRightDate = "";
    }
  }
};
</script>
<style lang="scss" scoped>
.pBoxUp {
  background: #f5f5f5;
  width: 100vw;
  height: 600rpx;
  .psTitle {
    line-height: 100rpx;
    text-align: center;
    border-bottom: 1rpx solid #f7f7f7;
  }
  .shopPopup {
    backgound: #ffffff;
    font-size: 32rpx;
    display: flex;
    justify-content: space-between;
  }
  .boxLDate {
    font-size: 24rpx;
    height: 80rpx;
    line-height: 80rpx;
    width: 273rpx;
    text-align: center;
  }
  .lBox {
    color: #666666;
    background: #f5f5f5;
    font-size: 30rpx;
  }
  .boxLDate.ed {
    color: var(--view-theme);
    background: #fff;
  }
  // .rWrapper{
  // 	height: 300rpx;
  // }
  .rBox.ed {
    color: var(--view-theme);
  }
  .rBox {
    width: 239px;
    padding-left: 20rpx;
    font-size: 24rpx;
    color: #333;
    height: 80rpx;
    background: #fff;
    line-height: 80rpx;
  }
  .disabled-text {
    color: #999;
  }
  .cancelButton {
    font-size: 36rpx;
    color: #999;
    text-align: center;
    height: 100rpx;
    line-height: 100rpx;
    border-top: 1px solid #e5e5e5;
    background: #fff;
  }
}
</style>