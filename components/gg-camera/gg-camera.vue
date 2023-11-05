<template>
	<view class="camera-box" @click="showSelector=false">
		<view style="width:100vw;height:100vh;display:flex;flex-direction: column;">
			<view @click="changeFinish" class="finish">完成</view>
			<camera v-if="isTakePhoto" frame-size="large" device-frame-size="large" resolution="high" device-resolution="high"
				:position="device" :device-position="device" :flash="flash" :device-flash="flash" @error="error"
				@initdone="success" class="camera-w camera-re">
			<cover-image v-if="coverImage" :src="coverImage" mode="aspectFill" class="img-top"></cover-image>
			</camera>
			<image v-if="!isTakePhoto" :src="user_image" mode="aspectFill" class="camera-w camera-re"></image>
			<view :class="{'hidden':showSelector || outputPath}" class="camera-bottom">
				<scroll-view scroll-x="true" @scroll="scroll" :scroll-left="tabLeft" show-scrollbar="true">
					<view style="display: flex;">
						<view v-for="(pic, index) of pictureArr" :key="index" @click="changePicture(pic, index)">
							<view :class="index===current?'picture-active':'picture-no-active'" class="picture-box-item">
								<image v-if="pic.user_image" class="picture-box-item-image" :src="pic.user_image" mode="aspectFill"/>
								<image v-else :src="pic.icon" mode="aspectFill" class="picture-box-item-icon" />
								<view class="picture-box-item-name">{{ pic.name }}</view>
							</view>
						</view>
					</view>
				</scroll-view>
				<view v-if="isTakePhoto" class="acea-row row-around row-middle">
					<view class="flex-col-center" @click.stop="changeFlash">
						<image v-show="flash === 'off'" class="image1" src="@/static/png/print.png"></image>
						<image v-show="flash==='torch'" class="image1" src="@/static/png/fl-torch.png"></image>
					</view>
					<view class="cameraBtn" @click="takePhoto">
						<view class="cameraBtn2"></view>
					</view>
					<view class="flex-col-center">
						<image class="image1" @click="uploadpic" src="@/static/png/cam.png"></image>
					</view>
				</view>
				<view v-else class="acea-row row-around row-middle">
					<view class="flex-col-center">
						<image class="image1" @click.stop="isTakePhoto=true" src="@/static/png/back.png"></image>
					</view>
					<view class="flex-col-center">
						<image class="image1" @click.stop="changeRight()" src="@/static/png/right.png"></image>
					</view>
				</view>
			</view>
		</view>
		<!-- <view style="position: absolute;top: -999999px;">
			<outputer ref="outputer"></outputer>
		</view> -->
	</view>
</template>

