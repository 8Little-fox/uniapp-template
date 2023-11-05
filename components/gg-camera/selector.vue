<template>
  <view @click.stop>
<!--    <cover-view style="position: absolute;bottom:230rpx;right: 0;z-index:9;" :class="{'hidden':visible}">
      <gg-choose-location v-model="basicConfigs._Location"></gg-choose-location>
    </cover-view> -->
    <view 
     :class="{'hidden':!visible}" @click.stop
    style="position:relative;height: 750rpx;width:100vw;">
      <view style="font-weight: bold;font-size: 18px;text-align: center;padding: 20rpx;">
        {{showForm?'编辑水印':'选择水印'}}
      </view>
      <view class="content" :class="{'hidden':showForm}" style="padding:0 0;">
        <view v-for="(item) in list" @click="onSelected(item.type)"
        :key="item.type" style="margin: 5px;background-color: #535b71;float: left;position: relative;border-radius: 10px;">
          <!-- <wxml-to-canvas 
          style="z-index:0;"
          v-if="item.canvasWidth && item.canvasHeight" 
          :class="['canvas'+item.type]" :width="item.canvasWidth" :height="item.canvasHeight">
          </wxml-to-canvas> -->
          <cover-view :class="{'hidden':item.type !== selected,'actions':item.type === selected}" >
            <cover-view class="btn" @click="[showForm=true]">编辑</cover-view>
          </cover-view>
        </view>
        <view style="clear: both;"></view>
      </view>
      <view class="content" v-if="showForm">
        <u-form :model="configs[selected].form" ref="baseForm" label-width="120" label-align="left" label-position="left">
         <u-form-item :label="field.label" v-for="(field,name) in schemas" :key="name">
           <gg-safe-input v-if="field.type==='input'" v-model="configs[selected].form[name]" :border="true"/>
           <view v-else-if="field.type==='switch'" style="display: flex;justify-content: flex-end;">
             <u-switch v-model="configs[selected].form[name]"></u-switch>
           </view>
           <view v-else-if="field.type==='image'">
             <uni-file-picker
                 :image-styles="{height: 100,width: 100}"
                 v-model="configs[selected].form[name]"  
                 file-mediatype="image"
                 mode="grid"
                 file-extname="png,jpg,jpeg"
                 :limit="1"/>
           </view>
           <view v-else>不支持的表单项</view>
         </u-form-item>
        </u-form>
        <u-form :model="customConfigs" ref="customForm" label-width="40" label-align="left" label-position="left">
         <u-form-item :label="field.label" v-for="(field,name) in customOptions" :key="name">
           <view v-if="field.type==='custom'" style="display: flex;">
             <gg-safe-input style="flex:1;" v-model="customConfigs[name]" :border="true"/>
             <view style="width:100rpx;display: flex;justify-content: center;align-items: center;">
               <u-icon label=" " size="50" name="close-circle" @click="removeCustomOptions(name)" color="#666"></u-icon>
             </view>
           </view>
         </u-form-item>
        </u-form>
        <u-button style="margin-top:10px;" type="primary" @click="addCustomOptions" :border="false" shape="circle">添加自定义条目</u-button>
      </view>
      <view style="display:flex;padding-top:40rpx;width: 100vw;">
        <u-button style="width: 250rpx;margin-left: 90rpx" @click="cancel" plain>取消</u-button>
        <u-button style="width: 250rpx;margin-left: 35rpx" @click="confirm" type="primary" plain>确认</u-button>
      </view>
    </view>
  </view>
</template>

