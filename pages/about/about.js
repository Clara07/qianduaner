//获取应用实例
const app = getApp();
Page({
  data:{

  },
  onLoad:function(){
    wx.showToast({
      title: '可以关注公众号哦😘',
      duration: 1000,
      icon: "none"
    })
  },
  //点击快递查询的方法
  onKuaidiTap:function(){
    wx.navigateTo({
      url: 'kuaidi/kuaidi',
    })
  },
  //点击字典查询的方法
  onDictionaryTap:function(){
    wx.navigateTo({
      url: 'dictionary/dictionary',
    })
  },
  //点击更多查询的跳转
  onMoreTap:function(){
    wx.navigateTo({
      url: 'gzhao/gzhao',
    })
  }
})