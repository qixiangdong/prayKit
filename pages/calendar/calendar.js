

var ccFile = require('../../utils/calendar-converter.js');
var Hijri = require('../../utils/Hijri.js');
console.log(Hijri);
var calendarConverter = new ccFile.CalendarConverter();
var HijriJS = Hijri.HijriJS;


//月份天数表
var DAY_OF_MONTH = [
    [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
];

//判断当前年是否闰年
var isLeapYear = function(year){
    if (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0))
        return 1
    else
        return 0
};

//获取当月有多少天
var getDayCount = function(year, month){
    return DAY_OF_MONTH[isLeapYear(year)][month];
};

//获取当前索引下是几号
var getDay = function(index) {
    return index - curDayOffset;
};

var pageData = {
  offset: null, //一个月的第一天是周几
    date: "",                //当前日期字符串
    //arr数据是与索引对应的数据信息
    hijriDays: [], //伊历日期
    arrIsShow: [],          //是否显示此日期
    arrDays: [],            //关于几号的信息
    arrDaysShow: [],       //显示公历节假日信息
    choosed: [],
    arrInfoEx: [],          //农历节假日等扩展信息
    arrInfoExShow: [],      //处理后用于显示的扩展信息

    //选择一天时显示的信息
    detailData: {
        curDay: "",         //detail中显示的日信息
        curInfo:"", //公历
        curInfo1: "",//农历
        curInfo2: "",//伊历
    }
    
}

//设置当前详细信息的索引，前台的详细信息会被更新
var setCurDetailIndex = function(index){
    var curEx = pageData.arrInfoEx[index+2];
    pageData.detailData.curDay = curEx.sDay;
    console.log(curEx);
    console.log(curEx.sYear+"年"+ curEx.sMonth+"月" + curEx.sDay+"日");
    pageData.detailData.curInfo = curEx.sYear + "年" + curEx.sMonth + "月" + curEx.sDay + "日";
    pageData.detailData.curInfo1 = "农历 " + curEx.cYear + "年"+ curEx.lunarMonth + "月" + curEx.lunarDay;
    pageData.detailData.curInfo2 = "伊历 "+curEx.hYear + "年" + curEx.hMonth + "月" + curEx.hDay + "日";

    console.log(curEx);
}

var hFestivals = new Array(
  "1/1*新年",
  "1/10*阿舒拉日",
  "2/1*二月",
  "3/1*三月",
  "4/1*四月",
  "5/1*五月",
  "6/1*六月",
  "7/1*七月",
  "8/1*八月",
  "9/1*入斋",
  "92/7*盖德尔",
  "10/1*开斋节",
  "11/1*11月",
  "12/1*12月",
  "12/8*朝觐",
  "12/9*阿拉法特",
  "12/10*古尔邦节"
);

var hijriFes = function(hMonth, hDay){
  let festival ="";
    hFestivals.map(function(value){
        let d = hMonth+'/'+hDay;
        let arr = value.split("*");
        if(arr[0]===d){
          festival=arr[1];
        }
    });

    return festival;

}


//刷新全部数据
var refreshPageData = function(year, month, day){

  pageData.choosed.fill(false);
    pageData.date = year+'年'+(month+1)+'月';

  let offset = new Date(year, month, 1).getDay();
    if(offset===0) offset=7;
    pageData.offset = offset;
    let dayCount = getDayCount(year, month);
    console.log(dayCount);
    for (let i = 0; i < dayCount; i++)
    {
      pageData.arrDays[i] = i+1;        
        var d = new Date(year, month, i+1);
        var dEx = calendarConverter.solar2lunar(d);

        pageData.arrInfoEx[i] = dEx;

        pageData.hijriDays[i] = HijriJS.gregorianToHijri(dEx.sYear, dEx.sMonth, dEx.sDay);
        dEx.hYear = pageData.hijriDays[i].hYear;
        dEx.hMonth = pageData.hijriDays[i].hMonth;
        dEx.hDay = pageData.hijriDays[i].hDay;
        dEx.hijriFestival = hijriFes(pageData.hijriDays[i].hMonth, pageData.hijriDays[i].hDay); //验证节日

        if ("" != dEx.hijriFestival) {
          pageData.hijriDays[i].hDay = dEx.hijriFestival;
        }

        if ("" != dEx.solarFestival) {
          pageData.arrDays[i] = dEx.solarFestival;
        }

        if ("" != dEx.lunarFestival)
        {
          pageData.arrInfoExShow[i] = dEx.lunarFestival;
        }
        else if ("初一" === dEx.lunarDay)
        {
          pageData.arrInfoExShow[i] = dEx.lunarMonth + "月";
        }
        else
        {
          pageData.arrInfoExShow[i] = dEx.lunarDay;
        }
    }

let todayDate = new Date();
if (month === todayDate.getMonth()){
  let td = todayDate.getDate();
  pageData.choosed[td+offset-2] = true;//控制被选中颜色
  console.log(pageData.choosed)
  }
   console.log(pageData.arrDays);
    setCurDetailIndex(day-2);
};

var curDate = new Date();
var curMonth = curDate.getMonth();
var curYear = curDate.getFullYear();
var curDay = curDate.getDate();
refreshPageData(curYear, curMonth, curDay-1);

Page({
    data: pageData,

    onLoad: function(options){
        
    },
    onShareAppMessage: function (res) {
      if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log(res.target)
      }
      return {
        title: '伊历查询',
        path: '/pages/calendar/calendar',
        success: function (res) {
          // 转发成功
        },
        fail: function (res) {
          // 转发失败
        }
      }
    }
    ,

    goToday: function(e){
        curDate = new Date();
        curMonth = curDate.getMonth();
        curYear = curDate.getFullYear();
        curDay = curDate.getDate();
        refreshPageData(curYear, curMonth, curDay-1);
        this.setData(pageData);
    },

    goLastMonth: function(e){
        if (0 == curMonth)
        {
            curMonth = 11;
            --curYear
        }
        else
        {
            --curMonth;
        }
        refreshPageData(curYear, curMonth, 0);
        this.setData(pageData);
    },

    goNextMonth: function(e){
        if (11 == curMonth)
        {
            curMonth = 0;
            ++curYear
        }
        else
        {
            ++curMonth;
        }
        refreshPageData(curYear, curMonth, 0);
        this.setData(pageData);
    },

    selectDay: function(e){
      setCurDetailIndex(e.currentTarget.dataset.dayIndex - pageData.offset-1);

        console.log(e.currentTarget.dataset.dayIndex);
        pageData.choosed.fill(false);
        pageData.choosed[e.currentTarget.dataset.dayIndex] = true;
        console.log(pageData.choosed[e.currentTarget.dataset.dayIndex]);

        this.setData(pageData);
        this.setData({
            detailData: pageData.detailData,
        })
    },

    bindDateChange: function(e){
        var arr = e.detail.value.split("-");
        refreshPageData(+arr[0], arr[1]-1, arr[2]-1);
        this.setData(pageData);
    },
});