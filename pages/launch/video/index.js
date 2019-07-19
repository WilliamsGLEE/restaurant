// pages/launch/video/index.js
const app = getApp();
var openid;
var box_mac;
var res_sup_time ;
var policy;
var signature;
var forscreen_char='' ;
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
    wx.hideShareMenu();
    box_mac = options.box_mac;
    openid = options.openid;
    intranet_ip = options.intranet_ip;
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
    openid = res.detail.value.openid;
    box_mac = res.detail.value.box_mac;
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
    var is_pub_hotelinfo = res.detail.value.is_pub_hotelinfo;
    var is_share = res.detail.value.is_share;
    if(app.globalData.is_zhilian==1){
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

                  uploadVedio(video_url, box_mac, openid, res_sup_time, is_pub_hotelinfo, is_share, duration, avatarUrl, nickName, play_times);
                } else {
                  that.setData({
                    is_btn_disabel:false,
                  })
                }
              }
            })
          } else {

            uploadVedio(video_url, box_mac, openid, res_sup_time, is_pub_hotelinfo, is_share, duration, avatarUrl, nickName, play_times);
          }
        }
      })
      function uploadVedio(video_url, box_mac, openid, res_sup_time, is_pub_hotelinfo, is_share, duration, avatarUrl, nickName, play_times) {

        wx.request({
          url: 'https://mobile.littlehotspot.com/Smallapp/Index/getOssParams',
          headers: {
            'Content-Type': 'application/json'
          },
          success: function (rest) {
            policy = rest.data.policy;
            signature = rest.data.signature;
            uploadOssVedio(policy, signature, video_url, box_mac, openid, res_sup_time, is_pub_hotelinfo, is_share, duration, avatarUrl, nickName, play_times);
          }
        });
      }
      function uploadOssVedio(policy, signature, video_url, box_mac, openid, res_sup_time, is_pub_hotelinfo, is_share, duration, avatarUrl, nickName, play_times) {

        var filename = video_url;          //视频url

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
                    msg: '{ "action":42, "url": "forscreen/resource/' + timestamp + postf_t + '", "filename":"' + timestamp + postf_t + '","openid":"' + openid + '","resource_type":2,"video_id":"' + timestamp + '","forscreen_id":"' + res_eup_time + '","play_times":' + play_times + '}',
                  },
                  success: function (result) {


                  },

                });
              }
            });
          }

        });
        // that.setData({
        //   replay_video_url: "forscreen/resource/" + timestamp + postf_t,
        //   updateStatus: 4,
        //   upload_vedio_temp: filename,

        //   //upload_vedio_img_temp: filename_img,

        // });
        that.setData({

          updateStatus: 4,
          upload_vedio_temp: video_url,
          filename: "forscreen/resource/" + timestamp + postf_t,
          resouce_size: resouce_size,
          duration: duration,
          intranet_ip: intranet_ip,
          hiddens: true,
        })
      }
    }else {
      wx.uploadFile({
        url: 'http://' + intranet_ip + ':8080/h5/restVideo?deviceId=' + openid + '&deviceName=' + mobile_brand + '&web=true&forscreen_id=' + forscreen_id + '&filename=' + filename + '&device_model=' + mobile_model + '&resource_size=' + resouce_size + '&duration=' + duration + '&action=2&resource_type=2&avatarUrl=' + avatarUrl + "&nickName=" + nickName + "&play_times=" + play_times,
        filePath: video_url,
        name: 'fileUpload',
        success: function (res) {
          var res_data = JSON.parse(res.data);
          if(res_data.result==0){
            that.setData({

              updateStatus: 4,
              upload_vedio_temp: video_url,
              filename: filename,
              resouce_size: resouce_size,
              duration: duration,
              intranet_ip: intranet_ip,
              hiddens: true,
            })
            wx.showToast({
              title: '投屏成功',
              icon: 'none',
              duration: 2000
            });
          }else {
            that.setData({
              hiddens: true,
              updateStatus:0,
              is_btn_disabel:false
            })
            wx.showToast({
              title: '视频投屏失败,请重试',
              icon: 'none',
              duration: 2000
            });
            // wx.reLaunch({
            //   url: '/pages/index/index?box_mac=' + box_mac,
            // })
          }
          
        }, fail: function ({ errMsg }) {
          that.setData({
            hiddens: true,
            updateStatus: 0,
            is_btn_disabel:false
          })
          wx.showToast({
            title: '视频投屏失败,请重试',
            icon: 'none',
            duration: 2000
          });
        },
      })
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
          is_btn_disabel: false,
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
    box_mac = res.currentTarget.dataset.box_mac;
    intranet_ip = res.currentTarget.dataset.intranet_ip;
    if(app.globalData.is_zhilian==1){
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
          wx.navigateBack({
            delta: 1
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
    }else {
      wx.request({
        url: "http://" + intranet_ip + ":8080/h5/stop?deviceId=" + openid + "&web=true",
        success: function (res) {
          wx.navigateBack({
            delta: 1
          })
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