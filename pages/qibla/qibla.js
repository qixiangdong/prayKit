const app = getApp();

Page({
  data: {
    direction: '',
    angle: 0,
    rotate: '',
    dqibla: null,
  },
  //事件处理函数
  onLoad: function () {
    let latitude = app.globalData.latitude;
    let longitude = app.globalData.longitude;

    let dqibla = this.getQibla(latitude, longitude);
    if(dqibla<0){
      dqibla = dqibla+360;
    }
  this.setData({
    dqibla
  });



    // 罗盘Api
    var that = this;
    wx.onCompassChange(function (res) {
      // 罗盘数据保留两位小数
      var directions = res.direction.toFixed(2);
      var radios = res.direction.toFixed(0);
      var isShow = false;
      if (dqibla-3<directions&&directions<dqibla+3){
        isShow = true;
      }

      that.setData({
        angle: directions,
        rotate: 360 - radios,
        direction: check(radios),
        isShow: isShow
      })
    });
    // 判断手机是否有陀旋仪
    // 外部检测，如果没有陀旋仪数据，代码不会进入wx.onCompassChange
    // 必须使用setsetTimeout包裹代码，否则代码立即执行都会弹窗
    setTimeout(function () {
      if (that.data.direction == '--' && that.data.angle == '--') {
        wx.showToast({
          title: '您的手机没有电子罗盘或被禁用',
          icon: 'loading',
          duration: 5000,
          mask: true
        })
      }
    }, 3000);
    // 判断文字
    function check(i) {
      if (15 <= i && i <= 75) {
        return '东北'
      } else if (75 < i && i < 105) {
        return '正东'
      } else if (105 <= i && i <= 165) {
        return '东南'
      } else if (165 < i && i < 195) {
        return '正南'
      } else if (195 <= i && i <= 255) {
        return '西南'
      } else if (255 < i && i < 285) {
        return '正西'
      } else if (285 <= i && i <= 345) {
        return '西北'
      } else {
        return '正北'
      }
    }
  },

  getQibla(latitude, longitude){
    let phiK = 21.4 * Math.PI / 180.0;
    let lambdaK = 39.8 * Math.PI / 180.0;
    let phi = latitude * Math.PI / 180.0;
    let lambda = longitude * Math.PI / 180.0;
    let psi = 180.0 / Math.PI * Math.atan2(Math.sin(lambdaK - lambda), Math.cos(phi) *    Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda));
    return Math.round(psi);
  },

  // 设置页面分享
  onShareAppMessage: function () {
    return {
      title: '礼拜朝向',
      path: '/pages/qibla/qibla'
    }
  }
})