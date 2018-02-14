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

			<p class="tips">Windows 10 的聚焦壁纸一般存放在用户目录 \Packages\Microsoft.Windows.ContentDeliveryManager_***\LocalState\Assets
				目录下，其中 * 部分的文本为随机字符串。</p>

		</div>

		<h4 class="empty" v-if="filesEmpty">暂无资源</h4>

		<div v-if="imageFiles && imageFiles.length > 0" class="gallery-wrap">

			<div class="head">

				<el-button-group v-if="!filesEmpty">
					<el-button size="mini" @click="changeAll">全选</el-button>
					<el-button size="mini" @click="changeReverse">反选</el-button>
					<template v-if="hasChange">
						<el-button size="mini" @click="saveChanges">保存所选</el-button>
						<el-button size="mini" @click="checkedFiles = []">取消选择</el-button>
					</template>
				</el-button-group>

			</div>

			<div class="body">

				<div class="gallery">

					<el-checkbox-group v-model.sync="checkedFiles" @change="handleCheckedChange">
						<ul class="results">
							<li v-for="(file, key) in imageFiles" :key="key">

								<div class="item">

									<div class="inner">
										<img :src="'file:///'+ file.srcPath.replace(/\\/g,'/')" alt=""/>
									</div>

									<el-checkbox class="checker-handler" :label="key">&nbsp;</el-checkbox>

									<el-button type="text" class="save" size="mini" @click="saveImage([key])" title="保存">保存</el-button>

								</div>

							</li>
						</ul>
					</el-checkbox-group>

				</div>

			</div>

		</div>

	</div>
</template>

<script>

	import path from 'path'
	import fse from 'fs-extra'
	import main from '../../lib/main'

	export default {

		name: 'Main',

		data() {
			return {
				srcPath: null,
				distPath: null,
				srcFiles: null,
				filesEmpty: false,
				imageFiles: [],
				checkedFiles: [],
			};
		},

		computed: {

			hasChange: function () {
				return this.checkedFiles && this.checkedFiles.length >= 1;
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

			handleCheckedChange(value) {
				this.checkedFiles = value;
			},

			changeAll() {
				this.checkedFiles = this.imageFiles.map((file, i) => i);
			},

			changeReverse() {
				let checked = new Set(this.checkedFiles),
					allFiles = new Set(this.imageFiles.map((file, i) => i));

				// 完全反选
				if (checked.size === 0) {
					this.checkedFiles = Array.from(allFiles);
					return;
				}
				;

				// 差集筛选
				this.checkedFiles = Array.from(new Set([...allFiles].filter(x => !checked.has(x))));

			},

			itemChangeToggle(checked, e) {
				let index = this.checkedFiles.findIndex(file => file === e.path[0].value);
				if (checked) {
					if (index !== -1) {
						this.checkedFiles.push(e.path[0].value);
					}
				} else {
					this.checkedFiles.splice(index);
				}
			},

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
					let tempFiles = this.imageFilesParse(files);

					// 默认使用全部图片
					this.imageFiles = tempFiles;

					// 仅 PC 壁纸
					if (filter === 'pc') {
						this.imageFiles = [];
						tempFiles.forEach(file => {
							if (file.width >= 1920 && file.width > file.height) {
								this.imageFiles.push(file);
							}
						});
					}

					// 仅手机壁纸
					if (filter === 'mobile') {
						this.imageFiles = [];
						tempFiles.forEach(file => {
							if (file.width >= 1920 && file.width < file.height) {
								this.imageFiles.push(file);
							}
						});
					}

					if (!this.imageFiles || this.imageFiles.length === 0) {
						this.filesEmpty = true;
					}

				}, error => {
					console.error(error);
				});

			},

			imageFilesParse(useFiles) {
				if (!useFiles) return;

				let files = [];

				useFiles.map(file => {

					let image = main.getImageInfo(path.join(this.srcPath, file));

					if (image.size >= 1) {
						image.name = file;
						image.checked = false;
						image.savePath = this.distPath + '/' + file + '.' + image.type;
						files.push(image);
					}

				});

				return files;
			},

			saveImage(index) {

				if (!this.distPath) {
					this.$message.error('出错了，请选择存放的位置');
					return;
				}

				// 获取全部文件
				let saveFiles = [];

				this.imageFiles.forEach((file, i) => {
					if (index.find(checked => checked === i)) {
						saveFiles.push(file);
					}
				});

				saveFiles.forEach(file => {
					if (fse.pathExistsSync(file.savePath)) {

						this.$confirm('文件已存在，是否替换该文件？', null, {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							main.saveImage(file.srcPath, file.savePath);
							this.$message.success('保存成功');
						});

						return;
					}

					main.saveImage(file.srcPath, file.savePath);
					this.$message.success('保存成功');
				});

			},

			saveChanges() {
				if (!this.hasChange) {
					this.$message.warning('请选择需要保存的文件');
					return;
				}

				this.saveImage(this.checkedFiles);
			},

			reset() {
				this.filesEmpty = false;
				this.srcFiles = null;
				this.imageFiles = null;
				this.checkedFiles = [];
			}

		},

		mounted() {
			this.srcPath = main.getSrcPath();
			this.distPath = main.getDistPath();
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

	.gallery-wrap {
		max-width: 960px;
		margin: 0 auto;
		min-width: 480px;
		padding: @voidLarge;

		& > .head, & > .body, & > .foot {
			padding: @void;
		}

		.gallery li {
			display: inline-block;
			width: 20%;
			vertical-align: top;

			.item {
				background-color: rgba(0, 0, 0, .5);
				height: 0;
				margin: @voidSmall;
				overflow: hidden;
				padding-bottom: 56%;
				position: relative;

				.inner {
					font-size: 0;
					height: 100%;
					line-height: 560%;
					position: absolute;
					overflow: hidden;
					text-align: center;
					width: 100%;
					vertical-align: middle;
					z-index: 1;

					img {
						max-height: 100%;
						vertical-align: middle;
						transition: all .6s ease;
					}
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

				.checker-handler:not(.is-checked) {
					opacity: 0;
					transition: all .6s ease;
					transform: scale(.5);
				}

				.save {
					position: absolute;
					right: @void;
					top: @void;
					z-index: 3;
				}

				&:hover {

					img {
						transform: scale(1.2);
					}

					.checker-handler {
						opacity: 1;
						transform: scale(1);
					}

				}

			}

		}

	}

</style>
