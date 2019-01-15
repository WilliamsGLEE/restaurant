// pages/user/login.js
const app = getApp()
var openid;
var sms_time_djs;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile:'',                //手机号
    invite_code:'',           //邀请码
    is_get_sms_code:0,        //是否显示获取手机验证码倒计时

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (app.globalData.openid && app.globalData.openid != '') {
      that.setData({
        openid: app.globalData.openid
      })
      openid = app.globalData.openid;
      
    } else {
      app.openidCallback = openid => {
        if (openid != '') {
          that.setData({
            openid: openid
          })
          openid = openid;
          
        }
      }
    }
  },
  //输入手机号失去焦点
  mobileOnInput:function(res){
    var that = this;
    var mobile = res.detail.value;
    that.setData({
      mobile: mobile
    }) 
  },
  //输入邀请码失去焦点
  inviteCodeOnInput:function(res){
    var that =this;
    var invite_code = res.detail.value;
    that.setData({
      invite_code:invite_code
    })
  },
  //获取手机验证码
  getSmsCode:function(res){
    var that = this;
    var mobile = res.target.dataset.mobile;
    var invite_code = res.target.dataset.invite_code;
    if(mobile==''){
      
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      });
      return ;
    }
    var is_mobile = app.checkMobile(mobile);
    if(!is_mobile){
      return ;
    }
    if(invite_code==''){
      
      wx.showToast({
        title: '请输入邀请码',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    wx.request({
      url: 'https://mobile.littlehotspot.com/Smalldinnerapp/sms/sendverifyCode',
      header: {
        'content-type': 'application/json'
      },
      data:{
        mobile:mobile,
        invite_code:invite_code,
      },
      success:function(res){
        
        
        if(res.data.code==10000){ //上线前更换
          sms_time_djs = 60
          that.setData({
            is_get_sms_code: 1,
            sms_time_djs: sms_time_djs
          })
          var timer8_0 = setInterval(function () {
            sms_time_djs -= 1;
            that.setData({
              sms_time_djs: sms_time_djs
            });
            if (sms_time_djs == 0) {
              that.setData({
                is_get_sms_code: 0,
              })
              clearInterval(timer8_0);
            }

          }, 1000);
          /*wx.setStorage({
            key: 'savor_user_info',
            data: { 'openid': openid,'hotel_id': 7 },
          })*/
        }else {
          var error_msg = res.data.msg;
          wx.showToast({
            title: error_msg,
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },
  doLogin:function(res){
    var that = this;
    var mobile = res.detail.value.mobile;
    var invite_code = res.detail.value.invite_code;
    var verify_code = res.detail.value.verify_code;
    var openid = res.detail.value.openid;
    var is_mobile = app.checkMobile(mobile);
    if(!is_mobile){
      return ;
    }
    if (mobile == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if(invite_code==''){
      wx.showToast({
        title: '请输入邀请码',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if (verify_code == '') {
      wx.showToast({
        title: '请输入手机验证码',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    wx.request({
      url: 'https://mobile.littlehotspot.com/Smalldinnerapp/login/login',
      header: {
        'content-type': 'application/json'
      },
      data: {
        mobile: mobile,
        invite_code: invite_code,
        verify_code: verify_code,
        openid:openid,
      },
      success:function(rt){
        if(rt.data.code==10000){
          wx.navigateTo({
            url: '/pages/index/index',
          })
          wx.setStorage({
            key: 'savor_user_info',
            data: { 'openid': openid, 'hotel_id': rt.data.result.hotel_id },
          })
        }else {
          wx.showToast({
            title: rt.data.msg,
            icon: 'none',
            duration: 2000
          });
        }
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