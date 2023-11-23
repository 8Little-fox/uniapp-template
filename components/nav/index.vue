<template>
	<view class="lxy-content">
		<scroll-view scroll-x="true" class="content-scroll" scroll-with-animation :scroll-left="scrollLeft">
			<view v-for="(item, index) in category" :key="index" class="scroll-item" @click="changeTitle(index)">
				<text class="item-text" :class="curIndex == index? 'active' : ''">{{item.name}}</text>
			</view>
		</scroll-view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				category: [{
						id: 1,
						name: '星期一'
					},
					{
						id: 2,
						name: '星期二'
					},
					{
						id: 3,
						name: '星期三'
					},
					{
						id: 4,
						name: '星期四星期四'
					},
					{
						id: 5,
						name: '星期五'
					},
					{
						id: 6,
						name: '星期六'
					},
					{
						id: 7,
						name: '星期七'
					},
					{
						id: 8,
						name: '星期八'
					},
					{
						id: 9,
						name: '星期九'
					},
					{
						id: 10,
						name: '星期十'
					}
				],

				contentScrollW: 0, // 导航区宽度
				curIndex: 0, // 当前选中
				scrollLeft: 0, // 横向滚动条位置
			}
		},
		mounted() {
			// 获取标题区域宽度，和每个子元素节点的宽度
			this.getScrollW()
		},
		methods: {
			// 获取标题区域宽度，和每个子元素节点的宽度以及元素距离左边栏的距离
			getScrollW() {
				const query = uni.createSelectorQuery().in(this);

				query.select('.content-scroll').boundingClientRect(data => {
					// 拿到 scroll-view 组件宽度
					this.contentScrollW = data.width
				}).exec();

				query.selectAll('.scroll-item').boundingClientRect(data => {
					console.log(data);
					let dataLen = data.length;
					for (let i = 0; i < dataLen; i++) {
						//  scroll-view 子元素组件距离左边栏的距离
						this.category[i].left = data[i].left;
						//  scroll-view 子元素组件宽度
						this.category[i].width = data[i].width
					}
				}).exec()
			},


			// 选择标题
			changeTitle(index) {
				this.curIndex = index;

				// 效果一(当前点击子元素靠左展示)  局限性：子元素宽度相同
				this.scrollLeft = index * this.category[index].width

				// 效果一(当前点击子元素靠左展示)  子元素宽度不相同也可实现
				/* this.scrollLeft = 0;
				for (let i = 0; i < index; i++) {
				    this.scrollLeft += this.category[i].width
				}; */


				// 效果二(当前点击子元素靠左留一展示)  局限性：子元素宽度相同
				/* this.scrollLeft = (index - 1)  * this.category[index].width */

				// 效果二(当前点击子元素靠左留一展示)  子元素宽度不相同也可实现
				/* this.scrollLeft = 0;
				for (let i = 0; i < index - 1; i++) {
				    this.scrollLeft += this.category[i].width
				}; */


				// 效果三(当前点击子元素居中展示)  不受子元素宽度影响
				/* this.scrollLeft = this.category[index].left - this.contentScrollW / 2 + this.category[index].width / 2; */

			}
		}
	}
</script>

<style lang="scss" scoped>
	.lxy-content {
		width: 100%;
		height: 100rpx;
		// margin-top: 50rpx;
		box-sizing: border-box;

		.content-scroll {
			height: 100rpx;
			white-space: nowrap;

			.scroll-item {
				height: 100rpx;
				padding: 0 20rpx;
				display: inline-block;
				text-align: center;

				.item-text {
					font-size: 30rpx;
					line-height: 100rpx;

					&.active {
						color: #1468FF;
						border-bottom: 4rpx solid #1468FF;
						padding-bottom: 20rpx;
					}
				}
			}
		}
	}
</style>