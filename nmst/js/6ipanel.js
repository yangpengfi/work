/*-- NTV
====================================================== --*/

var ntv = ntv || {};
ntv.stb = ntv.stb || function(){};

/**
 * iPanel中间件问题汇总
 * 1. 在页面使用<video />标签,不能启用调试模式. 因为不断的修改HTML会造成无法播放视频, 尤其是使用窗口视频.
 */


/*--STB iPanel
====================================================== */
ntv.stb.ipanel = function(){};

ntv.stb.ipanel.init = function(){
	
};
var _videoindex = 0;
var _videourl;
var _videocount = 0;
/*--Tools 
====================================================== */
ntv.stb.ipanel.get_version = function(){
	var ver_str = iPanel.System.revision;
	var ver_array = ver_str.split(".");
	var ver_int = parseInt(ver_array[ver_array.length - 1]);
	return [ver_str, ver_int];
};


ntv.stb.ipanel.get_MAC = function(){
	return network.ethernets[0].MACAddress;
};

/*--Key
====================================================== */
ntv.stb.ipanel.key = function(){};
ntv.stb.ipanel.key.move_back = function(){
	ntv.log.console("ntv.stb.ipanel.key.move_back()");
	if(ntv.stb.key.move_back_url)
	{
		ntv.page.openurl(ntv.stb.key.move_back_url);
		ntv.stb.ipanel.onpageunload();
	}
};

/*--MediaPlayer
====================================================== */
ntv.stb.ipanel.mediaplayer = function(){};
ntv.stb.ipanel.mediaplayer.mp = undefined;
ntv.stb.ipanel.mediaplayer.msg = {}; // 由msg.js 重写
ntv.stb.ipanel.mediaplayer.play = function(type, url){
	var log = "ntv.stb.ipanel.mediaplayer.play()";
		log += ", param: type　= " + type + ", url　= " + url + ".";
		_videourl = url;
		_videocount = url.length;
	if(!this.mp)
	{
		if(type == "AUDIO")
			this._play_audio(url);
		else(type == "HTTP")
		{
			this._media.av.open(url[_videoindex], "HTTP");	
			// 稍后由系统事件5202触发media.AV.play()事件
			this.mp = "media.AV";
		}

	}else
		log += this.msg.currentMediaPlayer + ntv.msg.common.exist;

	ntv.log.console(log);
};

ntv.stb.ipanel.mediaplayer._play_audio = function(url){
	// 低版本使用MP3接口兼容
	var version = ntv.stb.ipanel.get_version();
	if(version[0].indexOf("10673.") != -1
		 || version[0].indexOf("41358.") != -1
		 || (version[0].indexOf("41227.") != -1 && version[1] <= 10402))
	{
		this._mp3.play(url);

		this.mp = "MP3";
	}else // media接口
	{
		this._media.av.open(url, "HTTP");	
		// 稍后由系统事件5202触发media.AV.play()事件

		this.mp = "media.AV";
	}

	ntv.log.console("ntv.stb.ipanel.mediaplayer._play_audio(), mp = " + this.mp);
};

ntv.stb.ipanel.mediaplayer.pause = function(){
	var log = "ntv.stb.ipanel.mediaplayer.pause()";

	if(this.mp)
	{
		if(this.mp == "media.AV")
			this._media.av.pause();	
		else if(this.mp == "MP3")
			this._mp3.pause();
	}else
		log += ", " +　this.msg.currentMediaPlayer + ntv.msg.common.isnull;

	ntv.log.console(log);
};

ntv.stb.ipanel.mediaplayer.resume = function(){
	var log = "ntv.stb.ipanel.mediaplayer.resume()";

	if(this.mp)
	{
		if(this.mp == "MP3")
			this._mp3.resume();
	}else
		log += ", " +　this.msg.currentMediaPlayer + ntv.msg.common.isnull;
		media.AV.play();
	ntv.log.console(log);
};

ntv.stb.ipanel.mediaplayer.stop = function(){
	var log = "ntv.stb.ipanel.mediaplayer.stop()";

	if(this.mp)
	{
		if(this.mp == "media.AV")
			this._media.av.stop();	
		else if(this.mp == "MP3")
			this._mp3.stop();

		this.mp = undefined;
	}else
		log += ", " +　this.msg.currentMediaPlayer + ntv.msg.common.isnull;

	ntv.log.console(log);
};

