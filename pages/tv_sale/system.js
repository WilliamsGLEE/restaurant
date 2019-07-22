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
    room_arr: [{ 'id': 1, 'name': '全部', 'checked': true }, { 'id': 2, 'name': '包间', 'checked': false }, { 'id': 3, 'name': '非包间', 'checked': false }],
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
        that.setData({
          showPageType:3
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