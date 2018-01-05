/*-- NTV
====================================================== --*/

/*--Common 公共类函数
====================================================== */

var $ = function(selector) {
	if(selector.indexOf("#") > -1)
		return document.getElementById(selector.replace("#", ""));
	else
		return document.getElementsByTagName(selector);
};

/* 封装ajax函数
 * @param {string}opt.type http连接的方式，包括POST和GET两种方式
 * @param {string}opt.url 发送请求的url
 * @param {boolean}opt.async 是否为异步请求，true为异步的，false为同步的
 * @param {object}opt.data 发送的参数，格式为对象类型
 * @param {function}opt.success ajax发送并接收成功调用的回调函数
 */
function ajax(opt) {
	opt = opt || {};
	opt.method = opt.method.toUpperCase() || 'POST';
	opt.url = opt.url || '';
	//      typeof(opt.async)==='boolean'?opt.async = opt.async:opt.async = true;
	//      opt.async = opt.async || true;
	if(typeof(opt.async) === 'boolean') {
		opt.async = opt.async
	} else {
		opt.async = true
	}
	opt.data = opt.data || null;
	opt.success = opt.success || function() {};
	var xmlHttp = null;
	if(XMLHttpRequest) {
		xmlHttp = new XMLHttpRequest();
	} else {
		xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
	}
	var params = [];
	for(var key in opt.data) {
		params.push(key + '=' + opt.data[key]);
	}
	xmlHttp.onreadystatechange = function() {
		if(xmlHttp.readyState == 4 && xmlHttp.status == 200) {
			opt.success(xmlHttp.responseText);
		}
	};
	var postData = params.join('&');
	if(opt.method.toUpperCase() === 'POST') {
		xmlHttp.open(opt.method, opt.url, opt.async);
		xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
		xmlHttp.send(postData);
	} else if(opt.method.toUpperCase() === 'GET') {
		xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
		xmlHttp.send(null);
	}

}
﻿ /*-- NTV
 ====================================================== --*/

 var ntv = ntv || {};

 /*--Log 页面调试输出
====================================================== */
 ntv.log = function(){};
 ntv.log.debug=false;
 ntv.log.console = function(str) {
 	if(ntv.log.debug && this.filter(str)) {

   		var html = '<div style="display: block; background-color: #336699;' +
   			' opacity: 0.7; position: absolute; top: 40px; left: 20px;' +
   			' text-align: left; font-size: 18px; color:#fff;"' +
   			' id="console"><!-- #$#: --></div>';

   		var html = '<div class="console" id="console"><!-- #$#: --></div>';
   			window.document.body.innerHTML += html;
 			$("#console").innerHTML += "<p>#$#: " + str + "</p>";
 	}
 };
 ntv.log.alert=function(val){
 	var html = '<div id="ntvalert" style="display: block;width:1200px; background-color: #336699;' +
   			' opacity: 0.7; position: absolute; top: 40px; left: 40px;' +
   			' text-align: left; font-size: 18px; color:#fff;"' +
   			' ><!-- #$#: --></div>';
   		window.document.body.innerHTML += html;
   		$("#ntvalert").innerHTML+="<p>#$#: " + val + "</p>";
 }
 ntv.log.filter = function(str) {
 	var print = true;
 	if(str.indexOf("$PAGE") > -1)
 		print = false;
 	else if(str.indexOf("ntv.key") > -1)
 		print = false;
 	else if(str.indexOf("ntv.navigation") > -1)
 		print = false;
 	else if(str.indexOf("ntv.page") > -1)
 		print = false;
 	else if(str.indexOf("ntv.stb") > -1)
 		print = false;
 	else if(str.indexOf("ntv.effect") > -1)
 		print = true;

 	return print;
 };

 /*--Profile
====================================================== */
 ntv.profile = function() {};

 ntv.profile.platform = "PC or STB";
 ntv.profile.browser = "NGB-H or iPanel or SHDV"; // 国标NGB-H or iPanel or SHDV

 ntv.profile.info = function() {
 	var info = "browser info" +
 		", platform: " + navigator.platform +
 		", appName: " + navigator.appName +
 		", appVersion: " + navigator.appVersion;

 	var platform = "当前网页运行平台检测结果为(PC or STB): " +
 		this.platform;

 	var browser = "当前网页运行浏览器检测结果为(NGB-H or iPanel or SHDV): " +
 		this.browser;

 	ntv.log.console(info);
 	ntv.log.console(platform);
 	ntv.log.console(browser);
 };

 ntv.profile.init = function() {
 	this.platform = this._get_platform();
 	this.browser = this._get_browser();
 };

 ntv.profile._get_platform = function() {
 	var platform = navigator.platform;

 	if(platform.indexOf("Win32") == -1 &&
 		platform.indexOf("Linux x86") == -1)
 		platform = "STB";
 	else
 		platform = "PC";

 	return platform;
 };

 ntv.profile._get_browser = function() {
 	var browser = "PCBrowser";

 	// 茁壮中间件
 	if(typeof(iPanel) != "undefined")
 		browser = "iPanel";
 	// 全景中间件
 	else if(typeof(jShow) != "undefined")
 		browser = "SHDV";
 	// NGB-H国标(iPanel也有MediaPlayer对象,但NGB-H绝对没有iPanel对象)
 	else if(typeof(MediaPlayer) != "undefined")
 		browser = "NGB-H";

 	return browser;
 };

 /*--NTV对象初始化
 ====================================================== */
 (function() {
 	ntv.profile.init();
 	ntv.profile.info();
 })();/*-- NTV
====================================================== --*/

 var ntv = ntv || {};

 /*--Key 页面键值控制
====================================================== */
 ntv.key = function(){};

 ntv.key.init = function(){
 	this.listener_keyevent();
 	this.listener_systemevent();
	this.keycode_set();
 };

 ntv.key.listener_keyevent = function(){
	if(ntv.profile.platform == "STB")
 	{
 		document.onkeydown = this.keypress;

 		if(ntv.profile.browser == "iPanel")
 		{
 			document.onkeypress = this.keypress;
			document.onirkeypress = this.keypress;
 		}

 	}else if(ntv.profile.platform == "PC")
 	{
 		document.addEventListener("keydown",this.keypress,false);
 	}
 };

 ntv.key.listener_systemevent = function(){
 		
 		if(ntv.profile.browser == "NGB-H"
 			 || ntv.profile.browser == "iPanel")
			document.onsystemevent = this.systemevent;
 		else if(ntv.profile.browser == "SHDV")
 		{
 			jShow.signal.connect(ntv.key.systemevent);
 		}
 };

 ntv.key.keypress = function(event){
 	var key_event = event ? event : window.Event;
	var key_code = key_event.which ? key_event.which : key_event.keyCode;

	ntv.log.console("ntv.key.keypress, keycode: " + key_code);

	ntv.navigation.move(key_code, event); // 用来处理 上/下/左/右/确定/刷新/返回 等常规键值
	ntv.key.keypress_handle(key_code); // 用来自定义处理键值的函数
 };

 /*
  * 用于手动控制返回页面路径的键值处理函数, 由于各浏览器厂商对返回事件处理不一致.
  * 说明: 通过禁止系统处理返回事件来达到手动控制返回操作. 代码经测试, 必须写在此处.
  * 使用：通过调用如下代码来手动控制返回操作
  *       ntv.stb.key.enable_manual_control_back_event();
  *       ntv.stb.key.move_back_url = "返回页面地址"; 
  */
 ntv.key.keypress_for_manual_control_back_event = function(event){
 	var key_event = event ? event : window.Event;
	var key_code = key_event.which ? key_event.which : key_event.keyCode;

	ntv.log.console("ntv.key.keypress, keycode: " + key_code);

	// 禁用系统返回键动作,以下代码必须放置在此
	var browser = ntv.profile.browser;
	if(browser == "NGB-H" && key_code == ntv.key.keycode_stb_ngb_h.KEY_BACK)
	{
		event.preventDefault();
		ntv.navigation.move_back();
	}
	else if(browser == "iPanel" && key_code == ntv.key.keycode_stb_ipanel.KEY_BACK)
	{
		ntv.navigation.move_back();
		return 0;
	}
	else if(browser == "SHDV" && key_code == ntv.key.keycode_stb_shdv.KEY_BACK)
	{
		ntv.navigation.move_back();
	}
	else if(browser == "PCBrowser" && key_code == ntv.key.keycode_pc.KEY_BACK)
	{
		event.preventDefault();
		ntv.navigation.move_back();
	}else
	{
		ntv.navigation.move(key_code, event); // 用来处理 上/下/左/右/确定/刷新/返回 等常规键值
		ntv.key.keypress_handle(key_code); // 用来自定义处理键值的函数
	}
	
 };

 // 具体使用时重写此函数
 ntv.key.keypress_handle = function(event_code){
 	ntv.log.console("ntv.key.keypress_handle() 1, event_code: " + event_code);
 	//grab1Event(event_code);
 };

 ntv.key.systemevent = function(event){
 	// SHDV回传对象需重新构造
 	if(ntv.profile.browser == "SHDV")
 	{
 		// 重构透传参数
		var shdv_system_event = {
			type: event.type,
			which: event.msg,
			modifiers: event.info
		};
		event = shdv_system_event;
 	}

 	var system_event = event ? event : window.Event;
	var event_code = system_event.which ? system_event.which : system_event.keyCode;

	ntv.log.console("ntv.key.systemevent(), event_code: " + event_code);
	ntv.key.systemevent_handle(event_code);
 };

 // 具体使用时重写此函数
 ntv.key.systemevent_handle = function(event_code){
 	ntv.log.console("ntv.key.systemevent_handle(), event_code: " + event_code);
 };

 ntv.key.keycode_pc = {
	KEY_OK : 13,
	KEY_UP : 38,
	KEY_DOWN : 40,
    KEY_LEFT : 37,
    KEY_RIGHT : 39,
    KEY_REFRESH : 116,
    KEY_BACK : 32,
    
    KEY_RED: 192 // ~键(tab上方)
 };

 ntv.key.keycode_stb_ipanel = {
	KEY_OK : 13,
	KEY_UP : 1,
	KEY_DOWN : 2,
    KEY_LEFT : 3,
    KEY_RIGHT : 4,
    KEY_REFRESH : 338,
    KEY_BACK : 340,

    KEY_RED: 832
 };

 ntv.key.keycode_stb_shdv = {
	KEY_OK : 13,
	KEY_UP : 38,
	KEY_DOWN : 40,
    KEY_LEFT : 37,
    KEY_RIGHT : 39,
    KEY_REFRESH : 338,
    KEY_BACK : 70,

    KEY_RED: 66
 };

 ntv.key.keycode_stb_ngb_h= {
	KEY_OK : 4097,
	KEY_UP : 38,
	KEY_DOWN : 40,
    KEY_LEFT : 37,
    KEY_RIGHT : 39,
    KEY_REFRESH : 4226,
    KEY_BACK : 4096,

    KEY_RED: 2305
 }; 

 ntv.key.keycode = ntv.key.keycode_pc;

 ntv.key.keycode_set = function(){
	if(ntv.profile.browser == "iPanel")
		this.keycode = this.keycode_stb_ipanel;
	else if(ntv.profile.browser == "SHDV")
		this.keycode = this.keycode_stb_shdv;
	else if(ntv.profile.browser == "NGB-H")
		this.keycode = this.keycode_stb_ngb_h;
 };


