<template>
  <div>
    <el-table :data="table_data" v-loading="loading_table" element-loading-text="加载中..." border style="width: 100%">
      <el-table-column
        v-if="table_config.checkbox"
        type="selection"
        width="35"
      ></el-table-column>
      <template v-for="item in this.table_config.thead">
        <el-table-column v-if="item.type === 'function'" :key="item.prop" :prop="item.prop" :label="item.label">
					<template slot-scope="scope">
						<span v-html="item.callback && item.callback(scope.row,item.prop)"></span>
					</template>
        </el-table-column>

				<el-table-column v-else-if="item.type === 'slot'" :key="item.prop" :prop="item.prop" :label="item.label" :width="item.width">
						<template slot-scope="scope">
								<slot :name="item.slotName" :data="scope.row"></slot>
						</template>
				</el-table-column>

        <el-table-column v-else-if="item.type === 'image'" :key="item.prop" :prop="item.prop" :label="item.label" :width="item.width">
						<template slot-scope="scope">
								<img :src="scope.row.imgUrl"  :width="item.imgWidth" alt="">
						</template>
				</el-table-column>
				
				<!-- 纯文本渲染 -->
				<el-table-column v-else :key="item.prop" :prop="item.prop" :label="item.label"></el-table-column>
      </template>
    </el-table>
		<el-row class="padding-top-30">
			<el-col :span="4" style="padding:5px"></el-col>
			<el-col :span="20">
				<el-pagination
					v-if="table_config.pagination"
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
			</el-col>
		</el-row>
  </div>
</template>

<script>
import { GetTableData } from '@/api/common'
export default {
  name: 'TableComponent',
  data() {
    return {
			loading_table:true,
			total: 0,
      currentPage: 1,
      table_data: [],
      table_config: {
        thead: [],
        checkbox: true,
        url: '',
				pagination:true,
				data:{}
      },
    }
  },
  methods: {
    initConfig() {
      for (let key in this.config) {
        if (Object.keys(this.table_config).includes(key)) {
          this.table_config[key] = this.config[key]
        }
      }
      // 配置完成后读取接口数据
      this.loadData()
    },
    loadData() {
      let requestData = {
        url: this.table_config.url,
        data: this.table_config.data
      }
			this.loading_table = true
      GetTableData(requestData).then((response) => {
        console.log(response, 'response')
        let data = response.data
        if (data) {
          this.table_data = data.data
					// 页码
					this.$nextTick(() =>{
						this.total = data.total
						this.loading_table = false
					})
        }
      }).catch(()=>{
					this.loading_table = false
			})
    },
		requestData(params = ""){
			if(params) {
				// 处理业务逻辑
				this.table_config.data = params
			}
			this.loadData()
		},
		handleSizeChange(val) {
      // 页码
      this.table_config.pageSize = val
      this.loadData()
    },
    handleCurrentChange(val) {
      this.table_config.pageNumber = val
      this.loadData()
    },
  },
  props: {
    config: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    config: {
      handler(newValue) {
        this.initConfig()
      },
      immediate: true,
    },
  },
}
</script>

<style></style>
