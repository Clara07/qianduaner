var app = getApp();
var util = require('../../utils/cityutil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      '../../images/bg/bg-003.jpg',
      '../../images/bg/bg-011.jpg',
      '../../images/bg/bg-016.jpg',
      '../../images/bg/bg-017.jpg'
    ],
    kejiNews:[],
    newsType:'keji',
  },

  onLoad: function (options) {
    var that = this;
    var sixNews=[];
    //更新当前日期
    app.globalData.day = util.formatTime(new Date()).split(' ')[0];
    this.setData({
      today: app.globalData.day
    });
    wx.showLoading({
      title: '加载中',
    }),
    //初始化加载科技类新闻 --调用聚合数据头条新闻接口
    wx.request({
      url: app.globalData.juhetoutiaoBase,
      data:{
        type:'keji',
        key: app.globalData.juhetoutiaoKey
      },
      header:{
        'Content-Type':'application.json'
      },
      success:function(res){
        wx.hideLoading();
        if (res.data.error_code == 0){
          sixNews = res.data.result.data.slice(0,6);//获取返回数据的前6条在首页展示
         // console.log(sixNews);
          that.setData({
            kejiNews: sixNews
          })
        }else{
          wx.showToast({
            title: '网络异常,获取新闻失败',
            icon: 'none',
            duration: 2000
          })
         // console.log("接口数据获取失败")
        }
      }
    })
  },
  //点击首页详情跳转
  hrefToLink:function(){
   wx.showToast({
     title: '一个小程序中只能放置一个 web-view插件来跳转外部链接,ε=(´ο｀*)))唉',
     icon:'none',
     duration:2000
   })
  },

  //跳转到新闻界面
  jumpToNews:function(event){
    wx.switchTab({
      url: '../news/news'
    })
  },

  // 用户点击右上角分享
  onShareAppMessage: function () {
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