/*--Key对象初始化
====================================================== */
(function(){
	ntv.key.init();
})();/*-- NTV
====================================================== --*/

var ntv = ntv || {};

/*--Navigation 页面元素导航
====================================================== */
 ntv.navigation = function(){};

 ntv.navigation.coord = "11";
 ntv.navigation.coords = undefined;


 ntv.navigation.init = function(){
 	var log = "ntv.navigation.init()";

 	this.coords = this.getcoords();
 	if(this.coords)
 	{
	 	log += ", coords.length: " + this.coords.length;
	 	this.focus(this.coord);
	 }else
	 	log += ", The page not found coord element!";

	 ntv.log.console(log);
 };

 ntv.navigation.getcoords = function(){
 	var coords = [];
	var imgs = $("img");
	if(imgs.length > 0)
	{
		for(var i=0; i<imgs.length; i++)
		{
			if(imgs[i].alt)
				coords.push(imgs[i]);
		}
		ntv.log.console("ntv.navigation.getcoords(), coords[0]: " + imgs[0].name);
	}else
		coords = undefined;

	return coords;
 };

 ntv.navigation.move = function(keycode, event){
 	switch(keycode)
 	{
 		case ntv.key.keycode.KEY_UP:
 			ntv.navigation.move_up();
 			break;
 		case ntv.key.keycode.KEY_DOWN:
 			ntv.navigation.move_down();
 			break;
 		case ntv.key.keycode.KEY_LEFT:
 			ntv.navigation.move_left();
 			break;
 		case ntv.key.keycode.KEY_RIGHT:
 			ntv.navigation.move_right();
 			break;
 		case ntv.key.keycode.KEY_REFRESH:
 			ntv.page.refresh();
 			break;
 		case ntv.key.keycode.KEY_OK:
 			ntv.navigation.move_ok();
 			break;
 		case ntv.key.keycode.KEY_BACK:
 			ntv.navigation.move_back();
 			break;
 	}
 };

 ntv.navigation.move_up = function(){this.move_control(1)};
 ntv.navigation.move_down = function(){this.move_control(3)};
 ntv.navigation.move_left = function(){this.move_control(4)};
 ntv.navigation.move_right = function(){this.move_control(2)};
 ntv.navigation.move_notcoord_callback = function(num){}; // 超出导向范围的元素,使用时重写
 ntv.navigation.move_done_callback = function(coord){}; // 焦点移动完成的回调函数,使用时重写
 ntv.navigation.move_back = function(){}; // 具体使用时重写
 ntv.navigation.move_ok = function(){
 	var data = this.getElmByCoord(this.coord).name;

 	if(data && data != " ")
 	{
	 	if(data.indexOf("javascript:") == -1)
	 		ntv.page.openurl(data);
	 	else if(data.indexOf("javascript:") == 0)
	 	{
	 		try{
	 			eval(data);
	 		}catch(e){
	 			ntv.log.console("ntv.navigation.move_ok() , eval error!");
	 		};
	 	}
	 	else
	 		ntv.log.console("ntv.navigation.move_ok() , href is null!");
 	}
 };

 ntv.navigation.move_control = function(num){
 	if(this.coords)
 	{
	 	var target_coord = undefined;

		var current_coord = this.get_next_coord(num);
		if(current_coord)
	 		target_coord = this.getElmByCoord(current_coord);

	 	if(target_coord != undefined)
	 	{
	 		if(target_coord != this.getElmByCoord(this.coord))
	 		{
		 		this.blur(this.coord);
		 		this.coord = current_coord;
		 		this.focus(this.coord);
	 		}
	 		else if(current_coord != this.coord) // 1个元素多个坐标
			{
				this.coord = current_coord;
				this.move_control(num);
			}

			ntv.navigation.move_done_callback(current_coord); // 焦点移动完成的回调事件
	 	}else
	 		this.move_notcoord_callback(num); // 超出坐标的元素

	 	ntv.log.console("ntv.navigation.move_control(), target_coord: " + current_coord);
 	}
 };

 ntv.navigation.getElmByCoord = function(coord){
 	ntv.log.console("ntv.navigation.getElmByCoord(), coord: " + coord);
 	var elm = undefined;
 	if(coord)
 	{
 		for(var i=0; i<this.coords.length; i++)
		{
			var alt = this.coords[i].alt;

			if(alt.indexOf(",")) // 兼容1个元素多个坐标
			{
				var coord_ary = alt.split(",");
				for(var j=0; j<coord_ary.length; j++)
				{	
					if(coord_ary[j] == coord)
					{
						elm = this.coords[i];
						break;
					}
				}
			}else{
				if(alt == coord)
				{
					elm = this.coords[i];
					break;
				}
			}
		}
 	}

 	ntv.log.console("ntv.navigation.getElmByCoord(), target_coord: " + coord);
 	return elm;
 };

 ntv.navigation.focus = function(coord){
	var focus_flag = "-f";

	var elm = this.getElmByCoord(coord);
 	if(elm)
 	{
		bg_img = elm.src;
		var ext_name = bg_img.match(/\.[a-z]+/)[0];
		ntv.log.console("ntv.navigation.focus(), is foucs:" + bg_img.indexOf(focus_flag + ext_name));
		if(bg_img.indexOf(focus_flag + ext_name) == -1)
		{
			
			elm.src = bg_img.replace(ext_name, focus_flag + ext_name);
		}
		
		ntv.log.console("ntv.navigation.focus(), coord: " + coord + ", href: " + elm.name);
 	}else
 		ntv.log.console("ntv.navigation.focus(), coord not found!");
 };

 ntv.navigation.blur = function(coord){
 	var focus_flag = "-f";

 	var elm = this.getElmByCoord(coord);

 	if(elm)
 	{
			bg_img = elm.src;
			var ext_name = bg_img.match(/\.[a-z]+/)[0];
 			elm.src = bg_img.substring(0, bg_img.lastIndexOf(focus_flag)) + ext_name;

 			ntv.log.console("ntv.navigation.blur(), coord: " + coord);
 	}else
 		ntv.log.console("ntv.navigation.blur(), coord not found!");
 };

