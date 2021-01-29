<template>
  <div>
    <!-- <Cars></Cars> -->
    <!-- 地图 -->
    <Map></Map>
    <!-- 导航 -->
    <Navbar></Navbar>
    <!-- 会员 -->
    <div id="children-view" :class="{ open: show }">
      <router-view />
    </div>
  </div>
</template>
<script>
import Map from '../amap/index'
import Cars from './../cars/index'
import Navbar from './../../components/navbar/index'
export default {
  name: 'Index',
  components: { Map, Cars, Navbar },
  data() {
    return {}
  },
  computed: {
    show() {
      const route = this.$route
      return route.name === 'Index' ? false : true
    },
  },
  mounted() {
    document.addEventListener('mouseup', (e) => {
			// 点击关闭用户会员弹框
      const userCon = document.getElementById('children-view')
      if (userCon && !userCon.contains(e.target)) {
				this.$router.push({
					name: "Index"
				})
      }
    })
  },
}
</script>
<style lang="scss">
#children-view {
  position: fixed;
  top: 0;
  right: -600px;
  bottom: 0;
  width: 410px;
  background: #34393f;
  -webkit-transition: all 0.3s ease 0s;
  &.open {
    right: 0px;
  }
}
</style>
