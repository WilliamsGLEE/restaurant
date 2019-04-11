// pages/launch/video/index.js
const app = getApp();
var openid;
var box_mac;
var res_sup_time ;
var policy;
var signature;
var forscreen_char ;
var intranet_ip;
var api_url = app.globalData.api_url;
var cache_key = app.globalData.cache_key;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    play_times: 0,
    item: [],
    updateStatus:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    var that = this;
    box_mac = options.box_mac;
    openid = options.openid;
    intranet_ip = options.intranet_ip;
    console.log(intranet_ip)
    that.setData({
      box_mac: box_mac,
      openid: openid,

    })
    var forscreen_id = (new Date()).valueOf();
    var filename = (new Date()).valueOf();


    wx.request({
      url: api_url + '/Smalldinnerapp/playtime/getTimeList',
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (rts) {
        that.setData({
          item: rts.data.result,
          intranet_ip: intranet_ip,
          openid: openid,
          box_mac: box_mac,
        })
      }

    })

    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        var video_url = res.tempFilePath

        that.setData({
          upload_vedio_temp: video_url,
          duration: res.duration,
          video_size: res.size,
          is_forscreen: 1
        })
        
      },
      fail: function (e) {
        wx.navigateBack({
          delta: 1,
        })
      }
    })

  },
  forscreen_video: function (res) {
    var that = this;
    that.setData({
      updateStatus: 1,
      is_btn_disabel: true,
      hiddens: false,
    })
    console.log(res);
    openid = res.detail.value.openid;
    box_mac = res.detail.value.boxmac;
    intranet_ip = res.detail.value.intranet_ip;
    var user_info = wx.getStorageSync(cache_key+'userinfo');
    var avatarUrl = user_info.avatarUrl;
    var nickName = user_info.nickName;
    var video_url = res.detail.value.video_url;
    var mobile_brand = app.globalData.mobile_brand;
    var mobile_model = app.globalData.mobile_model;
    var resouce_size = res.detail.value.video_size;
    var duration = res.detail.value.duration;
    var play_times = res.detail.value.play_times;
    var forscreen_id = (new Date()).valueOf();
    var filename = (new Date()).valueOf();
   
    wx.uploadFile({
      url: 'http://' + intranet_ip + ':8080/h5/restVideo?deviceId=' + openid + '&deviceName=' + mobile_brand + '&web=true&forscreen_id=' + forscreen_id + '&filename=' + filename + '&device_model=' + mobile_model + '&resource_size=' + resouce_size + '&duration=' + duration + '&action=2&resource_type=2&avatarUrl=' + avatarUrl + "&nickName=" + nickName + "&play_times=" + play_times,
      filePath: video_url,
      name: 'fileUpload',
      success: function (res) {
        that.setData({
          
          updateStatus:4,
          upload_vedio_temp: video_url,
          filename: filename,
          resouce_size: resouce_size,
          duration: duration,
          intranet_ip: intranet_ip,
          hiddens: true,
        })
      }, fail: function ({ errMsg }) {
        that.setData({
          hiddens: true,
        })
        wx.showToast({
          title: '视频投屏失败',
          icon: 'none',
          duration: 2000
        });
        wx.reLaunch({
          url: '/pages/index/index?box_mac=' + box_mac,
        })
      },
    })
  },
  playTimesChange: function (res) {
    var that = this;
    var play_times = res.detail.value;
    that.setData({
      play_times: play_times
    })

  },
  //重新选择视频
  chooseVedio(e) {
    var that = this;
    //console.log(res);
    box_mac = e.currentTarget.dataset.box_mac;
    openid = e.currentTarget.dataset.openid;
    that.setData({
      play_times: 0,
      is_btn_disabel: false,
      item: that.data.item,
      box_mac: box_mac,
      openid: openid
    })
    var intranet_ip = e.currentTarget.dataset.intranet_ip;
    var forscreen_id = (new Date()).valueOf();
    var filename = (new Date()).valueOf();
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        var video_url = res.tempFilePath
        that.setData({
          updateStatus: 0,
          upload_vedio_temp: res.tempFilePath,
          is_btn_disabel:false,
          intranet_ip: intranet_ip,
          openid: openid,
          box_mac: box_mac,
          duration: res.duration,
          video_size: res.size,
          is_forscreen: 1
        })
        
      }
    })
    
    
  },
  //退出投屏
  exitForscreend(res) {
    var that = this;
    openid = res.currentTarget.dataset.openid;
    box_mac = res.currentTarget.dataset.boxmac;
    intranet_ip = res.currentTarget.dataset.intranet_ip;

    wx.request({
      url: "http://" + intranet_ip + ":8080/h5/stop?deviceId=" + openid + "&web=true",
      success: function (res) {
        console.log(res);
        wx.navigateBack({
          delta: 1
        })
        wx.showToast({
          title: '退出成功',
          icon: 'none',
          duration: 2000
        });
      },
      fial: function ({ errMsg }) {

        wx.showToast({
          title: '退出失败',
          icon: 'none',
          duration: 2000
        });
      },
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})