ntv.navigation.move_focus = function(coord){
	if(this.getElmByCoord(coord))
	{
		this.blur(this.coord);
		
		this.focus(coord);
		this.coord = coord;
	}
};

ntv.navigation.get_next_coord = function(num){
	var coord = undefined;
	if(this.coords)
 	{
	 	var current_coord = parseInt(this.coord);
	 	switch(num)
	 	{
	            case 1: // up
	                current_coord -= 10;
	                break;
	            case 2: // right
	                current_coord += 1;
	                break;
	            case 3: // down
	                current_coord += 10;
	                break;
	            case 4: // left
	                current_coord -= 1;
	                break;
	 	}

	 	coord = current_coord + "";
 	}

 	return coord;
};


/*--Navigation对象初始化
====================================================== */
(function(){
	ntv.navigation.init();
})();/*-- NTV
====================================================== --*/

var ntv = ntv || {};


/*--Page 页面处理类
====================================================== */
ntv.page = function(){};

ntv.page.init = function(){
	window.onload = ntv.page._onload;
	window.onunload = ntv.page._onunload;
	window.onbeforeunload = ntv.page._onunload;
};

/*--Page Event
====================================================== */
ntv.page._onload = function(){}; // 具体使用时重写,页面建议用匿名函数
ntv.page._onunload = function(){
	ntv.page.onbeforeunload_page();
	ntv.page.onbeforeunload_stb();
};
ntv.page.onbeforeunload_page = function(){}; // 页面使用时重写
ntv.page.onbeforeunload_stb = function(){}; // 被stb.js重写