<script>
  import waterMarkProvider from './watermark/index.js';

  const baseSchema = {
    _showDate:{
      label:'显示日期',
      type:'switch',
      default:true,
    },
    _showTime:{
      label:'显示时间',
      type:'switch',
      default:true,
    },
    _showLocation:{
      label:'显示地点',
      type:'switch',
      default:true,
    },
    _showWeather:{
      label:'显示天气',
      type:'switch',
      default:true,
    },
    _showAPPName:{
      label:'小程序名',
      type:'switch',
      default:true,
    },
  }
  
  export default {
    name:'selector',
    props:{
      value:{
        type:Object,
        default:()=>{
          return {};
        }
      },
      visible:{
        type:Boolean,
        default:false,
      },
    },
  	data() {
  		return {
        selected:uni.getStorageSync('__selected_watermark__') || 'default',
        configs:uni.getStorageSync('__watermark_configs__')||{},
        list:waterMarkProvider.getAllProvider(),
        showForm:false,
        customOptions:uni.getStorageSync('__watermark_customs__')||{},
        customConfigs:uni.getStorageSync('__watermark_custome_configs__')||{},
        basicConfigs:{
          _Date:'',
          _Time:'',
          _Week:'',
          _Location:'',
          _Weather:'',
          _AppName:'水印相机',
        },
      }
  	},
    events:['change','input'],
    computed:{
      schemas(){
        if(!this.selected){
          return baseSchema;
        }
        const provider = waterMarkProvider.getProvider(this.selected);
        // const result={};
        // const arr1=Object.keys(provider.form);
        // for (let i = 0,len=arr1.length; i < len; i++) {
        //   const key=arr1[i];
        //   result[key]=provider.form[key]
        // }
        // const arr2=Object.keys(baseSchema);
        // for (let i = 0,len=arr2.length; i < len; i++) {
        //   const key=arr2[i];
        //   result[key]=baseSchema[key]
        // }
        // return result;
        return {
          ...provider.form,
          ...baseSchema,
        }
      }
    },
    created(){
      let now=new Date();
      this.basicConfigs._Date=this.$tools.dateFormat('YYYY.mm.dd',now)
      this.basicConfigs._Time=this.$tools.dateFormat('HH:MM',now)
      this.basicConfigs._Week=this.$tools.dateFormat('WW',now)
      this.basicConfigs._Location=''
      this.basicConfigs._Weather=''
      
      this.interval=setInterval(()=>{
        let now=new Date();
        if(now.getSeconds()===1){
          this.basicConfigs._Date=this.$tools.dateFormat('YYYY.mm.dd',now)
          this.basicConfigs._Time=this.$tools.dateFormat('HH:MM',now)
          this.basicConfigs._Week=this.$tools.dateFormat('WW',now)
        }
      },1000);
      this.onSelected(this.selected);
    },
    mounted() {
      setTimeout(async ()=>{
        await this.renderList();
      },Math.random()*1000);
      
      this.unwatch=this.$watch('basicConfigs',(nvalue)=>{
        this.onEdit(this.selected,true)
      },{
        deep:true,
        immediate:false,
      })
    },
    beforeDestroy() {
      this.interval && clearInterval(this.interval);
      this.unwatch && this.unwatch();
      this.interval=null;
      this.unwatch=null;
    },
  	methods: {
      cancel(){
        if(this.showForm){
          this.showForm=false;
        }else{
          this.$emit('update:visible', false);
        }
      },
      confirm(){
        if(this.showForm){
          this.onEdit(this.selected);
          this.showForm=false;
        }else{
          this.$emit('update:visible', false);
        }
      },
      async renderList(){
        this.list.forEach(async (config)=>{
          const waterMark = waterMarkProvider.getProvider(config.type);
          
          const canvasWidth=(this.systemInfo.windowWidth-5*4)/2;
          const canvasHeight=(canvasWidth/16)*9;
          
          this.$set(config,'canvasWidth',canvasWidth);
          this.$set(config,'canvasHeight',canvasHeight);
          
          let { wxml, style } = await waterMark.render({},canvasWidth,canvasHeight);
          
          wxml=`<view class="canvas">${wxml}</view>`
          style.canvas={
            width: canvasWidth,
            height: canvasHeight,
            flexDirection: 'column',
            justifyContent:'center',
            background: 'rgba(255,255,255,0)',
          }
          try{
            await this.$tools.whileTaskDone(()=>{
              const canvas = this.selectComponent('.canvas'+config.type)
              return canvas.renderToCanvas({ wxml, style });
            },20,50)
          }catch(err){
            console.error('渲染出错',err)
            uni.showToast({
              icon:'error',
              title:'水印加载失败'
            })
          }
        })
      },
      onSelected(type){
        this.selected=type;
        this.onEdit(type);
        uni.setStorageSync('__selected_watermark__',type);
      },
      onEdit(type,refresh,ignore){
        let config=this.configs[type] || {
          type:type,
          form:{},
        };
        const schemas = this.schemas;
        Object.keys(schemas).forEach((key)=>{
          if(config.form[key] === undefined){
            config.form[key] = schemas[key].default;
          }
        })
        const customOptions=this.customOptions;
        Object.keys(customOptions).forEach((key)=>{
          if(this.customConfigs[key] === undefined){
            this.customConfigs[key] = customOptions[key].default;
          }
        })
        this.configs[config.type]=config;
        if(!ignore){
          this.$emit('input',JSON.parse(JSON.stringify({
            type:config.type,
            form:{
              ...config.form,
              ...this.customConfigs,
              ...this.basicConfigs,
            },
            refresh
          })));
        }
        uni.setStorageSync('__watermark_configs__',this.configs);
        uni.setStorageSync('__watermark_custom_configs__',this.customConfigs);
        uni.setStorageSync('__watermark_customs__',this.customOptions);
      },
      addCustomOptions(){
        const add = ()=>{
          const name = 'custom-'+Date.now();
          this.$set(this.customOptions,name,{
            label:'#',
            type:'custom',
            default:'',
            placeHolder:'输入自定义内容',
          })
          this.onEdit(this.selected,false,true)
        }
        if(!Object.keys(this.customOptions).length){
          return uni.showModal({
            title:'关于自定义条目',
            content:'自定义条目自定以“#”开头。\n同时在所有水印内生效。\n不支持分享。',
            success:({confirm})=>{
              if(confirm){
                add();
              }
            }
          })
        }
        add();
      },
      removeCustomOptions(name){
        uni.showModal({
          content:'是否删除本条目',
          success:({confirm})=>{
            if(confirm){
              this.$delete(this.customConfigs,name)
              this.$delete(this.customOptions,name)
              uni.setStorageSync('__watermark_custom_configs__',this.customConfigs);
              uni.setStorageSync('__watermark_customs__',this.customOptions);
            }
          }
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .actions{
    position: absolute;
    left:0;right: 0;top:0;bottom: 0;
    border-radius: 10px;
    background-color: #3b99f8;
    opacity: 0.9;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index:99 !important;
    .btn{
      z-index:99;
      font-size: 16px;
      color:#3b99f8;
      opacity: 1;
      background-color: #ffffff;
      padding: 15rpx 50rpx;
      border-radius: 40rpx;
    }
  }
  
  .content {
    font-size: 16px;
    color: #909399;
    padding: 0 120rpx;
    height: 500rpx;
    width:100vw;
    overflow-y: scroll;
  }
</style>