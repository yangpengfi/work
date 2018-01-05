/*-- NTV
====================================================== --*/

var ntv = ntv || {};
ntv.stb = ntv.stb || function(){};

/**
 * NGB-H中间件问题汇总
 * 1. mp.setVideoDisplayMode(255);无效
 */

/*--STB NGB-H
====================================================== */
ntv.stb.ngb_h = function(){};

ntv.stb.ngb_h.init = function(){
	
};

/*--Tools
====================================================== */
ntv.stb.ngb_h.get_version = function(){
	return "待补充";
};

ntv.stb.ngb_h.get_MAC = function(){
	var ethernets = Broadband.getAllEthernets();
	if (ethernets.length > 0) {
		var ethernet = ethernets[0];
		mac = ethernet.MACAddress.replace(/-/g, "");
	} else {
		mac = ethernet.MACAddress.replace(/-/g, "");
	}
//	return "98bc576e8007";
	return mac;
};

/*--Key
====================================================== */
ntv.stb.ngb_h.key = function(){};
ntv.stb.ngb_h.key.move_back = function(){
	ntv.log.console("ntv.stb.ngb_h.key.move_back()");
	if(ntv.stb.key.move_back_url)
	{
		ntv.page.openurl(ntv.stb.key.move_back_url);
		
		ntv.stb.ngb_h.onpageunload();
	}
};

/*--MediaPlayer
====================================================== */

var _videoindex = 0;
var _videourl;
var _videocount = 0;
var _rectangle_x= 0;
var _rectangle_y = 0;
var _rectangle_w = 0;
var _rectangle_h = 0;


ntv.stb.ngb_h.mediaplayer = function(){};
ntv.stb.ngb_h.mediaplayer.mp = undefined;
ntv.stb.ngb_h.mediaplayer.msg = {}; // 由msg.js 重写


/**
 * 媒体统一播放函数
 * param type String "AUDIO", "VOD", "DVB"
 * param url  String "http://mp3", "rtsp://ts", "dvb:xxx"
 */
ntv.stb.ngb_h.mediaplayer.play = function(type, url){

	var log = "ntv.stb.ngb_h.mediaplayer.play(), ";
	_videourl = url;
	_videocount = url.length;
	if(!this.mp)
	{ 
		alert('play_1');
		this._set_mp_instance();

		var set_source_rs = this.mp.setMediaSource(url[_videoindex]);
		if(set_source_rs == 0)
		{
			if(type == "AUDIO")
				this._set_audio_mode(this.mp);
			else if(type == "VOD")
				this._set_vod_mode(this.mp);
			else if(type == "DVB")
				this._set_dvb_mode(this.mp);
			else if (type == "HTTP") {
				alert('play_http');
				//this.mp.play();
				var rect = new Rectangle(_rectangle_x ,_rectangle_y ,_rectangle_w , _rectangle_h);//100 * rx, 10 * ry, 600 * rx, 400 * ry);
            	this.mp.setVideoDisplayArea(rect);
            	this.mp.play();
				//this.mp.refresh();
				this.mp.enableTrickMode(true);
			} 

            
			log += this.msg.play + ntv.msg.common.success;
		}
		else
			log += this.msg.setMediaSource + ntv.msg.common.failure;
	}
	else
		log += this.msg.currentMediaPlayer + ntv.msg.common.exist;

	ntv.log.console(log);		
};

ntv.stb.ngb_h.mediaplayer.pause = function(){
	//this.mediaplayer.mp.pause();
	var re_puse = this.mp.pause();
	//var re_puse = ntv.stb.mediaplayer.pause();
	alert(re_puse)
};

ntv.stb.ngb_h.mediaplayer.resume = function(){
	this.mp.resume();
};

ntv.stb.ngb_h.mediaplayer.getVolume = function(){
	var currentVolume = this.mp.getVolume();
	return currentVolume;
}
ntv.stb.ngb_h.mediaplayer.setVolume = function(size){
	this.mp.setVolume(size);
};


ntv.stb.ngb_h.mediaplayer.seekSecond = function(second){
	 
	 iPanel.debug('hq_durationTime');
	 var durationTime = this.mp.getMediaDuration();
	 iPanel.debug(durationTime);

	 var currTime = this.mp.getCurrentPlayTime();
	 iPanel.debug(currTime);
	
	 document.getElementById("info").innerHTML="durationTime:"+durationTime;
	
	 document.getElementById("result").innerHTML="currTime:"+currTime;
	
	 //this.mp.seek(1,"00:01:00");
	 //this.mp.seek(1,"00:01:30");
	 //this.mp.seek("00:01:30");
	 if(second>0){
	
         if((currTime+second) >= durationTime){
		
          //this.mp.seek(1,getStrToTime(currTime+second)+'-now');
          this.mp.seek(1,getStrToTime(currTime+second));
		
           //this.mp.seek(1,"00:02:00");
         }else{
            //this.mp.seek(1,getStrToTime(durationTime)+'-now');
		
			iPanel.debug('seek_kj');
            //var seek_result = this.mp.seek(1,getStrToTime(durationTime));
			var seek_result = this.mp.seek(1,getStrToTime(currTime+second));
			var time = getStrToTime(currTime+second);
			alert(seek_result);
			alert(time);
			
	
			iPanel.debug(seek_result);
            //this.mp.seek(1,"00:01:00-now");
         }
     }else{
         if(currTime+second>0){
			 alert('pd7');
           this.mp.seek(1,getStrToTime(currTime+second)+'-now');
		   alert('pd8');
              //this.mp.seek(1,"00:03:00-now");
         }else{
			 alert('pd9');
            this.mp.seek(1,getStrToTime(0)+'-now');
			alert('pd10');
               //this.mp.seek(1,"00:02:00-now");
        }
      }
	  alert('tc1');
	// var flag = this.mp.seek(1,"00:01:10-now");
	// document.getElementById("volume").innerHTML=flag;
};



