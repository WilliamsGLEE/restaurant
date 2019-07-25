//app.js
App({
  connectHotelwifi: function (box_mac,openid, wifi_mac, wifi_name, use_wifi_password, intranet_ip, that, jump_url = '', forscreen_type = 0) {
    if (wifi_mac == '') {//如果后台未填写wifi_mac  获取wifi列表自动链接
      wx.startWifi({
        success: function (reswifi) {
          wx.getWifiList({
            success: function (et) {
              wx.onGetWifiList(function (ret) {
                var wifilist = ret.wifiList;
                for (var i = 0; i < ret.wifiList.length; i++) {
                  if (wifi_name == wifilist[i]['SSID']) {
                    wx.connectWifi({
                      SSID: wifilist[i]['SSID'],
                      BSSID: wifilist[i]['BSSID'],
                      password: use_wifi_password,
                      success: function (ressuc) {
                        that.setData({
                          is_link_wifi: 1,
                          hiddens: true,
                        })
                      },
                      fail: function (resfail) {
                        that.setData({
                          is_link_wifi: 0,
                        })
                      }
                    })
                    break;
                  }
                }
              })
            }
          })
        }
      })
    } else {//如果后台填写了wifi_mac直接链接
      wx.startWifi({
        success: function (rts) {

          wx.connectWifi({
            SSID: wifi_name,
            BSSID: wifi_mac,
            password: use_wifi_password,
            success: function (reswifi) {

              if (reswifi.errCode == 12006) {

                wx.showToast({
                  title: 'wifi链接失败或您的手机未打开GPS定位',
                  icon: 'none',

                  duration: 5000,

                })
                that.setData({
                  hiddens: true,
                  img_disable: false,
                  video_disable: false,
                  birthday_disable: false,
                  showRetryModal: true,
                })

              } else if (reswifi == 'getConnectedWifi erro') {
                wx.showToast({
                  title: '请打开您的wifi',
                  icon: 'none',
                  duration: 2000
                });
                that.setData({
                  hiddens: true,
                  img_disable: false,
                  video_disable: false,
                  birthday_disable: false,
                  showRetryModal: true,
                })
              }
              else {
                wx.getConnectedWifi({
                  success: function (scres) {
                    if (scres.wifi.SSID == wifi_name) {//如果当前连接wifi正确
                      wx.setStorageSync('savor_link_box_mac', box_mac);
                      if (forscreen_type == 0) {
                        wx.showToast({
                          title: 'wifi链接成功',
                          icon: 'none',
                          duration: 5000
                        });
                      }

                      if (jump_url != '') {
                        wx.navigateTo({
                          url: jump_url,
                        })
                        if (forscreen_type == 1) {//图片投屏
                          that.setData({
                            img_disable: false,
                            video_disable: false,
                            birthday_disable: false,
                            hiddens: true,
                            is_link_wifi: 1,
                          })
                        } else if (forscreen_type == 2) {//视频投屏
                          that.setData({
                            img_disable: false,
                            video_disable: false,
                            birthday_disable: false,
                            hiddens: true,
                            is_link_wifi: 1,
                          })
                        } else if (forscreen_type == 3) {  //生日歌点播
                          that.setData({
                            img_disable: false,
                            video_disable: false,
                            birthday_disable: false,
                            hiddens: true,
                            is_link_wifi: 1,
                          })
                        } else {  //首页加载
                          that.setData({
                            is_link_wifi: 1,
                            hiddens: true,
                            img_disable: false,
                            video_disable: false,
                            birthday_disable: false,
                            showRetryModal: false, //连接WIFI重试弹窗
                          })
                        }

                      } else {    //首页加载
                        that.setData({
                          is_link_wifi: 1,
                          hiddens: true,
                          img_disable: false,
                          video_disable: false,
                          birthday_disable: false,
                          showRetryModal: false, //连接WIFI重试弹窗
                        })
                      }
                      

                    } else { //当前连接的wifi不是当前包间wifi

                      that.setData({

                        hiddens: true,
                        img_disable: false,
                        video_disable: false,
                        birthday_disable: false,
                        showRetryModal: true,
                      })
                    }
                  }, fail: function (res) {
                    that.setData({
                      hiddens: true,
                      img_disable: false,
                      video_disable: false,
                      birthday_disable: false,
                      showRetryModal: true,
                    })
                  }
                })
              }

            },
            fail: function (resfail) {
              that.setData({
                hiddens: true,
                img_disable: false,
                video_disable: false,
                birthday_disable: false,
                showRetryModal: true,
              })
            }
          })
        },
        fail: function (res) {
          wx.showToast({
            title: '请打开您的wifi',
            icon: 'none',
            duration: 2000
          });
          that.setData({
            hiddens: true,
            img_disable: false,
            video_disable: false,
            birthday_disable: false,
            showRetryModal: true,
          })
        }
      })
    }
  },
  checkMobile:function(mobile){
    
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (mobile.length == 0) {
      
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else if (mobile.length < 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else if (!myreg.test(mobile)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
      return false;
    } 
    return true;
  },
  onLaunch: function () {
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新打开',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }



    var that = this
    wx.login({
      success: res => {
        var code = res.code; //返回code
        wx.request({
          url: that.globalData.api_url+'/smalldinnerapp/user/getOpenid',
          data: {
            "code": code
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {

            that.globalData.openid = res.data.result.openid;
            that.globalData.session_key = res.data.result.session_key;
            if (that.openidCallback) {
              that.openidCallback(res.data.result.openid);
            }
          }
        })
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.mobile_brand = res.brand;
        that.globalData.mobile_model = res.model;
      }
    })
  },
  globalData: {
    openid: '',
    session_key:'',
    box_mac: '',
    mobile_brand: '',
    mobile_model: '',
    api_url:'https://mobile.littlehotspot.com',
    oss_upload_url: 'https://image.littlehotspot.com',
    oss_url: 'https://oss.littlehotspot.com',
    cache_key:'savor:dinners:',
    common_appid:'wxfdf0346934bb672f',
    box_type:0,
    is_zhilian:1,
  }
})