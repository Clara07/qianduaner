/*百度地图调用 */
var app = getApp();
let bmap = require('../../libs/bmap-wx.min.js');
let wxMarkerData = [];
Page({
  data: {
    markers: [],
    latitude: '',
    longitude: '',
    placeData: '',
    sugData: '',
    sugDataList: [],
    region: '',
    fail: '',
    success: '',
    myBMap: '',
    queryMethod: '美食',
    selectedState: [1, 0, 0, 0, 0],
    isShow: true,
    isShowList: false,
    isShowMap: true
  },
  // Do some initialize when page load.
  onLoad: function() {
    let that = this;
    //定位到当前城市
    that.getLocation();
    let BMap = new bmap.BMapWX({
      ak: 'aSGhaXHzGUEIjNzVVZZmAWbP2O8Q3aTf'
    });
    that.setData({
      myBMap: BMap
    })
    let fail = function(data) {
      console.log(data);
      console.log('----fail----')
    }
    let success = function(data) {
      wx.hideLoading();
     // console.log(data);
      console.log('----success----')
      wxMarkerData = data.wxMarkerData;
      // console.log(wxMarkerData)
      that.setData({
          markers: wxMarkerData,
          fail: fail
        }),
        that.setData({
          latitude: wxMarkerData[0].latitude
        });
      that.setData({
        longitude: wxMarkerData[0].longitude
      });
    }
    that.setData({
      success: success
    })
  },
  //定位到当前城市
  getLocation: function() {
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        let latitude = res.latitude;
        let longitude = res.longitude;
        wx.request({
          url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${app.globalData.tencentMapKey}`,
          success: res => {
            app.globalData.defaultCity = app.globalData.defaultCity ? app.globalData.defaultCity : res.data.result.ad_info.city;
            app.globalData.defaultCounty = app.globalData.defaultCounty ? app.globalData.defaultCounty : res.data.result.ad_info.district;
            that.setData({
              region: app.globalData.defaultCity,
              placeData:{
                title: (res.data.result.address ? res.data.result.address :'欢迎体验小程序版的地图功能 o(*￣︶￣*)o')+'\n',
                address: res.data.result.formatted_addresses.recommend
              }
            });
          }
        })
      },
    })
  },
  //点击标注时执行事件
  makertap: function(e) {
    let that = this;
    let id = e.markerId;
    that.showSearchInfo(wxMarkerData, id);
    that.changeMarkerColor(wxMarkerData, id);
  },

  //点击marker时,显示周边美食信息
  showSearchInfo: function(data, i) {
    let that = this;
    that.setData({
      placeData: {
        title: (data[i].title != undefined ? data[i].title : data[i].desc) + '\n',
        address: (data[i].address != undefined ? data[i].address : '--') + '\n',
        telephone: (data[i].telephone != undefined ? data[i].telephone : data[i].business)
      },
      isShow: true
    });
  },

  //点击marker时,变更marker的颜色
  changeMarkerColor: function(data, id) {
    let that = this;
    let markersTemp = [];
    for (var i = 0; i < data.length; i++) {
      if (i === id) {
        data[i].iconPath = "../../images/icon/marker_orange.png"
      } else {
        data[i].iconPath = "../../images/icon/marker_pink.png"
      }
      markersTemp[i] = data[i]
    }
    that.setData({
      markers: markersTemp
    })
  },
  //绑定input输入事件
  bindKeyInput: function(e) {
    let that = this;
    let fail = function(data) {
      console.log(data);
    };
    let success = function(data) {
      let sugDataList = data.result ? data.result : [];
      that.setData({
        sugDataList: sugDataList,
        isShowList: true,
        isShow: false,
        isShowMap: false
      });
    }
    this.data.myBMap.suggestion({
      query: e.detail.value,
      region: this.data.region,
      city_limit: true,
      fail: fail,
      success: success
    })
  },
  //绑定鼠标移出事件
  bindBlurInput: function(e) {
    let that = this;
    that.setData({
      isShowList: false,
      isShowMap: true
    })
  },
  //显示搜索的地点位置信息
  onLocTap: function(e) {
    let that = this;
    let locDataset = e.currentTarget.dataset;
    let locLat = locDataset.lat;
    let locLng = locDataset.lng;
    let locDatasetArray = [];
    //console.log(locDataset);
    //locDatasetArray.push(locDataset);
    // console.log(locDatasetArray)
    // let success = function(data){
    //   console.log(data +'success')
    //   locDatasetArray = data.wxMarkerData;
    //   that.setData({
    //     markers: locDatasetArray
    //   });
    //   that.setData({
    //     latitude: locDatasetArray[0].lat
    //   });
    //   that.setData({
    //     longitude: locDatasetArray[0].lng
    //   })
    // };
    this.data.myBMap.regeocoding({
      fail: this.data.fail,
      success: this.data.success,
      location: locLat + ',' + locLng,
      iconPath: '../../images/icon/marker_pink.png',
      iconTapPath: '../../images/icon/marker_orange.png'
    });

  },
  //点击美食按钮
  clickFood: function() {
    let that = this;
    that.setData({
      queryMethod: '美食',
      selectedState: [1, 0, 0, 0, 0],
      isShow: false
    });
    that.onShow();
  },
  //点击酒店
  clickHotel: function() {
    let that = this;
    that.setData({
      queryMethod: '酒店',
      selectedState: [0, 1, 0, 0, 0],
      isShow: false
    });
    that.onShow();
  },
  //点击银行
  clickBank: function() {
    let that = this;
    that.setData({
      queryMethod: '银行',
      selectedState: [0, 0, 1, 0, 0],
      isShow: false
    });
    that.onShow();

  },
  //点击公交站
  clickBus: function() {
    let that = this;
    that.setData({
      queryMethod: '公交站',
      selectedState: [0, 0, 0, 1, 0],
      isShow: false
    });
    that.onShow();
  },
  //点击生活服务
  clickLife: function() {
    let that = this;
    that.setData({
      queryMethod: '生活服务',
      selectedState: [0, 0, 0, 0, 1],
      isShow: false
    });
    that.onShow();
  },
  // Do something when page show.
  onShow: function() {
    wx.showLoading({
        title: '拼命加载中...',
      }),
      this.data.myBMap.search({
        "query": this.data.queryMethod,
        fail: this.data.fail,
        success: this.data.success,
        iconPath: '../../images/icon/marker_pink.png',
        iconTapPath: '../../images/icon/marker_orange.png'
      })
  },

  onShareAppMessage: function() {
    return {
      title: '',
      desc: '',
      success: function(res) {
        wx.showToast({
          title: "分享一款百度地图小程序",
          duration: 1000,
          icon: "success"
        })
      }
    }
  }
})