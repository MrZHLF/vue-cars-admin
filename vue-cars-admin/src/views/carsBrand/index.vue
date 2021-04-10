<template>
  <div>
    <div class="filter-form">
      <el-row>
        <el-col :span="18">
          <el-form
            :inline="true"
            label-position="left"
            :model="form"
            class="demo-form-inline"
            label-width="80px"
          >
            <el-form-item label="车辆品牌">
              <el-input
                v-model="form.brand"
                placeholder="请输入车辆品牌"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6">
          <div class="pull-right">
            <el-button type="danger" @click="dialog_show = true"
              >新增车辆品牌</el-button
            >
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 表格 -->
    <tableData ref="table" :config="table_config">
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
      <template v-slot:operation="slotData">
        <el-button size="mini" @click="edit(slotData.data)">编辑</el-button>
        <el-button size="mini" :loading="slotData.data.id == rowId" type="danger" @click="delConfirm(slotData.data.id)">删除</el-button>
      </template>
    </tableData>
   <AddCarsBrand :flagVisible.sync="dialog_show" :data="data_brand" @callbackComponent="callbackComponent" />
  </div>
</template>

<script>
import AddCarsBrand from './../../components/dialog/addCarsBrand'
import tableData from './../../components/tableData/index'
import { BrandDelete,BrandStatus } from '@/api/brand'
export default {
  name: 'Parking',
  components:{
    AddCarsBrand,
    tableData
  },
  data() {
    return {
      // 表格配置
      table_config:{
        thead: [
          {
            label:"LOGO",
            prop:"imgUrl",
            type:"image",
            width:100,
            imgWidth:70
          },
          {
            label:"车辆品牌",
            prop:"nameCh",
            type:"function",
            callback:(row,prop) =>{
              return `${row.nameCh}/${row.nameEn}`
            }
          },
          {
            label:"禁启用",
            prop:"status",
            type:"slot",
            slotName:"status"
          },
          {
            label:"操作",
            type:"slot",
            slotName:"operation"
          },
        ],
        url: "brandList", //url地址
        data:{
           pageSize: 10,
          pageNumber: 1,
        }
      },
      dialog_show: false,
      switch_disable:"",
      rowId:"",
      data_id:"",
      data_brand:{},
      form: {
        brand: '',
        area: '',
        type: '',
      },
    }
  },
  methods: {
    callbackComponent(params){
      if(params.function) { this[params.function](); }
    },
    search(){
      // 搜索
      const requstData = {
        pageSize: 10,
        pageNumber: 1,
      }
      if (this.form.brand) {requstData.brand = this.form.brand }
      this.$refs.table.requestData(requstData)
    },
    edit(data){
      // 禁启用
      this.data_brand = Object.assign({}, data); // Es6 浅拷贝
      this.dialog_show = true
    },
    switchChange(data){
      // 禁启用
      const requestData = {
        id:data.id,
        status:data.status
      }
      this.switch_disable = data.id
      BrandStatus(requestData).then(response=>{
        this.$message({
          type:"success",
          message:response.message
        })
        this.switch_disable = ''
      }).catch((err) =>{
        this.switch_disable = ''
      })
    },
    delConfirm(id) {
      this.$confirm('确定删除此信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.rowId = id
        BrandDelete({id}).then(res => {
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
  },
}
</script>

<style lang="sass" scoped>
</style>
