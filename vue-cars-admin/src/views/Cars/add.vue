<template>
  <div class="parking-add">
    <VueForm ref="vueForm" :formData="form_data" :formItem="form_item" :formHandler="form_handler">
      <template v-slot:maintain>
          <el-row :gutter="30">
            <el-col :span="6">
              <el-date-picker v-model="form_data.maintainDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" style="width: 100%;"></el-date-picker>
            </el-col>
            <el-col :span="6">下次保养日期：2020-12-12</el-col>
          </el-row>
      </template>
      <template v-slot:energy>
          <el-radio-group v-model="form_data.energyType" @change="changeEnergyType">
            <el-radio v-for="item in energyType" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
          <div class="progress-bar-wrap" v-if="form_data.energyType == 3 || form_data.energyType == 1">
            <span class="label-text">电量：</span>
            <el-row>
              <el-col :span="10">
                <el-slider v-model="form_data.electric" show-input></el-slider>
              </el-col>
            </el-row>
          </div>
          <div class="progress-bar-wrap" v-if="form_data.energyType == 3 || form_data.energyType == 2">
            <span class="label-text">油量：</span>
            <el-row>
              <el-col :span="10">
                <el-slider v-model="form_data.oil" show-input></el-slider>
              </el-col>
            </el-row>
          </div>
      </template>
      <template v-slot:carsAttr>
        <!-- <CarsAttr ref="carsAttr" :oil="form_data.oil" :initValue="form_data.carsAttr" :countKm.sync="form_data.countKm" :value.sync="form_data.carsAttr" /> -->
        <el-button type="primary" @click="addCarsAttr">添加汽车</el-button>
        <div class="cars-attr-list" v-for="(item,index) in cars_attr" :key="index">
          <el-row :gutter="3">
            <el-col :span="2"><el-input v-model="item.attr_key"></el-input></el-col>
            <el-col :span="3"><el-input v-model="item.attr_value"></el-input></el-col>
            <el-col :span="6">
              <el-button @click="delCarsAttr(index)">删除</el-button>
            </el-col>
          </el-row>
        </div>
      </template>
      <template v-slot:content>
         <div ref="editorDom" style="text-align:left;"></div>
      </template>
    </VueForm>
  </div>
