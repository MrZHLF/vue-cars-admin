<template>
  <div class="cars-dialog-center">
    <!-- 弹框 -->
    <el-dialog
      :title="data.parkingName"
      :visible.sync="dialogVisible"
      class="cars-dialog-center"
        :close-on-click-modal="false"
        @close="close"
        @opened="opened"
    >
    <div style="height:500px">
        <AMap ref="aMap"/>
    </div>
    </el-dialog>
  </div>
</template>

<script>
import AMap from './../../views/amap'
export default {
  name: 'showMapLoaction',
  props: {
    flagVisible: {
      type: Boolean,
      default: false,
    },
    data:{
        type:Object,
        default:()=> {}
    }
  },
  components:{
    AMap
  },
  data() {
    return {
	    dialogVisible:false,
     }
	},
	methods: {
        opened(){
            this.$refs.aMap.mapCreate()
            this.$nextTick(() =>{
                // DOM元素渲染完之后
                const splitLnglat = this.data.lnglat.split(',')
                const lnglat = {
                    lng: splitLnglat[0],
                    lat: splitLnglat[1]
                }
                console.log(this.data);
                this.$refs.aMap.setMarker(lnglat)
            })
        },
		close(){
            this.$refs.aMap.mapDestroy()
			this.$emit('update:flagVisible',false)
		}
	},
	watch:{
		flagVisible: {
			handler(newValue,oldValue) {
				this.dialogVisible = newValue
			}
 		},
	}
}
</script>

<style lang="scss" scoped></style>
