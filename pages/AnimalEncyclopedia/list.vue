<template>
	<view class="list-item">
		<view class="list-item-img">
			<image :src="item.dwtp" mode="aspectFill">
			</image>
		</view>
		<view class="list-content">
			<view class="list-name">
				{{item.name}}
			</view>
			<view class="list-tag" v-if="item.tags">
				<block v-for="(tag, i) in item.tags">
					   <text v-if="tag != ''">{{ tag }}</text>
				</block>
			</view>
<!-- 			<view class="list-price">
				<text>￥</text>
				<text>{{'0'|filterPrice}}</text>
			</view> -->
			<view class="list-comment">
				{{item.dwjj}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: ['item'],
		data() {
			return {

			};
		},
		methods: {
		}
	}
</script>

<style lang="scss">
	.list-item {
		width: 100%;
		display: flex;
		border-radius: 10rpx;
		box-sizing: border-box;
		margin: 16px 0;
		// margin-bottom: 20rpx;

		.list-comment {
			width: 100%;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			overflow: hidden;
			text-overflow: ellipsis;
			-webkit-line-clamp: 3;
			max-height: 3.2rem;
			color: #666;
			font-size: .8rem;
		}

		.list-price {
			width: 100%;
			margin-top: 15rpx;

			text:first-child {
				font-size: 26rpx;
				font-weight: 400;
				color: orangered;
			}

			text:last-child {
				font-size: 36rpx;
				color: orangered;
				font-weight: 600;
			}
		}

		.list-tag {
			width: 100%;
			margin: 4px 0;
			display: flex;
			flex-wrap: wrap;

			text {
				font-size: 22rpx;
				font-weight: 400;
				border: 1px solid orangered;
				color: orangered;
				margin-right: 8px;
				border-radius: 10rpx;
				padding: 2px;
				margin-bottom: 6px;
				box-sizing: border-box;
			}
		}

		.list-item-img {
			width: 110px;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.list-content {
			flex: 1;
			margin-left: 8px;

			.list-name {
				width: 100%;
				font-weight: bold;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				word-break: break-all;
				word-wrap: break-word;
				white-space: normal;
				word-break: break-word;

			}
		}

	}
</style>