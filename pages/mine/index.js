// pages/mine/index.js
const app = getApp()
var api_url = app.globalData.api_url;
var box_mac;
var openid;
var page = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName:'匿名用户',
    integral:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var user_info = wx.getStorageSync('savor:dinners:userinfo');
    openid = user_info.openid;
    
    wx.request({
      url: api_url +'/Smalldinnerapp11/user/center',
      header: {
        'content-type': 'application/json'
      },
      data:{
        openid:openid,
      },
      success:function(res){
        if(res.data.code==10000){
          that.setData({
            avatarUrl: res.data.result.avatarUrl,
            nickName:  res.data.result.nickName,
            integral: res.data.result.integral
          })
        }
      }
    })
    wx.request({
      url: api_url +'/Smalldinnerapp11/user/integralrecord',
      header: {
        'content-type': 'application/json'
      },
      data:{
        openid: openid,
        page:1,
      },
      success:function(res){
        if(res.data.code==10000){
          that.setData({
            integral_list:res.data.result.datalist
          })
        }
      }
    })
  },
  loadMore:function(res){
    var that = this;
    page = page + 1;
    wx.showLoading({
      title: '加载中，请稍后',
    })
    wx.request({
      url: api_url + '/aaa/bbb/ccc',
      header: {
        'content-type': 'application/json'
      },
      data: {
        openid: openid,
        page: page,
      },
      success: function (res) {
        if (res.data.code == 10000) {
          wx.hideLoading()
        }
      }
    })
    setTimeout(function () {
      wx.hideLoading()
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none',
        duration: 2000,
      })
    }, 5000)
  },
  exchange:function(res){
    wx.navigateTo({
      url: '/pages/mine/exchange',
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
    this.onLoad()
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