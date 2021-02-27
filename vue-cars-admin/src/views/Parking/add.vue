<template>
  <div class="parking-add">
    <el-form ref="form" :rules="rules" :model="form" label-width="120px">
      <el-form-item label="停车场名称" prop="parkingName">
        <el-input v-model="form.parkingName"></el-input>
      </el-form-item>
      <el-form-item label="区域" prop="area">
        <CityArea ref="cityArea" :mapLocation="true" :cityAreaValue.sync="form.area" @callback="callbackComponent" />
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input v-model="form.address"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio v-for="(item,index) in type" :label="item.value"  :key="index">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="可停放车辆" prop="carsNumber">
        <el-input v-model.number="form.carsNumber"></el-input>
      </el-form-item>
      <el-form-item label="禁启用" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio v-for="(item,index) in status" :label="item.value" :key="index">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="位置">
        <div class="address-map">
          <AMap ref="amap" :options="option_map" @callback="callbackComponent"/>
        </div>
      </el-form-item>
      <el-form-item label="经纬度" prop="lnglat">
        <el-input v-model="form.lnglat"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')" :loading="button_loading">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import AMap from '../amap/index'
import CityArea from './../../components/common/cityArea/index'
import {ParkingAdd,ParkingDetailed} from '@/api/parking'
export default {
  name: 'parkingAdd',
  components:{
    AMap,
    CityArea
  },
  data() {
    return {
      id:this.$route.query.id,
      option_map:{
        mapLoad:true,
      },
      button_loading: false,
      status:this.$store.state.config.parking_status,
      type:this.$store.state.config.parking_type,
      form: {
        area:"",
        parkingName: '',
        address:"",
        type: "",
        status:"",
        lnglat:"",
        carsNumber:"",
      },
      rules:{
        address:[
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
        parkingName:[
          { required: true, message: '请输入车辆名称', trigger: 'blur' },
        ],
        area:[
          { required: true, message: '请选择省市区', trigger: 'blur' },
        ],
        lnglat:[
          { required: true, message: '经纬度不能为空', trigger: 'blur' },
        ],
        carsNumber:[
          { required: true, message: '数量不能为空', trigger: 'blur' },
          {type:"number",message:"请输入数字"}
        ]
      }
    }
  },
  beforeMount() {
    // this.getDetaile()
  },
  methods: {
    // 获取详情
    getDetaile(){
      if(!this.id) { return false}
      ParkingDetailed({
        id:this.id
      }).then(res =>{
        console.log(res,'d')
        const data = res.data
        for (let key in data) {
          if (Object.keys(this.form).includes(key)) {
            this.form[key] = data[key]
          }
        }
        // 设置覆盖物
        const splitLnglat = data.lnglat.split(',')
        const lnglat = {
            lng: splitLnglat[0],
            lat: splitLnglat[1]
        }
        this.$refs.amap.setMarker(lnglat)
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
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.form);
          this.addParKing()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    addParKing() {
      this.button_loading = true
      ParkingAdd(this.form).then(res=>{
        this.$message({
          type:"primary",
          message: res.message
        })
        this.button_loading = false
        this.reset("form")
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