/**
 * 临时使用函数,中间件bug.待bug解决后请使用_stop()
 * 龙晶提供临时解决方法，将媒体地址指向错误地址
 */
/*ntv.stb.ngb_h.mediaplayer.stop = function(){
	var log = "ntv.stb.ngb_h.mediaplayer.stop()";

	if(this.mp)
	{
		this.mp.setMediaSource("http://127.0.0.1/audio.mp3");
		this.mp.refresh();
		this.mp.play();
		this.mp = undefined;
	}else
		log += this.msg.stop + ntv.msg.common.isnull;
		ntv.stb.ngb_h.mediaplayer._stop();

	ntv.log.console(log);
};
*/
ntv.stb.ngb_h.mediaplayer.stop = function(){
	var log = "ntv.stb.ngb_h.mediaplayer.stop(), ";

	if(this.mp)
	{
		var mp_stop_rs = this.mp.stop();

		if(mp_stop_rs == 0)
		{
			var unbind_instance_rs = this.mp.unbindPlayerInstance();
			if(unbind_instance_rs == 0)
			{
				this.mp = undefined;
				log += this.msg.stop + ntv.msg.common.success;
			}
			else
				log += this.msg.unbindPlayerInstance + ntv.msg.common.failure;
		}else
			log += this.msg.stop + ntv.msg.common.failure;
	}else
		log += this.msg.stop + ntv.msg.common.isnull;

	ntv.log.console(log);
};
//var _mp;
/*--MediaPlayer Private Function
====================================================== */
ntv.stb.ngb_h.mediaplayer._set_mp_instance = function(){
	var log = "ntv.stb.ngb_h.mediaplayer._set_mp_instance(), ";

	var _mp = new MediaPlayer();
	var get_instance_id = _mp.getPlayerInstanceID();
	if(get_instance_id != -1)
	{
		var bind_instance_rs = _mp.bindPlayerInstance(get_instance_id);
		if(bind_instance_rs != -1)
		{
			this.mp = _mp;
			log += this.msg.bindPlayerInstance + ntv.msg.common.success;
		}
		else
			log += this.msg.bindPlayerInstance + ntv.msg.common.failure;
	}
	else
		log += this.msg.getPlayerInstanceID + ntv.msg.common.failure;

	ntv.log.console(log);
};

ntv.stb.ngb_h.mediaplayer._set_audio_mode = function(mp){
	var log = "ntv.stb.ngb_h.mediaplayer._set_audio_mode(), ";

	var rect = this._set_rectangle(1280, 720, 0, 0);
	var set_display_area_rs = mp.setVideoDisplayArea(rect);
	if(set_display_area_rs == 0)
	{
		var mp_refresh_rs = mp.refresh();
		if(mp_refresh_rs == 0)
		{
			log += this.msg.setVideoDisplayArea + ntv.msg.common.success;	
		}else
			log += this.msg.refresh + ntv.msg.common.failure;
		
	}else
		log += this.msg.setVideoDisplayArea + ntv.msg.common.failure;


	ntv.log.console(log);
};
ntv.stb.ngb_h.mediaplayer._set_vod_mode = function(mp){
	var log = "ntv.stb.ngb_h.mediaplayer._set_vod_mode(), ";

	ntv.log.console(log);
};
ntv.stb.ngb_h.mediaplayer._set_dvb_mode = function(mp){
	var log = "ntv.stb.ngb_h.mediaplayer._set_dvb_mode(), ";

	ntv.log.console(log);
};

ntv.stb.ngb_h.mediaplayer._set_rectangle = function(left, top, width, height){
	var rect = new Rectangle();
	rect.left = left;
	rect.top = top;
	rect.width = width;
	rect.height = height;

	return rect;
};



/*--System Event
_videoindex：视频播放下标
_videocount：视频总数量
_videotype：视频播放状态（是否循环播放）
====================================================== */
ntv.stb.ngb_h.systemevent = function(event_code){

		switch(event_code){

 		case 13001:
 		
            ntv.stb.ngb_h.mediaplayer.mp.play();
         
 		case 13003:
            status = "playing";
            break;
		case 13051:
		    _callback_end();
			_videoindex += 1;
			
            //判断视频列表是否播放完毕
            if (_videoindex == _videocount ) {
            	_videoindex = 0;

            	 //判断视频是否循环播放
            	if (_videotype == "end") { 
            		/*临时使用函数,中间件bug.待bug解决后请使用_stop()
                    龙晶提供临时解决方法，将媒体地址指向错误地址*/
                    
            		ntv.stb.ngb_h.mediaplayer.stop();

            	//视频循环播放
                } else if (_videotype=="continue") {
                
             		ntv.stb.ngb_h.mediaplayer.mp.setMediaSource(_videourl[_videoindex]);
        			
                }  

            } else {
        		
        		ntv.stb.ngb_h.mediaplayer.mp.setMediaSource(_videourl[_videoindex]);
            }


             
        
			
			break;
	}
};


/*--Destory beforeunload
====================================================== */
ntv.stb.ngb_h.onpageunload = function(){
	ntv.log.console("ntv.stb.ngb_h.onpageunload()");
	// MediaPlayer资源释放,如果不为空
	if(ntv.stb.ngb_h.mediaplayer.mp)
		ntv.stb.ngb_h.mediaplayer.stop();
};


/*--视频播放窗口定位 chang xinping 2015-12-28
====================================================== */
ntv.stb.ngb_h.mediaplayer.position = function(x,y,w,h){
	_rectangle_x = x;
	_rectangle_y = y;
	_rectangle_w = w;
	_rectangle_h = h;

};


