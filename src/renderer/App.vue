<template>
	<div id="app" :class="{dark: darkMode}">
		<div class="header">
			<h1 class="title">Window 10 <span>FocusWallpaper</span></h1>

			<el-button class="theme-dark-toggle" size="mini" @click="darkMode = !darkMode">{{darkMode? '亮色': '暗色'}}</el-button>

		</div>
		<div class="body">
			<div class="sidebar">

				<ul class="menu">
					<li>
						<button><i class="el-icon-sort"></i></button>
					</li>
					<li>
						<el-tooltip class="item" effect="dark" content="Top Center 提示文字" placement="right-center">
							<button>
								<i class="el-icon-star-off"></i>
							</button>
						</el-tooltip>
					</li>
					<li>
						<button @click="settingVisible = true"><i class="el-icon-setting"></i></button>
					</li>
				</ul>

			</div>
			<div class="wrapper" ref="wrapper">
				<div class="content">
					<router-view></router-view>
				</div>
			</div>
		</div>
		<div class="footer">

			<span class="version">版本 {{version}} Beta</span>

		</div>

		<el-dialog title="设置" :visible.sync="settingVisible">
			<div class="app-setting-wrap">
				<el-form ref="form" label-width="128px">

					<el-form-item label="记住选择">
						<el-switch></el-switch>
					</el-form-item>

					<el-form-item>
						<el-button size="mini" type="primary">保存</el-button>
						<el-button size="mini">恢复默认</el-button>
					</el-form-item>

				</el-form>
			</div>
		</el-dialog>

		<!--
		<div class="menus">
			<button @click="exitApp">关闭</button>
		</div>
		-->
	</div>
</template>

<script>

	import BScroll from 'better-scroll'
	import main from '../lib/main'
	import appInfo from '../../package'

	export default {

		name: 'WinTenFocus',

		data() {
			return {
				scroll: null,
				settingVisible: false,
				darkMode: false,
				version: appInfo.version,
			};
		},

		watch: {

			darkMode: function (set) {
				main.toggleThemeMode(set);
			}

		},

		methods: {

			exitApp() {
				this.$electron.remote.process.exit();
			},

		},

		mounted() {

			// 主题
			this.darkMode = main.isDarkMode();

			this.$nextTick(() => {

				// 滚动条
				this.scroll = new BScroll(this.$refs.wrapper, {
					mouseWheel: true,
					scrollbar: {
						fade: false,
						interactive: true,
					},
				});

			});
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

	body {
		font-family: "微软雅黑", "Helvetica Neue", Helvetica, Arial, sans-serif !important;
		-webkit-user-select: none;
		-webkit-font-smoothing: subpixel-antialiased;
		-webkit-transform: transition3d(0,0,0);
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

	input, textarea {
		-webkit-user-select: text;
		user-select: text;
	}

	.padding {
		padding: @void;
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

		// 主题切换按钮
		.theme-dark-toggle {
			position: absolute;
			right: @voidLarge;
			top: 50%;
			margin-top: -14px;
		}

		// 头部
		& > .header {
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

		& > .body {
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

		.wrapper {
			background-color: #fafafa;
			bottom: 0;
			left: 64px;
			right: 0;
			top: 0;
			overflow: hidden;
			position: absolute;
			z-index: 1;

		}

		& > .footer {
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

		// 暗色主题
		&.dark {
			background-color: #222;

			.header, .sidebar, .footer {
				border-color: #444;
			}

			.header {
				background-color: #111;
			}

			.wrapper {
				background-color: #333;
			}

		}

	}

</style>
