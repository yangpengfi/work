/**
 * Created by ypf on 2017/12/28.
 */
var banxue = $.noConflict();
//选择器
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

var ntv = ntv || {};

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
/*--NTV对象初始化*/
(function() {
    ntv.profile.init();
    ntv.profile.info();
})();
/*--Key 页面键值控制
 ====================================================== */
ntv.key = function(){};

ntv.key.init = function(){
    this.listener_keyevent();
    this.listener_systemevent();
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
    ntv.key.keycode=eventMapping(key_code).code;
    ntv.navigation.move(eventMapping(key_code), event); // 用来处理 上/下/左/右/确定/刷新/返回 等常规键值
    ntv.key.keypress_handle(eventMapping(key_code)); // 用来自定义处理键值的函数
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
        ntv.navigation.move(eventMapping(key_code), event);; // 用来处理 上/下/左/右/确定/刷新/返回 等常规键值
        ntv.key.keypress_handle(eventMapping(key_code)); // 用来自定义处理键值的函数
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
/*键值映射 */
function eventMapping(keycode) {
    var code = "";
    var args = {};
    if (keycode < 58 && keycode > 47) { //数字键
        args = {value: (keycode - 48) };
        code = "KEY_NUM";
    } else {
        var args = {value: keycode };
        switch (keycode) {
            case 1:
            case 38: //advanced_value
                code = "KEY_UP";
                break;
            case 2:
            case 40: //advanced_value
                code = "KEY_DOWN";
                break;
            case 3:
            case 37: //advanced_value
                code = "KEY_LEFT";
                break;
            case 4:
            case 39: //advanced_value
                code = "KEY_RIGHT";
                break;
            case 116:
            case 338:
                code = "KEY_REFRESH";
                break;
            case 13:
                code = "KEY_OK";
                break;
            case 339:
            case 27: //advanced_value
                code = "KEY_EXIT";
                break;
            case 340:
            case 8: //advanced_value
                code = "KEY_BACK";
                break;
            case 372:
            case 33: //advanced_value
                code = "KEY_PAGE_UP";
                break;
            case 373:
            case 34: //advanced_value
                code = "KEY_PAGE_DOWN";
                break;
            case 512: //首页
            case 4098: //advanced_value
                code = "KEY_HOMEPAGE";
                break;
            case 513: //菜单键
            case 4097: //advanced_value
                code = "KEY_MENU";
                break;
            case 832: //red
            case 2305: //advanced_value
                code = "KEY_RED";
                break;
            case 833: //green
            case 2306: //advanced_value
                code = "KEY_GREEN";
                break;
            case 834: //yellow
            case 2307: //advanced_value
                code = "KEY_YELLOW";
                break;
            case 835: //blue
            case 2308: //advanced_value
                code = "KEY_BLUE";
                break;
            /*vod播放消息映射*/
            case 5202:
                code = "MSG_MEDIA_URL_VALID";
                break;
            case 5203:
                code = "MSG_MEDIA_URL_INVALID";
                break;
            case 5204:
                code = "EIS_VOD_DVB_SERACH_FAILED";
                break;
            case 5205:
                code = "EIS_VOD_START_SUCCESS";
                break;
            case 5221:
                code = "EIS_VOD_START_FAILED";
                break;
            case 5210:
                code = "EIS_VOD_PLAY_END";
                break;
        }
    }
    return { code: code, args: args };
}


/*--Key对象初始化
 ====================================================== */
(function(){
    ntv.key.init();
})();
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
    var code = keycode.code;
    switch(code)
    {
        case "KEY_UP":
            ntv.navigation.move_up();
            break;
        case "KEY_DOWN":
            ntv.navigation.move_down();
            break;
        case "KEY_LEFT":
            ntv.navigation.move_left();
            break;
        case "KEY_RIGHT":
            ntv.navigation.move_right();
            break;
        case "KEY_REFRESH":
            ntv.page.refresh();
            break;
        case "KEY_OK":
            ntv.navigation.move_ok();
            break;
        case "KEY_BACK":
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
        ntv.navigation.move_done_callback(coord); // 焦点移动完成的回调事件
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
})();
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
})();