/**
 * 此方法就算页面没有创建媒体实例, 也会主动去调用媒体资源销毁.
 * 为防止在使用返回键或window.location.href离开页面时, 媒体无法停止释放资源
 * 所有需要手动调用释放资源的对象, 都应在此方法内调用一次
 */
ntv.stb.ipanel.mediaplayer._stop_every = function(){
	var log = "ntv.stb.ipanel.mediaplayer._stop_every()";

	// media.AV接口
	media.AV.stop();
	media.AV.close();

	// MP3接口
	MP3.stop();
	MP3.close();

	ntv.log.console(log);
};

/*--MediaPlayer Private media.AV接口
====================================================== */
ntv.stb.ipanel.mediaplayer._media = function(){};

ntv.stb.ipanel.mediaplayer._media.av = function(){};
ntv.stb.ipanel.mediaplayer._media.av.msg  = {}; // 由msg.js 重写
ntv.stb.ipanel.mediaplayer._media.av.open = function(url, type){
	var log = "ntv.stb.ipanel.mediaplayer._media.av.open()";
	log += ", param: url= " + url;

	media.AV.open(url, type);
	log += this.msg.media_AV_open + ntv.msg.common.success;

	ntv.log.console(log);
};

ntv.stb.ipanel.mediaplayer._media.av.play = function(){
	var log = "ntv.stb.ipanel.mediaplayer._media.av.play()";

	media.AV.play();
	log += this.msg.media_AV_play + ntv.msg.common.success;
	
	ntv.log.console(log);
};

ntv.stb.ipanel.mediaplayer._media.av.pause = function(){
	var log = "ntv.stb.ipanel.mediaplayer._media.av.pause()";

	media.AV.pause()
	log += this.msg.MP3_pause + ntv.msg.common.success;

	ntv.log.console(log);
};

ntv.stb.ipanel.mediaplayer._media.av.stop = function(){
	var log = "ntv.stb.ipanel.mediaplayer._media.av.stop()";

	if(media.AV.stop() == 1)
	{
		log += this.msg.media_AV_stop + ntv.msg.common.success;

		media.AV.close();
		log += this.msg.media_AV_close + ntv.msg.common.success;
	}else
		log += this.msg.media_AV_stop + ntv.msg.common.failure;

	ntv.log.console(log);
};


/*--MediaPlayer Private MP3接口
	MP3接口（已过时），为了兼容低版本。新版本请使用，media.AV接口
	兼容低版本："10673.", "41358.", ("41227." && version <= 10402)
====================================================== */
ntv.stb.ipanel.mediaplayer._mp3 = function(){};
ntv.stb.ipanel.mediaplayer._mp3.msg = {}; // 由msg.js 重写
ntv.stb.ipanel.mediaplayer._mp3.play = function(url){
	var log = "ntv.stb.ipanel.mediaplayer._mp3.play()";
	log += ", param: url= " + url + ". ";

	MP3.setProperty("beginData","1024");
	log += this.msg.MP3_setProperty + ntv.msg.common.success;

	MP3.open(url);
	log += this.msg.MP3_open + ntv.msg.common.success;

	MP3.play();
	log += this.msg.MP3_play + ntv.msg.common.success;

	ntv.log.console(log);
};

ntv.stb.ipanel.mediaplayer._mp3.pause = function(){
	var log = "ntv.stb.ipanel.mediaplayer._mp3.pause()";

	MP3.pause();
	log += this.msg.MP3_pause + ntv.msg.common.success;

	ntv.log.console(log);
};

ntv.stb.ipanel.mediaplayer._mp3.stop = function(){
	var log = "ntv.stb.ipanel.mediaplayer._mp3.stop()";

	MP3.stop();
	log += this.msg.MP3_stop + ntv.msg.common.success;

	MP3.close();
	log += this.msg.MP3_close + ntv.msg.common.success;

	ntv.log.console(log);
};

