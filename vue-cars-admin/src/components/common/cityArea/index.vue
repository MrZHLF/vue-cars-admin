<template>
  <el-cascader
    v-model="value"
    :options="cascader_options"
    :props="cascader_props"
    @change="changeValue"
  >
  </el-cascader>
</template>

<script>
import { GetCity } from '@/api/common'
export default {
  props: {
    cityAreaValue: {
      type: String,
      default: '',
    },
    mapLocation:{
        type:Boolean,
        default:false
    }
  },
  data() {
    const _this = this
    return {
      address: [],
      addressData: {},
      value: '',
      cascader_options: [],
      cascader_props: {
        // value:"PROVINCE_CODE",
        // label:"PROVINCE_NAME",
        lazy: true,
        lazyLoad(node, resolve) {
          const level = node.level
          // 请求参数
          const requestData = {}
          const josnType = {
            0: { type: 'province' },
            1: { type: 'city', code: 'province' },
            2: { type: 'area', code: 'city' },
          }

          if (josnType[level].code) {
            requestData[`${josnType[level].code}_code`] = node.value
          }
          requestData.type = josnType[level].type

          GetCity(requestData).then((res) => {
            console.log(res, 'd')
            const data = res.data.data
            const type = josnType[level].type.toUpperCase()
            data.forEach((item) => {
              item.value = item[`${type}_CODE`]
              item.label = item[`${type}_NAME`]
              if (level === 2) {
                item.leaf = level >= 2
              }
            })
            // 存储省市区
            _this.addressData[josnType[level].type] = data
            resolve(data)
          })
          //   获取address
          if (node.level != 0) {
            _this.getAdderess(node)
          }
        },
      },
    }
  },
  methods: {
    changeValue(value) {
      this.$emit('update:cityAreaValue', value.join())
      const lastCode = value[value.length - 1]
      const area = this.addressData.area.filter(
        (item) => item.value == lastCode
      )[0]
      this.address[2] = area.label
      this.getAdderess()
    },
    //   获取中文地址
    getAdderess(node) {
      if (node) {
        const index = node.level - 1
        this.address[index] = node.label
      }
      if(this.mapLocation) {
          this.$emit('callback', {
            function: 'setMapCenter',
            data: {
            address: this.address.join(''),
            },
        })
      }
      
    },
    clear() {
      this.value = ""
    }
  },
}
</script>

<style lang="scss" scoped></style>
