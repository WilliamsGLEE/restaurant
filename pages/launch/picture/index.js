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
    wx.hideShareMenu();
    //var user_info = wx.getStorageSync("savor_user_info");
    
    openid = options.openid;
    box_mac = options.box_mac;
    intranet_ip = options.intranet_ip;
    that.setData({
      box_mac: box_mac,
      openid: openid,
      is_btn_disabel: true,
    })

    wx.request({
      url: api_url + '/Smalldinnerapp/playtime/getTimeList',
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (rts) {
        that.setData({
          item: rts.data.result,
        })
      }

    })

    wx.chooseImage({
      count: 6, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success:function(res){
        
        
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
    var user_info = wx.getStorageSync(cache_key+'userinfo');
    var avatarUrl = user_info.avatarUrl;
    var nickName = user_info.nickName;
    var img_lenth = e.detail.value.img_lenth;
    var intranet_ip = e.detail.value.intranet_ip;
    var mobile_brand = app.globalData.mobile_brand;
    var mobile_model = app.globalData.mobile_model;
    var forscreen_char = e.detail.value.forscreen_char;
    var play_times = e.detail.value.play_times;
    var upimgs = [];
    var is_pub_hotelinfo = e.detail.value.is_pub_hotelinfo;   //是否公开显示餐厅信息
    var is_share = e.detail.value.is_share;
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
    if(app.globalData.box_type==2){
      var public_text = '';
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

                  wx.request({
                    url: 'https://mobile.littlehotspot.com/Smallapp/Index/getOssParams',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    success: function (rest) {

                      policy = rest.data.policy;
                      signature = rest.data.signature;
                      uploadOss_multy(policy, signature, upimgs, box_mac, openid, img_lenth, forscreen_char, avatarUrl, nickName, public_text, play_times);
                      
                    }
                  });
                } else {
                  that.setData({
                    is_btn_disabel:false,
                  })
                }
              }
            })
          } else {

            wx.request({
              url: 'https://mobile.littlehotspot.com/Smallapp/Index/getOssParams',
              headers: {
                'Content-Type': 'application/json'
              },
              success: function (rest) {

                policy = rest.data.policy;
                signature = rest.data.signature;
                uploadOss_multy(policy, signature, upimgs, box_mac, openid, img_lenth, forscreen_char, avatarUrl, nickName, public_text, play_times);
              }
            });

          }
        }
      })


      function uploadOssNew(policy, signature, img_url, box_mac, openid, timestamp, flag, img_len, forscreen_char, forscreen_id, res_sup_time, avatarUrl, nickName, public_text, play_times) {

        var filename = img_url;
        var index1 = filename.lastIndexOf(".");
        var index2 = filename.length;
        var mobile_brand = app.globalData.mobile_brand;
        var mobile_model = app.globalData.mobile_model;
        var order = flag + 1;
        var postf_t = filename.substring(index1, index2);//后缀名
        var postf_w = filename.substring(index1 + 1, index2);//后缀名

        var upload_task = wx.uploadFile({
          url: "https://image.littlehotspot.com",
          filePath: img_url,
          name: 'file',
          header: {
            'Content-Type': 'image/' + postf_w
          },
          formData: {
            Bucket: "redian-produce",
            name: img_url,
            key: "forscreen/resource/" + timestamp + postf_t,
            policy: policy,
            OSSAccessKeyId: "LTAITjXOpRHKflOX",
            sucess_action_status: "200",
            signature: signature

          },

          success: function (res) {

          },
          complete: function (es) {
            tmp_percent[flag] = { "percent": 100 };
            that.setData({
              tmp_percent: tmp_percent
            })
          },
          fail: function ({ errMsg }) {
            console.log('uploadImage fail,errMsg is', errMsg)
          },
        });
        upload_task.onProgressUpdate((res) => {
          tmp_percent[flag] = { "percent": res.progress };
          //console.log(res.progress);
          that.setData({
            tmp_percent: tmp_percent
          });
          if (res.progress == 100) {
            var res_eup_time = (new Date()).valueOf();
            wx.request({
              url: 'https://mobile.littlehotspot.com/Smalldinnerapp/ForscreenLog/recordForScreenPics',
              header: {
                'content-type': 'application/json'
              },
              data: {
                forscreen_id: forscreen_id,
                openid: openid,
                box_mac: box_mac,
                action: 4,
                mobile_brand: mobile_brand,
                mobile_model: mobile_model,
                forscreen_char: forscreen_char,
                public_text: public_text,
                imgs: '["forscreen/resource/' + timestamp + postf_t + '"]',
                resource_id: timestamp,
                res_sup_time: res_sup_time,
                res_eup_time: res_eup_time,
                resource_size: res.totalBytesSent,
                is_pub_hotelinfo: is_pub_hotelinfo,
                is_share: is_share,
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

                    msg: '{ "action": 44, "resource_type":2, "url": "forscreen/resource/' + timestamp + postf_t + '", "filename":"' + timestamp + postf_t + '","openid":"' + openid + '","img_nums":' + img_len + ',"forscreen_char":"' + forscreen_char + '","order":' + order + ',"forscreen_id":"' + forscreen_id + '","img_id":"' + timestamp + '","play_times":' + play_times + ',"avatarUrl":"' + avatarUrl + '","nickName":"' + nickName+'"}',

                  },
                  success: function (result) {

                    that.setData({
                      updateStatus: 4,

                      percent: 0
                    })
                  },
                });

              }
            });

          }

        })

      }
      function uploadOss_multy(policy, signature, upimgs, box_mac, openid, img_len, forscreen_char, avatarUrl, nickName, public_text, play_times) {
        //console.log(img_len);
        var tmp_imgs = [];
        var filename_arr = [];
        var forscreen_id = (new Date()).valueOf();
        for (var i = 0; i < img_len; i++) {
          var res_sup_time = (new Date()).valueOf();
          
          var filename = upimgs[i].img_url;
          var index1 = filename.lastIndexOf(".");
          var index2 = filename.length;
          var timestamp = (new Date()).valueOf();
          postf = filename.substring(index1, index2);//后缀名
          post_imgs[i] = "forscreen/resource/" + timestamp + postf;
          filename_arr[i] = timestamp + postf;
          tmp_imgs[i] = { "oss_img": post_imgs[i] };
          that.setData({
            tmp_imgs: tmp_imgs
          });
          uploadOssNew(policy, signature, filename, box_mac, openid, timestamp, i, img_len, forscreen_char, forscreen_id, res_sup_time, avatarUrl, nickName, public_text, play_times);
        }
        // that.setData({
        //   showThird: true,
        //   showTpBt: false
        // });
        that.setData({
          up_imgs: upimgs,
          filename_arr: filename_arr,
          is_upload: 1,
          forscreen_char: forscreen_char,
          hiddens: true,
          updateStatus: 4,
        })
      }
    }else {
      var forscreen_id = (new Date()).valueOf();
      var filename_arr = [];

      for (var i = 0; i < img_lenth; i++) {
        var img_url = upimgs[i].img_url;
        var img_size = upimgs[i].img_size;
        var filename = (new Date()).valueOf();
        filename_arr[i] = filename;

        wx.uploadFile({
          url: "http://" + intranet_ip + ":8080/h5/restPicture?isThumbnail=1&imageId=20170301&deviceId=" + openid + "&deviceName=" + mobile_brand + "&rotation=90&imageType=1&web=true&forscreen_id=" + forscreen_id + '&forscreen_char=' + forscreen_char + '&filename=' + filename + '&device_model=' + mobile_model + '&resource_size=' + img_size + '&action=4&resource_type=0&avatarUrl=' + avatarUrl + "&nickName=" + nickName + "&forscreen_nums=" + img_lenth + "&play_times=" + play_times,
          filePath: img_url,
          name: 'fileUpload',
          success: function (res) {
            console.log(res)
          },
          complete: function (es) {
            console.log(es)
          },
          fail: function ({ errMsg }) {
            console.log('uploadImage fail,errMsg is', errMsg)
          },
        });
      }
      that.setData({
        up_imgs: upimgs,
        filename_arr: filename_arr,
        is_upload: 1,
        forscreen_char: forscreen_char,
        hiddens: true,
        updateStatus: 4,
      })
    }

    
  }, //多张图片投屏结束(不分享到发现)
  up_single_pic(res) {//指定单张图片投屏开始

    var that = this;
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
    var forscreen_img = 'forscreen/resource/'+filename;
    var play_times = res.target.dataset.play_times;
    that.setData({
      choose_key: choose_key
    })
    if(app.globalData.box_type==2){
      
      wx.request({
        url: 'https://mobile.littlehotspot.com/Netty/Index/index',
        headers: {
          'Content-Type': 'application/json'
        },
        method: "POST",
        data: {
          box_mac: box_mac,
          msg: '{ "action": 42,"resource_type":1, "url": "' + forscreen_img + '", "filename":"' + filename + '","openid":"' + openid + '","forscreen_id":"' + forscreen_id + '","play_times":' + play_times + ',"avatarUrl":"' + avatarUrl + '","nickName":"' + nickName + '"}',

        },
        success: function (result) {
          if(result.data.code==10000){
            wx.request({
              url: 'https://mobile.littlehotspot.com/Smalldinnerapp/ForscreenLog/recordForScreenPics',
              header: {
                'content-type': 'application/json'
              },
              data: {
                forscreen_id: forscreen_id,
                openid: openid,
                box_mac: box_mac,
                action: 2,
                resource_type: 1,
                mobile_brand: mobile_brand,
                mobile_model: mobile_model,
                imgs: '["' + forscreen_img + '"]',
                small_app_id: 4,
              },
            });
          }else {
            wx.showToast({
              title: '投屏失败，请重试',
              icon: 'none',
              duration: 2000
            })
          }
          
        },
        fail:function(res){
          wx.showToast({
            title: '投屏失败，请重试',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }else {
      wx.uploadFile({
        url: "http://" + intranet_ip + ":8080/h5/singleImg?isThumbnail=1&imageId=20170301&deviceId=" + openid + "&deviceName=" + mobile_brand + "&rotation=90&imageType=1&web=true&forscreen_id=" + forscreen_id + '&forscreen_char=' + forscreen_char + '&filename=' + filename + '&device_model=' + mobile_model + '&resource_size=' + resouce_size + '&action=2&resource_type=1&avatarUrl=' + avatarUrl + "&nickName=" + nickName,
        filePath: img_url,
        name: 'fileUpload',
        success: function (res) {
          console.log(res)
        },
        complete: function (es) {
          //console.log(es)
        },
        fail: function ({ errMsg }) {
          wx.showToast({
            title: '投屏失败，请重试',
            icon:'none',
            duration:2000,
          })
          //console.log('uploadImage fail,errMsg is', errMsg)
        },
      });
    }
    
    
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
      


    })

    wx.chooseImage({
      count: 6, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        that.setData({
          up_imgs: [],
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
    box_mac = res.currentTarget.dataset.box_mac;
    intranet_ip = res.currentTarget.dataset.intranet_ip;
    if(app.globalData.box_type==2){
      
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