ntv.stb.ipanel.mediaplayer._mp3.resume = function(){
	var log = "ntv.stb.ipanel.mediaplayer._mp3.resume()";

	MP3.resume();
	log += this.msg.MP3_resume + ntv.msg.common.success;

	ntv.log.console(log);
};


/*--System Event
 *5974:  当前页面已经打开完成，发消息通知页面
 *13001: 媒体源路径有效
 *5202:  准备播放媒体成功
 *13051  铺货节目播放到尾
====================================================== */

ntv.stb.ipanel.systemevent = function(event_code){
	var log = "ntv.stb.ipanel.systemevent()";
	log += ", param: event_code = " + event_code;

	switch(event_code)
	{
		case 5202:
			if(ntv.stb.ipanel.mediaplayer.mp == "media.AV")
				ntv.stb.ipanel.mediaplayer._media.av.play();
			break;

		case 5203:   //ope服务器失败(5203)
			media.AV.close();
			break;

		case 5205:   //play 播放媒体成功
			break;

		case 5206:   //play 播放媒体失败
			media.AV.close();
			break;

		case 5210:   //播放完毕
            //alert("aaa1") ;  
			_callback_end();
			_videoindex += 1;
            
            if (_videoindex == _videocount ) {
               
            	if (_videotype == "end") { 
            		media.AV.close();

            	} else if (_videotype="continue") {           		
            		_videoindex = 0;
            		media.AV.open(_videourl[_videoindex], "HTTP");		
            	}

            } else {
            	media.AV.open(_videourl[_videoindex], "HTTP");	
            	
            }
			
			break;

		case 5211:  //close 成功
			break;

		case 5212:  //close 失败
			break;

		case 4404:  //播放的节目没有数据
			break;
		default:
		    break;


	}

	ntv.log.console(log);
};


ntv.stb.ipanel.systemevent._event_5202 = function(){
	var log = "ntv.stb.ipanel.systemevent._event_5202()";

	if(ntv.stb.ipanel.mediaplayer.mp == "media.AV")
		ntv.stb.ipanel.mediaplayer._media.av.play();

	ntv.log.console(log);
};

/*--Destory onunload
====================================================== */
ntv.stb.ipanel.onpageunload = function(){
	ntv.log.console("ntv.stb.ipanel.onpageunload()");
	
	// 由于页面每次加载时都调用, 故使用_stop_every函数
	ntv.stb.ipanel.mediaplayer._stop_every();
};



/*--视频播放窗口定位 chang xinping 2015-12-28
====================================================== */
ntv.stb.mediaplayer = function(){};
ntv.stb.ipanel.mediaplayer.position = function(x,y,w,h){
	media.video.setPosition(x,y,w,h);
};

//获取音量值
ntv.stb.ipanel.mediaplayer.getVolume = function(){
	return  media.sound.value;
	
}

//设置音量值  //volume取值0~100
ntv.stb.ipanel.mediaplayer.setVolume = function(volume){
	var currVolume = parseInt(volume);
	if( currVolume>100 )
 		currVolume = 100;
 	if( currVolume<0 )
 		currVolume = 0;
	media.sound.value = currVolume;
	
}



function getStrToTime(_time){
      var hour = Math.floor(_time/3600);
      var minute = Math.floor((_time - 3600 * hour)/60);
      var second = _time - 3600 * hour - minute * 60;
      hour = hour > 9 ? hour:"0"+hour;
      minute = minute>9 ? minute:"0"+minute;
      second = second>9 ? second:"0"+second;
      var _str = hour + ":" + minute + ":" + second;
      return _str;
    } 

  //seek second整数为快进　负数为倒退
 ntv.stb.ipanel.mediaplayer.seekSecond =  function(second){
    var durationTime = media.AV.duration;
    var currTime = media.AV.elapsed;
    if(second>0){
         if((currTime+second)<durationTime){
            media.AV.seek(getStrToTime(currTime+second));
         }else{
            media.AV.seek(getStrToTime(durationTime));
         }
     }else{
         if(currTime+second>0){
            media.AV.seek(getStrToTime(currTime+second));
         }else{
            media.AV.seek(getStrToTime(0));
        }
      }
 }


  

// }
