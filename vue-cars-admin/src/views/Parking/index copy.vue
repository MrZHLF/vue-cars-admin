<template>
  <div>
    <div class="filter-form">
      <el-row>
        <el-col :span="21">
          <el-form :inline="true" :model="form" class="demo-form-inline">
            <el-form-item label="区域">
              <CityArea
                ref="cityArea"
                :cityAreaValue.sync="form.area"
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
                  v-for="(item, index) in type"
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
                  v-for="(item, index) in status"
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
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="table_loading">
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column prop="parkingName" label="停车场名称"> </el-table-column>
      <el-table-column prop="type" label="类型">
        <template slot-scope="scope">
          <span>{{getType(scope.row.type)}}</span>
        </template>
      </el-table-column>
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
      <el-table-column prop="area" label="查看位置"> 
        <template slot-scope="scope">
            <el-button type="success" size="mini" @click="showMap(scope.row)">查看地图</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="edit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="del(scope.row.id)">删除</el-button>
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
      :total="total"
    >
    </el-pagination>

    <showMapLoaction :flagVisible.sync="map_show" :data="parking_data"/>
  </div>
</template>

<script>
import { ParkingList,ParkingDelete } from '@/api/parking'
import CityArea from './../../components/common/cityArea/index'
import showMapLoaction from './../../components/dialog/showMapLoaction'
export default {
  name: 'Parking',
  components: {
    CityArea,
    showMapLoaction
  },
  data() {
    return {
      total: 0,
      currentPage: 1,
      pageSize: 10,
      pageNumber: 1,
      status: this.$store.state.config.parking_status,
      type: this.$store.state.config.parking_type,
      form: {
        area: '',
        type: '',
        status: '',
      },
      search_key:"",
      keyword: "",
      tableData: [],
      map_show:false,
      parking_data:{},
      table_loading: false
    }
  },
  methods: {
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
      console.log(data);
      this.map_show = true
      this.parking_data = data
    },
    search(){
      // 搜索
      this.getParking()
    },
    callbackComponent(params) {
      if (params.function) {
        this[params.function](params.data)
      }
    },
    getParking() {
      // 列表
      const requstData = {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
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
      this.table_loading = true
      ParkingList(requstData).then((response) => {
        console.log(response, 'ddd')
        let data = response.data
        this.table_loading = false
        if (data) {
          this.tableData = data.data
        }
        if (data.total) {
          this.total = data.total
        }
      }).catch(()=>{
        this.table_loading = false
      })
    },
    handleSizeChange(val) {
      // 页码
      this.pageSize = val
      this.getParking()
    },
    handleCurrentChange(val) {
      this.pageNumber = val
      this.getParking()
    },
    getType(value) {
      const data = this.type.filter(item => item.value == value)
      if(data && data.length > 0) {
        return data[0].label
      }
    },
    del(id) {
      this.$confirm('确定删除此信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ParkingDelete({id}).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getParking()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    }
  },
  beforeMount() {
    this.getParking()
  },
}
</script>

<style lang="sass" scoped></style>
