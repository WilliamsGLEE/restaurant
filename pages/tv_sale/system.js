// pages/tv_sale/system.js
const app = getApp()
var api_url = app.globalData.api_url;
var box_mac;
var openid;
var policy;
var signature;
var accessid;
var page = 1;
var common_appid = app.globalData.common_appid;
var cache_key = app.globalData.cache_key; 
var oss_upload_url = app.globalData.oss_upload_url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myChoosed:0,
    showPageType:1,
    play_list:[],  //节目单播放列表
    sale_list:[],  //促销活动列表
    room_type:1,   //活动范围1：全部 2：包间 3：非包间
    room_arr: [{ 'id': 1, 'name': '全部', 'checked': true,'desc':'本餐厅全部电视'}, { 'id': 2, 'name': '包间', 'checked': false,'desc':'本餐厅包间电视'}, { 'id': 3, 'name': '非包间', 'checked': false,'desc':'本餐厅非包间电视' }],
    check_status_arr: [{ 'status': 0, 'name': '审核中', 'img': 'http://oss.littlehotspot.com/media/resource/z8YQnmsySD.png' }, { 'status': 1, 'name': '审核通过', 'img': 'http://oss.littlehotspot.com/media/resource/RiifNKCWeT.png' }, { 'status': 2, 'name': '未审核通过', 'img':'http://oss.littlehotspot.com/media/resource/8Xyk3NtmzS.png'}],
    start_date:'', //活动开始时间
    end_date:'',   //活动结束时间

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
  //切换选项卡  活动促销  我的活动
  selectXxk:function(res){
    var that = this;
    var status = res.currentTarget.dataset.status;
    if(status==1){
      that.setData({
        showPageType: status
      })
    }else {
      var user_info = wx.getStorageSync(cache_key + "userinfo");
      var openid = user_info.openid;
      var hotel_id = user_info.hotel_id
      wx.request({
        url: api_url+'/aaa/bbb/ccc',
        header: {
          'content-type': 'application/json'
        },
        data:{
          openid:openid,
          hotel_id:hotel_id,
        },
        success:function(res){
          if(res.data.code==10000){
            that.setData({
              showPageType: 2
            })
          }else {
            that.setData({
              showPageType:2
            })
          }
        }
      })
    }
    
    
  },
  //上传图片
  chooseImg:function(res){
    var that =this;
    wx.chooseImage({
      count: 1, // 默认6
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        var filename = res.tempFilePaths[0];
        var index1 = filename.lastIndexOf(".");
        var index2 = filename.length;
        var postf = filename.substring(index1, index2);//后缀名
        var timestamp = (new Date()).valueOf();
        var oss_img = "forscreen/resource/" + timestamp + postf;
        console.log(oss_img);
        var postf_w = filename.substring(index1 + 1, index2);//后缀名
        wx.request({
          url: api_url + '/Smallapp/Index/getOssParams',
          headers: {
            'Content-Type': 'application/json'
          },
          success: function (rest) {
            signature = rest.data.signature;
            policy    = rest.data.policy;
            accessid = rest.data.accessid;
            wx.uploadFile({
              url: oss_upload_url,
              filePath: filename,
              name: 'file',
              header: {
                'Content-Type': 'image/' + postf_w
              },
              formData: {
                Bucket: "redian-produce",
                name: filename,
                key: "forscreen/resource/" + timestamp + postf,
                policy: policy,
                OSSAccessKeyId: accessid,
                sucess_action_status: "200",
                signature: signature

              },

              success: function (res) {
                that.setData({
                  myChoosed:1,
                  filename:filename,
                  goods_img: oss_img
                })
              },
              complete: function (es) {
                
              },
              fail: function ({ errMsg }) {
                
              },
            });
            
          }
        });
      },
    })
  },
  //上传视频
  chooseVideo:function(){
    var that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        console.log(res);
        var filename = res.tempFilePath;
        var index1 = filename.lastIndexOf(".");
        var index2 = filename.length;
        var postf = filename.substring(index1, index2);//后缀名
        var timestamp = (new Date()).valueOf();
        var oss_img = "forscreen/resource/" + timestamp + postf;
        console.log(oss_img);
        var postf_w = filename.substring(index1 + 1, index2);//后缀名
        wx.request({
          url: api_url + '/Smallapp/Index/getOssParams',
          headers: {
            'Content-Type': 'application/json'
          },
          success: function (rest) {
            signature = rest.data.signature;
            policy = rest.data.policy;
            accessid = rest.data.accessid;
            wx.uploadFile({
              url: oss_upload_url,
              filePath: filename,
              name: 'file',
              header: {
                'Content-Type': 'image/' + postf_w
              },
              formData: {
                Bucket: "redian-produce",
                name: filename,
                key: "forscreen/resource/" + timestamp + postf,
                policy: policy,
                OSSAccessKeyId: accessid,
                sucess_action_status: "200",
                signature: signature

              },

              success: function (res) {
                that.setData({
                  myChoosed: 2,
                  filename: filename,
                  goods_img: oss_img
                })
              },
              complete: function (es) {

              },
              fail: function ({ errMsg }) {

              },
            });

          }
        });
      },
    })
  },
  //切换最大值
  setMaxPrice: function (res) {
    var totalNums = res.detail.value;
    if (totalNums != '') {
      if (totalNums < 0) {
        return 1;
      }
      if (totalNums > 9999) {
        return 9999;
      }
    }
  },
  //切换活动范围单选按钮
  changeRoomType:function(res){
    console.log(res);
    var that = this;
    var room_arr = this.data.room_arr;
    var room_type = res.currentTarget.dataset.room_type;
    console.log(room_type);
    that.setData({
      room_type: room_type
    })
    for (var i = 0; i < room_arr.length; i++){
      if(room_arr[i].id==room_type){
        room_arr[i].checked = true;
        
      }else {
        room_arr[i].checked = false;
      }
    }
  },
  bindDateChange:function(res){
    console.log(res);
    var that = this;
    var date_type =  res.currentTarget.dataset.date_type;
    if(date_type==1){
      that.setData({
        start_date: res.detail.value
      })
    }else if(date_type==2){
      that.setData({
        end_date:res.detail.value
      })
    }
  },
  pubAct:function(res){
    console.log(res);
    var that = this;
    var goods_img = res.detail.value.goods_img;
    var start_date = res.detail.value.start_date;
    var end_date   = res.detail.value.end_date;
    var price      = res.detail.value.price;
    var room_type  = res.detail.value.room_type;
    var room_arr = this.data.room_arr;
    var check_status_arr = this.data.check_status_arr;
    if(goods_img==''){
      wx.showToast({
        title: '请上传图片/视频',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (price==''){
      that.setData({
        price_focus:true
      })
      wx.showToast({
        title: '请输入价格',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    if (start_date==''){
      wx.showToast({
        title: '请输入活动开始时间',
        icon: 'none',
        duration: 2000
      });
    }
    if (end_date == '') {
      wx.showToast({
        title: '请输入活动结束时间',
        icon: 'none',
        duration: 2000
      });
    }
    var diff_date = tab(start_date,end_date);
    if(diff_date==0){
      wx.showToast({
        title: '结束时间不能小于开始时间',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    var user_info = wx.getStorageSync(cache_key + "userinfo");
    openid = user_info.openid;
    wx.request({
      url: api_url+'/aaa/bbb/ccc',
      header: {
        'content-type': 'application/json'
      },
      data:{
        openid:openid,
        goods_img:goods_img,
        price:price,
        start_date:start_date,
        end_date:end_date,
        room_type:room_type
      },
      success:function(res){
        for (var i = 0;i<room_arr.length;i++){
          if(room_arr[i].id==room_type){
            var room_desc = room_arr[i].desc;
            break;
          }
        }
        var check_status_img = check_status_arr[0].img
        that.setData({
          showPageType:3,
          price:price,
          start_date:start_date,
          end_date:end_date,
          room_type: room_type,
          room_desc:room_desc,
          check_status_img: check_status_img
        })
      }
    })


    function tab(date1, date2) {
      var oDate1 = new Date(date1);
      var oDate2 = new Date(date2);
      if (oDate1.getTime() > oDate2.getTime()) {
        return 0
      } else {
        return 1
      }
    }
  },
  clearGoodsImg:function(res){
    var that = this;
    var goods_img_type = res.currentTarget.dataset.goods_img_type;
    
    that.setData({
      myChoosed:0,
      filename:'',
      goods_img:''
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
    var showPageType = this.data.showPageType;
    if (showPageType==1){
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
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})