/*--Tools
====================================================== */
ntv.page.openurl = function(url){
	window.location.href = url;
};

ntv.page.refresh = function(){
	window.location.href = window.location.href;
};

ntv.page.url = function(){};
ntv.page.url.host = function(){
	return "http://" + window.location.host;
	ntv.log.console("ntv.page.url.host: " + window.location.host);
};


/*--page对象初始化
====================================================== */
(function(){
	ntv.page.init();
})();/*-- NTV
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
				var rect = new Rectangle(_rectangle_x ,_rectangle_y ,_rectangle_w , _rectangle_h);//100 * rx, 10 * ry, 600 * rx, 400 * ry);
            	this.mp.setVideoDisplayArea(rect);
            	this.mp.refresh();
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
	this.mp.pause();
};

ntv.stb.ngb_h.mediaplayer.resume = function(){
	this.mp.resume();
};

ntv.stb.ngb_h.mediaplayer.getVolume = function(){
	return this.mp.getVolume();
}
ntv.stb.ngb_h.mediaplayer.setVolume = function(size){
	this.mp.setVolume(size);
};


ntv.stb.ngb_h.mediaplayer.seekSecond = function(second){
	 
	 var durationTime = this.mp.getMediaDuration();
	 var currTime = this.mp.getCurrentPlayTime();
	 document.getElementById("info").innerHTML="durationTime:"+durationTime;
	 document.getElementById("result").innerHTML="currTime:"+currTime;
	 if(second>0){
         if((currTime+second)<durationTime){
           this.mp.seek(1,getStrToTime(currTime+second)+'-now');
           //this.mp.seek(1,"00:02:00-now");
         }else{
            this.mp.seek(1,getStrToTime(durationTime)+'-now');
            //this.mp.seek(1,"00:01:00-now");
         }
     }else{
         if(currTime+second>0){
           this.mp.seek(1,getStrToTime(currTime+second)+'-now');
              //this.mp.seek(1,"00:03:00-now");
         }else{
            this.mp.seek(1,getStrToTime(0)+'-now');
               //this.mp.seek(1,"00:02:00-now");
        }
      }
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


/*-- NTV
====================================================== --*/

var ntv = ntv || {};
ntv.stb = ntv.stb || function(){};

/**
 * SHDV中间件问题汇总
 * 1. 返回键不透传给页面的document.onkeydown
 * 2. 页面的window.onbeforeunload时所有实例已销毁,所以释放资源时无法判断是否为空
 */

/*--STB SHDV
====================================================== */
ntv.stb.shdv = function(){};

ntv.stb.shdv.init = function(){
	ntv.stb.shdv.key.control_key_back(true);
};

/*--Tools
====================================================== */
ntv.stb.shdv.get_version = function(){
	return jShow.browserGetVersion();
};

ntv.stb.shdv.get_MAC = function(){
	return jShow.systemInfo().mac;
};

