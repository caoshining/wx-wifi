// pages/wifi/wifi.js
Page({
  data: {
    startError: '',//初始化错误提示
    wifiListError: false, //wifi列表错误显示开关
    wifiListErrorInfo: '',//wifi列表错误详细
    system: '', //版本号
    platform: '', //系统 android
    ssid: 'wifi帐号',//wifi帐号(必填)
    pass: 'wifi密码',//无线网密码(必填)
    bssid: '',//设备号 自动获取
    endError: ''//连接最后的提示
  },
  onLoad: function (options) {
    var scene = decodeURIComponent(options.scene)||''
    var _this = this;
    var shopId = scene.split('_')[1]||20
    wx.request({
      url: '', //仅为示例，并非真实的接口地址
      data: {
        shop_id: shopId ,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res.data)
        var respData = res.data.data
        if(res.data.code===0){
          _this.setData({
            ssid:respData.wifi_account,
            pass:respData.wifi_password
          })
          // _this.setData({
          //   ssid:'202',
          //   pass:'ABC@!202,,'
          // })
          //检测手机型号
        wx.getSystemInfo({
          success: function (res) {
            var system = '';
            if (res.platform == 'android') system = parseInt(res.system.substr(8));
            if (res.platform == 'ios') system = parseInt(res.system.substr(4));
            // if (res.platform == 'android' && system < 6) {
            //   _this.setData({ startError: '手机版本暂时不支持' }); return
            // }
            // if (res.platform == 'ios' && system < 11) {
            //   _this.setData({ startError: '手机版本暂时不支持' }); return
            // }
            _this.setData({ platform: res.platform });
            //初始化 Wi-Fi 模块
            _this.startWifi(_this);
          },fail:function(e){
            console.log(e)
            _this.setData({ platform: 'android' });
            _this.startWifi(_this);
          }
        })

        }else{
          wx.showToast(res.data.msg)
        }
      }
    })
    

  },//初始化 Wi-Fi 模块。
  startWifi: function (_this) {
    wx.startWifi({
      success: function () {
        _this.getList(_this);
      },
      fail: function (res) {
        _this.setData({ startError: '微信版本暂不支持Wi-Fi模块' });
      }
    })
  },
  getList: function (_this) {
    //安卓执行方法
    if (_this.data.platform == 'android') {
      //请求获取 Wi-Fi 列表
      wx.getWifiList({
        success: function (res) {
          //安卓执行方法
          _this.AndroidList(_this);
        },
        fail: function (err) {
          console.log(err,'err')
          const {errCode} = err
          var obj = {
            12000:"未先调用 startWifi 接口",
            12001:"当前系统不支持相关能力",
            12002:"Wi-Fi:密码错误",
            12003:"连接超时",
            12004:"重复连接 Wi-Fi",
            12005:"未打开 Wi-Fi 开关",
            12006:"未打开 GPS 定位开关",
            12007:"用户拒绝授权链接 Wi-Fi",
            12008:"无效 SSID",
            12009:"系统运营商配置拒绝连接 Wi-Fi",
            12010:"系统其他错误，需要在 errmsg 打印具体的错误原因",
            12011:"应用在后台无法配置 Wi-Fi"
          }
          _this.setData({ wifiListError: true });
          _this.setData({ wifiListErrorInfo: obj[errCode]});
        }
      })
    }
    //IOS执行方法
    if (_this.data.platform == 'ios') {
      // _this.IosList(_this);
      console.log(1,'1')
      // wx.onGetWifiList(function(res) {
      //   console.log(res,'1')
      //   if (res.wifiList.length) {
      //     var ssid = _this.data.ssid;
      //     var signalStrength = 0;
      //     var bssid = '';
      //     for (var i = 0; i < res.wifiList.length; i++) {
      //       console.log(i,'i')
      //       console.log(ssid,'ssid')
      //       if (res.wifiList[i]['SSID'] == ssid && res.wifiList[i]['signalStrength'] > signalStrength) {
      //         bssid = res.wifiList[i]['BSSID'];
      //         signalStrength = res.wifiList[i]['signalStrength'];
      //       }
      //     }
      //     console.log(2,'1')

      //     if (!signalStrength) {
      //       _this.setData({ wifiListError: true });
      //       _this.setData({ wifiListErrorInfo: '未查询到设置的wifi' });
      //       return
      //     }
      //     _this.setData({ bssid: bssid });

      //     wx.setWifiList({
      //       wifiList: [{
      //         SSID: _this.data.ssid,
      //         BSSID: bssid,
      //         password: _this.data.pass,
      //       }]
      //     })
      //   } else {
      //     _this.IosList(_this);
      //   }
      // })
      wx.connectWifi({
        SSID: _this.data.ssid,
        BSSID: '',
        password: _this.data.pass,
        success: function (res) {
          _this.setData({ endError: 'wifi连接成功' });
        },
        fail: function (err) {
          console.log(err,'err')
          const {errCode} = err
          var obj = {
            12000:"未先调用 startWifi 接口",
            12001:"当前系统不支持相关能力",
            12002:"Wi-Fi:密码错误",
            12003:"连接超时",
            12004:"重复连接 Wi-Fi",
            12005:"未打开 Wi-Fi 开关",
            12006:"未打开 GPS 定位开关",
            12007:"用户拒绝授权链接 Wi-Fi",
            12008:"无效 SSID",
            12009:"系统运营商配置拒绝连接 Wi-Fi",
            12010:"系统其他错误，需要在 errmsg 打印具体的错误原因",
            12011:"应用在后台无法配置 Wi-Fi"
          }
          _this.setData({ wifiListError: true });
          _this.setData({ wifiListErrorInfo: obj[errCode]});
        }
        // fail: function (res) {
        //   _this.setData({ wifiListError: true });
        //   _this.setData({ endError: res.errMsg });
        // }
      })
      // wx.setWifiList({
      //   wifiList: [{
      //     SSID: _this.data.ssid,
      //     BSSID: '',
      //     password: _this.data.pass,
      //   }]
      // })
    }

  },
  AndroidList: function (_this) {
    //监听获取到 Wi-Fi 列表数据
    wx.onGetWifiList(function (res) { //获取列表
      if (res.wifiList.length) {
        console.log(res,'res')
        // _this.setData({
        //   wifiList: res.wifiList
        // });
        //循环找出信号最好的那一个
        var ssid = _this.data.ssid;
        var signalStrength = 0;
        var bssid = '';
        for (var i = 0; i < res.wifiList.length; i++) {
          console.log(i,'i')
          console.log(ssid,'ssid')
          if (res.wifiList[i]['SSID'] == ssid && res.wifiList[i]['signalStrength'] > signalStrength) {
            bssid = res.wifiList[i]['BSSID'];
            signalStrength = res.wifiList[i]['signalStrength'];
          }
        }
        console.log(signalStrength,'signalStrength')
        if (!signalStrength) {
          _this.setData({ wifiListError: true });
          _this.setData({ wifiListErrorInfo: '未查询到设置的wifi' });
          return
        }
        // 
        
        _this.setData({ bssid: bssid });
        //执行连接方法
        //连接wifi
        _this.Connected(_this);
      } else {
        _this.setData({ wifiListError: true });
        _this.setData({ wifiListErrorInfo: '未查询到设置的wifi' });
      }
    })
  },
  
  IosList: function (_this) {
    _this.setData({ wifiListError: true });
    _this.setData({ wifiListErrorInfo: 'IOS暂不支持' });
  },//连接wifi
  Connected: function (_this) {
    wx.connectWifi({
      SSID: _this.data.ssid,
      BSSID: _this.data.bssid,
      password: _this.data.pass,
      success: function (res) {
        _this.setData({ endError: 'wifi连接成功' });
      },fail: function (err) {
          console.log(err,'err')
          const {errCode} = err
          var obj = {
            12000:"未先调用 startWifi 接口",
            12001:"当前系统不支持相关能力",
            12002:"Wi-Fi:密码错误",
            12003:"连接超时",
            12004:"重复连接 Wi-Fi",
            12005:"未打开 Wi-Fi 开关",
            12006:"未打开 GPS 定位开关",
            12007:"用户拒绝授权链接 Wi-Fi",
            12008:"无效 SSID",
            12009:"系统运营商配置拒绝连接 Wi-Fi",
            12010:"系统其他错误，需要在 errmsg 打印具体的错误原因",
            12011:"应用在后台无法配置 Wi-Fi"
          }
          _this.setData({ wifiListError: true });
          _this.setData({ wifiListErrorInfo: obj[errCode]});
        }
    })
  }

})