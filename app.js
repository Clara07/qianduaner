//app.js
App({
  onLaunch: function() {},
  globalData: {
    userInfo:null,
    defaultCity: '',
    defaultCounty: '',
    weatherData: '',
    air: '',
    day: '',
    g_isPlayingMusic: false,
    g_currentMusicPostId: null,
    doubanBase: "https://douban.uieee.com",
    heWeatherBase: "https://free-api.heweather.com",
    juhetoutiaoBase: "https://v.juhe.cn/toutiao/index",
    bMapBase:"https://api.map.baidu.com",
    bMapKey:"aSGhaXHzGUEIjNzVVZZmAWbP2O8Q3aTf",
    kuaidiBase:"https://www.kuaidi100.com/query",
    kuaidiKey:"",
    dictBase:"https://api.shanbay.com/bdc/search/",
    dictExamBase:"https://api.shanbay.com/bdc/example/",
    tencentMapKey: "4HYBZ-EB23D-SLC42-HQ5R3-LP3LQ-OZFU5",
    heWeatherKey: "4a817b4338e04cc59bdb92da7771411e",
    juhetoutiaoKey: "7759f39a6aa8a93cb80e067ad64f0155",
    curBook: "",
  },
})