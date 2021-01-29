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
            <el-form-item label="类型">
              <el-select v-model="form.type" placeholder="选择品牌">
                <el-option label="红旗" value="beijing"></el-option>
                <el-option label="奔驰" value="shanghai"></el-option>
                <el-option label="宝马" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="品牌型号">
              <el-input
                v-model="form.parking_name"
                placeholder="请输入品牌型号"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary">搜索</el-button>
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
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column prop="name" label="LOGO"> </el-table-column>
      <el-table-column prop="type" label="车辆品牌"> </el-table-column>
      <el-table-column prop="area" label="品牌型号"> </el-table-column>
      <el-table-column prop="disabled" label="禁启用">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.disabled"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button size="mini">编辑</el-button>
          <el-button size="mini" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

   <AddCarsBrand :flagVisible.sync="dialog_show" />
  </div>
</template>

<script>
import AddCarsBrand from './../../components/dialog/addCarsBrand'
export default {
  name: 'Parking',
  components:{
    AddCarsBrand
  },
  data() {
    return {
      dialog_show: false,
      form: {
        parking_name: '',
        area: '',
        type: '',
      },
      tableData: [
        {
          name: '郑州停车场',
          type: '室内',
          area: '金水区',
          carNumber: 100,
          disabled: 0,
          address: '3423,453253',
        },
      ],
    }
  },
}
</script>

<style lang="sass" scoped>
</style>
