// pages/result/result.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '古兰经查询',
      path: '/pages/search/result',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let ayahNumber = options.number;
    let surah = options.surah;
    let numberinsurah = options.numberinsurah;
    this.setData({
      surah: surah,
      numberinsurah: numberinsurah
    });

    let that = this;
    let urlCh = 'https://api.quran.2muslim.org/ayah/' + ayahNumber + '/zh.jian';
    let urlEn = 'https://api.quran.2muslim.org/ayah/' + ayahNumber + '/en.sahih';
    let urlAr = 'https://api.quran.2muslim.org/ayah/' + ayahNumber + '/ar.muyassar';

    wx.request({
      url: urlCh, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log("Result:"+res.data.data);

        let result = res.data.data;
        console.log(result);
        that.setData({
          textCh: result.text
        });

      }
    })

    wx.request({
      url: urlEn, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log("Result:" + res.data.data);

        let result = res.data.data;
        console.log(result);
        that.setData({
          textEn: result.text
        });

      }
    })

    wx.request({
      url: urlAr, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log("Result:" + res.data.data);

        let result = res.data.data;
        console.log(result);
        that.setData({
          textAr: result.text
        });

      }
    })


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