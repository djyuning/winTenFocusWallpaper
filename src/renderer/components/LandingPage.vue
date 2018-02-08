<template>
    <div id="wrapper">
        <main>

            <el-form label-width="80px">

                <el-form-item label="源路径">
                    <el-input v-model="srcPath" @click="getPath('srcPath')"></el-input>
                    <p>C:\Users\CL-20171221-002\AppData\Local\Packages\Microsoft.Windows.ContentDeliveryManager_cw5n1h2txyewy\LocalState\Assets</p>
                </el-form-item>

                <el-form-item label="存放地址">
                    <el-input v-model="distPath"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="getImages">读取资源</el-button>
                    <el-button @click="reset">清空</el-button>
                </el-form-item>

            </el-form>

            <ul class="results" v-if="srcFiles">
                <li v-for="(file, key) in imageFiles" :key="key">
                    <img :src="'file:///'+ file.fullPath.replace(/\\/g,'/')" alt="" style="width: 200px;"/>
                    <span>{{file.type}}-{{file.size}}</span>
                    <button @click="saveImage(file)">保存</button>
                </li>
            </ul>

        </main>
    </div>
</template>

<script>
    import SystemInformation from './LandingPage/SystemInformation'

    import fs from 'fs'
    import fse from 'fs-extra'
    import path from 'path'
    import imageSize from 'image-size'

    export default {

        name: 'landing-page',

        components: {SystemInformation},

        data() {
            return {
                srcPath: 'C:\\Users\\CL-20171221-002\\AppData\\Local\\Packages\\Microsoft.Windows.ContentDeliveryManager_cw5n1h2txyewy\\LocalState\\Assets',
                srcFiles: null,
                distPath: 'G:\\test\\temp',
            };
        },

        computed: {

            imageFiles: function () {
                if (!this.srcFiles) return;

                let files = [];

                this.srcFiles.map(file => {
                    let srcPathFile = path.join(this.srcPath, file),
                        stat = fs.statSync(srcPathFile),
                        size = imageSize(srcPathFile),
                        fileUse = {};

                    fileUse.name = file;
                    fileUse.width = size.width;
                    fileUse.height = size.height;
                    fileUse.type = size.type;
                    fileUse.size = stat.size;
                    fileUse.fullPath = srcPathFile;
                    fileUse.savePath = this.distPath + '/' + file + '.' + size.type;

                    if (stat.size >= 2000) {
                        files.push(fileUse);
                    }

                });

                return files;
            },

        },

        methods: {

            reset(){
                this.srcFiles = null;
            },

            getPath(path) {

                let dialog = this.$electron.remote.dialog;

                dialog.showOpenDialog({
                    defaultPath: null,
                    properties: ['openDirectory'],
                }, dirs => {
                    if (!dirs) return;
                    this[path] = dirs[0];
                });

            },

            getImages() {

                fse.readdir(this.srcPath, (err, files) => {
                    if (err) {
                        return;
                    }
                    this.srcFiles = files;
                });

            },

            saveImage(file) {
                fse.copy(file.fullPath, file.savePath);
            },

        },

    }
</script>

<style scoped>

    ul.results, ul.results li {
        list-style: none;
    }

    ul.results li {
        border: 1px #eee solid;
        display: inline-block;
        height: 128px;
        overflow: hidden;
        padding: 10px;
        position: relative;
        width: 128px;
        vertical-align: top;
    }

    ul.results li img {
        background-color: black;
        max-width: 100%;
        height: 100%;
    }

    ul.results li button {
        position: absolute;
        right: 10px;
        bottom: 10px;
        z-index: 2;
    }

    ul.results li span {
        background-color: rgba(0, 0, 0, .8);
        color: white;
        font-size: 12px;
        left: 10px;
        top: 10px;
        padding: 0 10px;
        position: absolute;
        z-index: 2;
    }

</style>
