// pages/user/login.js
const app = getApp()
var openid;
var sms_time_djs;
var box_mac;
var api_url = app.globalData.api_url;
var cache_key = app.globalData.cache_key;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile:'',                //手机号
    invite_code:'',           //邀请码
    is_get_sms_code:0,        //是否显示获取手机验证码倒计时
    showModal:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    box_mac = options.box_mac;
    box_mac = '00226D655202';   //上线去掉******************************************************
    if (app.globalData.openid && app.globalData.openid != '') {
      that.setData({
        openid: app.globalData.openid
      })
      openid = app.globalData.openid;
      //判断用户是否注册
      userRegister(openid,box_mac);
    } else {
      app.openidCallback = openid => {
        if (openid != '') {
          that.setData({
            openid: openid
          })
          openid = openid;
          //判断用户是否注册
          userRegister(openid,box_mac);

        }
      }

    }
    
    //判断用户是否注册
    function userRegister(openid,box_mac){
      if(openid !='' && openid !=undefined){
        wx.request({
          url: api_url+'/Smalldinnerapp11/User/isRegister',
          header: {
            'content-type': 'application/json'
          },
          data: {
            openid: openid,
          },
          success: function (res) {
            if(res.data.code==10000){
              //res.data.result.userinfo.box_mac = box_mac;
              
              if (box_mac == undefined || box_mac == 'undefined') {//如果是从微信直接打开的小程序
                that.setData({
                  showModal: true,
                })
              } else {//如果是从其他小程序跳转过来的
                that.setData({
                  box_mac: box_mac,
                })
                //判断用户是否授权
               
                if (res.data.result.userinfo.is_wx_auth != 2) {
                  that.setData({
                    showWXAuthLogin: true
                  })
                  wx.setStorage({
                    key: cache_key + 'userinfo',
                    data: res.data.result.userinfo,
                  })
                } else {
                  if (res.data.result.userinfo.mobile != '') {
                    
                    res.data.result.userinfo.is_login = 1;
                    wx.setStorage({
                      key: cache_key + 'userinfo',
                      data: res.data.result.userinfo,
                    })
                    wx.reLaunch({
                      url: '/pages/index/index?box_mac=' + box_mac,
                    })
                  }else {
                    wx.setStorage({
                      key: cache_key + 'userinfo',
                      data: res.data.result.userinfo,
                    })
                  }
                  
                }


              }
            }
          }
        })
      }
      
    }
  },
  //微信用户授权登陆
  onGetUserInfo:function(res){
    var that = this;
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    openid = user_info.openid;
    if (res.detail.errMsg == 'getUserInfo:ok') {
      wx.request({
        url: api_url+'/Smalldinnerapp11/User/register',
        data: {
          'openid': openid,
          'avatarUrl': res.detail.userInfo.avatarUrl,
          'nickName': res.detail.userInfo.nickName,
          'gender': res.detail.userInfo.gender
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if(res.data.code==10000){
            that.setData({
              showWXAuthLogin: false,

            })
            var mobile = res.data.result.mobile;
            if (mobile != '') {
               res.data.result.is_login = 1;
              wx.setStorage({
                key: cache_key + 'userinfo',
                data: res.data.result,
              });
              wx.reLaunch({
                url: '/pages/index/index?box_mac='+box_mac,
              })
            }else {
              wx.setStorage({
                key: cache_key + 'userinfo',
                data: res.data.result,
              });
            }
            
            
            
          }else{
            wx.showToast({
              title: '微信授权登陆失败，请重试',
              icon: 'none',
              duration: 2000
            });
            wx.reLaunch({
              url: '/pages/index/index?box_mac='+box_mac,
            })
          }
        },
        fail:function(res){
          wx.showToast({
            title: '微信登陆失败，请检查您的网络',
            icon: 'none',
            duration: 2000
          });
        }
      })
    } else {
      wx.request({
        url: api_url +'/Smalldinnerapp11/User/refuseRegister',
        header: {
          'content-type': 'application/json'
        },
        data:{
          openid:openid
        },
        success:function(){
          user_info.is_wx_auth = 1;
          wx.setStorage({
            key: cache_key + 'userinfo',
            data: user_info,
          });
        }
      })
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
      url: api_url+'/Smalldinnerapp/sms/sendverifyCode',
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
      url: api_url+'/Smalldinnerapp/login/login',
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
          wx.reLaunch({
            url: '/pages/index/index?box_mac='+box_mac,
          })
          var user_info = wx.getStorageSync(cache_key + "userinfo");
          user_info.is_login = 1;
          wx.setStorage({
            key: cache_key+'userinfo',
            data: user_info,
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