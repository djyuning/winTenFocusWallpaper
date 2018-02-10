<template>
	<div class="app-home">

		<div class="checker">

			<div class="row">
				<el-input v-model="srcPath" placeholder="请选择源地址">
					<el-button type="primary" slot="append" icon="el-icon-more"
										 @click="getPath('srcPath')"></el-button>
				</el-input>
			</div>

			<div class="row">
				<el-input v-model="distPath" placeholder="请选择图片默认导出地址">
					<el-button type="primary" slot="append" icon="el-icon-more"
										 @click="getPath('distPath')"></el-button>
				</el-input>
			</div>

			<div class="row">
				<el-button @click="getImages">获取全部</el-button>
				<el-button>电脑</el-button>
				<el-button>手机</el-button>
				<el-button>图标</el-button>
				<el-button @click="srcFiles = null">清空</el-button>
			</div>

		</div>

		<div class="gallery">
			<ul class="results" v-if="srcFiles">
				<li v-for="(file, key) in imageFiles" :key="key">
					<img :src="'file:///'+ file.srcPath.replace(/\\/g,'/')" alt="" style="width: 200px;"/>
					<div class="name">
						<span>{{file.type}}-{{file.size}}</span>
					</div>
					<el-button class="save" type="primary" size="small" @click="saveImage(file)">保存</el-button>
				</li>
			</ul>
		</div>

		<el-alert
			title="如何找到壁纸存放路径？"
			:closable="false"
			description="Windows 10 的聚焦壁纸一般存放在用户目录 \Packages\Microsoft.Windows.ContentDeliveryManager_***\LocalState\Assets 目录下，其中 * 部分的文本为随机字符串。">
		</el-alert>

	</div>
</template>

<script>

	import path from 'path'
	import main from '../../lib/main'

	export default {

		name: 'Main',

		data() {
			return {
				srcPath: 'C:\\Users\\XuYuningPC\\AppData\\Local\\Packages\\Microsoft.Windows.ContentDeliveryManager_cw5n1h2txyewy\\LocalState\\Assets',
				distPath: null,
				srcFiles: null,
			};
		},

		computed: {

			imageFiles: function () {
				if (!this.srcFiles) return;

				let files = [];

				this.srcFiles.map(file => {

					let image = main.getImageInfo(path.join(this.srcPath, file));

					if (image.size >= 1) {
						image.name = file;
						image.savePath = this.distPath + '/' + file + '.' + image.type;
						files.push(image);
					}

				});

				return files;
			},

		},

		methods: {

			getPath(dist) {
				let dialog = this.$electron.remote.dialog;

				dialog.showOpenDialog({
					defaultPath: null,
					properties: ['openDirectory'],
				}, dirs => {
					if (!dirs) return;
					this[dist] = dirs[0];
				});

			},

			getImages() {

				main.getImages(this.srcPath, files => {
					this.srcFiles = files;
				}, error => {
					console.error(error);
				});

			},

			saveImage(file) {
				if (!this.distPath) {
					this.$electron.remote.dialog.showErrorBox('出错了', '请选择存放的位置');
					console.error('出错了', '请选择存放的位置');
					return;
				}
				main.saveImage(file.srcPath, file.savePath);
			},

		}

	}
</script>

<style lang="less" scoped>
	@import '../assets/less/mixins/mixins';
	@import '../assets/less/mixins/const';

	.checker {
		margin: @voidLarge auto;
		padding: @voidLarge;
		position: relative;
		max-width: 480px;

		.row {
			padding: @void;
			position: relative;
		}

	}

	.gallery {

		li {
			background-color: #444;
			border: 1px #222 solid;
			display: inline-block;
			height: 128px;
			padding: @void;
			position: relative;
			width: 128px;
			vertical-align: top;

			img {
				height: auto;
				overflow: hidden;
				position: relative;
				width: 100%;
				z-index: 1;
			}

			.name {
				background-color: rgba(0, 0, 0, .8);
				color: white;
				font-size: 12px;
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0;
				z-index: 3;

				span {
					display: block;
					padding: @voidSmall @void;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

			}

			.save {
				position: absolute;
				right: @void;
				top: @void;
				z-index: 3;
			}

		}

	}

</style>