/*--Key
====================================================== */
ntv.stb.shdv.key = function(){};
ntv.stb.shdv.key.control_key_back = function(enabled){
	if(enabled)
		jShow.browserSetControlKeycode(this._change_key_mapping("VK_BACK_SPACE", "KEY_F"));
	else
		jShow.browserSetControlKeycode(this._change_key_mapping("VK_BACK_SPACE", "VK_BACK_SPACE"));
};

ntv.stb.shdv.key._change_key_mapping = function(source_key, new_key){
	var objKey = new Object();
	objKey.remoteCode = source_key;
	objKey.newKeyCode = new_key;
	objKey.ctrlMode = 0;
	objKey.shiftMode = 0;
	objKey.altMode = 0;
	return objKey;
};

ntv.stb.shdv.key.move_back = function(){
	ntv.log.console("ntv.stb.shdv.key.move_back()");
	if(ntv.stb.key.move_back_url)
	{
		ntv.page.openurl(ntv.stb.key.move_back_url);
		ntv.stb.shdv.key.control_key_back(false);

		ntv.stb.shdv.onpageunload();
	}
};

/*--MediaPlayer
====================================================== */
ntv.stb.shdv.mediaplayer = function(){};
ntv.stb.shdv.mediaplayer.mp = undefined;
ntv.stb.shdv.mediaplayer.msg = {}; // 由msg.js 重写
ntv.stb.shdv.mediaplayer.play = function(type, url){
	var log = "ntv.stb.shdv.mediaplayer.play()";
		log +=", param: type = " + type + ", url = " + url;

	if(!this.mp)
	{
		if(type == "AUDIO")
		{
			if(this._hip.play(url))
				this.mp = "hip";
		}
		else if(type == "9DAYEPG")
		{
			if(this._9dayepg.play())
				this.mp = "9dayepg";
		}

	}else
		log += ", " + this.msg.currentMediaPlayer + ntv.msg.common.exist;

	ntv.log.console(log);
};

ntv.stb.shdv.mediaplayer.pause = function(){
	var log = "ntv.stb.shdv.mediaplayer.pause()";

	if(this.mp)
	{
		if(this.mp == "hip")
			this._hip.pause();	
		//else if(this.mp == "9dayepg")
			// 待补充;

	}else
		log += ", " +　this.msg.currentMediaPlayer + ntv.msg.common.isnull;

	ntv.log.console(log);
};

ntv.stb.shdv.mediaplayer.resume = function(){};

