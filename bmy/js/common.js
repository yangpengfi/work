/*页面版式设置 start*/

/*页面版式设置 end*/

var DEBUG = 1; //0表示真实数据,1表示测试数据

//var yytUrl = "http://10.215.4.1:9001/tvself/index.jsp"; //营业厅订购url
var playIp = "http://vod.fjgdwl.com:80/gldb/NEW_UI/vodPlay/"; //去vod播放的路径
var recommendIp = "http://vod.fjgdwl.com:80/gldb/NEW_UI/tuijian/"; //推荐的地址
if (DEBUG == 1) recommendIp = "tuijian/";

if (navigator.appName.indexOf("iPanel") != -1) {
    document.onsystemevent = function() {
        return (eventHandler(eventMapping(event), 2));
    };
    var E = iPanel.eventFrame;
    var account = GlobalVarManager.getItemStr("account");
    var portalurl = GlobalVarManager.getItemStr("tvPortalUrl");
    var ip = iPanel.getGlobalVar("ip"); // ip
    var port = iPanel.getGlobalVar("port"); // 端口
    var area_code = VOD.areaCode;
    if (area_code == "") {
        area_code = VOD.server.regionId;
    }
    if (area_code == "") {
        area_code = VOD.server.nodeGroupID;
    };
} else {
    var E = window;
    var account = "";
    var portalurl = "";
    var ip = ""; // ip
    var port = ""; // 端口
    var area_code = "";
}

function setGlobalVar(_name, _value) { //设置全局变量
    if (navigator.appName.indexOf("iPanel") != -1) {
        iPanel.setGlobalVar(_name, _value);
    } else {
        sessionStorage.setItem(_name, _value);
    }
}

function getGlobalVar(_name) { //获取全局变量
    if (navigator.appName.indexOf("iPanel") != -1) {
        return iPanel.getGlobalVar(_name);
    } else {
        return sessionStorage.getItem(_name);
    }
}

function delGlobalVar(_name) { //删除全局变量
    if (navigator.appName.indexOf("iPanel") != -1) {
        iPanel.delGlobalVar(_name);
    } else {
        sessionStorage.removeItem(_name);
    }
}

function getDisplayStr(_str) {
    if (navigator.appName.indexOf("iPanel") != -1) {
        return iPanel.getDisplayString(_str);
    } else {
        return _str;
    }
}

function gotoPortal() {
    window.location.href = portalurl;
}

var userAgent = navigator.userAgent.toLowerCase();
var webkitFlag = true;
var EVENT = { STOP: false, DOWN: true, ADVECTED: true }; //控制消息流向 截止：EVENT.STOP  同层：EVENT.ADVECTED  下一层：EVENT.DOWN
if (userAgent.indexOf("ipanel") != -1 && userAgent.indexOf("advanced") == -1) { //ipanel 3.0
    webkitFlag = false;
    EVENT = { STOP: 0, DOWN: 1, ADVECTED: 2 };
}

function iDebug(str) { //打印函数
    if (userAgent.indexOf("ipanel") != -1) {
        iPanel.debug(str, 2);
    } else {
        console.log(str);
    }
}

function $(__id) {
    return document.getElementById(__id);
}

