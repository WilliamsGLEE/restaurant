//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,

    boxArray: [],
    objectBoxArray: [],
    boxIndex: 0,

    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  
  onLoad: function(res) {
    var that = this;
    var user_info = wx.getStorageSync("savor_user_info"); 
    var hotel_id   = user_info.hotel_id;
    var openid  = user_info.openid;
    if (user_info==''){
      wx.navigateTo({
        url: '/pages/user/login',
      })
    }else {
      var box_mac = user_info.box_mac;
      var boxIndex= user_info.box_index;

      //获取包间机顶盒列表
      wx.request({
        url: 'https://mobile.littlehotspot.com/Smalldinnerapp/stb/getBoxlist',
        headers: {
          'Content-Type': 'application/json'
        },
        method: "POST",
        data:{
          hotel_id: hotel_id
        },
        success:function(res){
          if(res.data.code ==10000){
            that.setData({
              boxArray: res.data.result.box_name_list,
              objectBoxArray: res.data.result.box_list,
            })
          }
        }
      })
      if (box_mac == undefined || box_mac == '') {
          that.setData({
            box_mac : '',
            openid:openid,
          })
      }else {
        that.setData({
          boxIndex:boxIndex,
          box_mac:box_mac,
          openid:openid,
        })
      }
    }
  },
  //选择包间
  boxPickerChange(res){
    
    var that = this;
    var boxIndex = res.detail.value;
    var box_list = that.data.objectBoxArray;
    
    var box_mac = box_list[boxIndex].box_mac;
    console.log(box_mac);
    var user_info = wx.getStorageSync("savor_user_info");
    user_info.box_mac = box_mac; 
    user_info.box_index = boxIndex;
    wx.setStorage({
      key: 'savor_user_info',
      data: user_info,
    })

    that.setData({
      boxIndex:boxIndex,
    })
  },
  chooseImage:function(res){
    var user_info = wx.getStorageSync("savor_user_info");
    var box_mac = user_info.box_mac;
    if (box_mac == '' || box_mac == undefined){
      
      wx.showToast({
        title: '请选择包间电视',
        icon: 'none',
        duration: 2000
      });
    }else {
      wx.navigateTo({
        url: '/pages/launch/picture/index',
      })
    }
  },
  chooseVideo:function(res){
    var user_info = wx.getStorageSync("savor_user_info");
    var box_mac = user_info.box_mac;
    if (box_mac == '' || box_mac == undefined) {
      wx.showToast({
        title: '请选择包间电视',
        icon: 'none',
        duration: 2000
      });
    }else {
      wx.navigateTo({
        url: '/pages/launch/video/index',
      })
    }
  }
})