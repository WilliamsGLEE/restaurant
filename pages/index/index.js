//index.js
//获取应用实例
const app = getApp()
var api_url = app.globalData.api_url;
var cache_key = app.globalData.cache_key; 
var openid;
var box_mac;
var is_view_wifi = 0;
var wifi_password;
var intranet_ip;
var wifi_name;
var wifi_mac;
var use_wifi_password;
var forscreen_type;
var common_appid = app.globalData.common_appid;
Page({
  data: {
    array: ['美国', '中国', '巴西', '日本'], index: 0,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    is_link: 0,     //是否连接酒楼
    is_link_wifi: 0, //是否连接wifi
    is_view_link: 0,
    hotel_name: '',
    room_name: '',
    box_mac: '',
    wifi_mac: '',
    wifi_name: '',
    wifi_password: '',
    hiddens: true,

    showRetryModal: true, //连接WIFI重试弹窗
    bdShowModal:true,    //邀请码酒楼和绑定酒楼不一致
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showHotelErr:false,
  },
  
  onLoad: function(res) {
    var that = this;
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    var hotel_id = user_info.hotel_id;
    var openid = user_info.openid;
    that.setData({
      common_appid: common_appid,
    })
    
    //box_mac = '00226D655202';  //***************************上线去掉 */
    //box_mac = '00226D583D92';    //兜率宫
    //box_mac = '00226D5845CE';   //4G监测
    if (user_info.is_login!=1 || user_info.is_wx_auth !=3){
      wx.reLaunch({
        url: '/pages/user/login',
      })
      
    }else if(user_info.hotel_id=='' || typeof(user_info.hotel_id)=='undefined'){
      wx.removeStorageSync(cache_key+'userinfo');
      that.setData({
        showHotelErr:true
      })
    }
    else {
      var hotel_id = user_info.hotel_id;
      //获取酒楼包间列表
      wx.request({
        url: api_url +'/Smalldinnerapp11/Stb/getBoxList',
        header: {
          'content-type': 'application/json'
        },
        data: {
          hotel_id: hotel_id,
        },
        success:function(res){
          if(res.data.code==10000){
            that.setData({
              objectBoxArray:res.data.result
            })
          }
        }
      })
    }
  },
  
  //选择包间
  boxPickerChange(res) {

    var that = this;
    var boxIndex = res.detail.value;
    var box_list = that.data.objectBoxArray;

    var box_mac = box_list[boxIndex].box_mac;
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    user_info.box_mac = box_mac;
    user_info.box_index = boxIndex;
    wx.setStorage({
      key: cache_key + "userinfo",
      data: user_info,
    })

    that.setData({
      boxIndex: boxIndex,
      box_mac: box_mac,
    })
  },
  chooseImage: function (res) {
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    var mobile = user_info.mobile;
    var box_mac = user_info.box_mac;
    if (box_mac == '' || box_mac == undefined) {

      wx.showToast({
        title: '请选择包间电视',
        icon: 'none',
        duration: 2000
      });
    } else {
      wx.request({
        url: 'https://mobile.littlehotspot.com/Smalldinnerapp/user/checkuser',
        headers: {
          'Content-Type': 'application/json'
        },
        method: "POST",
        data: {
          mobile: mobile
        },
        success: function (res) {
          if (res.data.code == 10000) {
            wx.navigateTo({
              url: '/pages/launch/picture/index',
            })
          } else {
            wx.showToast({
              title: '邀请码已失效',
              icon: 'none',
              duration: 2000
            });
            wx.removeStorageSync(cache_key + "userinfo");
            wx.navigateTo({
              url: '/pages/user/login',
            })
          }

        }
      })

    }
  },
  chooseVideo: function (res) {
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    var mobile = user_info.mobile;
    var box_mac = user_info.box_mac;
    if (box_mac == '' || box_mac == undefined) {
      wx.showToast({
        title: '请选择包间电视',
        icon: 'none',
        duration: 2000
      });
    } else {
      wx.request({
        url: 'https://mobile.littlehotspot.com/Smalldinnerapp/user/checkuser',
        headers: {
          'Content-Type': 'application/json'
        },
        method: "POST",
        data: {
          mobile: mobile
        },
        success: function (res) {
          if (res.data.code == 10000) {
            wx.navigateTo({
              url: '/pages/launch/video/index',
            })
          } else {
            wx.showToast({
              title: '邀请码已失效',
              icon: 'none',
              duration: 2000
            });
            wx.removeStorageSync(cache_key + "userinfo");
            wx.navigateTo({
              url: '/pages/user/login',
            })
          }
        }
      })
    }
  },
  exitForscreen(e) {
    var that = this;
    var openid = e.currentTarget.dataset.openid;
    var box_mac = e.currentTarget.dataset.box_mac;
    var timestamp = (new Date()).valueOf();
    wx.request({
      url: 'https://mobile.littlehotspot.com/Netty/Index/index',
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      data: {
        box_mac: box_mac,
        msg: '{ "action": 3,"openid":"' + openid + '"}',
      },
      success: function (res) {
        wx.showToast({
          title: '退出成功',
          icon: 'none',
          duration: 2000
        });
      },
      fail: function (res) {
        wx.showToast({
          title: '网络异常，退出失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },//退出投屏结束
  changeVolume: function (e) {//更改音量
    var box_mac = e.target.dataset.box_mac;
    var change_type = e.target.dataset.change_type;
    var timestamp = (new Date()).valueOf();
    wx.request({
      url: 'https://mobile.littlehotspot.com/Netty/Index/index',
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      data: {
        box_mac: box_mac,
        msg: '{"action":31,"change_type":' + change_type + '}',
      },
    })
  },
  gotodownload:function(res){
    var that = this;
    that.setData({
      download_disable:true,
    })
    wx.navigateTo({
      url: '/pages/download/index',
      success:function(){
        that.setData({
          download_disable: false,
        })
      }
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      is_link: 1,
      index: e.detail.value
    })
  }
})