<template>
  <view>
    <view class="content">
      <view class="options-group">
        <view
          v-for="(item, index) in list"
          :key="index"
          class="options-group-item"
          @click="handleOptionClick(index, item)"
        >
          <text class="text">{{ item.label }}</text>
          <image src="@/static/right.png" class="icon" />
        </view>
      </view>
    </view>
    <time-select ref="timeBox" :getTime.sync="door_time"></time-select>
  </view>
</template>

<script>
import timeSelect from "@/components/TimeSelect/index.vue";
export default {
  components: {
    timeSelect
  },
  data() {
    return {
      title: "Hello",
      door_time: "",
      list: [
        { label: "上门取件时间", page: "", typeStr: "door_time" },
        { label: "拍摄", page: "/pages/photo/index", typeStr: "photo" }
      ]
    };
  },
  onLoad() {},
  created() {},
  methods: {
    changeDoorTime() {
      this.$refs.timeBox.getNextDay();
      this.$refs.timeBox.showBox();
    },
    handleOptionClick(index, item) {
      if (item.typeStr == "door_time") {
        this.changeDoorTime();
      }
      uni.navigateTo({
        url: item.page
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  min-height: 700rpx;
  margin-top: 20rpx;
  overflow: auto;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;

  .options-group {
    width: 100%;
    .options-group-item {
      color: $dark;
      font-size: $wk-font-base;
      border-bottom: 1rpx solid $border-color;
      padding: 22rpx 0;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .text {
        flex: 1;
        margin-left: 20rpx;
      }
      .icon {
        color: inherit;
        line-height: 1;
        width: 45rpx;
        height: 45rpx;
        margin-right: 20rpx;
      }
    }
  }
}
</style>
