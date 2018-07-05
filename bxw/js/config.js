/**
 * url配置=====================================
 */
//var hostIp='http://www.mybanxue.com';
//var hostVideoIP='http://www.mybanxue.com:86';

var hostIp='http://192.168.8.251/banxue';
var hostVideoIP='http://192.168.8.252:86';

//var hostIp='http://192.168.17.12/banxue';
//var hostVideoIP='http://192.168.17.13:86';

/*var hostIp='http://10.215.0.40/banxue';
var hostVideoIP='http://10.215.0.40:86';*/

/*
* 定义基础变量==============================================================
* */
/**
 * 获取token
 * */
var token="";
var parameter={
    username:18943980005,
    //username:18800000000,
    //username:15989346035,
    pwd:"e10adc3949ba59abbe56e057f20f883e",
    skey:"skey",
    type:1
};
ajax({
    url:hostIp+'/app/user/login.do',
    method:'POST',
    async: false,
    data:parameter,
    success:function(data){
        var data=JSON.parse(data).data;
        //console.log(data);
        token=data.token;
        //console.log(token);
    }
});

//定义学科小图片数组
var imgArr=['sub_chinesesmall.png','sub_mathsmall.png','sub_englishsmall.png','sub_physicssmall.png','sub_chemistrysmall.png','sub_geographysmall.png','sub_historysmall.png','sub_politikbsmall.png','sub_biologysmall.png','sub_chinesesmall.png','sub_sciensesmall.png','sub_politikbsmall.png'];

//定义学科大图片数组
var imgBigArr=['sub_chinesebig.png','sub_mathbig.png','sub_englishbig.png','sub_physicsbig.png','sub_chemistrybig.png','sub_geographybig.png','sub_historybig.png','sub_politikbig.png','sub_biologybig.png','sub_chinesebig.png','sub_sciensebig.png','sub_politikbig.png'];

//console.log(token);
/*封装ajax*/
function getData( params,url,callback){
    banxue.ajax({
        url:hostIp+url,
        method:'POST',
        data:params,
        success:callback
    });
}


/*
* wkList页相关操作==============================================================================
* */
function headerClick(){
    banxue("#footer li").removeClass();
    banxue('#footer').animate({
        'top':'540px'
    },500)
}
function footerLiClick(){
    var gradeId=banxue(focusEle).attr('data-grade');
    sessionStorage.setItem("gradeId",gradeId);
    banxue('#textCont').text(banxue(focusEle).parent().text()).attr('data-grade',gradeId);
    banxue('#footer').animate({
        'top':'720px'
    },500);
    var params={
        token:token,
        gradeId:gradeId
    };
    getData(params,'/app/microcourse/a/getSubjectList4Tv.do',setLeftList);
    ntv.navigation.move_focus(11);
}
function centerLiClick(){
    //console.log(banxue(focusEle).parent().attr('data-resourceId')!=undefined);

    if(banxue(focusEle).parent().attr('data-resourceId')!=undefined){
        var postId=banxue(focusEle).parent().attr('data-resourceId');
        location.href="details.html";
        sessionStorage.setItem("resourceid",postId);
    }else{
        var postId=banxue(focusEle).parent().attr('data-topicId');
        location.href="wkSubList.html";
        sessionStorage.setItem("topicId",postId);
    }
}
/*
 * 创建左侧菜单列表
 * */
function asideListInit(){
    for(var i=0;i<11;i++){
        banxue('#asideList img').eq(i).attr('alt',(i+1)+'1').show();
    }
}
var setLeftList=function(msg){
    //console.log(data);
    var len=msg.data.length;
    if(len){
        banxue('#asideList li p').empty();
        var gradeId=sessionStorage.getItem("gradeId");
        asideListInit();
        banxue("#asideList img:gt("+(len-1)+")").removeAttr("alt");
        for(var i=0;i<len;i++){
            if(gradeId<=6){
                //console.log(banxue('.subjectName').eq(i));
                banxue('#asideList li p').eq(i)
                    .html(msg.data[i].name+'<span>'+msg.data[i].versionName+'</span>')
                    .attr("styel","text-align:left");
            }else{
                banxue('#asideList li p').eq(i).html(msg.data[i].name);
            }
            banxue("#asideList img").eq(i).attr({
                'data-subjectId':msg.data[i].id,
                'data-versionId':msg.data[i].versionId,
            });
            if(i==0){
                var params={
                    token:token,
                    gradeId:gradeId,
                    subjectId:msg.data[0].id,
                    versionId:msg.data[0].versionId,
                    pageSize:8,
                    pageIndex:1
                };
                getData(params,'/app/microcourse/a/getTopicList.do',setCenterList);
                sessionStorage.setItem("autoParams",JSON.stringify(params));
            }
        }
    }else{
        alert("暂无此年级相关课程，敬请期待！");
        banxue("#centerList li p").empty().next().remove();
        banxue("#centerList img").removeAttr("alt").hide();
        banxue('#asideList li p').empty();
        banxue('#asideList img').hide();
        ntv.navigation.move_focus(1);
        return false;
    }
};
/*
 * 创建中间菜单列表
 * */
