<template>
	<view class="index">
		<!-- 由于获取主题色需要canvas绘制。绝对定位，把canvas移除屏幕外绘制 -->
		<canvas canvas-id="canvas" style="position: absolute;left: -400px;"></canvas>
		<!-- box：填充主题颜色容器 -->
		<view class="box" :style="[getStyle]">
			<!-- 其他内容 -->
			<view class="tabs"></view>
			<!-- 轮播图 -->
			<swiper class="swiper" :current="current" circular autoplay indicator-dots @change="onChange"
				:interval="3000">
				<swiper-item class="swiper-item" v-for="(url, i) in list" :key="i">
					<image :src="url" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import {getImageThemeColor} from '../../utils/tools'
	export default {
		data() {
			return {
				// 图片列表
				list: [],
				// 当前轮播图索引
				current: 0,
				// 缓存banner图片主题色
				colors: [],
				// 记录当前提取到第几张banner图片
				count: 0
			}
		},
		computed: {
			// 动态设置banner主题颜色背景
			getStyle() {
				const color = this.colors[this.current]
				return {
					background: color ? `linear-gradient(to bottom, rgb(${color}), #fff)` : '#fff'
				}
			}
		},
		methods: {
			// banner改变
			onChange(e) {
				this.current = e.target.current
			},
			getList() {
				this.list = [
					'https://img.zcool.cn/community/0121e65c3d83bda8012090dbb6566c.jpg@3000w_1l_0o_100sh.jpg',
					'https://img.zcool.cn/community/010ff956cc53d86ac7252ce64c31ff.jpg@900w_1l_2o_100sh.jpg',
					'https://img.zcool.cn/community/017fc25ee25221a801215aa050fab5.jpg@1280w_1l_2o_100sh.jpg',
					'https://img.iplaysoft.com/wp-content/uploads/2019/free-images/free_stock_photo.jpg',
					'https://inews.gtimg.com/om_bt/OjdjRjBkvglXLtSq4uaH_zHr6ferMGDqFiN0IKH34RGFoAA/641'
				]
			},
			// 获取主题颜色
			getThemColor() {
				console.log('util', getImageThemeColor);
				getImageThemeColor(this, this.list[this.count], 'canvas', (color) => {
					const colors = [...this.colors]
					colors[this.count] = color
					this.colors = colors
					this.count++
					if (this.count < this.list.length) {
						this.getThemColor()
					}
				})
			}
		},
		onLoad() {
			this.getList()
			// banner图片请求完成后，获取主题色
			this.getThemColor()
		}
	}
</script>

<style>
	.box {
		display: flex;
		flex-direction: column;
		background-color: deeppink;
		padding: 10px;
	}

	.tabs {
		height: 100px;
		color: #fff;
	}

	.swiper {
		width: 95%;
		height: 200px;
		margin: auto;
		border-radius: 10px;
		overflow: hidden;
	}

	image {
		width: 100%;
		height: 100%;
	}
</style>