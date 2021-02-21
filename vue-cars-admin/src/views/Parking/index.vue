<template>
  <div>
    <div class="filter-form">
      <el-row>
        <el-col :span="21">
          <el-form :inline="true" :model="form" class="demo-form-inline">
            <el-form-item label="停车场名称">
              <el-input
                v-model="form.parkingName"
                placeholder="请输入车辆名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="区域">
              <CityArea ref="cityArea" :cityAreaValue.sync="form.area" @callback="callbackComponent" />
            </el-form-item>
            <el-form-item label="类型">
              <el-select placeholder="活动区域" v-model="form.type" class="width-120">
                <el-option v-for="(item,index) in type" :label="item.label" :value="item.value" :key="index">{{item.label}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="禁启用">
              <el-select placeholder="请选择" v-model="form.status" class="width-120">
                <el-option v-for="(item,index) in status" :label="item.label" :value="item.value" :key="index">{{item.label}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary">搜索</el-button>
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
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column prop="parkingName" label="停车场名称"> </el-table-column>
      <el-table-column prop="type" label="类型"> </el-table-column>
      <el-table-column prop="address" label="区域"> </el-table-column>
      <el-table-column prop="carsNumber" label="可停放车辆"> </el-table-column>
      <el-table-column prop="status" label="禁启用">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="1"
            inactive-value="2"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="area" label="查看位置"> </el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button size="mini">编辑</el-button>
          <el-button size="mini" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pull-right padding-top-30"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import {ParkingList} from '@/api/parking'
import CityArea from './../../components/common/cityArea/index'
export default {
  name: 'Parking',
  components:{
    CityArea
  },
  data() {
    return {
      total:0,
      currentPage:1,
      pageSize:10,
      pageNumber:1,
      status:this.$store.state.config.parking_status,
      type:this.$store.state.config.parking_type,
      form: {
        parkingName: '',
        area: '',
        type: '',
        status:""
      },
      tableData: [],
    }
  },
  methods: {
    callbackComponent(params) {
      if(params.function){
        this[params.function](params.data)
      }
    },
    getParking() {
      const requstData = {
        pageSize:this.pageSize,
        pageNumber:this.pageNumber
      }
      ParkingList(requstData).then(response => {
        console.log(response,'ddd');
        let data = response.data
        if(data) {
          this.tableData = data.data
        }
        if (data.total) {
          this.total = data.total
        }
      })
    },
    handleSizeChange(val) {
      // 页码
      this.pageSize=val
      this.getParking()
    },
    handleCurrentChange(val){
      this.pageNumber=val
      this.getParking()
    }
  },
  beforeMount() {
    this.getParking()
  },
  
}
</script>

<style lang="sass" scoped></style>
