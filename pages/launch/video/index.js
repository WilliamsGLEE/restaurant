// pages/launch/video/index.js
const app = getApp();
var openid;
var box_mac;
var res_sup_time ;
var policy;
var signature;
var forscreen_char ;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: [],
    updateStatus:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    var that = this;
    var user_info = wx.getStorageSync("savor_user_info");

    openid = user_info.openid;
    box_mac = user_info.box_mac;
    
    that.setData({
      openid: openid,
      box_mac: box_mac,
      upload_vedio_temp: '',
      
    })
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        wx.request({
          url: 'https://mobile.littlehotspot.com/Smalldinnerapp/playtime/getTimeList',
          headers: {
            'Content-Type': 'application/json'
          },
          success: function (rts) {
            that.setData({
              item: rts.data.result,
              upload_vedio_temp: res.tempFilePath,
              duration: res.duration
            })
          }

        })
        

      }, fail: function (res) {
        wx.navigateBack({
          delta: 1,
        })
      }
    });

  },
  forscreen_video: function (res) {
    //console.log(res);
    var that = this;
    that.setData({
      
      updateStatus: 1,
      is_btn_disabel: true,
    })
    var video = res.detail.value.video;
    var box_mac = res.detail.value.box_mac;
    var openid = res.detail.value.openid;
    var is_pub_hotelinfo = res.detail.value.is_pub_hotelinfo;
    var is_share = res.detail.value.is_share;
    var duration = res.detail.value.duration;
    var avatarUrl = res.detail.value.avatarUrl;
    var nickName = res.detail.value.nickName;
    var play_times = res.detail.value.play_times;
    var forscreen_char = '';  


    res_sup_time = (new Date()).valueOf();

    wx.request({
      url: 'https://mobile.littlehotspot.com/smallapp21/User/isForscreenIng',
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      data: { box_mac: box_mac },
      success: function (res) {
        
        var is_forscreen = res.data.result.is_forscreen;
        if (is_forscreen == 1) {
          wx.showModal({
            title: '确认要打断投屏',
            content: '当前电视正在进行投屏,继续投屏有可能打断当前投屏中的内容.',
            success: function (res) {
              if (res.confirm) {
                
                uploadVedio(video, box_mac, openid, res_sup_time, is_pub_hotelinfo, is_share, duration, avatarUrl, nickName, play_times);
              } else {

              }
            }
          })
        } else {
         
          uploadVedio(video, box_mac, openid, res_sup_time, is_pub_hotelinfo, is_share, duration, avatarUrl, nickName, play_times);
        }
      }
    })
    function uploadVedio(video, box_mac, openid, res_sup_time, is_pub_hotelinfo, is_share, duration, avatarUrl, nickName, play_times) {

      wx.request({
        url: 'https://mobile.littlehotspot.com/Smallapp/Index/getOssParams',
        headers: {
          'Content-Type': 'application/json'
        },
        success: function (rest) {
          policy = rest.data.policy;
          signature = rest.data.signature;
          uploadOssVedio(policy, signature, video, box_mac, openid, res_sup_time, is_pub_hotelinfo, is_share, duration, avatarUrl, nickName, play_times);
        }
      });
    }
    function uploadOssVedio(policy, signature, video, box_mac, openid, res_sup_time, is_pub_hotelinfo, is_share, duration, avatarUrl, nickName, play_times) {

      var filename = video;          //视频url

      //var filename_img = video.thumbTempFilePath; //视频封面图
      //console.log(video);
      var index1 = filename.lastIndexOf(".");
      var index2 = filename.length;
      var mobile_brand = app.globalData.mobile_brand;
      var mobile_model = app.globalData.mobile_model;
      var postf_t = filename.substring(index1, index2);//后缀名
      var timestamp = (new Date()).valueOf();

      var upload_task = wx.uploadFile({
        url: "https://image.littlehotspot.com",
        filePath: filename,
        name: 'file',

        formData: {
          Bucket: "redian-produce",
          name: filename,
          key: "forscreen/resource/" + timestamp + postf_t,
          policy: policy,
          OSSAccessKeyId: "LTAITjXOpRHKflOX",
          sucess_action_status: "200",
          signature: signature

        },
        success: function (res) {
          
        }
      });
      upload_task.onProgressUpdate((res) => {
        //console.log(res);

        that.setData({
          vedio_percent: res.progress
        });
        if (res.progress == 100) {
          var res_eup_time = (new Date()).valueOf();
          //console.log(res_eup_time);
          that.setData({
            showVedio: false,
            oss_video_url: "http://oss.littlehotspot.com/forscreen/resource/" + timestamp + postf_t,
            upload_vedio_temp: '',
            is_view_control: true,
            hiddens: true,
          })
          wx.request({
            url: 'https://mobile.littlehotspot.com/Smalldinnerapp/ForscreenLog/recordForScreenPics',
            header: {
              'content-type': 'application/json'
            },
            data: {
              openid: openid,
              box_mac: box_mac,
              action: 2,
              resource_type: 2,
              mobile_brand: mobile_brand,
              mobile_model: mobile_model,
              forscreen_char: forscreen_char,
              
              imgs: '["forscreen/resource/' + timestamp + postf_t + '"]',
              resource_id: timestamp,
              res_sup_time: res_sup_time,
              res_eup_time: res_eup_time,
              resource_size: res.totalBytesSent,
              is_pub_hotelinfo: is_pub_hotelinfo,
              is_share: is_share,
              forscreen_id: res_eup_time,
              duration: duration,
              small_app_id: 4,
            },
            success: function (ret) {
              wx.request({
                url: 'https://mobile.littlehotspot.com/Netty/Index/index',
                headers: {
                  'Content-Type': 'application/json'
                },
                method: "POST",
                data: {
                  box_mac: box_mac,
                  msg: '{ "action":42, "url": "forscreen/resource/' + timestamp + postf_t + '", "filename":"' + timestamp + postf_t + '","openid":"' + openid + '","resource_type":2,"video_id":"' + timestamp + '","forscreen_id":"' + res_eup_time + '","play_times":'+play_times+'}',
                },
                success: function (result) {


                },

              });
            }
          });
        }

      });
      that.setData({
        replay_video_url: "forscreen/resource/" + timestamp + postf_t,
        updateStatus: 4,
        upload_vedio_temp: filename,

        //upload_vedio_img_temp: filename_img,

      });
    }
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
    var that = this
    that.setData({
      
      
      is_btn_disabel: false
    })
    var box_mac = e.currentTarget.dataset.boxmac;
    var openid = e.currentTarget.dataset.openid;


    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {

        that.setData({
          updateStatus: 0,
          upload_vedio_temp: res.tempFilePath,
          vedio_percent: 0
        });
        //uploadVedio(res, box_mac, openid);
      }
    });
    
    
  },
  //退出投屏
  exitForscreend(e) {
    var that = this;
    openid = e.currentTarget.dataset.openid;
    box_mac = e.currentTarget.dataset.boxmac;
    var timestamp = (new Date()).valueOf();
    wx.request({
      url: 'https://mobile.littlehotspot.com/Netty/Index/index',
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      data: {
        box_mac: box_mac,
        msg: '{"action": 3,"openid":"' + openid + '"}',
      },
      success: function (res) {
        wx.navigateBack({
          delta: 1,
        })
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