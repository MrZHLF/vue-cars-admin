<template>
  <div class="cars-dialog-center">
    <!-- 弹框 -->
    <el-dialog
      title="新增车辆品牌"
      :visible.sync="dialogVisible"
      class="cars-dialog-center"
			:close-on-click-modal="false"
			@close="close"
    >
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="车辆品牌">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="品牌型号">
          <el-cascader
            v-model="form.area"
            :options="options"
            :props="{ expandTrigger: 'hover' }"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="LOGO">
          <div class="upload-img-wrap">
            <div class="upload-img">
              <img
                src="https://ss0.baidu.com/7Po3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/9c16fdfaaf51f3de9ba8ee1194eef01f3a2979a8.jpg"
                alt=""
              />
            </div>
            <ul class="img-list">
              <li>
                <img
                  src="https://ss0.baidu.com/7Po3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/9c16fdfaaf51f3de9ba8ee1194eef01f3a2979a8.jpg"
                  alt=""
                />
              </li>
              <li>
                <img
                  src="https://ss0.baidu.com/7Po3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/9c16fdfaaf51f3de9ba8ee1194eef01f3a2979a8.jpg"
                  alt=""
                />
              </li>
              <li>
                <img
                  src="https://ss0.baidu.com/7Po3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/9c16fdfaaf51f3de9ba8ee1194eef01f3a2979a8.jpg"
                  alt=""
                />
              </li>
              <li>
                <img
                  src="https://ss0.baidu.com/7Po3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/9c16fdfaaf51f3de9ba8ee1194eef01f3a2979a8.jpg"
                  alt=""
                />
              </li>
            </ul>
          </div>
        </el-form-item>
        <el-form-item label="禁启用">
          <el-radio-group v-model="form.disabled">
            <el-radio label="禁用"></el-radio>
            <el-radio label="启用"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">立即创建</el-button>
        </el-form-item>
      </el-form>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="flagVisible = false">取 消</el-button>
        <el-button type="primary" @click="flagVisible = false">确 定</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'addCarsBrand',
  props: {
    flagVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
			dialogVisible:false,
      form: {
        name: '',
        area: '',
        disabled: 0,
        type: '',
      },

      options: [
        {
          value: 'zhinan',
          label: '河南省',
          children: [{ value: '222', label: '郑州市' }],
        },
      ],
    }
	},
	methods: {
		close(){
			this.$emit('update:flagVisible',false)
		}
	},
	watch:{
		flagVisible: {
			handler(newValue,oldValue) {
				this.dialogVisible = newValue
			}
 		}
	}
}
</script>

<style lang="scss" scoped></style>
