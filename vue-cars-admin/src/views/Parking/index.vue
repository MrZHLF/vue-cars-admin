<template>
  <div>
    <div class="filter-form">
      <el-row>
        <el-col :span="21">
          <el-form :inline="true" :model="form" class="demo-form-inline">
            <el-form-item label="区域">
              <CityArea
                ref="cityArea"
                :cityAreaValue.sync="form.lnglat"
                @callback="callbackComponent"
              />
            </el-form-item>
            <el-form-item label="类型">
              <el-select
                placeholder="活动区域"
                v-model="form.type"
                class="width-120"
              >
                <el-option
                  v-for="(item, index) in parking_type"
                  :label="item.label"
                  :value="item.value"
                  :key="index"
                  >{{ item.label }}</el-option
                >
              </el-select>
            </el-form-item>
            <el-form-item label="禁启用">
              <el-select
                placeholder="请选择"
                v-model="form.status"
                class="width-120"
              >
                <el-option
                  v-for="(item, index) in parking_status"
                  :label="item.label"
                  :value="item.value"
                  :key="index"
                  >{{ item.label }}</el-option
                >
              </el-select>
            </el-form-item>

            <el-form-item label="关键字">
              <el-select placeholder="请选择" v-model="search_key" class="width-120">
                <el-option label="停车场名称" value="parkingName"></el-option>
                <el-option label="详细区域" value="address"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="keyword"
                placeholder="请输入关键字按Enter搜索"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="3">
          <div class="pull-right">
            <router-link to="/parkingAdd">
              <el-button type="danger">新增停车场</el-button>
            </router-link>
          </div>
        </el-col>
      </el-row>
      
    </div>
    <tableData ref="table" :config="table_config">
      <!-- 禁启用 -->
      <template v-slot:status="slotData">
        <el-switch
          :disabled="slotData.data.id == switch_disable"
          @change="switchChange(slotData.data)"
           v-model="slotData.data.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
        </el-switch>  
      </template>
      <!-- 查看地图 -->
      <template v-slot:lnglat="slotData">
        <el-button type="success" size="mini" @click="showMap(slotData.data)">查看地图</el-button> 
      </template>
      <!-- 操作 -->
      <template v-slot:operation="slotData">
        <el-button size="mini" @click="edit(slotData.data.id)">编辑</el-button>
        <el-button size="mini" :loading="slotData.data.id == rowId" type="danger" @click="delConfirm(slotData.data.id)">删除</el-button>
      </template>
    </tableData>
    <showMapLoaction :flagVisible.sync="map_show" :data="parking_data"/>
  </div>
</template>

<script>
import {ParkingDelete,ParkingStatus } from '@/api/parking'
import CityArea from './../../components/common/cityArea/index'
import showMapLoaction from './../../components/dialog/showMapLoaction'
import tableData from './../../components/tableData/index'
import { address,parkingType } from './../../utils/common'
export default {
  name: 'Parking',
  components: {
    CityArea,
    showMapLoaction,
    tableData
  },
  data() {
    return {
      // 表格配置
      table_config:{
        thead: [
          {label:"停车场名称",prop:"parkingName"},
          {
            label:"类型",
            prop:"type",
            type:"function",
            callback:(row,prop)=>{
              return parkingType(row[prop])
            }
          },
          {
            label:"区域",
            prop:"address",
            type:"function",
            callback:(row,prop)=>{
              return address(row[prop])
            }
          },
          {label:"可停放车辆",prop:"carsNumber"},
          {
            label:"禁启用",
            prop:"status",
            type:"slot",
            slotName:"status"
          },
          {
            label:"查看位置",
            prop:"lnglat",
            type:"slot",
            slotName:"lnglat"
          },
          {
            label:"操作",
            type:"slot",
            slotName:"operation"
          },
        ],
        url: "parkingList",
        data:{
           pageSize: 10,
          pageNumber: 1,
        }
      },
      pageSize: 10,
      pageNumber: 1,
      parking_status: this.$store.state.config.radio_disabled,
      parking_type: this.$store.state.config.parking_type,
      form: {
        lnglat: '',
        type: '',
        status: '',
      },
      switch_disable:"", //防止重复切换禁启用
      rowId:"", //防止重复删除
      search_key:"",
      keyword: "",
      map_show:false,
      parking_data:{},
      table_loading: false
    }
  },
  methods: {
    switchChange(data){
      // 禁启用
      const requestData = {
        id:data.id,
        status:data.status
      }
      this.switch_disable = data.id
      ParkingStatus(requestData).then(response=>{
        this.$message({
          type:"success",
          message:response.message
        })
        this.switch_disable = ''
      }).catch((err) =>{
        this.switch_disable = ''
      })
    },
    edit(id){
      // 编辑
      this.$router.push({
        name:'ParkingAdd',
        query:{
          id
        }
      })
    },
    showMap(data) {
      // 查看地图
      console.log(data,'ojkjk');
      this.map_show = true
      this.parking_data = data
    },
    search(){
      // 搜索
      const requstData = {
        pageSize: 10,
        pageNumber: 1,
      }
      // 过滤筛选
      const filterData = JSON.parse(JSON.stringify(this.form))
      for (let key in filterData) {
        if (filterData[key]) {
          requstData[key] = filterData[key]
        }
      }
      // 关键字
      if (this.keyword && this.search_key) {
        requstData[this.search_key] = this.keyword
      }
      // 调用子组件的方法
      this.$refs.table.requestData(requstData)
    },
    callbackComponent(params) {
      if (params.function) {
        this[params.function](params.data)
      }
    },
    
    getType(value) {
      const data = this.parking_type.filter(item => item.value == value)
      if(data && data.length > 0) {
        return data[0].label
      }
    },
    delConfirm(id) {
      this.$confirm('确定删除此信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.rowId = id
        ParkingDelete({id}).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.rowId = ""
          // 调用子组件的方法
          this.$refs.table.requestData()
        }).catch(() =>{
          this.rowId = ""
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    }
  }
}
</script>