var app = getApp();
var util = require('../../utils/cityutil.js');
Page({
 /**
  * 页面初始化数据
  */
  data:{
    location:'',
    county:'',
    today:'',
    weatherData:'',
    air:'',
    totalweatherData:'',
    topNews:[],
    newsType:'keji',
    isSunnyDay:'',
    dress:'',
    selectedState: [1, 0, 0, 0, 0]
  },
  onLoad:function(options){
    let that=this;
    wx.showLoading({
      title: '加载中',
    }),
    //更新当前日期
   app.globalData.day = util.formatTime(new Date()).split(' ')[0];
    that.setData({
      today:app.globalData.day
    });
    //定位当前城市
    that.getLocation();
    //初始化加载科技类新闻 --调用聚合数据头条新闻接口
    wx.request({
      url: app.globalData.juhetoutiaoBase,
      data: {
        type: 'shehui',
        key: app.globalData.juhetoutiaoKey
      },
      header: {
        'Content-Type': 'application.json'
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.error_code == 0) {
          that.setData({
            topNews: res.data.result.data
          })
        } else {
          wx.showToast({
            title: '网络异常,获取新闻失败',
            icon: 'none',
            duration: 2000
          })
           console.log("接口数据获取失败")
        }
      }
    })
  },
  //定位到当前城市
  getLocation: function () {
    let that = this;
    wx.getLocation({
      type:'wgs84',
      success: function(res) {
        let latitude = res.latitude;
        let longitude = res.longitude;
        wx.request({
          url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${app.globalData.tencentMapKey}`,
          success:res =>{
            app.globalData.defaultCity = app.globalData.defaultCity ? app.globalData.defaultCity : res.data.result.ad_info.city;
            app.globalData.defaultCounty = app.globalData.defaultCounty ? app.globalData.defaultCounty : res.data.result.ad_info.district;
            that.setData({
              location: app.globalData.defaultCity,
              county: app.globalData.defaultCounty
            });
            that.getWeather();
            that.getAir();
          }
        })
      },
    }) 
  },

  //获取天气
  getWeather:function(){
    let length = this.data.location.length;
    let city = this.data.location.slice(0,length-1);
    let that = this;
    let param={
      key:app.globalData.heWeatherKey,
      location:city
    };
    wx.request({
      url: app.globalData.heWeatherBase + "/s6/weather",
      data:param,
      header: {
        'content-type': 'application/json'
      },
      success:function(res){
        app.globalData.weatherData = res.data.HeWeather6[0].status == "unknown city" ? "" : res.data.HeWeather6[0];
        app.globalData.dress = res.data.HeWeather6[0].lifestyle[1];
        let weatherData = app.globalData.weatherData ? app.globalData.weatherData.now : "暂无该城市天气信息";
        let totalweatherData = app.globalData.weatherData ? app.globalData.weatherData.daily_forecast[0] : "暂无该城市天气信息";
        let isSunnyDay='';
        let dress = app.globalData.weatherData ? res.data.HeWeather6[0].lifestyle[1] : { txt: "暂无该城市天气信息" };
       
        if (weatherData.cond_txt != '晴' && weatherData.cond_txt != '多云'){
           isSunnyDay =false;
        }else{
           isSunnyDay=true;
        }
        that.setData({
          weatherData: weatherData,//今天天气情况数组 
          totalweatherData: totalweatherData,//总共天气情况
          dress: dress,//穿衣指数等建议
          isSunnyDay: isSunnyDay//控制天气图片标志位
        });
      }
    })

  },

  //获取当前空气质量情况
  getAir:function(){
    let length = this.data.location.length;
    let city = this.data.location.slice(0, length - 1);
    let that = this;
    let param = {
      key: app.globalData.heWeatherKey,
      location: city
    };
    wx.request({
      url: app.globalData.heWeatherBase + "/s6/air/now",
      data: param,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        app.globalData.air = res.data.HeWeather6[0].status == "unknown city" ? "" : res.data.HeWeather6[0].air_now_city;
        that.setData({
          air: app.globalData.air
        });
      }
    })
  },

 //获取头条
  clickTop:function(){
    this.setData({
      newsType: 'shehui',
      selectedState: [1, 0, 0, 0, 0]
    });
    this.getNews();
  },

//获取时尚新闻
  clickFashion:function(){
    this.setData({
      newsType: 'shishang',
      selectedState: [0, 1, 0, 0, 0]
    });
    this.getNews();
  },
  //获取科技新闻
  clickTech: function () {
    this.setData({
      newsType: 'keji',
      selectedState: [0,0,1, 0, 0]
    });
    this.getNews();
  },
  //获取财经新闻
  clickEcon: function () {
    this.setData({
      newsType: 'caijing',
      selectedState: [0, 0, 0, 1, 0]
    });
    this.getNews();
  },
  //获取体育新闻
  clickSport: function () {
    this.setData({
      newsType: 'tiyu',
      selectedState: [0, 0, 0, 0, 1]
    });
    this.getNews();
  },


  //获取新闻信息
  getNews:function(){
    var that = this;
    wx.request({
      url: app.globalData.juhetoutiaoBase,
      data: {
        type: this.data.newsType,
        key: app.globalData.juhetoutiaoKey
      },
      header: {
        'Content-Type': 'application.json'
      },
      success: function (res) {
        console.log(res.data.result)
        wx.hideLoading();
        if (res.data.error_code == 0) {
          that.setData({
            topNews: res.data.result.data
          })
        } else {
          wx.showToast({
            title: '网络异常,获取新闻失败',
            icon: 'none',
            duration: 2000
          })
          console.log("接口数据获取失败")
        }
      }
    })
  },

  //点击新闻详情给友好提示
  hrefToLink:function(){
    wx.showModal({
      title: '友好提醒',
      content: '新闻详情正在思考怎么搞ing🙄',
      success:function(res){
        if(res.confirm){
          wx.showToast({
            title: "谢谢支持",
            duration: 1000,
            icon: "success"
          })
        }else if(res.cancel){
          wx.showToast({
            title: '欢迎贡献力量😘',
            duration:1000,
            icon:"none"
          })
        }
      }
    })
  },
  //点击切换定位
  jumpChangeCity:function(){
    wx.reLaunch({
      url: '../switchcity/switchcity'
    })
  },
  //点击查看天气详情
  jumpFutureWeather:function(){
    wx.navigateTo({
      url: '../weather/weather',
    })

  },
  // 用户点击右上角分享
  onShareAppMessage: function () {
    return {
      title: '',
      desc: '',
      success: function (res) {
        wx.showToast({
          title: "分享成功",
          duration: 1000,
          icon: "success"
        })
      }
    }
  }


})