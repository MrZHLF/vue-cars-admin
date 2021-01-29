<template>
  <div class="parking-add">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="停车场名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="区域">
        <el-cascader
          v-model="form.area"
          :options="options"
          :props="{ expandTrigger: 'hover' }"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item label="类型">
        <el-radio-group v-model="form.type">
          <el-option label="室内" value="shanghai"></el-option>
          <el-option label="室外" value="beijing"></el-option>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="可停放车辆">
        <el-input v-model="form.carNumber"></el-input>
      </el-form-item>
      <el-form-item label="禁启用">
        <el-radio-group v-model="form.disabled">
          <el-radio label="禁用"></el-radio>
          <el-radio label="启用"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="位置">
        <div class="address-map"></div>
      </el-form-item>
      <el-form-item label="经纬度">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'parkingAdd',
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
      },
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    },
  },
}
</script>

<style lang="scss" scoped>
.address-map {
	width:100%;
	height: 350px;
	border: 1px solid #ccc;
}
</style>
