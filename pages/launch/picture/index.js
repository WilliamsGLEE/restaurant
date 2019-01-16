// pages/launch/picture/index.js
const app = getApp();
var img_lenth = 0;
var openid;
var box_mac;
var forscreen_char = '';
var upimgs = [];
var policy;
var signature;
var postf;   //上传文件扩展名
var post_imgs = [];
var tmp_percent = [];
var pic_show_cur = [];
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
    var user_info = wx.getStorageSync("savor_user_info");
    
    openid = user_info.openid;
    box_mac= user_info.box_mac;
    that.setData({
      openid:openid,
      box_mac:box_mac,
    })

    

    wx.chooseImage({
      count: 6, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success:function(res){
        wx.request({
          url: 'https://mobile.littlehotspot.com/Smalldinnerapp/playtime/getTimeList',
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
    })
    
    img_lenth = e.detail.value.img_lenth;
    
    openid = e.detail.value.openid;
    box_mac = e.detail.value.box_mac;
    forscreen_char = e.detail.value.forscreen_char;
    
    var is_pub_hotelinfo = e.detail.value.is_pub_hotelinfo;   //是否公开显示餐厅信息
    var is_share = e.detail.value.is_share;
    var avatarUrl = e.detail.value.avatarUrl;
    var nickName = e.detail.value.nickName;
    var public_text = '';

    var play_times = e.detail.value.play_times;

    if (e.detail.value.upimgs0 != '' && e.detail.value.upimgs0 != undefined) upimgs[0] = e.detail.value.upimgs0;
    if (e.detail.value.upimgs1 != '' && e.detail.value.upimgs1 != undefined) upimgs[1] = e.detail.value.upimgs1;
    if (e.detail.value.upimgs2 != '' && e.detail.value.upimgs2 != undefined) upimgs[2] = e.detail.value.upimgs2;
    if (e.detail.value.upimgs3 != '' && e.detail.value.upimgs3 != undefined) upimgs[3] = e.detail.value.upimgs3;
    if (e.detail.value.upimgs4 != '' && e.detail.value.upimgs4 != undefined) upimgs[4] = e.detail.value.upimgs4;
    if (e.detail.value.upimgs5 != '' && e.detail.value.upimgs5 != undefined) upimgs[5] = e.detail.value.upimgs5;
    if (e.detail.value.upimgs6 != '' && e.detail.value.upimgs6 != undefined) upimgs[6] = e.detail.value.upimgs6;
    if (e.detail.value.upimgs7 != '' && e.detail.value.upimgs7 != undefined) upimgs[7] = e.detail.value.upimgs7;
    if (e.detail.value.upimgs8 != '' && e.detail.value.upimgs8 != undefined) upimgs[8] = e.detail.value.upimgs8;

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
              uploadOss_multy(policy, signature, upimgs, box_mac, openid, img_lenth, forscreen_char, avatarUrl, nickName, public_text,play_times);
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
        fial: function ({ errMsg }) {
          console.log('uploadImage fial,errMsg is', errMsg)
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

                  msg: '{ "action": 44, "resource_type":2, "url": "forscreen/resource/' + timestamp + postf_t + '", "filename":"' + timestamp + postf_t + '","openid":"' + openid + '","img_nums":' + img_len + ',"forscreen_char":"' + forscreen_char + '","order":' + order + ',"forscreen_id":"' + forscreen_id + '","img_id":"' + timestamp + '","play_times":'+play_times+'}',

                },
                success: function (result) {

                  that.setData({
                    updateStatus:4,
                    
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
      var forscreen_id = (new Date()).valueOf();
      for (var i = 0; i < img_len; i++) {
        var res_sup_time = (new Date()).valueOf();
        var filename = upimgs[i];
        var index1 = filename.lastIndexOf(".");
        var index2 = filename.length;
        var timestamp = (new Date()).valueOf();
        postf = filename.substring(index1, index2);//后缀名
        post_imgs[i] = "forscreen/resource/" + timestamp + postf;

        tmp_imgs[i] = { "oss_img": post_imgs[i] };
        that.setData({
          tmp_imgs: tmp_imgs
        });
        uploadOssNew(policy, signature, filename, box_mac, openid, timestamp, i, img_len, forscreen_char, forscreen_id, res_sup_time, avatarUrl, nickName, public_text, play_times);
      }
      that.setData({
        showThird: true,
        showTpBt: false
      });
    }
  }, //多张图片投屏结束(不分享到发现)
  up_single_pic(e) {//指定单张图片投屏开始

    var that = this;
    box_mac = e.target.dataset.boxmac;
    openid = e.target.dataset.openid;
    var forscreen_img = e.target.dataset.img;
    var pos = forscreen_img.lastIndexOf('/');
    var filename = forscreen_img.substring(pos + 1);
    var timestamp = (new Date()).valueOf();
    var mobile_brand = app.globalData.mobile_brand;
    var mobile_model = app.globalData.mobile_model;
    var img_index = e.target.dataset.imgindex;
    var img_len = e.target.dataset.imglen;

    var user_info = wx.getStorageSync("savor_user_info");
    var avatarUrl = user_info.avatarUrl;
    var nickName = user_info.nickName;
    var play_times = e.target.dataset.play_times;

    for (var p = 0; p < img_len; p++) {

      if (img_index == p) {
        pic_show_cur[p] = true;

      } else {
        pic_show_cur[p] = false;
      }
      that.setData({
        pic_show_cur: pic_show_cur
      })
    }
    var forscreen_id = (new Date()).valueOf();
    wx.request({
      url: 'https://mobile.littlehotspot.com/Netty/Index/index',
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      data: {
        box_mac: box_mac,
        msg: '{ "action": 42,"resource_type":1, "url": "' + forscreen_img + '", "filename":"' + filename + '","openid":"' + openid + '","forscreen_id":"' + forscreen_id + '","play_times":' + play_times+'}',
      },
      success: function (result) {
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
      },
    })
  },//指定单张图片投屏结束
  chooseImage(e) {//重新选择照片开始
    var that = this;
    that.data.item[0].checked =true,
    that.setData({
      
      play_times: 0,
      
      is_btn_disabel: false,
      item:that.data.item,
    })
    openid = e.currentTarget.dataset.openid;
    box_mac = e.currentTarget.dataset.boxmac;

    wx.chooseImage({
      count: 6, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        that.setData({
          up_imgs: [],
          tmp_percent: [],
          tmp_imgs: [],
          pic_show_cur: []

        });
        uploadInfos(res, box_mac, openid);
        that.setData({
          updateStatus: 0,
          forscreen_char:''
        })
      }
    })
    function uploadInfos(res, box_mac, openid) {
      var img_len = res.tempFilePaths.length;
      if (img_len > 0 && img_len < 10) {
        var tmp_imgs = [];
        for (var i = 0; i < img_len; i++) {
          tmp_imgs[i] = { "tmp_img": res.tempFilePaths[i] };
        }
        that.setData({
          
          percent: 0,
          up_imgs: tmp_imgs,
          img_lenth: img_len,

        })
      }
    }
  },//重新选择照片结束
  exitForscreen(e) {
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