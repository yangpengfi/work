 /*-- NTV
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