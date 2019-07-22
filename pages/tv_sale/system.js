// pages/tv_sale/system.js
const app = getApp()
var api_url = app.globalData.api_url;
var box_mac;
var openid;
var page = 1;
var common_appid = app.globalData.common_appid;
var cache_key = app.globalData.cache_key; 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPageType:1,
    play_list:[],  //节目单播放列表
    sale_list:[],  //促销活动列表
    room_type:1,   //活动范围1：全部 2：包间 3：非包间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var user_info  = wx.getStorageSync(cache_key + "userinfo");
    openid = user_info.openid;
    wx.request({//节目单播放列表
      url: api_url + '/aaa/bb/cc',
      header: {
        'content-type': 'application/json'
      },
      data: {
        box_mac: box_mac,
      },
      success: function (res) {
        if (res.data.code == 10000) {
          that.setData({
            play_list: res.data.result,
          })
        }
      }
    })
    wx.request({ //促销活动列表
      url: api_url + '/aaa/bbb/ccc',
      header: {
        'content-type': 'application/json'
      },
      data: {
        box_mac: box_mac,
        page: 1,
      },
      success: function (res) {
        if (res.data.code == 10000) {
          that.setData({
            sale_list: res.data.result,
          })
        }
      }
    })
  },
  delProgramPlay:function(e){
    var that = this;
    var sale_id = e.currentTarget.dataset.sale_id;
    wx.request({
      url: api_url+'/aaa/bbb/ccc',
      header:{
        'content-type':'application/json'
      },
      data:{
        box_mac:box_mac,
        openid:openid,
        sale_id:sale_id,
      },
      success:function(res){
        if(res.data.code==10000){
          wx.showToast({
            title: '移除成功',
            icon: 'none',
            duration: 2000,
          })
          that.setData({
            play_list:res.data.result
          })
        }else {
          wx.showToast({
            title: '移除失败，请重试',
            icon: 'none',
            duration: 2000,
          })
        }
      },fail:function(res){
        wx.showToast({
          title: '移除失败，请重试',
          icon: 'none',
          duration: 2000,
        })
      }
    })
  },
  programPlay:function(e){//节目单播放
    var sale_id = e.currentTarget.dataset.sale_id;
    wx.request({
      url: api_url+'/aaa/bbb/ccc',
      header: {
        'content-type': 'application/json'
      },
      data:{
        box_mac:box_mac,
        openid:openid,
        sale_id:sale_id
      },
      success:function(res){
        if(res.data.code==10000){
          wx.showToast({
            title: '添加节目单播放成功',
            icon: 'none',
            duration: 2000,
          })
        }else {
          wx.showToast({
            title: '添加节目单播放失败，请重试',
            icon: 'none',
            duration: 2000,
          })
        }
      },fail:function(res){
        wx.showToast({
          title: '添加节目单播放失败，请重试',
          icon: 'none',
          duration:2000,
        })
      }
    })
  },
  boxShow:function(e){
    var sale_id = e.currentTarget.dataset.sale_id;
    wx.request({
      url: api_url+'/aaa/bbb/ccc',
      header: {
        'content-type': 'application/json'
      },
      data:{
        box:box_mac,
        sale_id:sale_id,
      },
      success:function(res){
        if(res.data.code==10000){
          wx.showToast({
            title: '电视播放成功',
            icon: 'none',
            duration: 2000,
          })
        }else {
          wx.showToast({
            title: '电视播放失败,请重试',
            icon: 'none',
            duration: 2000,
          })
        }
      },
      fail:function(res){
        wx.showToast({
          title: '电视播放失败,请重试',
          icon: 'none',
          duration: 2000,
        })
      }
    })
  },
  selectXxk:function(res){
    var that = this;
    var status = res.currentTarget.dataset.status;
    that.setData({
      showPageType : status
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
    console.log('dddd');
    var that = this;
    wx.showLoading({
      title: '加载中，请稍后',
    })
    page = page + 1;
    wx.request({
      url: api_url + '/aaa/bbb/ccc',
      header: {
        'content-type': 'application/json'
      },
      data: {
        box_mac: box_mac,
        page: page,
      },
      success: function (res) {
        if (res.data.code == 10000) {
          wx.hideLoading()
          that.setData({
            sale_list: res.data.result
          })

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})