//获取应用实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: "",
    sentext: "",
    senInfo:null,
    checkWord: null,
    isShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  wordInput: function(e) {
    this.setData({
      checkWord: e.detail.value
    });
  },

  //快递查询事件
  btnClick: function() {
    let that = this;
    that.getWordInfo();
  },

  //获取单词
  getWordInfo: function() {
    let that = this;
    let word = that.data.checkWord; //输入的单词
    if (word === null || word === '' || word === "undefined") {
      wx.showToast({
        title: '单词不能为空!',
        icon: 'none',
        duration: 1500
      });
      return;
    }

    wx.showLoading({
        title: '加载中',
      }),
      wx.request({
        url: app.globalData.dictBase,
        data: {
          word: word
        },
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          if (res.data.status_code==1){
            wx.hideLoading();
            wx.showToast({
              title:'只能查找单词哦,小C会继续努力哒😘',
              icon:'none',
              duration:2000
            })
            return;
          }
          if (res.data.msg == "SUCCESS" && res.data.status_code == 0) {
            that.setData({
              text: res.data.data.definition,
            });
             //获取单词例句
            wx.request({
              url: app.globalData.dictExamBase,
              data: {
                vocabulary_id: res.data.data.id,
                "type": "sys"
              },
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                wx.hideLoading();
                console.log(res.data.data)
                  that.setData({
                    senInfo: res.data.data,
                    isShow:true
                  });
              }
            })
          } else {
            that.setData({
              text: '查询不到这个单词'
            });
          }
        }
      });

  },

 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '小C单词工具',
      desc: '',
      success: function(res) {
        wx.showToast({
          title: '分享成功,谢谢支持😘',
          duration: 1000,
          icon: "none"
        })
      }
    }
  }
})