//index.js
//获取应用实例
const app = getApp();
let pray = require('../../utils/PrayTimes.js');
let prayTimes = pray.prayTimes;
let DateFormat = require('../../utils/dateformat.js');
let dateformat = DateFormat.dateformat;
var qqmap = require('../../utils/qqmap-wx-jssdk.min.js');
var demo = new qqmap({
  key: '3E7BZ-JVUKF-GJZJZ-N56LP-675TV' // 必填
});

Page({
  data: {
    array: ['北美伊斯兰协会','世界穆斯林联盟', '埃及调查总局', '麦加乌姆埃尔古拉大学', '卡拉奇伊斯兰科技大学'],
    index: 0,
    method: 'ISNA',
    date: null,
    dateStr: {},
    hasLocation: false,
    times: {},
    address: {},
    pageID: 1
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '礼拜时间查询',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  addDate: function(){
    let date = this.data.date;
    date = dateformat.addDay(date, 1);
    let dateStr = this.getDateInfo(date);
    let method = this.data.method;
    let times = this.getPrayTimesByDate(date, method)
    this.setData({
      date: date,
      dateStr: dateStr,
      times: times
    });
  },

  minusDate: function(){
    let date = this.data.date;
    date = dateformat.minusDay(date, 1);
    let dateStr = this.getDateInfo(date);
    let method = this.data.method;
    let times = this.getPrayTimesByDate(date, method)
    this.setData({
      date: date,
      dateStr: dateStr,
      times: times
    });
  },

  redirectNewPage: function(){

    wx.navigateTo({
      url: '../month/month',
    })
  },

  onLoad: function () {

    let date = new Date();
    let dateStr = this.getDateInfo(date);
    this.setData({
      date: date,
      dateStr: dateStr
    });
    this.getLocationInfo();


    demo.getCityList({
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });

  },

  getPrayTimesByDate: function(date, method){
    let latitude = app.globalData.latitude;
    let longitude = app.globalData.longitude;
    prayTimes.setMethod(method);
    let times = prayTimes.getTimes(date, [latitude, longitude], 'auto');
    return times;
  }
  ,
  getDateInfo: function(date){
    //var date = new Date()
    //周几
    let week = dateformat.getWeek(date, 1)
    let year = date.getFullYear()+"年";
    let　month = date.getMonth()+1+"月";
    let day = date.getDate()+"日";
    let dateStr = month+day+"  "+ week;

    return dateStr;
  },
  //get user's location
  getLocationInfo: function () {
    let that = this;

    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        let latitude = res.latitude;
        let longitude = res.longitude;

//逆解析地址
        demo.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            console.log(res);
            let address = res.result.address;
            app.globalData.address = address;
            console.log("address:"+address);
            that.setData({
              address: address
            });
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            console.log(that.data.address)
          }
        });



        //let speed = res.speed
        //let accuracy = res.accuracy
        app.globalData.latitude = latitude;
        app.globalData.longitude = longitude;
        let date = new Date();
        let times = that.getPrayTimesByDate(date, 'ISNA');
        console.log(times);
        that.setData({
          times: times,
          date: date
        });
      }
    })
  },

  bindPickerChange: function (e) {
    let date = this.data.date;
    let method = 'ISNA';
    console.log(e.detail.value);
    switch (e.detail.value) {
      case '0':
        method = 'ISNA';
        break;
      case '1':
        method = 'MWL';
        break;
      case '2':
        method = 'Egypt';
        break;
      case '3':
        method = 'Makkah';
        break;
      case '4':
        method = 'Karachi';
        break;
    };
    let times = this.getPrayTimesByDate(date, method);

    console.log(method);

    console.log(times);
    
    this.setData({
      times: times,
      method: method,
      index: e.detail.value
    })
  },
  onShow: function(){
    },

    onReady: function(){
      
    }
})
