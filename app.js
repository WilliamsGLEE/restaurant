//app.js
App({
  checkMobile:function(mobile){
    
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (mobile.length == 0) {
      console.log('dfadsfa');
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
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
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
          url: 'https://mobile.littlehotspot.com/smalldinnerapp/user/getOpenid',
          data: {
            "code": code
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {

            that.globalData.openid = res.data.result.openid;
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
    box_mac: '',
    mobile_brand: '',
    mobile_model: '',
  }
})