function centerListInit(select){
    if(select=="#centerList img"){
        for(var i=0;i<8;i++){
            banxue('#centerList img').eq(i).attr('alt',(12+i)).show();
        }
    }else{
        for(var i=0;i<8;i++){
            banxue('#subCenterList img').eq(i).attr('alt',(11+i)).show();
        }
    }
}
var setCenterList=function(msg){
    console.log(msg);
    if(msg.data.length){
        if(msg.data.length==1&&msg.data[0].isSkip==1){
                var params={
                    token:token,
                    gradeId:msg.data[0].gradeId,
                    subjectId:msg.data[0].subjectId,
                    topicId:msg.data[0].topicId,
                    pageSize:8,
                    pageIndex:1
                };
                sessionStorage.setItem("autoParams",JSON.stringify(params));
                getData(params,'/app/microcourse/a/getResourceList.do',setCenterListEls)
        }else{
            var total=msg.total;
            var lens=msg.data.length;
            banxue("#totalPage").html(Math.ceil(total/8));
            if(Math.ceil(total/8)>1){
                banxue("#pageBar").show();
            }else{
                banxue("#pageBar").hide();
            }
            banxue("#centerList li p").empty().next().remove();
            centerListInit("#centerList img");
            banxue("#centerList img:gt("+(lens-1)+")").removeAttr("alt").hide();
            for(var i=0;i<lens;i++){
                banxue("#centerList li p").eq(i).html(msg.data[i].topicName);
                banxue("#centerList li").eq(i)
                    .attr("data-topicId",msg.data[i].topicId)
                    .removeAttr("data-resourceid")
                    .append('<img src="img/index/'+imgArr[msg.data[i].subjectId-1]+'">');
            }
        }
    }
}
var setCenterListEls=function(res){
    console.log(res);
    var lenghs=res.data.length;
    var total=res.total;
    banxue("#totalPage").html(Math.ceil(total/8));
    if(Math.ceil(total/8)>1){
        banxue("#pageBar").show();
    }else{
        banxue("#pageBar").hide();
    }
    banxue("#centerList li p").empty().next().remove();
    centerListInit("#centerList img");
    banxue("#centerList img:gt("+(lenghs-1)+")").removeAttr("alt").hide();
    for(var i=0;i<lenghs;i++){
        banxue("#centerList li p").eq(i).html(res.data[i].videoName);
        banxue("#centerList li").eq(i)
            .attr("data-resourceid",res.data[i].resourceId)
            .append('<img src="img/index/'+imgArr[res.data[i].subjectId-1]+'">');
    }
}
/*
* 创建中间子菜单列表
* */
var setSubCenterList=function(msg){
    console.log(msg);
    var len=msg.data.length;
    var total=msg.total;
    sessionStorage.setItem('resourceid',msg.data[0].resourceId);
    banxue("#subCenterList li p").empty().next().remove();
    centerListInit("#subCenterList img");
    banxue("#subCenterList img:gt("+(len-1)+")").removeAttr("alt").hide();
    banxue("#totalPage").html(Math.ceil(total/8));
    if(Math.ceil(total/8)>1){
        banxue("#pageBar").show();
    }else{
        banxue("#pageBar").hide();
    }
    for(var i=0;i<len;i++){
        //if(i<8){
            banxue("#subCenterList li p").eq(i).html(msg.data[i].knowledgePoint);
            banxue("#subCenterList li").eq(i)
                .attr("data-resourceid",msg.data[i].resourceId)
                .append('<img src="img/index/'+imgArr[msg.data[i].subjectId-1]+'">');
        //}
    }
}
/*
* 小升初，中考
* */
function setThemeLeftList(msg){
    console.log(msg)
    var len=msg.data.length;
    banxue('#asideList p').empty();
    var gradeId=JSON.parse(sessionStorage.getItem("themePrm")).gradeId;
    asideListInit();
    banxue("#asideList img:gt("+(len-1)+")").removeAttr("alt").hide();
    for(var i=0;i<len;i++){
        //console.log(banxue('#asideList li p').eq(i));
        banxue('#asideList p').eq(i).html(msg.data[i].themeName);
        banxue("#asideList img").eq(i).attr({
            'data-subjectId':msg.data[i].subjectId,
            'data-themeId':msg.data[i].themeId
        });
        if(i==0){
            var params={
                token:token,
                gradeId:gradeId,
                subjectId:msg.data[0].subjectId,
                themeId:msg.data[0].themeId,
                pageSize:8,
                pageIndex:1
            };
            getData(params,'/app/microcourse/a/getResourceList.do',setOthCenterList);
            sessionStorage.setItem("autoParams",JSON.stringify(params));
        }
    }
}
function setOthCenterList(msg){
    console.log(msg);
    var len=msg.data.length;
    var total=msg.total;
    banxue("#centerList li p").empty().next().remove();
    centerListInit("#centerList img");
    banxue("#centerList img:gt("+(len-1)+")").removeAttr("alt").hide();
    banxue("#totalPage").html(Math.ceil(total/8));
    if(Math.ceil(total/8)>1){
        banxue("#pageBar").show();
    }else{
        banxue("#pageBar").hide();
    }
    for(var i=0;i<len;i++){
        //if(i<8){
            banxue("#centerList li p").eq(i).html(msg.data[i].videoName);
            banxue("#centerList li").eq(i)
                .attr("data-resourceid",msg.data[i].resourceId)
                .append('<img src="img/index/'+imgArr[msg.data[i].subjectId-1]+'">');
       // }
    }
}
/*
*初始化详情页======================================================
* */
var initDetailsHtml=function(msg){
    var data=msg.data;
    //console.log(data);
    banxue('#topic').html((data.topic=="全部")?'':data.topic);
    banxue('#knowledgePoint').html(data.knowledgePoint);
    banxue('#lecturer').html(data.lecturer);
    banxue('#courIcon').attr('src','img/index/'+imgBigArr[data.subjectId-1||0]);
    banxue('#videoIntro').html(data.videoIntro);
    banxue('#lecturerIntro').html(data.lecturerIntro);
    banxue('#playBtn').attr('data-url',data.videoUrl);
    sessionStorage.setItem('videoUrl',data.videoUrl);
}
