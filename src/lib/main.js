import fs from 'fs'
import fse from 'fs-extra'
import os from 'os'
import path from 'path'
import imageSize from 'image-size'
import storge from 'storge-js'

const PATH_SRC = 'path_src';
const PATH_DIST = 'path_dist';
const PATH_TEMP = path.join(os.tmpdir(), 'wtw');
const THEME_DARK_MODE = 'theme_dark_mode';

export default {

	/**
	 * 清空本地存储数据
	 * @description 重置应用时会清空本地存储的数据
	 */
	clearData: function () {
		storge.clear();
	},

	/**
	 * 获取源地址
	 * @return {String|null}
	 */
	getSrcPath: function () {
		return storge.get(PATH_SRC);
	},

	/**
	 * 设置源地址
	 * @param {String} path
	 */
	setSrcPath: function (path) {
		if (!path || path === '') return;
		return storge.set(PATH_SRC, path);
	},

	/**
	 * 获取存放地址
	 * @return {String|null}
	 */
	getDistPath: function () {
		return storge.get(PATH_DIST);
	},

	/**
	 * 设置存放地址
	 * @param {String} path
	 */
	setDistPath: function (path) {
		if (!path || path === '') return;
		return storge.set(PATH_DIST, path);
	},

	/**
	 * 读取指定目录下的图片文件
	 * @param {String} path
	 * @param {Function} success
	 * @param {Function} error
	 */
	getImages: function (path, success, error) {
		if (!path) return;

		// 是否存在路径
		if (!fse.pathExists(path)) {
			if (error && error instanceof Function) {
				error('指定的路径不存在，请检查！');
			}
			return;
		}

		fse.readdir(path, (err, files) => {

			if (err || !files || files.length <= 0) {
				if (error && error instanceof Function) {
					error(err);
				}
				return;
			}

			if (success && success instanceof Function) {
				success(files);
			}
		});

	},

	/**
	 * 保存图片到指定路径中
	 * @param {String} filePath
	 * @param {String} savePath
	 */
	saveImage: function (filePath, savePath) {
		fse.copy(filePath, savePath);
	},

	/**
	 * 获取图片文件信息
	 * @param imagePath
	 * @return {{}}
	 */
	getImageInfo: function (imagePath) {
		let image = {};

		let stat = fs.statSync(imagePath),
			dimension = imageSize(imagePath);

		image.dimension = dimension;
		image.width = dimension['width'] || 0;
		image.height = dimension['height'] || 0;
		image.type = dimension['type'] || null;
		image.size = stat['size'];
		image.srcPath = imagePath;

		return image;
	},

	/**
	 * 主题设置
	 * @param darkMode
	 * @return {*}
	 */
	toggleThemeMode: function (darkMode) {
		return storge.set(THEME_DARK_MODE, darkMode);
	},

	/**
	 * 是否为暗色模式主题
	 * @return {Boolean}
	 */
	isDarkMode: function () {
		return storge.get(THEME_DARK_MODE, false);
	},

	/**
	 * 添加到收藏
	 * @param {Object} file
	 */
	addToCollection: function (file) {
		this.saveImage(file.srcPath, path.join(PATH_TEMP, file.name + '.' + file.type));
	},

	/**
	 * 删除单个文件
	 * @param file
	 */
	removeFromCollection: function (file) {
		return fse.remove(file);
	},

	/**
	 * 删除收藏的文件
	 * @param files
	 * @param callback
	 * @return {Promise<[]>}
	 */
	removeCollections: function (files, callback) {
		let removed = [];

		files.forEach(file => {
			removed.push(callback(file));
		});

		return Promise.all(removed);
	},

	/**
	 * 清空收藏的文件
	 */
	clearCollections: function () {
		fse.empty(PATH_TEMP);
	},

	/**
	 * 获取收藏
	 * @param {Function} success
	 */
	getCollections: function (success) {
		fs.readdir(PATH_TEMP, (err, files) => {
			if (err) throw err;

			success(files.map(file => {
				return path.join(PATH_TEMP, file);
			}));

		});
	}

};