ntv.stb.shdv.mediaplayer.stop = function(){
	var log = "ntv.stb.shdv.mediaplayer.stop()";

	if(this.mp)
	{
		if(this.mp == "hip")
			this._hip.stop();	
		//else if(this.mp == "9dayepg")
			// 待补充;

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
ntv.stb.shdv.mediaplayer._stop_every = function(){
	var log = "ntv.stb.ipanel.mediaplayer._stop_every()";

	// hIp接口
	jShow.hIpMediaStop()

	// 9dayepg接口
	// 待补充

	ntv.log.console(log);
};

/*--MediaPlayer Private hIp(IP点播)
====================================================== */
ntv.stb.shdv.mediaplayer._hip = function(){};
ntv.stb.shdv.mediaplayer._hip.msg = {}; // 由msg.js 重写
ntv.stb.shdv.mediaplayer._hip.play = function(url){
	var log = "ntv.stb.shdv.mediaplayer._hip.play()";
		log += ", param: url = " + url + ". ";

	var rs = jShow.hIpMediaPlay(url, 0, 1);

	if(rs == 0)
  		log += this.msg.hIpMediaPlay + ntv.msg.common.success;
  	else
  		log += this.msg.hIpMediaPlay + ntv.msg.common.failure;

	ntv.log.console(log);

	return rs == 0 ? true : false;
};

ntv.stb.shdv.mediaplayer._hip.pause = function(){
	var log = "ntv.stb.shdv.mediaplayer._hip.pause().";

	if(jShow.hIpMediaPause() == 0)
  		log += this.msg.hIpMediaPause + ntv.msg.common.success;
  	else
  		log += this.msg.hIpMediaPause + ntv.msg.common.failure;

	ntv.log.console(log);
};

ntv.stb.shdv.mediaplayer._hip.stop = function(){
	var log = "ntv.stb.shdv.mediaplayer._hip.stop().";

	if(jShow.hIpMediaStop() == 0)
		log += this.msg.hIpMediaStop + ntv.msg.common.success;
	else
		log += this.msg.hIpMediaStop + ntv.msg.common.failure;

	ntv.log.console(log);
};

ntv.stb.shdv.mediaplayer._hip.set_volume = function(value){
	var log = "ntv.stb.shdv.mediaplayer._hip.set_volume()";
		log += ", param: value = " + value + ". ";

	jShow.hIpMediaSetVolume(value)
	log += this.msg.hIpMediaSetVolume + ntv.msg.common.success;

	ntv.log.console(log);
};


/*--MediaPlayer Private 9dayepg(9天EPG)
====================================================== */
ntv.stb.shdv.mediaplayer._9dayepg = function(){};
ntv.stb.shdv.mediaplayer._9dayepg.msg = {}; // 由msg.js 重写
ntv.stb.shdv.mediaplayer._9dayepg.play = function(url){
	var log = "ntv.stb.shdv.mediaplayer._9dayepg.play()";
		log += ", param: url = " + url + ". ";

	var rs = jShow.play9dayEpgEvent(url);
	if(rs == 0)
  		log += this.msg.play9dayEpgEvent + ntv.msg.common.success;
  	else
  		log += this.msg.play9dayEpgEvent + ntv.msg.common.failure;

	ntv.log.console(log);

	return rs == 0 ? true : false;
};


/*--System Event
====================================================== */
ntv.stb.shdv.systemevent = function(event_code){
	ntv.log.console("ntv.stb.shdv.systemevent(), event_code:" + event_code);
};


/*--Destory beforeunload
====================================================== */
ntv.stb.shdv.onpageunload = function(){
	ntv.log.console("ntv.stb.shdv.onpageunload()");
	
	if(ntv.stb.shdv.mediaplayer.mp) // 返回键控制时
		ntv.stb.shdv.mediaplayer.mp = undefined;

	// 由于页面每次加载时都调用, 故使用_stop_every函数
	ntv.stb.shdv.mediaplayer._stop_every();

	// 注销系统消息处理
	jShow.signal.disconnect(ntv.key.systemevent);
};/*-- NTV
====================================================== --*/

var ntv = ntv || {};
ntv.stb = ntv.stb || function(){};


/*--PCBrowser
====================================================== */
ntv.stb.pcbrowser = function(){};

/*--Tools
====================================================== */
ntv.stb.pcbrowser.get_version = function(){
	return "12";
};

ntv.stb.pcbrowser.get_MAC = function(){
//	return "98bc576855c5";
//	return "7C08D9D710EA";
	return "7C08D9F5C8EF";
	return "98bc576e8007";
	return "98bc5705f8a0";
};

/*--Key
====================================================== */
ntv.stb.pcbrowser.key = function(){};
ntv.stb.pcbrowser.key.move_back = function(){
	ntv.log.console("ntv.stb.pcbrowser.key.move_back()");
	if(ntv.stb.key.move_back_url)
	{
		ntv.page.openurl(ntv.stb.key.move_back_url);
	}
};

/*--MediaPlayer
====================================================== */
ntv.stb.pcbrowser.mediaplayer = function(){};
ntv.stb.pcbrowser.mediaplayer.mp = undefined;
ntv.stb.pcbrowser.mediaplayer.msg = {}; // 由msg.js 重写

ntv.stb.pcbrowser.mediaplayer.play = function(type, url){
	var log = "ntv.stb.pcbrowser.mediaplayer.play()";
		log += ", param : type = " + type + ", url = " + url + ". ";

	if(!this.mp)
	{
		log += this.msg.play + ntv.msg.common.success;
		this.mp = 1;
	}
	else
		log += this.msg.currentMediaPlayer + ntv.msg.common.exist;

	ntv.log.console(log);
};

ntv.stb.pcbrowser.mediaplayer.pause = function(){
	var log = "ntv.stb.pcbrowser.mediaplayer.pause(), ";

	if(this.mp)
		log += this.msg.pause + ntv.msg.common.success;
	else
		log += this.msg.currentMediaPlayer + ntv.msg.common.isnull;

	ntv.log.console(log);
};

ntv.stb.pcbrowser.mediaplayer.resume = function(){
	var log = "ntv.stb.pcbrowser.mediaplayer.resume(), ";

	if(this.mp)
		log += this.msg.resume + ntv.msg.common.success;
	else
		log += this.msg.currentMediaPlayer + ntv.msg.common.isnull;

	ntv.log.console(log);
};

ntv.stb.pcbrowser.mediaplayer.stop = function(){
	var log = "ntv.stb.pcbrowser.mediaplayer.stop(), ";

	if(this.mp)
	{
		log += this.msg.stop + ntv.msg.common.success;
		this.mp = undefined;
	}
	else
		log += this.msg.currentMediaPlayer + ntv.msg.common.isnull;

	ntv.log.console(log);
}; /*-- NTV
====================================================== --*/

 var ntv = ntv || {};


/*--Msg
====================================================== */
ntv.msg = function(){};
ntv.msg.common = {
	success:           "SUCCESS.",
	failure:           "FAILURE.",
	error:             "ERROR.",
	exist:          　 "IS EXIST.",
	isnull:            "IS NULL."
};


/*--STB NGB-H
====================================================== */
ntv.msg.ngb_h = function(){};
ntv.msg.ngb_h.init = function(){
	ntv.stb.ngb_h.mediaplayer.msg = this.dev.mediaplayer;
};

ntv.msg.ngb_h.dev = function(){};
ntv.msg.ngb_h.dev.mediaplayer = {
	// MediaPlayer对象
	getPlayerInstanceID: "获得接收终端本地可用的播放器实例ID: ",
	bindPlayerInstance:  "MediaPlayer对象与播放器实例绑定: ",
	unbindPlayerInstance: "MediaPlayer对象和当前播放器实例解除绑定: ",
	setMediaSource:       "异步方法，设置待播放媒体的URL地址: ",
	play:                 "异步方法，从媒体起始点开始播放: ",
	seek:                 "异步方法，从当前媒体的某个时间点开始播放: ",
	setPace:              "异步方法，设置播放步长: ",
	pause:                "异步方法，暂停播放: ",
	resume:               "异步方法，恢复播放: ",
	stop:                 "异步方法，停止播放: ",
	refresh:              "刷新视频窗口: ",
	enableTrickMode:      "设置MediaPlayer对象当前所绑定的播放器实例在其生命周期内是否允许特技操作: ",
	getTrickModeFlag:     "获取特技模式操作标志: ",
	setVideoDisplayMode:  "设置MediaPlayer对象对应的视频窗口的显示模式: ",
	getVideoDisplayMode:  "获取MediaPlayer对象对应的视频窗口的显示模式: ",
	setVideoDisplayArea:  "设置窗口显示区域: ",
	getVideoDisplayArea:  "获取视频窗口显示区域的位置信息: ",
	setVolume:            "设置当前音量: ",
	getVolume:            "获取当前音量: ",
	getMediaDuration:     "获取当前播放媒体的总时长: ",
	getCurrentPlayTime:   "获取媒体播放的当前时间点: ",
	getPlaybackMode:      "获取播放器当前的播放模式: ",
	// 自定义
	currentMediaPlayer:   "当前MediaPlayer实例: "
};

/*--STB iPanel
====================================================== */
ntv.msg.ipanel = function(){};
ntv.msg.ipanel.init = function(){
	ntv.stb.ipanel.mediaplayer.msg = this.dev.mediaplayer;
	ntv.stb.ipanel.mediaplayer._mp3.msg = this.dev.mediaplayer;
	ntv.stb.ipanel.mediaplayer._media.av.msg = this.dev.mediaplayer;
};

ntv.msg.ipanel.dev = function(){};
ntv.msg.ipanel.dev.mediaplayer = {
	// media.AV接口
	media_AV_open:         "media.AV接口，异步方法，打开指定媒体源进入待命状态: ",
	media_AV_play:         "media.AV接口，异步方法，开始正常播放当前所打开的视频: ",
	media_AV_pause:        "media.AV接口，暂时停止正在播放的视频: ",
	media_AV_stop:         "media.AV接口，将正在播放的、暂停的视频停止播放，进入待命状态: ",
	media_AV_close:        "media.AV接口，释放该媒体源信息及其相关信息: ",
	// MP3接口（已过时），为了兼容低版本。新版本请使用，media.AV接口
	MP3_setProperty:       "MP3接口（已过时），设置媒体属性: ",
	MP3_open:              "MP3接口（已过时），打开媒体源: ",
	MP3_play:              "MP3接口（已过时），播放媒体: ",
	MP3_pause:             "MP3接口（已过时），暂停播放: ",
	MP3_stop:              "MP3接口（已过时），停止媒体播放: ",
	MP3_close:             "MP3接口（已过时），释放媒体资源: ",
	MP3_resume:            "MP3接口（已过时），恢复已暂停的播放: ",
	// 自定义
	currentMediaPlayer:    "当前MediaPlayer实例: "
};

/*--STB SHDV
====================================================== */
ntv.msg.shdv = function(){};
ntv.msg.shdv.init = function(){
	ntv.stb.shdv.mediaplayer.msg = this.dev.mediaplayer;
	ntv.stb.shdv.mediaplayer._hip.msg = this.dev.mediaplayer;
	ntv.stb.shdv.mediaplayer._9dayepg.msg = this.dev.mediaplayer;
};

ntv.msg.shdv.dev = function(){};
ntv.msg.shdv.dev.mediaplayer = {
	// jShow IP点播接口
	hIpMediaPlay:          "IP点播接口，Ip方式播放文件: ",
	hIpMediaPause:         "IP点播接口，暂停正在通过ip方式播放的文件: ",
	hIpMediaStop:          "IP点播接口，停止正在通过ip方式播放的文件: ",
	hIpMediaSetVolume:     "IP点播接口，播放背景视频的同时设置背景视频音量: ",
	// 自定义
	currentMediaPlayer:    "当前MediaPlayer实例: "

};

/*--STB PCBrowser
====================================================== */
ntv.msg.pcbrowser = function(){};
ntv.msg.pcbrowser.init = function(){
	ntv.stb.pcbrowser.mediaplayer.msg = this.dev.mediaplayer;
};

ntv.msg.pcbrowser.dev = function(){};
ntv.msg.pcbrowser.dev.mediaplayer = {
	play:                  "PC浏览器，播放视频: ",
	pause:                 "PC浏览器，暂停视频播放: ",
	resume:                "PC浏览器，恢复暂停的视频: ",
	stop:                  "PC浏览器，停止视频播放: ",
	// 自定义
	currentMediaPlayer:    "当前MediaPlayer实例: "

};



/*--Msg对象初始化
====================================================== */
(function(){
	ntv.msg.ngb_h.init();
	ntv.msg.ipanel.init();
	ntv.msg.shdv.init();
	ntv.msg.pcbrowser.init();
})();/*-- NTV
====================================================== --*/

var ntv = ntv || {};

/*--依赖 ngb_h.js, ipanel.js, shdv.js, pc.js 之后引用
====================================================== */

/*--STB
====================================================== */
ntv.stb = ntv.stb || function(){};

ntv.stb.init = function(){
	ntv.log.console("当前网页运行的浏览器版本为: " + this.get_version());

	ntv.stb.load.init();
	ntv.stb.key.init();
	ntv.stb.mediaplayer.init();
	ntv.stb.systemevent.init();
	ntv.stb.unload.init();
};

/*--Load
====================================================== */
ntv.stb.load = function(){};
ntv.stb.load.init = function(){
	ntv.log.console("ntv.stb.load.init()");

	var browser = ntv.profile.browser;
	
	if(browser == "NGB-H")
		ntv.stb.ngb_h.init();
	else if(browser == "iPanel")
		ntv.stb.ipanel.init();
	else if(browser == "SHDV")
		ntv.stb.shdv.init();
};

/*--Tools
====================================================== */
ntv.stb.get_version = function(){
	var version = "未获取到浏览器版本!";

	var browser = ntv.profile.browser;

	if(browser == "iPanel")
		version = ntv.stb.ipanel.get_version()[0];
	else if(browser == "SHDV")
		version = ntv.stb.shdv.get_version();
	else if(browser == "NGB-H")
		version = ntv.stb.ngb_h.get_version();
	else if(browser == "PCBrowser")
		version = ntv.stb.pcbrowser.get_version();

	return version;
};

ntv.stb.get_MAC = function(){
	var mac = "未获取到机顶盒MAC地址!";

    var browser = ntv.profile.browser;

	if(browser == "iPanel")
		mac = ntv.stb.ipanel.get_MAC();
	else if(browser == "SHDV")
		mac = ntv.stb.shdv.get_MAC();
	else if(browser == "NGB-H")
		mac = ntv.stb.ngb_h.get_MAC();
	else if(browser == "PCBrowser")
		mac = ntv.stb.pcbrowser.get_MAC();

	ntv.log.console("ntv.stb.get_MAC(), mac: "+ mac);
	return mac;
};

/*--Key
====================================================== */
ntv.stb.key = function(){};
ntv.stb.key.move_back_url = "";
ntv.stb.key.init = function(){
	ntv.log.console("ntv.stb.key.init()");

	var browser = ntv.profile.browser;
	
	if(browser == "NGB-H")
		ntv.navigation.move_back = ntv.stb.ngb_h.key.move_back;
	else if(browser == "iPanel")
		ntv.navigation.move_back = ntv.stb.ipanel.key.move_back;
	else if(browser == "SHDV")
		ntv.navigation.move_back = ntv.stb.shdv.key.move_back;
	else if(browser == "PCBrowser")
		ntv.navigation.move_back = ntv.stb.pcbrowser.key.move_back;
};

ntv.stb.key.enable_manual_control_back_event = function(){
	ntv.key.keypress = ntv.key.keypress_for_manual_control_back_event;
};

/*--MediaPlayer
====================================================== */
ntv.stb.mediaplayer = function(){};
ntv.stb.mediaplayer.init = function(){
	ntv.log.console("ntv.stb.mediaplayer.init()");

	var browser = ntv.profile.browser;
	if(browser == "NGB-H")
		ntv.stb.mediaplayer = ntv.stb.ngb_h.mediaplayer;
	else if(browser == "iPanel")
		ntv.stb.mediaplayer = ntv.stb.ipanel.mediaplayer;
	else if(browser == "SHDV")
		ntv.stb.mediaplayer = ntv.stb.shdv.mediaplayer;
	else if(browser == "PCBrowser")
		ntv.stb.mediaplayer = ntv.stb.pcbrowser.mediaplayer;
};

/*--SystemEvent
====================================================== */
ntv.stb.systemevent = function(){};
ntv.stb.systemevent.init = function(){
	ntv.log.console("ntv.stb.systemevent.init()");

	var browser = ntv.profile.browser;
	
	if(browser == "NGB-H")
		ntv.key.systemevent_handle = ntv.stb.ngb_h.systemevent;
	else if(browser == "iPanel")
		ntv.key.systemevent_handle = ntv.stb.ipanel.systemevent;
	else if(browser == "SHDV")
		ntv.key.systemevent_handle = ntv.stb.shdv.systemevent;
};

/*--unload
====================================================== */
ntv.stb.unload = function(){};
ntv.stb.unload.init = function(){
	ntv.log.console("ntv.stb.unload.init()");

	var browser = ntv.profile.browser;
	
	if(browser == "NGB-H") // NGB-H在离开页面时会自动释放媒体资源
		ntv.page.onbeforeunload_stb = ntv.stb.ngb_h.onpageunload;
	else if(browser == "iPanel")
		ntv.stb.ipanel.onpageunload();
	else if(browser == "SHDV")
		ntv.stb.shdv.onpageunload();
};



/*--stb对象初始化
====================================================== */
(function(){
	ntv.stb.init();
})(); /*-- NTV
 ====================================================== --*/

 var ntv = ntv || {};

 /*-- Utils 工具类
 ====================================================== */
 ntv.utils = function() {};

 /*-- 字符串相关
 ====================================================== */
 ntv.utils.string = function() {};
 ntv.utils.string.substring = function(str, len) {
 	var r = /[^\x00-\xff]/g; // 支持中英文数字混合模式

 	if(str.replace(r, "mm").length <= len)
 		return str;

 	var m = Math.floor(len / 2);
 	for(var i = m; i < str.length; i++) {
 		if(str.substr(0, i).replace(r, "mm").length >= len) {
 			return str.substr(0, i) + "...";
 		}
 	}
 	return str;
 };

 /*-- 机顶盒相关
 ====================================================== */
 ntv.utils.stb = function() {};
 ntv.utils.stb.clear_html = function(str) {
 	var rs = this.clear_a_mailto(str);

 	return rs;
 };

 /* 解决HTML<a href="mailto:li.wen@shanghaiik.com"></a>
  * 含带href="mailto:**"导致机顶盒的浏览器无法解析。*/
 ntv.utils.stb.clear_a_mailto = function(str) {
 	return str.replace(/href="mailto:/g, " style='color:#000;' href='#mailto:'");
 };
 
/*-- 时间处理
 ====================================================== */
 // 对Date的扩展，将 Date 转化为指定格式的String
 // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
 // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
 // 例子： 
 // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
 // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
 Date.prototype.Format = function(fmt) { //author: meizz 
 	var o = {
 		"M+": this.getMonth() + 1, //月份 
 		"d+": this.getDate(), //日 
 		"h+": this.getHours(), //小时 
 		"m+": this.getMinutes(), //分 
 		"s+": this.getSeconds(), //秒 
 		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
 		"S": this.getMilliseconds() //毫秒 
 	};
 	if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
 	for(var k in o)
 		if(new RegExp("(" + k + ")").test(fmt))
 			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
 	return fmt;
 }