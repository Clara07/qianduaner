//获取应用实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectData: {
        "圆通":"yuantong",
        "中通": "zhongtong",
        "韵达": "yunda",
        "百世汇通": "huitongkuaidi",
        "申通": "shentong",
        "顺丰": "shunfeng",
        "EMS": "ems",
        "天天": "tiantian",
        "全峰": "quanfengkuaidi",
        "京东": "jd",
        "苏宁": "suning",
        "日日顺物流":"rrs"
    },
    arry:[],
    einputinfo: null,//输入框值
    expressInfo: null, //快递信息
    show: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    kdname: "--请选择--",//下拉列表显示名称
    kdvalue:''//下拉列表对应的值
  },
  // 点击下拉显示框
  selectTap() {
    this.setData({
      show: !this.data.show
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let kdName = e.currentTarget.dataset.key;//获取点击的下拉列表的名称
    let kdValue = e.currentTarget.dataset.value;//获取点击的下拉列表的值
    this.setData({
      kdname: kdName,
      kdvalue: kdValue,
      show: !this.data.show
    });
    // console.log(this.data.kdname);
    // console.log(this.data.kdvalue);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var arry = this.data.arry;
    var selectData = this.data.selectData;
    for (var i in selectData){
      //console.log(i + selectData[i])
      arry.push(i)
    }
    // console.log(selectData);
    // console.log(arry);
    // console.log(arry.length);
  },
  //快递输入框事件
  input: function (e) {
    this.setData({ einputinfo: e.detail.value });
  },
  //快递查询事件
  btnClick: function () {
    let that = this;
    that.getKuaidiInfo();
  },
  getKuaidiInfo:function(){
    let that = this;
    let com = that.data.kdvalue;//快递公司
    let nu = that.data.einputinfo;//快递单号
    if(com===null || com==='' || com==="undefined"){
      wx.showToast({
        title: '快递公司不能为空!',
        icon:'none',
        duration: 1500
      });
      return;
    }
    if (nu === null || nu === '' || nu === "undefined") {
      wx.showToast({
        title: '快递单号不能为空!',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    if(isNaN(nu)){
      wx.showToast({
        title: '快递单号格式不正确!',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    wx.showLoading({
      title: '加载中',
    }),
    wx.request({
      url: app.globalData.kuaidiBase,
      data:{
        "type": com,
        "postid":nu
      },
      success:function(res){
        //console.log(res.data)
        wx.hideLoading();
        if (res.data.message == "ok" && res.data.ischeck=="1"){
         // console.log("--success--")
          that.setData({
            expressInfo:res.data.data
          });
         // console.log(that.data.expressInfo);
        }else{
          that.setData({
            expressInfo: [
              { "context": "暂无该单号信息" }
            ]
          });
        }
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '小C快递工具',
      desc: '',
      success: function (res) {
        wx.showToast({
          title: '分享成功,谢谢支持😘',
          duration: 1000,
          icon: "none"
        })
      }
    }
  }
})