<script>
	import previewer from './previewer'
	import outputer from './outputer'
	import selector from './selector'
	// import jpeg from 'jpeg-js'
	export default {
		name: 'gg-camera',
		components: {
			// previewer,
			// selector,
			// outputer,
		},
		data() {
			return {
				flash: 'off', //闪光灯，值为auto, on, off,torch
				orientation: 'vertical', //画面方向，默认vertical竖屏，horizontal横屏
				device: 'back', //前置或后置摄像头，值为front, back
				showSelector: false,
				// selectedWaterMarkConfig: null,
				// maxZoom: 1,
				// outputPath: '',
				// showTips: true,
				pictureArr: [],
				current: 0,
				tabLeft: 0,
				coverImage: '', // 图例
				isTakePhoto: true,
				user_image: '' // 拍摄图
			}
		},
		mounted() {
			this.cameraCTX = uni.createCameraContext();
			this.frameListen = this.cameraCTX.onCameraFrame((frame) => {
				if (this.waitCameraFrame) {
					this.waitCameraFrame(frame)
					this.waitCameraFrame = null;
				}
			});
			this.frameListen.start({
				success() {
					console.log('frameListen start success')
				},
				fail() {
					this.frameListen = null;
					console.log('frameListen start fail')
				}
			})
			// const arr = uni.getStorageSync('identify_image')
			this.pictureArr = [
				{user_image: '', icon: '',name: '正面', image: ''},
				{user_image: '', icon: '',name: '正面', image: ''},
				{user_image: '', icon: '',name: '正面', image: ''},
				{user_image: '', icon: require('@/static/png/photo-add.png') ,name: '其他补充', image: ''},
			]
			// this.coverImage = arr[0].image
		},
		beforeDestroy() {
			this.frameListen && this.frameListen.stop({
				success: () => {
					this.frameListen = null;
					console.log('frameListen stop success')
				},
				fail: () => {
					this.frameListen = null;
					console.log('frameListen stop fail')
				}
			})
		},
		methods: {
			changePicture(item, index) {
				this.current = index
				this.coverImage = item.image
				this.isTakePhoto = true
				if (this.pictureArr.length > 5) {
					this.tabLeft = (index - 1) * 60; //设置下划线位置
				}
				console.log('tabLeft', this.tabLeft);
			},
			// 完成
			changeFinish() {
				console.log('拍摄完成', this.pictureArr);
				uni.setStorageSync('identify_image', this.pictureArr);
				uni.navigateBack({
					delta: 1
				})
			},
			switchCamera() {
				if (this.device == 'front') {
					this.device = 'back'
				} else {
					this.device = 'front'
				}
			},
			// 手电筒
			changeFlash() {
				this.flash = this.flash === 'off' ? 'torch' : 'off'
			},
			uploadpic: function() {
				let that = this;
				this.$util.uploadImageOne({url: 'upload/image', sourceType: ['album']}, function(res) {
					that.pictureData(res.data.url)
				});
			},	
			scroll(e) {
				console.log(e);
			},
			changeRight() {
				this.isTakePhoto=true	
				this.current = this.current + 1
				this.$set(this, 'coverImage', this.pictureArr[this.current].image)
			},
			async getCameraPhoto() {
				if (this.frameListen && 1 === 2) {
					const frame = await new Promise((resolve) => {
						this.waitCameraFrame = resolve;
					});
					return {
						filePath: new Uint8ClampedArray(frame.data),
						width: frame.width,
						height: frame.height,
					};
				} else {
					const {
						tempImagePath: filePath
					} = await this.$tools.promisify(this.cameraCTX.takePhoto)({
						quality: 'high',
					});
					const photoInfo = await this.$tools.promisify(uni.getImageInfo)({
						src: filePath,
					});
					return {
						filePath: filePath,
						width: photoInfo.width,
						height: photoInfo.height,
					};
				}
			},
			pictureData(url) {
				const that = this;
				const {name, icon, user_image, image } = that.pictureArr[that.current]
						that.pictureArr.splice(
							that.current,name !== '其他补充' ? 1 : 0, 
							{
								user_image: url,	
								icon,
								image,
								name})
						that.$set(that, 'coverImage', image)
						that.$set(that, 'user_image', url)
						that.$set(that, 'pictureArr', that.pictureArr)
			},
			// 拍摄
			async takePhoto() {
				if (this.handing) {
					return;
				}
				try {
					this.handing = true;
					const that = this;
					const ctx = uni.createCameraContext();
            ctx.takePhoto({
							quality: 'high',
							success: (res) => {
								this.isTakePhoto = false;
									this.$util.uploadImgs('upload/image', res.tempImagePath, (res) => {
										that.pictureData(res.data.url)
									}, (err) => {
										console.log(err)
									})
							}
					});
					// const photoInfo = await this.getCameraPhoto();
					// console.log(photoInfo);
					// this.outputPath = await this.$refs.outputer.output(this.orientation, this.selectedWaterMarkConfig,
					// 	photoInfo);
				} catch (err) {
					console.error(err);
					uni.showToast({
						icon: 'error',
						title: '处理失败'
					})
				} finally {
					this.handing = false;
				}
			},
			success(e) {
				this.maxZoom = e.detail.maxZoom;
				console.log('初始化相机成功', e)
			},
			error(e) {
				console.error('初始化相机失败', e)
				return uni.showToast({
					icon: 'error',
					title: '初始化相机失败'
				})
			},
			saveImageToPhotosAlbum() {
				uni.saveImageToPhotosAlbum({
					filePath: this.outputPath,
					success: (res) => {
						console.log(res)
						uni.showToast({
							icon: 'success',
							title: '保存成功'
						})
					},
					fail: (err) => {
						console.error(err)
						uni.showToast({
							icon: 'error',
							title: '保存失败'
						})
					}
				});
			},
			sharePhoto() {
				uni.showShareImageMenu({
					path: this.outputPath,
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	@import './camera.scss';
</style>