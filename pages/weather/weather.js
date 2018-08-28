//获取应用实例
var app = getApp();
Page({
  data:{
    weekday: ['周日', '周一','周二','周三', '周四','周五','周六'],
    showday:['今天','明天',''],
    city:'',//城市
    district:'',//区域
    now:'',//实时天气
    forecast:'',//天气预报
    quality:'',//空气质量
    dress:''
  },
  onLoad:function(){
    let that = this;
    let date = new Date();
    //设置showday的第三个值为周几
    that.setData({
      'showday[2]':this.data.weekday[date.getDay()+2]
    });
  },
  onShow:function(city){
    let that = this;
    that.setData({
      city: app.globalData.defaultCity,  
      district: app.globalData.defaultCounty, 
      now:app.globalData.weatherData.now,//今天天气情况
      forecast:app.globalData.weatherData.daily_forecast,
      quality:app.globalData.air,
      dress:app.globalData.dress
    });
  },

  //点击切换城市
  bindCity:function(){
    wx.reLaunch({
      url: '../switchcity/switchcity',
    })
  },
  onShareAppMessage:function(){
    return {
      title: '',
      desc: '',
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: "分享成功",
          duration: 1000,
          icon: "success"
        })
      }
    }
  }
})