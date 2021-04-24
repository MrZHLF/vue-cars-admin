<template>
  <div>
    <!-- 表格 -->
    <TabalData ref="table" :config="table_config">
        <!--禁启用-->
        <template v-slot:status="slotData">
            <el-switch :disabled="slotData.data.id == switch_disabled" @change="switchChange(slotData.data)" v-model="slotData.data.status" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
        </template>
        <!-- 操作 -->
      <template v-slot:operation="slotData">
        <el-button size="mini" @click="edit(slotData.data.id)">编辑</el-button>
        <el-button size="mini" type="danger">删除</el-button>
      </template>
    </TabalData>
  </div>
</template>

<script>
import TabalData from "@c/tableData";
import { address, yearCheckType, energyType } from "@/utils/common";
export default {
  name: 'Parking',
  components:{
    TabalData
  },
  data() {
    return {
      options: [
        {
          value: 'zhinan',
          label: '河南省',
          children: [{ value: '222', label: '郑州市' }],
        },
      ],
      table_config: {
        thead: [
          { label: "车牌号", prop: "carsMode" },
          { label: "车辆品牌", prop: "nameCh" },
          { 
              label: "车辆LOGO", 
              prop: "imgUrl",
              type: "image"
          },
          { 
              label: "车辆图片", 
              prop: "carsImg",
              type: "image"
          },
          { 
              label: "年检", 
              prop: "yearCheck",
              type: "function",
              callback: (row, prop) => yearCheckType(row[prop]),
              width: "100px"
          },
          { 
              label: "能源类型", 
              prop: "energyType",
              type: "function",
              callback: (row, prop) => energyType(row[prop]),
              width: "100px"
          },
          { 
              label: "禁启用",
              prop: "status",
              type: "slot",
              slotName: "status",
              width: "100px"
          },
          { 
              label: "车辆状态", 
              prop: "cars_status",
              type: "function",
              callback: (row) => {
                  const carsStatus = this.$store.state.config.cars_status;
                  const status = carsStatus[row.carsStatus];
                  return status ? status.zh : "";
              }
          },
          { label: "停车场", prop: "parkingName" },
          { 
              label: "区域",
              prop: "address",
              type: "function",
              callback: (row, prop) => address(row[prop])
          },
          {
            label:"操作",
            type:"slot",
            slotName:"operation"
          }
      ],
        url: "carsList",  // 真实URL请求地址
        data: {
          pageSize: 10,
          pageNumber: 1
        },
      },
      switch_disabled: "",
      switch_flag: false,
    }
  },
  methods: {
    switchChange(){

    }
  },
}
</script>

<style lang="sass" scoped></style>
