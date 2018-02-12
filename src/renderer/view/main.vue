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
				<el-button @click="getImages('pc')">电脑</el-button>
				<el-button @click="getImages('mobile')">手机</el-button>
				<el-button type="danger" @click="reset">清空</el-button>
			</div>

			<p class="tips">Windows 10 的聚焦壁纸一般存放在用户目录 \Packages\Microsoft.Windows.ContentDeliveryManager_***\LocalState\Assets 目录下，其中 * 部分的文本为随机字符串。</p>

		</div>

		<h4 class="empty" v-if="filesEmpty">暂无资源</h4>

		<div class="gallery" v-if="srcFiles">
			<ul class="results">
				<li v-for="(file, key) in imageFiles" :key="key">
					<img :src="'file:///'+ file.srcPath.replace(/\\/g,'/')" alt="" style="width: 200px;"/>
					<div class="name">
						<span>{{file.type}}-{{file.size}}</span>
					</div>
					<el-checkbox class="checker-handler"></el-checkbox>
					<el-button class="save" icon="el-icon-download" size="mini" @click="saveImage(file)" title="保存"></el-button>
				</li>
			</ul>
		</div>

	</div>
</template>

<script>

	import path from 'path'
	import main from '../../lib/main'

	export default {

		name: 'Main',

		data() {
			return {
				srcPath: null,
				distPath: null,
				srcFiles: null,
				filesEmpty: false,
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

		watch: {

			srcPath: function (path) {
				main.setSrcPath(path);
			},

			distPath: function (path) {
				main.setDistPath(path);
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

			getImages(filter) {

				this.reset();

				main.getImages(this.srcPath, files => {
					let tempFiles = files;

					// 仅 PC 壁纸
					if (filter === 'pc') {
						this.srcFiles = tempFiles.find(file => Math.ceil(file.size / 1024) >= 600 && file.width > file.height);
						if(!this.srcFiles){
							this.filesEmpty = true;
						}
						return;
					}

					// 仅手机壁纸
					if (filter === 'mobile') {
						this.srcFiles = tempFiles.find(file => Math.ceil(file.size / 1024) >= 600 && file.width < file.height);
						if(!this.srcFiles){
							this.filesEmpty = true;
						}
						return;
					}

					this.srcFiles = tempFiles
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

			reset(){
				this.filesEmpty = false;
				this.srcFiles = null;
			}

		},

		mounted() {
			// 读取缓存
			this.srcPath = main.getSrcPath();
			this.distPath = main.getDistPath();

			// 'C:\\Users\\XuYuningPC\\AppData\\Local\\Packages\\Microsoft.Windows.ContentDeliveryManager_cw5n1h2txyewy\\LocalState\\Assets'

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

	.tips {
		font-size: 12px;
		margin: @void;
	}

	.empty {
		color: #ddd;
		font-size: 24px;
		font-weight: normal;
		line-height: 32px;
		padding: @voidLarge;
		text-align: center;
	}

	.gallery {
		max-width: 960px;
		margin: 0 auto;
		min-width: 480px;
		padding: @voidLarge;

		li {
			background-color: #444;
			border: 1px #222 solid;
			display: inline-block;
			height: 128px;
			line-height: 100%;
			padding: @void;
			position: relative;
			width: 128px;
			vertical-align: top;

			img {
				height: auto;
				overflow: hidden;
				position: relative;
				width: 100%;
				vertical-align: bottom;
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

			.checker-handler {
				position: absolute;
				left: @void;
				top: @void;
				z-index: 3;
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