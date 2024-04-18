<template>
  <h-modal title="头像设置" :visible="visible" :confirmLoading="confirmLoading" :width="800" :bodyStyle="{ overflow: 'hidden' }"
    @cancel="cancelHandel">
    <a-spin :spinning="spinning">
      <div style="display: flex;">
        <div style="width: 400px; height: 400px; display:inline-block;">
          <vue-cropper ref="cropper" :img="options.img" :info="false" :autoCrop="options.autoCrop"
            :autoCropWidth="options.autoCropWidth" :autoCropHeight="options.autoCropHeight" :fixedBox="options.fixedBox"
            :canMoveBox="options.canMoveBox" :outputType="options.outputType" mode="300px auto" @realTime="realTime">
          </vue-cropper>
        </div>
        <div class="preview" style="flex: 1;">
          <div>
            <div style="height: 100px; margin-bottom: 10px;">
              <div class="avatar-upload-preview">
                <img :src="previews.url" alt="" :style="previews.img" />
              </div>
            </div>
            <p style="text-align: center;">100px x 100px</p>
          </div>
          <div>
            <div style="height: 80px; margin-bottom: 10px;">
              <div class="avatar-upload-preview" :style="previewStyle2">
                <img :src="previews.url" alt="" :style="previews.img" />
              </div>
            </div>
            <p style="text-align: center;">80px x 80px</p>
          </div>
          <div>
            <div style="height: 50px; margin-bottom: 10px;">
              <div class="avatar-upload-preview" :style="previewStyle3">
                <img :src="previews.url" alt="" :style="previews.img" />
              </div>
            </div>
            <p style="text-align: center;">50px x 50px</p>
          </div>
          <div style="text-align: center;">
            <a-upload name="avatar" action="https://workin.hanweb.com/jim-web/" class="avatar-uploader" :showUploadList="false" :beforeUpload="beforeUpload"
              accept=".jpeg,.jpg,.png,.gif" :headers="{ 'access-token': accessToken }">
              <h-button :icon="IconUpload">重新上传</h-button>
            </a-upload>
          </div>
        </div>
      </div>
    </a-spin>
    <template slot="footer">
      <h-button key="back" @click="cancelHandel">取消</h-button>
      <h-button key="submit" type="primary" :loading="confirmLoading" @click="okHandel">保存</h-button>
    </template>
  </h-modal>
</template>
<script>
import { VueCropper } from 'vue-cropper';
import { HButton, HModal } from 'jpaas-component';
import { accountAPI } from '../api/account/account';
import IconUpload from '@ant-design/icons/svg/outline/upload.svg?inline';

function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  components: {
    HButton,
    HModal,
    VueCropper
  },
  data() {
    return {
      IconUpload,
      accessToken: this.$ls.get('ACCESS_TOKEN'),
      currentFile: '',
      spinning: false, // 加载动画
      visible: false,
      id: null,
      confirmLoading: false,
      loading: false,
      imageUrl: '',
      options: {
        img: 'avator.png',
        size: 1,
        full: false,
        fixedBox: true,
        canMove: true,
        canMoveBox: false,
        autoCrop: true,
        original: false,
        autoCropWidth: 100,
        autoCropHeight: 100,
        outputType: 'png',
        canScale: false,
        imgName: 'avator.png',
      },
      previews: {},
      previewStyle1: {},
      previewStyle2: {},
      previewStyle3: {}
    }
  },
  methods: {
    edit(id, img) {
      this.visible = true
      this.options.img = img
      this.id = id
      /* 获取原始头像 */
    },
    close() {
      this.options.imgName = ''
      this.id = null
      this.visible = false
    },
    cancelHandel() {
      this.close()
    },
    okHandel() {
      const formData = new FormData()
      this.$refs.cropper.getCropBlob(data => {
        formData.append('file', new File([data], this.options.imgName, { type: data.type }))
        this.confirmLoading = true
        this.spinning = true
        accountAPI.modifyHeadPath(formData).then(res => {
          this.spinning = false
          this.confirmLoading = false
          if (res.success) {
            this.$message['success']('上传成功')
            this.visible = false
            this.$emit('uploadSuccess', res.data.headImagePaths)
          }
        })
      })
    },
    // 上传按钮   限制图片大小
    beforeUpload(file) {
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message.error('上传文件大小不能超过 5MB!')
        return false
      }
      this.fileinfo = file
      // getBase64(file, imageUrl => {
      //   this.options.img = imageUrl;
      // })
      let reader = new FileReader();
      let that = this;
      reader.onloadend = function () {
        // 将文件转换成base64字符串
        that.options.img = reader.result;
      }
      reader.readAsDataURL(file);
    },
    // 实时预览
    realTime(data) {
      this.previewStyle2 = {
        transform: `scale(${80 / 100})`
      }
      this.previewStyle3 = {
        transform: `scale(${50 / 100})`
      }
      this.previews = data
    }

  }
}
</script>

<style lang="less" scoped>
* {
  touch-action: pan-y;
  touch-action: none;
}

.avatar-upload-preview {
  overflow: hidden;
  width: 100px;
  height: 100px;
  margin: auto;
  border: 1px solid #ccc;
  border-radius: 50%;
  transform-origin: center top;
}
</style>
