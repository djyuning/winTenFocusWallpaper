<template>
	<div id="app" :class="{dark: darkMode}">
		<div class="header">

			<h1 class="title">Window 10 <span>FocusWallpaper</span></h1>

			<el-button type="success" class="theme-dark-toggle" size="mini" @click="darkMode = !darkMode">
				{{darkMode? '亮色': '暗色'}}
			</el-button>

		</div>
		<div class="body">
			<div class="sidebar">

				<ul class="menu">
					<router-link tag="li" to="/">
						<a><i class="el-icon-sort"></i></a>
					</router-link>
					<router-link tag="li" to="/collection">
						<a><i class="el-icon-star-off"></i></a>
					</router-link>
					<li>
						<button @click="settingVisible = true"><i class="el-icon-setting"></i></button>
					</li>
				</ul>

				<button class="exit" @click="exitApp">
					<icon name="power-off"></icon>
				</button>

			</div>
			<div class="wrapper">
				<router-view></router-view>
			</div>
		</div>
		<div class="footer">

			<span class="version">版本 {{version}}</span>

		</div>

		<el-dialog title="设置" :visible.sync="settingVisible">
			<div class="app-setting-wrap">
				<el-form ref="form" label-width="80px">

					<el-form-item label="记住选择">
						<el-switch></el-switch>
					</el-form-item>

					<el-form-item>
						<el-button size="mini" type="primary" @click="settingVisible = false">保存</el-button>
						<el-button size="mini" @click="settingVisible = false">恢复默认</el-button>
					</el-form-item>

				</el-form>
			</div>
		</el-dialog>

	</div>
</template>

<script>

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

			pushTo(routeName) {
				this.$router.push({
					name: 'Page' + routeName,
				});
			},

		},

		mounted() {

			// 主题
			this.darkMode = main.isDarkMode();

		}

	}
</script>

<style lang="less">
	@import './assets/less/main';
</style>
