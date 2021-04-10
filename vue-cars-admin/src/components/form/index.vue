<template>
  <div>
    <el-form ref="form" :model="formData"  :label-width="labelWidth">
      <el-form-item v-for="item in formItem" :key="item.prop" :label="item.label" :prop="item.prop" :rules="item.rules">

        <!-- input框 -->
        <el-input v-if="item.type === 'Input'" v-model.trim="formData[item.prop]" :placeholder="item.placeholder" :style="{width: item.width}" :disabled="item.disabled"></el-input>

        <!-- 省市区框 -->
        <slot v-if="item.type == 'Slot'" :name="item.slotName"></slot>

        <!-- 单选 -->
        <el-radio-group v-if="item.type == 'Radio'" v-model="formData[item.prop]">
          <el-radio v-for="radio in item.options" :label="radio.value"  :key="radio.label">{{radio.label}}</el-radio>
        </el-radio-group>

      </el-form-item> 
      <!-- 按钮 -->
      <el-form-item>
        <el-button v-for="item in formHandler" :key="item.key" :type="item.type" @click="item.handler && item.handler()">
          {{item.label}}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import CityArea from '@c/common/cityArea/index'
export default {
  name: 'form',
  props: {
    formItem:{
      type: Array,
      default: []
    },
    formHandler:{
      type: Array,
      default: []
    },
    formData:{
      type: Object,
      default: () => {}
    },
    labelWidth:{
      type: String,
      default: '120px'
    }
  },
  components:{
    CityArea
  },
  data() {
    return {
      form:{},
      type_msg:{
        "Input":"请输入",
        "Radio":"请选择"
      }
    }
  },
  methods: {
    initFormData(){
      const formData = {}
      this.formItem.forEach(item =>{
        if(item.prop) {
          formData[item.prop] == item.value || null
        }
        // 规则
        if (item.required) {
          this.rules(item)
        }
        // 自定义校验规则
        if(item.validator) {item.rules = item.validator}
      })
      this.form = formData
    },
    rules(item){
        const requiredRules = [{ required: true, message: item.requiers_msg || `${this.type_msg[item.type]} ${item.label}`, trigger: 'blur' }]
        // 还有其他规则
        if(item.rules && item.rules > 0) {
          // 存在两种以上
          item.rules = requiredRules.concat(item.rules);
        } else {
          item.rules = requiredRules
        }
    }
  },
  watch: {
    formItem:{
      handler(newValue) {
        this.initFormData()
      },
      immediate:true
    }
  }
}
</script>

<style lang="scss" scoped></style>
