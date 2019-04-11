// pages/download/index.js
const app = getApp()
var page = 1; //当前节目单页数
var api_url = app.globalData.api_url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddens:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.hideShareMenu();
    wx.request({
      url: api_url +'/Smalldinnerapp11/Download/index',
      header: {
        'content-type': 'application/json'
      },
      data:{
        page: 1
      },
      success:function(res){
        if(res.data.code==10000){
          that.setData({
            download_list:res.data.result,
          })
        }else {
          wx.navigateBack({
            delta: 1,
          })
        }
      },
      fail:function(res){
        wx.navigateBack({
          delta: 1,
        })
      }
    })
  },
  loadMore:function(res){
    var that = this;

    page = page + 1;
    that.setData({
      hiddens: false,
    })
    wx.request({
      url: api_url + '/Smalldinnerapp11/Download/index',
      header: {
        'content-type': 'application/json'
      },
      data: {
        page: page
      },
      success: function (res) {
        if (res.data.code == 10000) {
          that.setData({
            download_list: res.data.result,
            hiddens: true,
          })
        }else {
          that.setData({
            hiddens: true,
          })
        }
      },
      
    })

  },
  downloadimage:function(res){
    
    var imageUrl = res.currentTarget.dataset.oss_url;

    // 下载文件  
    wx.downloadFile({
      url: imageUrl,
      success: function (res) {
        

        // 保存图片到系统相册  
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            
            wx.showToast({
              title: '图片保存成功',
              icon: 'none',
              duration: 2000
            });
          },
          fail(res) {
            wx.showToast({
              title: '图片保存失败，请重试',
              icon: 'none',
              duration: 2000
            });
          }
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '图片下载失败，请重试',
          icon: 'none',
          duration: 2000
        });
      }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})