if (webkitFlag) {
    document.onkeydown = function() {
        return (eventHandler(eventMapping(event), 1));
    };
} else {
    document.onkeypress = function() {
        return (eventHandler(eventMapping(event), 1));
    };
    document.onirkeypress = function() {
        return (eventHandler(eventMapping(event), 1));
    };
}
/*键值映射
args不定义type，消息流向由页面控制（调用EVENT.STOP/EVENT.DOWN/EVENT.ADVECTED）
页面定义eventHandler方法处理按键
*/
function eventMapping(__event) {
    var keycode = __event.which;
    var code = "";
    var args = {};
    if (keycode < 58 && keycode > 47) { //数字键
        args = { modifiers: __event.modifiers, value: (keycode - 48) };
        code = "KEY_NUM";
    } else {
        var args = { modifiers: __event.modifiers, value: keycode };
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
            case 13:
                code = "KEY_SELECT";
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

//***************************************hashMap  start*******************************//
function hashTableClass(_maxLength) {
    /**
     * 仿写java中的hashmap对象，在eventFrame里进行数据缓存
     * @_maxLength：整型，缓存条目数量
     * 注意：
     *  1、自行判定条目是否已存在，控制是否覆盖数据（也可在使用put方法时传入第三个布尔参数进行控制），否则将视为更新已存在的数据
     *  2、delete系统方法，可能不被一些vane版本中间件支持
     */
    this.maxLength = typeof(_maxLength) == "undefined" ? 50 : _maxLength;

    this.hash = new Object();
    this.arry = new Array(); //记录条目的key

    this.put = function(_key, _value, _notCover) {
        /**
         * @_key：字符串型
         * @_value：不限制类型
         * @_notCover：布尔型，设定为真后不进行覆盖
         */
        if (typeof(_key) == "undefined") {
            return false;
        }
        if (this.contains(_key) == true) {
            if (_notCover) {
                return false;
            }
        }
        this.limit();
        if (this.contains(_key) == false) {
            this.arry.push(_key);
        }
        this.hash[_key] = typeof(_value) == "undefined" ? null : _value;
        return true;
    };
    this.get = function(_key) {
        if (typeof(_key) != "undefined") {
            if (this.contains(_key) == true) {
                return this.hash[_key];
            } else {
                return false;
            }
        } else {
            return false;
        }
    };
    this.remove = function(_key) {
        if (this.contains(_key) == true) {
            delete this.hash[_key];
            for (var i = 0, len = this.arry.length; i < len; i++) {
                if (this.arry[i] == _key) {
                    this.arry.splice(i, 1);
                    break;
                }
            }
            return true;
        } else {
            return false;
        }
    };
    //this.count = function() {var i = 0; for(var key in this.hash) {i++;} return i;};
    this.contains = function(_key) {
        return typeof(this.hash[_key]) != "undefined";
    };
    this.clear = function() {
        this.hash = {};
        this.arry = [];
    };
    this.limit = function() {
        if (this.arry.length >= this.maxLength) { //保存的对象数大于规定的最大数量
            var key = this.arry.shift(); //删除数组第一个数据，并返回数组原来第一个元素的值
            this.remove(key);
        }
    };
}

var hashTableObj = new hashTableClass(50);
/***************************************hashMap  end*******************************/

//*******************************获取标准URL的参数 start************************//
/**
 * 获取标准URL的参数
 * @_key：字符串，不支持数组参数（多个相同的key）
 * @_url：字符串，（window）.location.href，使用时别误传入非window对象
 * @_spliter：字符串，参数间分隔符
 * 注意：
 *  1、如不存在指定键，返回空字符串，方便直接显示，使用时注意判断
 *  2、非标准URL勿用
 *  3、query（？）与hash（#）中存在键值一样时，以数组返回
 */
function getUrlParams(_key, _url, _spliter) {
    if (typeof(_url) == "object") {
        var url = _url.location.href;
    } else {
        var url = _url ? _url : window.location.href;
    }
    if (url.indexOf("?") == -1 && url.indexOf("#") == -1) {
        return "";
    }
    var spliter = _spliter || "&";
    var spliter_1 = "#";
    var haveQuery = false;
    var x_0 = url.indexOf(spliter);
    var x_1 = url.indexOf(spliter_1);
    var urlParams;
    if (x_0 != -1 || x_1 != -1 || url.indexOf("?") != -1) {
        if (url.indexOf("?") != -1) urlParams = url.split("?")[1];
        else if (url.indexOf("#") != -1) urlParams = url.split("#")[1];
        else urlParams = url.split(spliter)[1];
        if (urlParams.indexOf(spliter) != -1 || urlParams.indexOf(spliter_1) != -1) { //可能出现 url?a=1&b=3#c=2&d=5 url?a=1&b=2 url#a=1&b=2的情况。
            var v = [];
            if (urlParams.indexOf(spliter_1) != -1) {
                v = urlParams.split(spliter_1);
                urlParams = [];
                for (var x = 0; x < v.length; x++) {
                    urlParams = urlParams.concat(v[x].split(spliter));
                }
            } else {
                urlParams = urlParams.split(spliter);
            }
        } else {
            urlParams = [urlParams];
        }
        haveQuery = true;
    } else {
        urlParams = [url];
    }
    var valueArr = [];
    for (var i = 0, len = urlParams.length; i < len; i++) {
        var params = urlParams[i].split("=");
        if (params[0] == _key) {
            valueArr.push(params[1]);
        }
    }
    if (valueArr.length > 0) {
        if (valueArr.length == 1) {
            return valueArr[0];
        }
        return valueArr;
    }
    return "";
}
//*****************************获取标准URL的参数 end********************//

/*
 *str:传入的字符串
 *len:字符串的最大长度，为汉字字符串长度，字母、符号的情况则换算为汉字长度
 *suffix:截取后的字符串结尾填充的字符串，如".."、"..."，不传则不填充，这里只考虑长度小于等于3的填充字符(不能为汉字)，或不传入的情况
 *返回截取的字符串
 */
function getStrChineseLen(str, len, suffix) {
    var arr = str.split("");
    var n = arr.length;
    var i = 0;
    for (i = n - 1; i >= 0; i--) {
        if (arr[i] != " " && arr[i] != "\t" && arr[i] != "\n") {
            break;
        }
        arr.pop();
    }
    n = i + 1;
    str = arr.join("");
    var c;
    var w = 0;
    var flag0 = 0; //上上个字符是否是双字节
    var flag1 = 0; //上个字符是否是双字节
    var flag2 = 0; //当前字符是否是双字节
    for (i = 0; i < n; i++) {
        c = arr[i].charCodeAt(0);
        flag0 = flag1;
        flag1 = flag2;
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
            w++;
            flag2 = 0;
        } else {
            w += 2;
            flag2 = 1;
        }
        if (parseInt((w + 1) / 2) > len) {
            if (typeof(suffix) == "undefined") {
                return str.substring(0, i);
            } else if (suffix.length == 1) {
                return str.substring(0, i - 1) + suffix;
            } else if (suffix.length == 2) {
                if (flag1 == 1) return str.substring(0, i - 1) + suffix;
                else return str.substring(0, i - 2) + suffix;
            } else {
                if (flag1 == 1) return str.substring(0, i - 2) + suffix;
                else {
                    var num = flag0 == 1 ? 2 : 3;
                    return str.substring(0, i - num) + suffix;
                }
            }
            break;
        }
    }
    return str;
}

//返回字符串长度，为汉字长度，即如果字符串为汉字如"字符"，则返回2，如为"zf"，则返回1，英文2个字符等同一个汉字的长度
function getStrChineseLength(str) {
    var arr = str.split("");
    var n = arr.length;
    var i = 0;
    for (i = n - 1; i >= 0; i--) {
        if (arr[i] != " " && arr[i] != "\t" && arr[i] != "\n") {
            break;
        }
        arr.pop();
    }
    n = i + 1;
    var c;
    var w = 0;
    for (i = 0; i < n; i++) {
        c = arr[i].charCodeAt(0);
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
            w++;
        } else {
            w += 2;
        }
    }
    var length = w % 2 == 0 ? (w / 2) : (parseInt(w / 2) + 1);
    return length;
}


