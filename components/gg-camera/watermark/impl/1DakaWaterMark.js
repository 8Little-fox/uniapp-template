import WaterMark from '../base.js'

export default class Daka1WaterMark extends WaterMark{
  
  constructor(){
    super('daka1',{
      nickname:{
        label:'设置姓名',
        type:'input',
        default:'',
        placeHolder:'输入姓名',
      }
    },'打卡1','打卡')
  }
  
  async render(data,viewPortWidth,viewPortHeight) {
    const wxml = `
    <view class="container" >
      <text class="text">更多水印正在开发</text>
    </view>
    `
    const style = {
      container: {
        width: this.vpx2px(750,viewPortWidth,viewPortHeight),
        flexDirection: 'row',
        justifyContent: 'center',
        background: 'rgba(255,255,255,0)',
        alignItems: 'center',
      },
      text: {
        width: this.vpx2px(750,viewPortWidth,viewPortHeight),
        height: this.vpx2px(120,viewPortWidth,viewPortHeight),
        fontSize:this.vpx2px(36,viewPortWidth,viewPortHeight,14),
        color:'#ffffff',
        textAlign: 'center',
        verticalAlign: 'middle',
      },
    }
    return {
      wxml,
      style
    }
  }
}