</template>
<script>
import VueForm from './../../components/form/index'
import CarsAttr from "./component/carsAttr";
import { GetCarsBrand, GetParking } from "@/api/common";
import { CarsAdd } from "@/api/cars";
import Editor from "wangeditor";
export default {
  name: 'parkingAdd',
  components:{
    VueForm,
    CarsAttr,
    Editor
  },
  data() {
    return {
      id: this.$route.query.id,
      // 富文本对象
      editor: '00',
      // 能源类型
      energyType: this.$store.state.config.energyType,
      cars_attr: [],
      // 表单配置项
      form_item: [
        { 
          type: "Select", 
          label: "车辆品牌", 
          placeholder: "请选择车辆品牌",
          prop: "carsBrandId",
          select_vlaue: "id",   // 自有的私有属性
          select_label: "nameCh",
          options: [],
          required: true
        },
        { 
          type: "Select", 
          label: "停车场", 
          placeholder: "请选择停车场",
          select_vlaue: "id",   // 自有的私有属性
          select_label: "parkingName",
          prop: "parkingId",
          options: [],
          required: true
        },
        { 
          type: "Input", 
          label: "车辆型号", 
          placeholder: "请输入车辆型号",
          prop: "carsMode",
          required: true
        },
        { 
          type: "Input", 
          label: "车牌号", 
          placeholder: "请输入车牌号",
          prop: "carsNumber",
          required: true
        },
        { 
          type: "Input", 
          label: "车架号", 
          placeholder: "请输入车架号",
          prop: "carsFrameNumber",
          required: true
        },
        { 
          type: "Upload", 
          label: "缩略图", 
          placeholder: "请上传缩略图",
          prop: "carsImg",
          required: true
        },
        { 
          type: "Input", 
          label: "发动机号", 
          placeholder: "请输入发动机号",
          prop: "engineNumber",
          required: true
        },
        { 
          type: "Radio", 
          label: "年检", 
          placeholder: "请选择年检",
          prop: "yearCheck",
          options: this.$store.state.config.year_check
        },
        { 
          type: "Slot", 
          slotName: "maintain", 
          prop:"maintainDate", 
          label: "保养日期"
        },
        { 
          type: "Radio", 
          label: "档位", 
          placeholder: "请选择档位",
          prop: "gear",
          options: this.$store.state.config.gear
        },
        { 
          type: "Slot", 
          slotName: "energy", 
          prop:"energyType", 
          label: "能源类型"
        },
        { 
          type: "Input", 
          label: "可行驶公里", 
          prop: "countKm"
        },
        { 
          type: "Slot", 
          slotName: "carsAttr", 
          prop:"carsAttr", 
          label: "车辆属性"
        },
        { 
          type: "Slot", 
          slotName: "content",
          label: "车辆描述"
        },
        { 
          type: "Slot", 
          slotName: "leaseList",
          prop:"lease", 
          label: "租赁价格"
        },
        { 
          type: "Disabled", 
          label: "禁启用", 
          placeholder: "请选择禁启用",
          prop: "status"
        }
      ],
      form_handler:[
        {label:"确定",key:"submit",type:"primary", handler: ()=> this.formValidate()},
        {label:"重置",key:"reset",type:"danger", handler: ()=> this.formValidate()}
      ],
      form_data: {
        parkingId: "",
        carsBrandId:"",
        carsMode: "",
        carsNumber: "",
        carsFrameNumber: "",
        engineNumber: "",
        carsImg: "",
        countKm: "",
        yearCheck: true,
        gear: 1,
        energyType: 2,
        electric: 100,
        oil: 100,
        carsAttr: "",
        content: "",
        maintainDate: "",
        status: true,
      },
      // 车辆租赁类型
      leaseListData: [],
      // 车辆品牌列表
      carsBrandList: [],
    }
  },
  beforeMount(){
    this.getCarsBrandList();
    this.getParkingList()
  },
  mounted() {
    this.createEditor()
  },
  methods: {
    formValidate() {
      this.formatCarsAttr()
      this.$refs.vueForm.$refs.form.validate((valid) => {
        if (valid) {
            this.id ? this.edit() : this.add();
        } else {
            console.log('error submit!!');
            return false;
        }
      });
      
      console.log(this.form_data ,'submit!')
    },
    add(){
      CarsAdd(this.form_data).then(response => {
        console.log(response);
        this.$message({
          message: response.message,
          type: "success"
        })
      })
    },
    edit() {

    },
    addCarsAttr() {
      this.cars_attr.push({
        attr_key:"",attr_value:""
      })
    },
    delCarsAttr(index) {
      this.cars_attr.splice(index,1)
    },
    // 创建富文本
    createEditor(){
      this.editor = new Editor(this.$refs.editorDom);
        this.editor.customConfig.onchange = html => {
          this.form_data.content = html;
        };
        this.editor.create(); // 创建富文本实例
    },
    // 获取停车场
    getParkingList(){
      GetParking().then(response => {
        const data = response.data.data;
        if(data) {
          const parking = this.form_item.filter(item => item.prop == "parkingId");
          if(parking.length > 0) {
            parking[0].options = data;
          }
        }
      })
    },
    // 车辆品牌
    getCarsBrandList() {
      GetCarsBrand().then(response => {
        const data = response.data.data;
        if (data) {
          const carsBrand = this.form_item.filter(item => item.prop == "carsBrandId");
          if(carsBrand.length > 0) {
            carsBrand[0].options = data;
          }
        }
      })
    },
    changeEnergyType(value){
      this.form_data.oil = 0;
      this.form_data.electric = 0;
    },
    /** 车辆属性格式化 */
  formatCarsAttr(){
    const data = this.cars_attr
    if(data && data.length == 0) {return false}
    let carsAttr={}
    data.forEach((item) => {
      if(item.attr_key) {
        carsAttr[item.attr_key] =  item.attr_value
      }
    });
    this.form_data.carsAttr = JSON.stringify(carsAttr)
  }
  },
  
}
</script>

<style lang="scss" >
@import './style';
.address-map {
	width:100%;
	height: 350px;
	border: 1px solid #ccc;
}
</style>
