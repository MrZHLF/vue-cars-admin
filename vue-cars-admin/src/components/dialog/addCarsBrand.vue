<template>
  <div class="cars-dialog-center">
    <!-- 弹框 -->
    <el-dialog
      title="新增车辆品牌"
      :visible.sync="dialogVisible"
      class="cars-dialog-center"
			:close-on-click-modal="false"
			@close="close"
      @opened="opened"
    >
    <VueForm :formData="form_data" :formItem="form_item" :formHandler="form_handler">
      <template v-slot:logo>
        <div class="upload-img-wrap">
            <div class="upload-img">
              <img :src="logo_current" v-show="logo_current"/>
            </div>
            <ul class="img-list">
              <li v-for="item in logo" :key="item.id" @click="logo_current = item.img"> 
                <img :src="item.img"/>
              </li>
            </ul>
          </div>
      </template>
    </VueForm>
    </el-dialog>
  </div>
</template>

<script>
import { BrandLogo,BrandAdd,BrandDetailed,BrandEdit } from '@/api/brand'
import VueForm from '@c/form'
export default {
  name: 'addCarsBrand',
  props: {
    flagVisible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      defult: () => {}
    }
  },
  components:{
    VueForm
  },
  data() {
    return {
			dialogVisible:false,
      // 表单数据
      form_data:{
        nameCh: '',
        nameEn: '',
        imgUrl: 0,
        status: '',
        content: ""
      },
      // 表单项
      form_item:[
        {
          type:'Input', 
          label:"品牌中文",
          placeholder:"请输入品牌中文",
          prop:"nameCh",
        },
        {
          type:'Input', 
          label:"品牌英文",
          placeholder:"请输入品牌英文",
          prop:"nameEn",
        },
        {type:'Slot',label:"Logo",slotName:"logo"},
        {
          type:'Radio', 
          label:"禁启用",
          prop:"status",
          options:this.$store.state.config.radio_disabled
        }
      ],
      form_handler:[
        {label:"确定",key:"submit",type:"primary", handler: ()=> this.submit()},
      ],
      form: {
        nameCh: '',
        nameEn: '',
        imgUrl: 0,
        status: '',
        content: ""
      },
      radio_disabled:this.$store.state.config.radio_disabled,
      logo_current:"",
      logo:[],
    }
	},
	methods: {
    opened(){
      this.getBrandLogo()
      this.getDetailed()
    },
   /** 获取详情 */
    getDetailed(){
      this.form_data = this.data;
      this.logo_current = this.data.imgUrl;
      this.form_data.imgUrl = this.data.imgUrl;
    },
    /** 获取LOGO */
    getBrandLogo(){
      // 存在数据时，不再请求接口
      if(this.logo.length != 0) { return false; }
      // 没有数据时
      BrandLogo().then(response => {
        const data = response.data;
        if(data) { this.logo = data; }
      })
    },
    submit(){
      this.data.id ? this.edit() : this.add();
    },
    /** 修改 */
    edit(){
      this.form_data.imgUrl = this.logo_current;
      const requestData = JSON.parse(JSON.stringify(this.form_data));
      BrandEdit(requestData).then(response => {
        this.$message({
          type: "success",
          message: response.message
        })
        this.close();
        this.$emit("callbackComponent", {
          function: "search"
        })
      })
    },
   /** 添加 */
    add(){
      this.form_data.imgUrl = this.logo_current;
      BrandAdd(this.form_data).then(response => {
        this.$message({
          type: "success",
          message: response.message
        })
        this.close();
        this.$emit("callbackComponent", {
          function: "search"
        })
      })
    },
    reset(formName) {
      for(let key in this.form_data) {
        this.form_data[key] = "";
      }
      // 清除选中的LOGO
      this.logo_current = "";
    },
		close(){
			this.reset("form");
      // 关闭窗口
      this.dialogVisible = false;
      this.$emit("update:flagVisible", false); // {}
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
