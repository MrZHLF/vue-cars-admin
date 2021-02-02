<template>
  <div class="parking-add">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="车辆品牌">
        <el-select>
          <el-option>宝马</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="车辆型号">
        <el-select>
          <el-option>宝马</el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="停车场">
        <el-select>
          <el-option>南山停车场</el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="车牌号">
        <el-input v-model="form.carNumber"></el-input>
      </el-form-item>

      <el-form-item label="车架号">
        <el-input v-model="form.carNumber"></el-input>
      </el-form-item>

      <el-form-item label="发动机号">
        <el-input v-model="form.carNumber"></el-input>
      </el-form-item>


      
      <el-form-item label="年检">
        <el-radio-group v-model="form.nianjian">
          <el-radio label="已年检"></el-radio>
          <el-radio label="未年检"></el-radio>
        </el-radio-group>
      </el-form-item>
    
      <el-form-item label="保养日期">
        <el-row :gutter="30">
          <el-col :span="6">
            <el-input v-model="form.carNumber"></el-input>
          </el-col>
          <el-col :span="6">下次保养日期：2020：10：10</el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="挡位">
        <el-radio-group v-model="form.disabled">
          <el-radio label="自动挡"></el-radio>
          <el-radio label="手动挡"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="能源类型">
        <el-radio-group v-model="form.energy">
          <el-radio :label="1">电动</el-radio>
          <el-radio :label="2">汽油</el-radio>
          <el-radio :label="3">混合动力</el-radio>
        </el-radio-group>
        <div class="progress-bar-wrap" v-if="form.energy == 1 || form.energy == 3">
          <span class="label-text">电量：</span>
          <el-row :gutter="20">
            <el-col :span="5">
              <div class="progress-bar">
                <span style="width:50%">
                   <label>90%</label>
                </span>
              </div>
            </el-col>
            <el-col :span="1">
              <el-input size="small"></el-input>
            </el-col>
          </el-row>
        </div>
        <div class="progress-bar-wrap" v-if="form.energy == 2 || form.energy == 3">
          <span class="label-text">由量：</span>
          <el-row :gutter="20">
            <el-col :span="5">
              <div class="progress-bar">
                <span style="width:50%">
                   <label>90%</label>
                </span>
              </div>
            </el-col>
            <el-col :span="1">
              <el-input size="small"></el-input>
            </el-col>
          </el-row>
        </div>
      </el-form-item>

      <el-form-item label="座位">
        <el-radio-group v-model="form.disabled">
          <el-radio label="4人座"></el-radio>
         <el-radio label="5人座"></el-radio>
         <el-radio label="6人座"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="禁启用">
        <el-radio-group v-model="form.disabled">
          <el-radio label="禁用"></el-radio>
          <el-radio label="启用"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="车辆属性">
        <div class="cars-attr-list" v-for="(item,index) in cara_attr" :key="index">
          <el-row :gutter="3">
            <el-col :span="2"><el-input ></el-input></el-col>
            <el-col :span="3"><el-input ></el-input></el-col>
            <el-col :span="6">
              <el-button type="primary" v-if="index == 0" @click="addCarsAttr">+</el-button>
              <el-button v-else>-</el-button>
            </el-col>
          </el-row>
        </div>
      </el-form-item>

      <el-form-item label="车辆描述">
        <div ref="editorDom" style="text-align:left;"></div>
      </el-form-item>
      

      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Editor from 'wangeditor'
export default {
  name: 'parkingAdd',
  data() {
    return {
      // 富文本
      editor:null,
      cara_attr:[
        {key1:11,value:222},
        {key2:11,value:222},
        {key3:11,value:222},
        {key4:11,value:222}
      ],
      form: {
        energy:'1',
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        nianjian:""
      },
    }
  },
  mounted() {
    this.createEditor()
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    },
    addCarsAttr() {
      this.cara_attr.push({
        key4:11,value:222
      })
    },
    createEditor() {
      this.editor = new Editor(this.$refs.editorDom)
      this.editor.customConfig.onchange = html => {}
      this.editor.create()
    }
  },
}
</script>

<style lang="scss" scoped>
@import './style';
.address-map {
	width:100%;
	height: 350px;
	border: 1px solid #ccc;
}
</style>
