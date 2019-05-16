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
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  
  onLoad: function(res) {
    var that = this;
    
    box_mac  = res.box_mac;
    //box_mac = '00226D655202';  //***************************上线去掉 */
    //box_mac = '00226D583D92';    //兜率宫
    //box_mac = '00226D5845CE';   //4G监测
    var user_info = wx.getStorageSync(cache_key +"userinfo"); 
    var hotel_id   = user_info.hotel_id;
    var openid  = user_info.openid;
    that.setData({
      common_appid: common_appid,
    })
    if (user_info.is_login!=1 || user_info.is_wx_auth !=3){
      wx.reLaunch({
        url: '/pages/user/login?box_mac='+box_mac,
      })
      
    }else {
      if (typeof (box_mac) == 'undefined' ){
        that.setData({
          showModal:true
        })
      }else {
        that.setData({
          box_mac: box_mac,
          openid: openid,
          //hiddens: false,
        })
        wx.hideShareMenu();
        //获取酒楼包间名称
        wx.request({
          url: api_url + '/Smalldinnerapp11/Login/getBindHotelInfo',
          header: {
            'content-type': 'application/json'
          },
          data: {
            openid:openid,
            box_mac: box_mac,
          },
          success: function (res) {
            if (res.data.code == 10000) {
              if (res.data.result.bd_status==1){ //绑定正确
                that.setData({
                  hotel_name: res.data.result.hotel_name,
                  room_name: res.data.result.room_name
                })
                app.globalData.box_type = res.data.result.box_type;
                if(app.globalData.box_type==2){//二代网络机顶盒采用netty投屏
                  that.setData({
                    hiddens: true,
                    is_link: 1,
                  })

                }else {
                  that.setData({
                    hiddens: false,
                  })
                  //链接wifi开始
                  intranet_ip = res.data.result.intranet_ip;
                  wifi_name = res.data.result.wifi_name;
                  wifi_password = res.data.result.wifi_password;
                  use_wifi_password = wifi_password

                  if (wifi_name == '' || wifi_mac == '') {

                    that.setData({
                      hiddens: true,
                      showRetryModal: true
                    })
                  } else {
                    that.setData({
                      is_link: 1,
                    })
                    if (wifi_password == '') {
                      wifi_password = "未设置wifi密码";
                    }
                    wifi_mac = res.data.result.wifi_mac;

                    if (wifi_mac == '') {//如果后台未填写wifi_mac  获取wifi列表自动链接
                      that.setData({
                        hotel_name: res.data.result.hotel_name,
                        room_name: res.data.result.room_name,
                        wifi_name: wifi_name,
                        wifi_password: wifi_password,
                        use_wifi_password: use_wifi_password,
                        intranet_ip: intranet_ip,
                        openid: openid,
                      })
                    } else {//如果后台填写了wifi_mac直接链接
                      that.setData({
                        hotel_name: res.data.result.hotel_name,
                        room_name: res.data.result.room_name,
                        wifi_name: wifi_name,
                        wifi_password: wifi_password,
                        use_wifi_password: use_wifi_password,
                        intranet_ip: intranet_ip,
                        openid: openid
                      })

                      that.setData({
                        hiddens: false,
                      })
                      app.connectHotelwifi(openid, wifi_mac, wifi_name, use_wifi_password, intranet_ip, that)

                    }
                  }
                  //链接wifi结束
                }
                
              } else if(res.data.result.bd_status==-1) {//绑定不正确
                that.setData({
                  bdShowModal:true,
                  hiddens: true,
                  bd_hotel_name: res.data.result.hotel_name
                })
              } else if(res.data.result.bd_status==0){//未绑定
                that.setData({
                  hiddens:true
                })
                wx.removeStorage({
                  key: cache_key + "userinfo",
                  success(rest) {
                    
                  }
                })
                wx.reLaunch({
                  url: '/pages/user/login?box_mac=' + box_mac,
                })
              }
              
            }
          },
          fail: function (res) {
            that.setData({
              hiddens: true,
              showRetryModal: true
            })
          }
        })
      } 
    }
  },
  netRetry: function (res) {
    var that = this;
    that.setData({
      showRetryModal: false,
      hiddens: false,
    })
    if (wifi_name == '' || wifi_mac == '') {
      that.setData({
        showRetryModal: true,
      })
    } else {
      app.connectHotelwifi(openid, wifi_mac, wifi_name, use_wifi_password, intranet_ip, that, '', 0);
    }

  },
  chooseImage: function (res) {//点击事件
    var that = this;
   
    
    that.setData({
      img_disable: true,

    })
    var box_mac = res.currentTarget.dataset.boxmac;
    var openid = res.currentTarget.dataset.openid;
    if(app.globalData.box_type==2){
      var jump_url = '/pages/launch/picture/index?box_mac=' + box_mac + '&openid=' + openid + '&intranet_ip=';
      wx.navigateTo({
        url: jump_url,
      })
      that.setData({
        img_disable: false,
        video_disable: false,
        birthday_disable: false,
      })
    }else {
      wx.startWifi({
        success: function () {

          wx.getConnectedWifi({
            success: function (res) {

              var errCode = res.errCode;
              var ssid = res.wifi.SSID;
              var jump_url = '/pages/launch/picture/index?box_mac=' + box_mac + '&openid=' + openid + '&intranet_ip=' + intranet_ip;
              if (errCode == 0 && wifi_name == ssid) {

                wx.navigateTo({
                  url: jump_url,
                })
                that.setData({
                  img_disable: false,
                  video_disable: false,
                  birthday_disable: false,
                })
              } else {
                //连接当前wifi
                //连接成功后跳转

                app.connectHotelwifi(openid, wifi_mac, wifi_name, use_wifi_password, intranet_ip, that, jump_url, forscreen_type = 1);


              }
            },
            fail: function (res) {
              that.setData({
                hiddens: true,
                showRetryModal: true,
              })
              wx.showToast({
                title: '连接wifi错误',
                icon: 'none',
                duration: 2000
              })
              
              //console.log('getConnectedWifi erro');
            }
          })
        },
        fail: function (res) {
          that.setData({
            hiddens:true,
            showRetryModal:true,
          })
          wx.showToast({
            title: '请打开您的wifi',
            icon: 'none',
            duration: 2000
          })
          //console.log('not open wifi');
        }
      })
    }
  }, 
  chooseVideo:function(res){
    var that = this;
    
    
    that.setData({
      video_disable: true,

    })
    var box_mac = res.currentTarget.dataset.boxmac;
    var openid = res.currentTarget.dataset.openid;
    if(app.globalData.box_type==2){
      var jump_url = '/pages/launch/video/index?box_mac=' + box_mac + '&openid=' + openid + '&intranet_ip=';
      wx.navigateTo({
        url: jump_url,
      })
      that.setData({
        img_disable: false,
        video_disable: false,
        birthday_disable: false,
      })
    }else {
      wx.startWifi({
        success: function () {

          wx.getConnectedWifi({
            success: function (res) {

              var errCode = res.errCode;
              var ssid = res.wifi.SSID;
              var jump_url = '/pages/launch/video/index?box_mac=' + box_mac + '&openid=' + openid + '&intranet_ip=' + intranet_ip;
              if (errCode == 0 && wifi_name == ssid) {

                wx.navigateTo({
                  url: jump_url,
                })
                that.setData({
                  img_disable: false,
                  video_disable: false,
                  birthday_disable: false,
                })
              } else {
                //连接当前wifi
                //连接成功后跳转

                app.connectHotelwifi(openid, wifi_mac, wifi_name, use_wifi_password, intranet_ip, that, jump_url, forscreen_type = 2);


              }
            },
            fail: function (res) {
              that.setData({
                hiddens: true,
                showRetryModal: true,
              })
              wx.showToast({
                title: '连接wifi错误',
                icon: 'none',
                duration: 2000
              })
              //console.log('getConnectedWifi erro');
            }
          })
        },
        fail: function (res) {
          that.setData({
            hiddens: true,
            showRetryModal: true,
          })
          wx.showToast({
            title: '请打开您的wifi',
            icon: 'none',
            duration: 2000
          })
          //console.log('not open wifi');
        }
      })
    }

    
      
    
  },
  exitForscreen(e) {
    var that = this;
    var openid = e.currentTarget.dataset.openid;
    var box_mac = e.currentTarget.dataset.box_mac;
    var timestamp = (new Date()).valueOf();
    
    intranet_ip = e.currentTarget.dataset.intranet_ip;
    if(app.globalData.box_type==2){
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
    }else {
      wx.request({
        url: "http://" + intranet_ip + ":8080/h5/stop?deviceId=" + openid + "&web=true",
        success: function (res) {
          
          wx.showToast({
            title: '退出成功',
            icon: 'none',
            duration: 2000
          });
        },
        fail: function ({ errMsg }) {

          wx.showToast({
            title: '退出失败',
            icon: 'none',
            duration: 2000
          });
        },
      })
    }
    
  },//退出投屏结束
  changeVolume: function (e) {//更改音量
    var box_mac = e.target.dataset.box_mac;
    var change_type = e.target.dataset.change_type;
    var timestamp = (new Date()).valueOf();
   
    intranet_ip = e.target.dataset.intranet_ip;

    if(app.globalData.box_type==2){
      
      if (change_type == 3) change_type=1;
      if (change_type == 4) change_type =2;
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
    }else {
      var change_type_name = '';
      if (change_type == 3) {
        change_type_name = '减小音量'
      } else if (change_type == 4) {
        change_type_name = '增大音量'
      }
      wx.request({
        url: "http://" + intranet_ip + ":8080/volume?action=" + change_type + "&deviceId=" + openid + "&projectId=" + timestamp + "&web=true",
        success: function (res) {
          if (res.data.result == 0) {
            wx.showToast({
              title: change_type_name + '成功',
              icon: 'none',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '投屏过程中才可控制音量',
              icon: 'none',
              duration: 2000
            })
          }

        }, fail: function () {
          wx.showToast({
            title: '投屏过程中才可控制音量',
            icon: 'none',
            duration: 2000
          })
        }


      })
    }

    
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
  }
})