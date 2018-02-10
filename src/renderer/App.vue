<template>
	<div id="app">
		<div class="header">
			<h1 class="title">Window 10 <span>FocusWallpaper</span></h1>
		</div>
		<div class="body">
			<div class="sidebar">

				<ul class="menu">
					<li>
						<button><i class="el-icon-sort"></i></button>
					</li>
					<li>
						<button><i class="el-icon-star-off"></i></button>
					</li>
					<li>
						<button><i class="el-icon-setting"></i></button>
					</li>
				</ul>

			</div>
			<div class="content">
				<router-view></router-view>
			</div>
		</div>
		<div class="footer">

			<span class="version">版本 0.0.1 Beta</span>

		</div>
		<!--
		<div class="menus">
			<button @click="exitApp">关闭</button>
		</div>
		-->
	</div>
</template>

<script>
	export default {

		name: 'WinTenFocus',

		methods: {

			exitApp() {
				this.$electron.remote.process.exit();
			},

		}

	}
</script>

<style lang="less">
	@import './assets/less/mixins/mixins';
	@import './assets/less/mixins/const';

	* {
		margin: 0;
		padding: 0;
	}

	ul, ol, li {
		list-style: none;
	}

	img {
		max-width: 100%;
	}

	input, button, textarea, select {
		font-family: inherit;
		font-size: inherit;
	}

	body {
		font-family: "微软雅黑", "Helvetica Neue", Helvetica, Arial, sans-serif !important;
		-webkit-user-select: none;
	}

	#app {
		background-color: white;
		color: #666;
		height: 100%;
		position: absolute;
		width: 100%;

		.el-form-item__label {
			color: inherit;
		}

		// 头部
		.header {
			background-color: white;
			border-bottom: 1px #eee solid;
			position: relative;
			z-index: 2;

			// LOGO
			.title {
				font-family: "Microsoft YaHei", sans-serif;
				font-size: 24px;
				font-weight: normal;
				line-height: 64px;
				margin: 0 @voidLarge;
				padding: @void;
				text-align: left;
				-webkit-app-region: drag;

				span {
					color: @colorPrimary;
					display: inline-block;
					font-weight: bold;
					vertical-align: top;
				}

			}

		}

		.body {
			bottom: 28px;
			left: 0;
			right: 0;
			position: absolute;
			top: 85px;
			z-index: 3;
		}

		.sidebar {
			border-right: 1px #eee solid;
			bottom: 0;
			left: 0;
			top: 0;
			position: absolute;
			width: 64px;
			z-index: 2;

			// 菜单
			.menu {
				position: relative;

				button {
					background-color: transparent;
					border: none;
					color: inherit;
					cursor: pointer;
					height: 64px;
					font-size: 24px;
					outline: none;
					width: 64px;

					&:hover {
						background-color: @colorPrimary;
						color: white;
					}

				}

			}

		}

		.content {
			background-color: #fafafa;
			bottom: 0;
			left: 64px;
			right: 0;
			top: 0;
			overflow: auto;
			position: absolute;
			z-index: 1;
		}

		.footer {
			border-top: 1px #eee solid;
			height: 28px;
			font-size: 12px;
			left: 0;
			bottom: 0;
			right: 0;
			position: absolute;
			z-index: 3;

			.version {
				color: #999;
				display: inline-block;
				padding: 0 @void;
				position: absolute;
				right: 0;
				top: 0;
				font-size: 12px;
				line-height: 28px;
			}

		}

		.menus {
			position: absolute;
			right: 0;
			top: 0;
			z-index: 8;

			button {
				cursor: pointer;
			}

		}

	}

</style>
