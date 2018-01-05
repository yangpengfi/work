# ntv.js
原始框架地址：[点击](https://git.oschina.net/ntv/ntv.js)

ntv.js 博客地址  [点击](https://my.oschina.net/cotonchen/home)


#### 一、源代码目录结构


- css       		    // 包含一些标签默认样式重置、常用class、组件所需的css样式        
- images               // 包含了2张透明图，具体用处后续介绍（可选目录）        
- js                        // 框架核心代码       
   - js/effect       // 框架提供的效果插件，例如滚动div、滑动菜单

#### 二、js文件结构


- 1common.js 

     公共函数类。例如：将document.getElementById(id)封装为 $("#id")函数, $.ajax()等函数。

- 2core.js 

     核心类。包括调试模式、机顶盒平台信息检测。

- 3key.js 
   机顶盒键值处理类。键值的定义、键值触发和系统消息事件的代理函数类和键值控制的  对外接口。

- 4navigation.js
   机顶盒焦点控制类。页面的焦点控制，例如上下左右的焦点移动、焦点边界检测和焦点控制接口。

- 5page.js
  页面的处理类。页面的载入、离开、打开新页面、刷新页面及页面URL的一些处理类。

- 6ngb_h.js
   NGB-H规范接口类。含所有NGB-H规范的接口调用。

- 6ipanel.js 
   iPanel私有规范接口类。含所有iPanel规范的接口调用。

- 6shdv.js 
   SHDV私有规范接口类。含所有SHDV规范的接口调用。

- 6pc.js 
   PC平台模拟接口类。PC平台上的浏览器模拟机顶盒的接口调用（PC调试所用）。

- 7msg.js 
   消息定义类。将接口返回的错误码（CODE）转为可读信息的定义。

- 8stb.js 
   机顶盒的统一接口类。对ipanel.js、shdv.js、ngb_h.js接口的封装，提供统一对外的接口。

- 9util.js 
   常用的工具函数类。例如：字符串的处理、机顶盒相关的字符处理。

- ***10ocn_media_player.js***

   东方有线流媒体播放

- win_js_release.bat 
   win32平台下合并js的批处理，用来将所有js合并为一个ntv.js文件。

- effect
  - effect-scrolldiv.js 

  ​     滚动div插件。用于文章过长时使用上下键阅读内容详细。

  - effect-slidemenu.js 

  ​    滑动菜单插件。横向多图标的滚动插件。

#### js文件解读

###### 10ocn_media_player.js

1：ocnmediaplayer方法的参数说明

     x：横坐标
     y：纵坐标
     w：宽度
     h：高度
     url：HTTP视频播放地址
     status：播放状态 （play：播放，pause：暂停播放，resume：恢复播放）
     type：播放类型（continue：循环播放；end：播放结束后关闭视频）
     callback_end：播放结束回掉函数

2：调用方法参照index.html文件

​	version 6.0， 2016.4.24

3：音量控制调用参照

```
//控制音量 volume取值0~100

ntv.stb.mediaplayer.setVolume(volume);

//获取音量

var getVo = ntv.stb.mediaplayer.getVolume();
```

   4: 播放控制

```
   //重新播放

   ntv.stb.mediaplayer.resume()

   //暂停播放

   ntv.stb.mediaplayer.pause()

   //停止

   ntv.stb.mediaplayer.stop()

   //跳转 time: 单位秒

   ntv.stb.mediaplayer.seekSecond(int time)
```

​	version 6.0， 2016.5.16

5. 高清盒子，ngb_h 接口优先，高清盒子ngb_h 接口调通

6. 增加内部unload 函数（调用ntv.stb.mediaplayer.stop()），用于是否页面在播放时没有停止直接退出，需要释放ngb_h接口的mediaplay实例。否则下次进入无法播放。
### 附录

   - 相关技术标准

   - 获取机顶盒MAC信息

  ```
     var browser = ntv.profile.browser;//用于辨别机顶盒类型

        var mac;

        if(browser == "iPanel"){//高清机顶盒获取mac方法

            mac = network.ethernets[0].MACAddress;

        }else if(browser == "NGB-H"){//智能机顶盒方法 ***待测试

            var ethernets = Broadband.getAllEthernets();

            if (ethernets.length > 0) {

                var ethernet = ethernets[0]; 

                mac = ethernet.MACAddress.replace(/-/g, "");

            } else {

                mac = ethernet.MACAddress.replace(/-/g, "");

            }

        }
  ```




   -  视频

   编码要求

|      | 视频分辨率        | 视频码率                    | 音频   |
| ---- | ------------ | ----------------------- | ---- |
| 高清   | 1280x720/50p | 2.5Mbps以上，H.264 HP@L4.0 | AAC  |
| 标清   | 720x576/50i  | 1.2Mbps以上，H.264 MP@3.0  | AAC  |

   支持格式

   ​	大部分符合编码的视频格式。

   ​	实际测试了.mp4，.mpeg两种。

   - - 安全显示区域

   高清机顶盒暂时只支持1280\*720的分辨率。其中安全区域为1120\*620，上下各空50px，左右各空80px。不在安全区域的部分，不同机顶盒的表现不相同，可能无法显示，也可能被显示出来。

   智能机顶盒有支持4K屏的开发计划。

   - - 机顶盒JS支持标准

|            | 高清     | 智能       |
| ---------- | ------ | -------- |
| javascript | ES3.0  | 大部分ES6.0 |
| CSS        | css2.0 | css2.0   |
| Html       | html4  | 部分H5标签   |

   经验证，**高清机顶盒**对Jquery、Backbone、Angular、Vue等通用JS框架都不支持。**智能机顶盒**支持Jquery和Vue框架的部分功能。智能机顶盒未能全部支持css3.0属性组。

   对Liferay的JS前端控件生成的页面，**高清机顶盒**不支持，**智能机顶盒**可以支持。

   智能机顶盒的部分版本（实测兆兴2000芯片的AC9V301机顶盒）不支持video标签的autoplay功能。

