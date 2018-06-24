//index.js
//获取应用实例
const app = getApp();
let pray = require('../../utils/PrayTimes.js');
let prayTimes = pray.prayTimes;
var Hijri = require('../../utils/Hijri.js');
var HijriJS = Hijri.HijriJS;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    today: null,
    address: null,
    monthTimes: null,
    date: null,
    array: ['北美伊斯兰协会', '世界穆斯林联盟', '埃及调查总局', '麦加乌姆埃尔古拉大学', '卡拉奇伊斯兰科技大学'],
    index: 0,
    method: 'ISNA',
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '礼拜时间查询',
      path: '/pages/month/month',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }, 

  getDateInfo: function (date) {
    //var date = new Date()
    //周几
    let year = date.getFullYear() + "年";
    let 　month = date.getMonth() +1+ "月";
    let dateStr = year+month;

    return dateStr;
  },

  addmonth: function(){
    let date = this.data.date;

    date.setMonth(date.getMonth()+1);
    let dateStr = this.getDateInfo(date);

    let method = this.data.method;
    this.getMonthlyTimes(date, method);
    this.setData({
      date: date,
      dateStr: dateStr
    }); 


  }
,
  minusMonth: function () {
    console.log("minus montg")
    let date = this.data.date;

    date.setMonth(date.getMonth()-1);
    let dateStr = this.getDateInfo(date);
    let method = this.data.method;
    this.getMonthlyTimes(date, method);

    this.setData({
      date: date,
      dateStr: dateStr
    });



  }
,

getMonthlyTimes: function(date, method){

let hijriDates = [];

console.log("getMonthlyTimes:"+date);
  let tYear = date.getFullYear();
  let tMonth = date.getMonth();
  let day = 1;
  let startDate = new Date(date.getFullYear(), date.getMonth(), day);
  let endDate = new Date(date.getFullYear(), date.getMonth()+1, 1);
  console.log("getMonthlyTimes:" + date);

  let monthTimes = new Array();
  let latitude = app.globalData.latitude;
  let longitude = app.globalData.longitude;
  prayTimes.setMethod(method);
  
  while (startDate < endDate) {
    let times = prayTimes.getTimes(startDate, [latitude, longitude], 'auto');
    monthTimes.push(times);
    let hDate = HijriJS.gregorianToHijri(tYear, tMonth+1, day);
    hijriDates.push(hDate);

    day++;
    startDate.setDate(day);
  //跳出循环时，date已经表为了下一个月
  }
  console.log("getMonthlyTimes:" + date);
  this.setData({
    monthTimes: monthTimes,
    hijriDates: hijriDates
  });
 console.log(monthTimes);
 console.log(hijriDates);
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
          console.log("address:" + address);
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



      if (app.globalData.latitude == null || app.globalData.longitude==null ){
        app.globalData.latitude = latitude;
        app.globalData.longitude = longitude;
      }

    }
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    if (app.globalData.address==null){
      this.getLocationInfo();
    }
    let address = app.globalData.address
    this.setData({
      address
    });

    let date = new Date();
    let today = date.getDate();
    this.setData({
        today
    });

    console.log("onload:"+date);
    date.setDate(1);

    let dateStr = this.getDateInfo(date);
    this.setData({
      date: date,
      dateStr: dateStr,
    });

    this.getMonthlyTimes(date);

    // let day = 1;
    // date.setDate(day);
    // let nextmonth = date.getMonth() + 1;


    // let monthTimes = new Array();
    // let latitude = app.globalData.latitude;
    // let longitude = app.globalData.longitude;
    // prayTimes.setMethod("ISNA");

    // while(date.getMonth()<nextmonth){
    //   let times = prayTimes.getTimes(date, [latitude, longitude], 'auto');
    //   monthTimes.push(times);
    //   day++;
    //   date.setDate(day);

    // }

    // this.setData({
    //   monthTimes: monthTimes
    // });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {


  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})