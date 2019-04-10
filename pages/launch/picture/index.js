// pages/launch/picture/index.js
const app = getApp();
var img_lenth = 0;
var openid;
var box_mac;
var intranet_ip;
var forscreen_char = '';
var upimgs = [];
var policy;
var signature;
var postf;   //上传文件扩展名
var post_imgs = [];
var tmp_percent = [];
var pic_show_cur = [];
var api_url  = app.globalData.api_url;
var cache_key = app.globalData.cache_key;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: [],
    play_times:0,
    updateStatus:0,
    is_btn_disabel: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    /*this.setData({
      updateStatus: 0 // 未上传
      // updateStatus: 1 // 正在上传
      // updateStatus: 2 // 上传失败
      // updateStatus: 4 // 上传成功
    });*/
    var that = this;
    //var user_info = wx.getStorageSync("savor_user_info");
    console.log(options);
    openid = options.openid;
    box_mac = options.box_mac;
    intranet_ip = options.intranet_ip;
    that.setData({
      box_mac: box_mac,
      openid: openid,
      is_btn_disabel: true,
    })

    

    wx.chooseImage({
      count: 6, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success:function(res){
        wx.request({
          url: api_url+'/Smalldinnerapp/playtime/getTimeList',
          headers: {
            'Content-Type': 'application/json'
          },
          success:function(rts){
            that.setData({
              item:rts.data.result,
            })
          }

        })
        
        var img_len = res.tempFilePaths.length;
        var tmp_imgs = [];
        for (var i = 0; i < img_len; i++) {
          tmp_imgs[i] = { "tmp_img": res.tempFilePaths[i], "resource_size": res.tempFiles[i].size };
        }
        that.setData({
          up_imgs: tmp_imgs,
          img_lenth: img_len,
          intranet_ip: intranet_ip,
          is_btn_disabel: false,
          
        })
      },
      fail:function(e){
        wx.navigateBack({
          delta: 1,
        })
      }
    })  
  },
  playTimesChange:function(res){
    var that = this;
    var play_times = res.detail.value;
    that.setData({
      play_times:play_times
    })

  },
  up_forscreen(e) {//多张图片投屏开始(不分享到发现)

    var that = this;
    that.setData({
      is_btn_disabel: true,
      hiddens: true,
    })
    console.log(e.detail.value);
    var user_info = wx.getStorageSync(cache_key+'userinfo');
    var avatarUrl = user_info.avatarUrl;
    var nickName = user_info.nickName;
    var img_lenth = e.detail.value.img_lenth;
    var intranet_ip = e.detail.value.intranet_ip;
    var mobile_brand = app.globalData.mobile_brand;
    var mobile_model = app.globalData.mobile_model;
    var forscreen_char = e.detail.value.forscreen_char;
    var upimgs = [];

    if (e.detail.value.upimgs0 != '' && e.detail.value.upimgs0 != undefined) {

      upimgs[0] = { 'img_url': e.detail.value.upimgs0, 'img_size': e.detail.value.upimgsize0 };


    }
    if (e.detail.value.upimgs1 != '' && e.detail.value.upimgs1 != undefined) {
      upimgs[1] = { 'img_url': e.detail.value.upimgs1, 'img_size': e.detail.value.upimgsize1 };
    }
    if (e.detail.value.upimgs2 != '' && e.detail.value.upimgs2 != undefined) {
      upimgs[2] = { 'img_url': e.detail.value.upimgs2, 'img_size': e.detail.value.upimgsize2 };
    }
    if (e.detail.value.upimgs3 != '' && e.detail.value.upimgs3 != undefined) {
      upimgs[3] = { 'img_url': e.detail.value.upimgs3, 'img_size': e.detail.value.upimgsize3 };
    }
    if (e.detail.value.upimgs4 != '' && e.detail.value.upimgs4 != undefined) {
      upimgs[4] = { 'img_url': e.detail.value.upimgs4, 'img_size': e.detail.value.upimgsize4 };
    }
    if (e.detail.value.upimgs5 != '' && e.detail.value.upimgs5 != undefined) {
      upimgs[5] = { 'img_url': e.detail.value.upimgs5, 'img_size': e.detail.value.upimgsize5 };
    }
    if (e.detail.value.upimgs6 != '' && e.detail.value.upimgs6 != undefined) {
      upimgs[6] = { 'img_url': e.detail.value.upimgs6, 'img_size': e.detail.value.upimgsize6 };
    }
    if (e.detail.value.upimgs7 != '' && e.detail.value.upimgs7 != undefined) {
      upimgs[7] = { 'img_url': e.detail.value.upimgs7, 'img_size': e.detail.value.upimgsize7 };
    }
    if (e.detail.value.upimgs8 != '' && e.detail.value.upimgs8 != undefined) {
      upimgs[8] = { 'img_url': e.detail.value.upimgs8, 'img_size': e.detail.value.upimgsize8 };
    }
    var forscreen_id = (new Date()).valueOf();
    var filename_arr = [];

    for (var i = 0; i < img_lenth; i++) {
      var img_url = upimgs[i].img_url;
      var img_size = upimgs[i].img_size;
      var filename = (new Date()).valueOf();
      filename_arr[i] = filename;
      
      wx.uploadFile({
        url: "http://" + intranet_ip + ":8080/h5/restPicture?isThumbnail=1&imageId=20170301&deviceId=" + openid + "&deviceName=" + mobile_brand + "&rotation=90&imageType=1&web=true&forscreen_id=" + forscreen_id + '&forscreen_char=' + forscreen_char + '&filename=' + filename + '&device_model=' + mobile_model + '&resource_size=' + img_size + '&action=4&resource_type=0&avatarUrl=' + avatarUrl + "&nickName=" + nickName + "&forscreen_nums=" + img_lenth,
        filePath: img_url,
        name: 'fileUpload',
        success: function (res) {
          console.log(res)
        },
        complete: function (es) {
          console.log(es)
        },
        fial: function ({ errMsg }) {
          console.log('uploadImage fial,errMsg is', errMsg)
        },
      });
    }

    console.log(upimgs);
    that.setData({
      up_imgs: upimgs,
      filename_arr: filename_arr,
      is_upload: 1,
      forscreen_char: forscreen_char,
      hiddens: true,
      updateStatus: 4,
    })
  }, //多张图片投屏结束(不分享到发现)
  up_single_pic(res) {//指定单张图片投屏开始

    var that = this;
    //console.log(res);
    openid = res.currentTarget.dataset.openid;
    box_mac = res.currentTarget.dataset.boxmac;
    intranet_ip = res.currentTarget.dataset.intranet_ip

    var user_info = wx.getStorageSync(cache_key+'userinfo');
    var avatarUrl = user_info.avatarUrl;
    var nickName = user_info.nickName;
    var filename = res.currentTarget.dataset.filename;
    var forscreen_char = res.currentTarget.dataset.forscreen_char;
    var resouce_size = res.currentTarget.dataset.resouce_size;
    var forscreen_id = (new Date()).valueOf();
    var mobile_brand = app.globalData.mobile_brand;
    var mobile_model = app.globalData.mobile_model;
    var img_url = res.currentTarget.dataset.img_url;
    var choose_key = res.currentTarget.dataset.choose_key;
    that.setData({
      choose_key: choose_key
    })
    
    wx.uploadFile({
      url: "http://" + intranet_ip + ":8080/h5/singleImg?isThumbnail=1&imageId=20170301&deviceId=" + openid + "&deviceName=" + mobile_brand + "&rotation=90&imageType=1&web=true&forscreen_id=" + forscreen_id + '&forscreen_char=' + forscreen_char + '&filename=' + filename + '&device_model=' + mobile_model + '&resource_size=' + resouce_size + '&action=2&resource_type=1&avatarUrl=' + avatarUrl + "&nickName=" + nickName,
      filePath: img_url,
      name: 'fileUpload',
      success: function (res) {
        console.log(res)
      },
      complete: function (es) {
        console.log(es)
      },
      fial: function ({ errMsg }) {
        console.log('uploadImage fial,errMsg is', errMsg)
      },
    });
  },//指定单张图片投屏结束
  chooseImage(res) {//重新选择照片开始
    var that = this;
    openid = res.currentTarget.dataset.openid;
    box_mac = res.currentTarget.dataset.box_mac;
    intranet_ip = res.currentTarget.dataset.intranet_ip

    that.setData({
      box_mac: box_mac,
      openid: openid,
      intranet_ip: intranet_ip,
      is_btn_disabel: true,
      up_imgs: [],


    })

    wx.chooseImage({
      count: 6, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var img_len = res.tempFilePaths.length;

        var tmp_imgs = [];
        for (var i = 0; i < img_len; i++) {
          tmp_imgs[i] = { "tmp_img": res.tempFilePaths[i], "resource_size": res.tempFiles[i].size };
        }
        that.setData({
          up_imgs: tmp_imgs,
          img_lenth: img_len,
          intranet_ip: intranet_ip,
          updateStatus: 0,
          is_btn_disabel: false,
          forscreen_char: ''
        })
      }
    })
  },//重新选择照片结束
  exitForscreen(res) {
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
  },//退出投屏结束
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