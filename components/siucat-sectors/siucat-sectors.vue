<template>
	<!-- 转盘触摸事件 -->
	<view class="turntable" @touchstart='Start' @touchmove='Move' @touchend='Chend' v-if="datalist.length>0">
		<view class="turntable-content"
			:style='{transform: `rotateZ(${turnZ}deg)`,transition}'>
			<!-- 循环生成转盘元素 -->
			<view class="turntable-item" v-for="(item,index) in datalist" :style="{
					zIndex:`${subIndex(index)}`,
					transform:`rotate(${index*TRANS}deg) translateX(-50%)`
				}" :key='index'>
				<view class="ar-floor__sku-item" :style="{
						transform: `scale(${subScale(index)})`,transition: `transform 0.2s ease-out 0s`}">
					<view class="taro-img">
						<!-- 商品图片 -->
						<image class="taro-img__mode-widthfix" :src="getDataFiled(index, 'baike_info.image_url')" mode="aspectFill">
						</image>
					</view>
					<view class="jo-price">
						<!-- 显示商品详情 -->
						<text class="taro-text jo-price__yen">{{getDataFiled(index, 'name')}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'SecTors',
		data() {
			return {
				// 数据变量
				datalist: [],
				zList: [45, 46, 47, 48, 49, 51, 49, 48, 47, 46, 45],
				zIndex: 6,
				TRANS:30,

				// 触摸事件变量
				moveClientX: 0, // 初始触摸位置
				startClientX: 0, // 开始触摸位置
				differenceClientX: 0, // 开始触摸和当前触摸的差值

				// 旋转和过渡变量
				turnZ: 0, // 旋转角度
				transition: '', // 过渡效果
				scale: 0.0618, // 缩放比例
				taroimg: 0, // 商品图片的索引
			}
		},
		computed: {
			// 计算商品的z-index值
			subIndex() {
				return (index) => {
					let {
						datalist,
						zIndex,
						zList
					} = this;
					// 根据索引和数据长度计算z-index值
					if (index > (datalist.length - zIndex) && (index - (datalist.length - zIndex + 1)) % zIndex <=
						11) {
						return zList[(index - (datalist.length - zIndex + 1)) % zIndex];
					} else {
						return zList[index + zIndex - 1] || -1;
					}
				}
			},
			// 计算商品的缩放比例
			subScale() {
				return () => 1.6;
			}
		},
		methods: {
			// 插入数据到datalist
			add(data) {
				this.datalist = data;
			},
			getDataFiled(index, filedLink) {
				return filedLink.split('.').reduce((e, filed) => e && (e[filed] || e), this.datalist[index]);
			},
			// 触摸事件处理
			Start(e) {
				this.moveClientX = e.touches[0].pageX;
				this.transition = ``;
			},
			Move(e) {
				this.startClientX = this.moveClientX;
				this.moveClientX = e.changedTouches[0].pageX;
				this.differenceClientX = this.moveClientX - this.startClientX;

				let trZ = Math.abs(this.differenceClientX) * .3;
				// 根据触摸移动更新旋转角度
				this.turnZ += trZ * (this.differenceClientX > 0 ? 1 : -1);
				
				let integer = ~~(this.turnZ) / this.TRANS;
				// 取整
				this.integer = Math.round(integer);
				let index = 6 + integer / 10;
				if (integer > 0) {
					this.zIndex = index % 36;
				} else {
					if (index % 36 <= -25) {
						if ((index % 36) % 5 == 0) {
							if (index % 36 == -30) {
								this.zIndex = 6;
							} else if (index % 36 == -35) {
								this.zIndex = 1;
							} else {
								this.zIndex = 11;
							}
						} else {
							if (this.zIndex <= 6) {
								if (index % 36 <= -31) {
									this.zIndex = 6 + (index % 36) % 5;
								} else {
									this.zIndex = 11 + (index % 36) % 5;
								}
							} else {
								this.zIndex = 11 + (index % 36) % 5;
							}
						}
					} else {
						this.zIndex = index % 36;
					}
				}
			},
			Chend() {
				this.transition = `transform 0.2s ease-out 0s`;
				this.turnZ = this.integer * this.TRANS;
				this.taroimg = Math.abs(this.integer)  % this.datalist.length;
				if (this.integer > 0) this.taroimg = this.datalist.length - this.taroimg;
				this.$emit('Chend', this.taroimg);
			}
		}
	}
</script>

<style scoped>
	.turntable {
		-webkit-touch-callout: none;
		user-select: none;
		padding-top: 100rpx;
		position: relative;
		width: 100%;
		overflow: hidden;
	}

	.turntable-content {
		height: 1600rpx;
		transform: rotateZ(0deg);
		will-change: transform;
	}

	.turntable-item {
		position: absolute;
		height: inherit;
		left: 50%;
		top: 0;
		transform: translate3d(-50%, 0px, 0px);
		-webkit-transform-origin: left center;
		-ms-transform-origin: left center;
		transform-origin: left center;
		-ms-touch-action: pan-y;
		touch-action: pan-y;
	}

	.ar-floor__sku-item {
		display: inline-block;
		padding: 6rpx 8rpx 0;
		box-shadow: 0.04704rem 0.16405rem 0.61867rem 0 rgb(49 29 87 / 41%);
		border-radius: 5px;
		background-color: #ebebeb;
		transform: translateZ(0);
		will-change: transform;
		overflow: hidden;
	}

	.taro-img {
		width: 140rpx;
		height: 140rpx;
		border-radius: 2rpx;
		background-color: #fff;
		padding: 2rpx;
		box-sizing: border-box;
		transform: translateZ(0);
		overflow: hidden;
	}

	.taro-img>image {
		width: 100%;
		height: 100%;
		border-style: none;
		pointer-events: none;
		background: 0 0;
		border: 0;
		margin: 0;
		outline: 0;
		padding: 0;
		vertical-align: bottom;
		/* object-fit: cover; */
	}

	.jo-price {
		text-align: center;
		padding: 10rpx 0;
		font-size: 24rpx;
		font-family: JDZH-Regular, PingFangSC-Medium, -apple-system, Helvetica, "Microsoft YaHei", Arial, sans-serif, "微软雅黑", "黑体", "宋体", Helvetica, Verdana;
	}

	.jo-price__text--big {
		font-size: 36rpx;
	}
</style>