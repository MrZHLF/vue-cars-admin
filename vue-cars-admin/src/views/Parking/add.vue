<template>
  <div class="parking-add">
    <VueForm ref="vueForm" :formData="form_data" :formItem="form_item" :formHandler="form_handler">
      <template v-slot:city>
        <CityArea ref="cityArea" :mapLocation="true" :cityAreaValue.sync="form_data.area" @callback="callbackComponent" />
      </template>
      <template v-slot:amap>
        <div class="address-map">
          <AMap ref="amap" :options="option_map" @callback="callbackComponent"/>
        </div>
      </template>
    </VueForm>
  </div>
</template>

<script>
import AMap from '../amap/index'
import CityArea from './../../components/common/cityArea/index'
import {ParkingAdd,ParkingDetailed,ParkingEdit} from '@/api/parking'
import VueForm from './../../components/form/index'
export default {
  name: 'parkingAdd',
  components:{
    AMap,
    CityArea,
    VueForm
  },
  data() {
    let validatePass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('停车场不能为空'));
      } else {
        callback()
      }
    }
    let validateNumber = (rule, value, callback) => {
        const regNumber = /^[0-9]*$/;
        if(!value) {
            callback(new Error('请输入可停放车辆'));
        }else if(!regNumber.test(value)){
            callback(new Error('请输入数字'));
        }else{
            callback();
        }
    }
    return {
      // 表单数据
      form_data:{
        parkingName:"",
        area:"",
        address:"",
        type:"",
        carsNumber:"",
        status:"",
        amap:"",
        lnglat:""
      },
      // 表单
      form_item:[
        { 
          type:'Input', 
          label:"停车场名称",
          placeholder:"请输入停车场名称",
          prop:"parkingName",
          // required:true, //是否必填
          // requiers_msg:"请输入停车场名称", //提示信息
          validator:[{validator:validatePass,trigger:'blur'}] //自定义规则
        },
        {
          type:'Slot', 
          slotName:"city", 
          label:"区域",
          prop:"area",
          value:[]
        },
        {
          type:'Input', 
          label:"详细地址",
          placeholder:"请输入详细地址",
          prop:"address",
          required:true,
        }, 
        { 
          type:'Radio', 
          label:"类型",
          prop:"type",
          options:this.$store.state.config.parking_type,
           required:true,
        },
        {
          type:'Input', 
          label:"可停放车辆",
          placeholder:"请输入可停放车辆",
          prop:"carsNumber",
          validator: [{ validator: validateNumber, trigger: 'change' }] //自定义规则
        }, 
        { 
          type:'Radio', 
          label:"禁启用",
          prop:"status",
          options:this.$store.state.config.radio_disabled,
        },
        {type:'Slot', slotName:"amap", label:"位置"},
        {
          type:'Input', 
          label:"经纬度",
          placeholder:"请输入经纬度",
          prop:"lnglat",
          disabled:true
        }, 
      ],
      form_handler:[
        {label:"确定",key:"submit",type:"primary", handler: ()=> this.formValidate()},
        {label:"重置",key:"reset",type:"danger", handler: ()=> this.formValidate()}
      ],
      id:this.$route.query.id,
      option_map:{
        mapLoad:true,
      },
      button_loading: false,
      status:this.$store.state.config.radio_disabled,
      type:this.$store.state.config.parking_type,
    }
  },
  methods: {
    formValidate(){
      // 提交表单
      this.$refs.vueForm.$refs.form.validate((valid) => {
        if (valid) {
          console.log(this.form_data);
         this.id ?  this.editParking() :  this.addParKing()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 获取详情
    getDetaile(){
      if(!this.id) { return false}
      ParkingDetailed({
        id:this.id
      }).then(res =>{
        const data = res.data
        for (let key in data) {
          if (Object.keys(this.form_data).includes(key)) {
            this.form_data[key] = data[key]
          }
        }
        // 设置覆盖物
        const splitLnglat = data.lnglat.split(',')
        const lnglat = {
            lng: splitLnglat[0],
            lat: splitLnglat[1]
        }
        this.$refs.amap.setMarker(lnglat)
        // 初始化省市区
        this.$refs.cityArea.initDefault(data.region);
      })
    },
    mapLoad(){
      // 地图加载完成
      this.getDetaile()
    },
    getLnglat(data){
      this.form.lnglat = data.lnglat.value
    },
    callbackComponent(params) {
      if(params.function){
        this[params.function](params.data)
      }
    },
    setMapCenter(data) {
      this.$refs.amap.setMapCenter(data.address)
    },
    addParKing() {
      // 添加
      this.button_loading = true
      ParkingAdd(this.form_data).then(res=>{
        this.$message({
          type:"primary",
          message: res.message
        })
        this.button_loading = false
        this.reset("form")
        this.$router.push({
          name:"ParkingIndex"
        })
      }).catch(error=>{
        this.button_loading = false
      })
    },
    editParking(){
      // 修改
      let requestData = JSON.parse(JSON.stringify(this.form_data))
      requestData.id = this.id
      this.button_loading = true
      ParkingEdit(requestData).then(res=>{
        this.$message({
          type:"primary",
          message: res.message
        })
        this.button_loading = false
        this.$router.push({
          name:"ParkingIndex"
        })
      }).catch(error=>{
        this.button_loading = false
      })
    },
    reset(formName) {
      this.$refs[formName].resetFields();
      this.$refs.cityArea.clear()
      this.$refs.amap.clearMarker()
    }
  },
}
</script>

<style lang="scss" scoped>
.address-map {
	width:100%;
	height: 500px;
}
</style>
