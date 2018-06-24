var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    tabs: ["关键词查询", "按章节查询"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    inputShowed: false,
    inputVal: "",
    itemsLan: [
      { name: 'zh.jian', value: '中文', checked: true },
      { name: 'en.sahih', value: '英语' },
      { name: 'ar.muyassar', value: '阿语' }
    ],
    itemsWay: [
      { name: 'keyword', value: '关键词', checked: true },
      { name: 'ayah', value: '章节' },
    ]
    ,
    edition: 'zh.jian',
    count: 0,
    matches: {}
  }
  ,
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '古兰经查询',
      path: '/pages/search/search',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  //选择查询语言
  editionChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    let edition = e.detail.value;
    this.setData({
      edition: edition
    });
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputConfirm: function (e) {
    let keyword = e.detail.value;
    if (keyword === null || keyword===''){
      wx.showModal({
        content: '请输入查询内容',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
      return false;
    } 
 
    let edition = this.data.edition;
    console.log(keyword);

    wx.showToast({
      title: '数据查询中',
      icon: 'loading',
      duration: 2000
    });
    this.searchByKW(keyword, edition);
  },

  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    let chapter = e.detail.value.chapter;
    let ayah = e.detail.value.ayah;
    let numberStr = chapter+":"+ayah;
    let edition = this.data.edition;
    wx.showToast({
      title: '数据查询中',
      icon: 'loading',
      duration: 1000
    });
    this.searchByNumber(numberStr, edition);
  },

  formReset: function () {
    console.log('form发生了reset事件')
  },

  searchByNumber: function (numberStr, edition) {
    //章节：2:222

    /*
      zh.jian 马坚版中文
    en.asad Muhammad Asad's english translation
    ar.muyassar  King Fahad Quran Complex  法赫德国王古兰经印刷厂
    */
    let that = this;
    let url = 'https://api.quran.2muslim.org/ayah/' + numberStr + '/' + edition;

    wx.request({
      url: url, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data.data);

        let result = res.data.data;
          console.log(result);
        that.setData({
          result: result
        });

      }
    })

  },

  searchByKW: function (keyword, edition) {
    let that = this;
    let url = 'https://api.quran.2muslim.org/search/' + keyword + '/all/' + edition;

console.log(url);
    wx.request({
      url: url, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data.data);
        if (res.data.data) {
        let count = res.data.data.count;
        let matches = res.data.data.matches;
     
          that.setData({
            count: count,
            matches: matches,
            search: true
          });
        }else{
          console.log("search is error");
          wx.showToast({
            title: '数据查询出错，请重新输入',
            icon: 'none',
            duration: 3000
          });
        }

      }
    })
  },

  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
});