/****************************ajax请求 start**************************************/
function ajaxClass(_url, _successCallback, _failureCallback, _urlParameters, _callbackParams, _async, _charset, _timeout, _frequency, _requestTimes, _frame) {
    /**
     * AJAX通过GET或POST的方式进行异步或同步请求数据
     * 注意：
     *  1、服务器240 No Content是被HTTP标准视为请求成功的
     *  2、要使用responseXML就不能设置_charset，需要直接传入null
     *  3、_frame，就是实例化本对象的页面对象，请尽量保证准确，避免出现难以解释的异常
     */
    /**
     * @param{string} _url: 请求路径
     * @param{function} _successCallback: 请求成功后执行的回调函数，带一个参数（可扩展一个）：new XMLHttpRequest()的返回值
     * @param{function} _failureCallback: 请求失败/超时后执行的回调函数，参数同成功回调，常用.status，.statusText
     * @param{string} _urlParameters: 请求路径所需要传递的url参数/数据
     * @param{*} _callbackParams: 请求结束时在回调函数中传入的参数，自定义内容
     * @param{boolean} _async: 是否异步调用，默认为true：异步，false：同步
     * @param{string} _charset: 请求返回的数据的编码格式，部分iPanel浏览器和IE6不支持，需要返回XML对象时不能使用
     * @param{number} _timeout: 每次发出请求后多长时间内没有成功返回数据视为请求失败而结束请求（超时）
     * @param{number} _frequency: 请求失败后隔多长时间重新请求一次
     * @param{number} _requestTimes: 请求失败后重新请求多少次
     * @param{object} _frame: 窗体对象，需要严格控制，否则会有可能出现页面已经被销毁，回调还执行的情况
     */
    this.url = _url || "";
    this.successCallback = _successCallback || function(_xmlHttp, _params) {
        //iPanel.debug("[xmlHttp] responseText: " + _xmlHttp.responseText);
    };
    this.failureCallback = _failureCallback || function(_xmlHttp, _params) {
        //iPanel.debug("[xmlHttp] status: " + _xmlHttp.status + ", statusText: " + _xmlHttp.statusText);
    };
    this.urlParameters = _urlParameters || "";
    this.callbackParams = _callbackParams || null;
    this.async = typeof(_async) == "undefined" ? true : _async;
    this.charset = _charset || null;
    this.timeout = _timeout || 5000; //20s
    this.frequency = _frequency || 500; //10s
    this.requestTimes = _requestTimes || 1;
    this.frame = _frame || window;

    this.timer = -1;
    this.counter = 0;

    this.method = "GET";
    this.headers = null;
    this.username = "";
    this.password = "";

    this.createXmlHttpRequest = function() {
        var xmlHttp = null;
        try { //Standard
            xmlHttp = new XMLHttpRequest();
        } catch (exception) { //Internet Explorer
            try {
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (exception) {
                try {
                    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (exception) {
                    return false;
                }
            }
        }
        return xmlHttp;
    };
    this.xmlHttp = this.createXmlHttpRequest();

    this.requestData = function(_method, _headers, _username, _password) {
        /**
         * @param{string} _method: 传递数据的方式，POST/GET
         * @param{string} _headers: 传递数据的头信息，json格式
         * @param{string} _username: 服务器需要认证时的用户名
         * @param{string} _password: 服务器需要认证时的用户密码
         */
        this.frame.clearTimeout(this.timer);
        this.method = typeof(_method) == "undefined" ? "GET" : (_method.toLowerCase() == "post") ? "POST" : "GET";
        this.headers = typeof(_headers) == "undefined" ? null : _headers;
        this.username = typeof(_username) == "undefined" ? "" : _username;
        this.password = typeof(_password) == "undefined" ? "" : _password;
        //iPanel.debug("[xmlHttp] method=" + this.method + "-->headers=" + _headers + "-->username=" +  this.username + "-->password=" + this.password);
        var target = this;
        var url;
        var data;
        this.xmlHttp.onreadystatechange = function() {
            target.stateChanged();
        };
        if (this.method == "POST") { //encodeURIComponent
            url = encodeURI(this.url);
            data = this.urlParameters;
        } else {
            url = encodeURI(this.url + (((this.urlParameters != "" && this.urlParameters.indexOf("?") == -1) && this.url.indexOf("?") == -1) ? ("?" + this.urlParameters) : this.urlParameters));
            data = null;
        }
        //iPanel.debug("[xmlHttp] username=" + this.username + "-->xmlHttp=" + this.xmlHttp + "typeof(open)=" + typeof(this.xmlHttp.open));
        if (this.username != "") {
            this.xmlHttp.open(this.method, url, this.async, this.username, this.password);
        } else {
            this.xmlHttp.open(this.method, url, this.async);
        }
        //iPanel.debug("[xmlHttp] method=" + this.method + "-->url=" + url + "-->async=" + this.async);
        var contentType = false;
        if (this.headers != null) {
            for (var key in this.headers) {
                if (key.toLowerCase() == "content-type") {
                    contentType = true;
                }
                //iPanel.debug("common__contentType=" + contentType);
                this.xmlHttp.setRequestHeader(key, this.headers[key]);
            }
        }
        if (!contentType) {
            //iPanel.debug("[xmlHttp] setRequestHeader");
            //this.xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            //this.xmlHttp.setRequestHeader("Content-type","text/xml;charset=utf-8");
            this.xmlHttp.setRequestHeader("Content-type", "application/xml;charset=utf-8")
        }
        if (this.charset != null) { //要使用responseXML就不能设置此属性
            this.xmlHttp.overrideMimeType("text/html; charset=" + this.charset);
        }
        //iPanel.debug("[xmlHttp] " + this.method + " url: " + url + ", data: " + data);
        this.xmlHttp.send(data);
    };
    this.stateChanged = function() { //状态处理
        if (this.xmlHttp.readyState < 2) {
            //iPanel.debug("[xmlHttp] readyState=" + this.xmlHttp.readyState);
        } else {
            //iPanel.debug("[xmlHttp] readyState=" + this.xmlHttp.readyState + ", status=" + this.xmlHttp.status);
        }

        var target = this;
        if (this.xmlHttp.readyState == 2) {
            this.timer = this.frame.setTimeout(function() {
                target.checkStatus();
            }, this.timeout);
        } else if (this.xmlHttp.readyState == 3) {
            if (this.xmlHttp.status == 401) {
                //iPanel.debug("[xmlHttp] Authentication, need correct username and pasword");
            }
        } else if (this.xmlHttp.readyState == 4) {
            this.frame.clearTimeout(this.timer);
            if (this.xmlHttp.status == 200 || this.xmlHttp.status == 204) {
                this.success();
            } else {
                this.failed();
            }
        }
    };
    this.success = function() {
        if (this.callbackParams == null) {
            this.successCallback(this.xmlHttp);
        } else {
            this.successCallback(this.xmlHttp, this.callbackParams);
        }
        this.counter = 0;
    };
    this.failed = function() {
        if (this.callbackParams == null) {
            this.failureCallback(this.xmlHttp);
        } else {
            this.failureCallback(this.xmlHttp, this.callbackParams);
        }
        this.counter = 0;
    };
    this.checkStatus = function() { //超时处理，指定时间内没有成功返回信息按照失败处理
        if (this.xmlHttp.readyState != 4) {
            if (this.counter < this.requestTimes) {
                this.requestAgain();
            } else {
                //iPanel.debug("[xmlHttp] readyState=" + this.xmlHttp.readyState + ", status=" + this.xmlHttp.status + " timeout");
                this.failed();
                this.requestAbort();
            }
        }
    };
    this.requestAgain = function() {
        this.requestAbort();
        var target = this;
        this.frame.clearTimeout(this.timer);
        this.timer = this.frame.setTimeout(function() {
            //iPanel.debug("[xmlHttp] request again");
            target.counter++;
            target.requestData(target.method, target.headers, target.username, target.password);
        }, this.frequency);
    };
    this.requestAbort = function() {
        //iPanel.debug("[xmlHttp] call abort");
        this.frame.clearTimeout(this.timer);
        this.xmlHttp.abort();
        //iPanel.debug("[xmlHttp] call abort has called");
    };
    this.addParameter = function(_json) {
        /**
         * @param{object} _json: 传递的参数数据处理，只支持json格式
         */
        var url = this.url;
        var str = this.urlParameters;
        for (var key in _json) {
            if (url.indexOf("?") != -1) {
                url = "";
                if (str == "") {
                    str = "&" + key + "=" + _json[key];
                } else {
                    str += "&" + key + "=" + _json[key];
                }
                continue;
            }
            if (str == "") {
                str += "?";
            } else {
                str += "&";
            }
            str += key + "=" + _json[key];
        }
        this.urlParameters = str;
        return str;
    };
    this.getResponseXML = function() { //reponseXML of AJAX is null when response header 'Content-Type' is not include string 'xml', not like 'text/xml', 'application/xml' or 'application/xhtml+xml'
        if (this.xmlHttp.responseXML != null) {
            return this.xmlHttp.responseXML;
        } else if (this.xmlHttp.responseText.indexOf("<?xml") != -1) {
            return typeof(DOMParser) == "function" ? (new DOMParser()).parseFromString(this.xmlHttp.responseText, "text/xml") : (new ActivexObject("MSXML2.DOMDocument")).loadXML(this.xmlHttp.responseText);
        }
        return null;
    };
}
/****************************ajax请求 end**************************************/

/*
 * showList对象的作用就是控制在页面列表数据信息上下滚动切换以及翻页；
 * @__listSize    列表显示的长度；
 * @__dataSize    所有数据的长度；
 * @__position    数据焦点的位置；
 * @__startplace  列表焦点Div开始位置的值；
 */
function showList(__listSize, __dataSize, __position, __startplace, __f) {
    this.currWindow = typeof(__f) == "undefined" ? iPanel.mainFrame : __f;
    this.listSize = typeof(__listSize) == "undefined" ? 0 : __listSize; //列表显示的长度；
    this.dataSize = typeof(__dataSize) == "undefined" ? 0 : __dataSize; //所有数据的长度；
    this.position = typeof(__position) == "undefined" ? 0 : __position; //当前数据焦点的位置；
    this.focusPos = 0; //当前列表焦点的位置；
    this.lastPosition = 0; //前一个数据焦点的位置；
    this.lastFocusPos = 0; //前一个列表焦点的位置；
    this.tempSize = 0; //实际显示的长度；
    this.infinite = 0; //记录数值，用来获取数据焦点的位置；

    this.pageStyle = 0; //翻页时焦点的定位，0表示不变，1表示移到列表首部；
    this.pageLoop = null; //是否循环翻页, true表示是，false表示否；
    this.showLoop = null; //是否循环显示内容,this.showLoop如果定义为true,则自动打开焦点首尾循环与循环翻页；
    this.focusLoop = null; //焦点是否首尾循环切换；
    this.focusFixed = null; //焦点是否固定，this.focusFixed如果定义为true,则自动打开循环显示内容；
    this.focusVary = 1; //当焦点发生改变时，如果前后焦点差的绝对值大于此值时，焦点再根据this.focusStyle的值做表现处理，此值必需大于0，否则默认为1；
    this.focusStyle = 0; //切换焦点时，列表焦点的表现样式，0是跳动，1表示滑动；

    this.showType = 1; //呈现的类型，0表示老的呈现方式，1表示新的滚屏呈现方式；   
    this.listSign = 0; //0表示top属性，1表示left属性, 也可以直接用"top"或"left"；
    this.listHigh = 30; //列表中每个行的高度，可以是数据或者数组，例如：40 或 [40,41,41,40,42];
    this.listPage = 1; //列表的总页数量；
    this.currPage = 1; //当前焦点所在页数；

    this.focusDiv = -1; //列表焦点的ID名称或者定义为滑动对象，例如："focusDiv" 或 new showSlip("focusDiv",0,3,40);
    this.focusPlace = new Array(); //记录每行列表焦点的位置值；
    this.startPlace = typeof(__startplace) == "undefined" ? 0 : __startplace; //列表焦点Div开始位置的值；

    this.haveData = function() {}; //在显示列表信息时，有数据信息就会调用该方法；
    this.notData = function() {}; //在显示列表信息时，无数据信息就会调用该方法；
    //调用以上两个方法都会收到参数为{idPos:Num, dataPos:Num}的对象，该对象属性idPos为列表焦点的值，属性dataPos为数据焦点的值；

    this.focusUp = function() { this.changeList(-1); }; //焦点向上移动；
    this.focusDown = function() { this.changeList(1); }; //焦点向下移动；
    this.pageUp = function() { this.changePage(-1); }; //列表向上鄱页；
    this.pageDown = function() { this.changePage(1); }; //列表向下鄱页；

    //开始显示列表信息
    this.startShow = function() {
            this.initAttrib();
            this.setFocus();
            this.showList();
        }
        //初始化所有属性；
    this.initAttrib = function() {
            if (typeof(this.listSign) == "number") this.listSign = this.listSign == 0 ? "top" : "left"; //把数值转换成字符串；
            if (typeof(this.focusDiv) == "object") this.focusDiv.moveSign = this.listSign; //设置滑动对象的方向值;

            if (this.focusFixed == null || (this.focusFixed && this.showType == 0)) this.focusFixed = false; //初始化焦点是否固定，如果用户没有定义，则默认为false，如果当前showType是0，那么设置固定是无效的；
            if (this.showLoop == null) this.showLoop = this.focusFixed ? true : false; //初始化是否循环显示内容，如果用户没有定义并且焦点为固定，就会自动打开为true，否则为false, 需要注意的是焦点为固定时，不要强制定义为false;
            if (this.pageLoop == null) this.pageLoop = this.showLoop ? true : false; //初始化是否循环翻页，如果用户没有定义并且循环显示内容，就会自动打开为true，否则为false, 需要注意的是循环显示内容时，不要强制定义为false;
            if (this.focusLoop == null) this.focusLoop = this.showLoop ? true : false; //初始化焦点是否首尾循环切换，如果用户没有定义并且循环显示内容，就会自动打开为true，否则为false, 需要注意的是循环显示内容时，不要强制定义为false;
            if (!this.focusFixed && this.dataSize < this.listSize) this.showLoop = false; //如果焦点不固定，并且数据长度小于列表显示长度，则强制设置循环显示内容为否；

            if (this.focusVary < 1) this.focusVary = 1;
            if (this.focusPos >= this.listSize) this.focusPos = this.listSize - 1;
            if (this.focusPos < 0) this.focusPos = 0;
            if (this.position >= this.dataSize) this.position = this.dataSize - 1;
            if (this.position < 0) this.position = 0;
            this.lastPosition = this.infinite = this.position;

            this.initPlace();
            this.initFocus();
            this.lastFocusPos = this.focusPos;
        }
        //初始化焦点位置；
    this.initFocus = function() {
            this.tempSize = this.dataSize < this.listSize ? this.dataSize : this.listSize;
            if (this.showType == 0) { //当前showType为0时，用户定义列表焦点是无效的，都会通过数据焦点来获取；
                this.focusPos = this.position % this.listSize;
            } else if (!this.focusFixed && !this.showLoop) { //当前showType为1，焦点不固定并且不循环显示内容时，判断当前用户定义的列表焦点是否超出范围，如果是则重新定义；
                var tempNum = this.position - this.focusPos;
                if (tempNum < 0 || tempNum > this.dataSize - this.tempSize) this.focusPos = this.position < this.tempSize ? this.position : this.tempSize - (this.dataSize - this.position);
            }
        }
        //处理每行(列)所在的位置，并保存在数组里；
    this.initPlace = function() {
            var tmph = this.listHigh;
            var tmpp = [this.startPlace];
            for (var i = 1; i < this.listSize; i++) tmpp[i] = typeof(tmph) == "object" ? (typeof(tmph[i - 1]) == "undefined" ? tmph[tmph.length - 1] + tmpp[i - 1] : tmph[i - 1] + tmpp[i - 1]) : tmph * i + tmpp[0];
            this.focusPlace = tmpp;
        }
        //切换焦点的位置
    this.changeList = function(__num) {
            if (this.dataSize == 0) return;
            if ((this.position + __num < 0 || this.position + __num > this.dataSize - 1) && !this.focusLoop) return;
            this.changePosition(__num);
            this.checkFocusPos(__num);
        }
        //切换数据焦点的值
    this.changePosition = function(__num) {
            this.infinite += __num;
            this.lastPosition = this.position;
            this.position = this.getPos(this.infinite, this.dataSize);
        }
        //调整列表焦点并刷新列表；
    this.checkFocusPos = function(__num) {
            if (this.showType == 0) {
                var tempNum = this.showLoop ? this.infinite : this.position;
                var tempPage = Math.ceil((tempNum + 1) / this.listSize);
                this.changeFocus(this.getPos(tempNum, this.listSize) - this.focusPos);
                if (this.currPage != tempPage) {
                    this.currPage = tempPage;
                    this.showList();
                }
            } else {
                if ((this.lastPosition + __num < 0 || this.lastPosition + __num > this.dataSize - 1) && !this.showLoop && !this.focusFixed) {
                    this.changeFocus(__num * (this.tempSize - 1) * -1);
                    this.showList();
                    return;
                }
                if (this.focusPos + __num < 0 || this.focusPos + __num > this.listSize - 1 || this.focusFixed) {
                    this.showList();
                } else {
                    this.changeFocus(__num);
                }
            }
        }
        //切换列表焦点的位置
    this.changeFocus = function(__num) {
            this.lastFocusPos = this.focusPos;
            this.focusPos += __num;
            this.setFocus(__num);
        }
        //设置调整当前焦点的位置；
    this.setFocus = function(__num) {
            if (typeof(this.focusDiv) == "number") return; //如果没定义焦点DIV，则不进行设置操作；
            var tempBool = this.focusStyle == 0 && (Math.abs(this.focusPos - this.lastFocusPos) > this.focusVary || (Math.abs(this.position - this.lastPosition) > 1 && !this.showLoop)); //当焦点发生改变时，根所前后焦点差的绝对值与focusStyle的值判断焦点表现效果；
            if (typeof(this.focusDiv) == "string") { //直接设置焦点位置；
                this.$(this.focusDiv).style[this.listSign] = this.focusPlace[this.focusPos] + "px";
            } else if (typeof(__num) == "undefined" || tempBool) { //直接定位焦点；
                this.focusDiv.tunePlace(this.focusPlace[this.focusPos]);
            } else if (__num != 0) { //滑动焦点；
                this.focusDiv.moveStart(__num / Math.abs(__num), Math.abs(this.focusPlace[this.focusPos] - this.focusPlace[this.lastFocusPos]));
            }
        }
        //切换页面列表翻页
    this.changePage = function(__num) {
            if (this.dataSize == 0) return;
            var isBeginOrEnd = this.currPage + __num < 1 || this.currPage + __num > this.listPage; //判断当前是否首页跳转尾页或尾页跳转首页;
            if (this.showLoop) { //如果内容是循环显示，则执行下面的翻页代码；
                if (isBeginOrEnd && !this.pageLoop) return;
                var tempNum = this.listSize * __num;
                if (!this.focusFixed && this.pageStyle != 0 && this.focusPos != 0) {
                    this.changePosition(this.focusPos * -1);
                    this.checkFocusPos(this.focusPos * -1);
                }
                this.changePosition(tempNum);
                this.checkFocusPos(tempNum);
            } else {
                if (this.dataSize <= this.listSize) return; //如果数据长度小长或等于列表显示长度，则不进行翻页；
                if (this.showType == 0) {
                    if (isBeginOrEnd && !this.pageLoop) return; //如果是首页跳转尾页或尾页跳转首页, this.pageLoop为否，则不进行翻页；
                    var endPageNum = this.dataSize % this.listSize; //获取尾页个数;
                    var isEndPages = (this.getPos(this.currPage - 1 + __num, this.listPage) + 1) * this.listSize > this.dataSize; //判断目标页是否为尾页;
                    var overNum = isEndPages && this.focusPos >= endPageNum ? this.focusPos + 1 - endPageNum : 0; //判断目标页是否为尾页，如果是并且当前列表焦点大于或等于尾页个数，则获取它们之间的差；      
                    var tempNum = isBeginOrEnd && endPageNum != 0 ? endPageNum : this.listSize; //判断当前是否首页跳转尾页或尾页跳转首页，如果是并且尾页小于this.listSize，则获取当前页焦点与目标页焦点的差值，否则为默认页面显示行数；
                    overNum = this.pageStyle == 0 ? overNum : this.focusPos; //判断当前翻页时焦点的style, 0表示不变，1表示移到列表首部；
                    tempNum = tempNum * __num - overNum;
                    this.changePosition(tempNum);
                    this.checkFocusPos(tempNum);
                } else {
                    var tempPos = this.position - this.focusPos; //获取当前页列表首部的数据焦点；
                    var tempFirst = this.dataSize - this.tempSize; //获取尾页第一个数据焦点的位置；
                    if (tempPos + __num < 0 || tempPos + __num > tempFirst) {
                        if (!this.pageLoop) return; //不循环翻页时跳出，否则获取翻页后的数据焦点;
                        tempPos = __num < 0 ? tempFirst : 0;
                    } else {
                        tempPos += this.tempSize * __num;
                        if (tempPos < 0 || tempPos > tempFirst) tempPos = __num < 0 ? 0 : tempFirst;
                    }
                    var tempNum = this.pageStyle == 0 || this.focusFixed ? this.focusPos : 0; //判断当前翻页时焦点的style, 取得列表焦点位置；
                    if (!this.focusFixed && this.pageStyle != 0 && this.focusPos != 0) this.changeFocus(this.focusPos * -1); //如果this.focusPos不为0，则移动列表焦点到列表首部；
                    this.changePosition(tempPos - this.position + tempNum);
                    this.showList();
                }
            }
        }
        //显示列表信息
    this.showList = function() {
            var tempPos = this.position - this.focusPos; //获取当前页列表首部的数据焦点；
            for (var i = tempPos; i < tempPos + this.listSize; i++) {
                var tempObj = { idPos: i - tempPos, dataPos: this.getPos(i, this.dataSize) }; //定义一个对象，设置当前列表焦点和数据焦点值；
                (i >= 0 && i < this.dataSize) || (this.showLoop && this.dataSize != 0) ? this.haveData(tempObj): this.notData(tempObj); //当i的值在this.dataSize的范围内或内容循环显示时，调用显示数据的函数，否则调用清除的函数；
            }
            this.currPage = Math.ceil((this.position + 1) / this.listSize);
            this.listPage = Math.ceil(this.dataSize / this.listSize);
        }
        //清除列表信息
    this.clearList = function() {
        for (var i = 0; i < this.listSize; i++) this.notData({ idPos: i, dataPos: this.getPos(i, this.dataSize) });
    }
    this.getPos = function(__num, __size) {
        return __size == 0 ? 0 : (__num % __size + __size) % __size;
    }
    this.$ = function(__id) {
        return this.currWindow.document.getElementById(__id);
    }
}
