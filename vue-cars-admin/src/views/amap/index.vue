<template>
    <div class="amap-wrap">
        <el-amap vid="amapContainer" :events="events" class="amap-demo">
      </el-amap>
    </div>
</template>
<script>
import { AMapManager,lazyAMapApiLoaderInstance  } from 'vue-amap';
import { getLonLag } from './common'
import {addressSetMapCenter} from './location'
import {mapSetMarker,amapClearMarker} from './marker'
export default {
    name:"Amap",
    data() {
        return {
            lnglat:{},
            map:null,
            zoom: 18,
            events: {}
        }
    },
    mounted(){
        lazyAMapApiLoaderInstance.load().then(() => {
            // 高德地图初始化
            this.map = new AMap.Map('amapContainer', {
                center: [116.404765,39.918052],
                zoo:this.zoom //初始化地图层级
            });

            this.map.on('click',(e)=> {
                const lnglat = getLonLag(e)
                this.lnglat = lnglat //经纬度
                this.$emit('callback',{
                    function:"getLnglat",
                    data:{
                        lnglat
                    }
                })
                // 设置覆盖物
                this.setMarker()
            })
        });
    },
    created(){

    },
    methods:{
        setMapCenter(value) {
            addressSetMapCenter(value,this.map)
        },
        setMarker(){
            // 设置覆盖物
            mapSetMarker(this.lnglat,this.map)
        },
        // 清除点
        clearMarker() {
            amapClearMarker(this.map)
        }
    }
}
</script>
<style lang="scss">
.amap-wrap{
    height: 100%;
}
</style>