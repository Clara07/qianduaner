//pages/welcome/welcome.js
//获取应用实例
const app = getApp()


Page({
  data: {
    userinfo: {},
    hasUserInfo:false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  clickGo: function() {
    wx.reLaunch({
      url: '../index/index',
    });
  },
  onShareAppMessage: function() {
    return {
      title: 'Clara G',
      desc: '不看看就分享?o(*￣︶￣*)o',
      success: function(res) {
        wx.showToast({
          title: '分享成功',
          duration: 1000,
          icon: "success"
        })
      }
    }
  },
  bindViewTap:function(){
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad:function(){
    if(app.globalData.userinfo){
      this.setData({
        userInfo:app.globalData.userinfo,
        hasUserInfo:true
      })
    }else if(this.data.canIUse){
       // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
       // 所以此处加入 callback 以防止这种情况'
      app.userInfoReadyCallback=res =>{
        this.setData({
          userInfo:res.userInfo,
          hasUserInfo:true
        });
      }
    }else{
      wx.getUserInfo({
        success:res=>{
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo:res.userInfo,
            hasUserInfo:true
          })
        }
      })

    }
  },
  getUserInfo:function(e){
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})