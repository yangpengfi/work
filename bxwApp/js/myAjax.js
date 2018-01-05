/**
 * Created by ypf on 2017/12/21.
 */
/*
* 获取token
* */
var token="";
var parameter={
    username:18943980005,
    pwd:"e10adc3949ba59abbe56e057f20f883e",
    skey:"skey",
    type:1
};
$.ajax({
    url:'http://192.168.8.251/banxue/app/user/login.do',
    type:'POST',
    data:parameter,
    success:function(data){
        //console.log(data);
        token=data.data.token;
        //console.log(token);
    }
});

//定义学科小图片数组
var imgArr=['sub_chinesesmall.png','sub_mathsmall.png','sub_englishsmall.png','sub_physicssmall.png','sub_chemistrysmall.png','sub_geographysmall.png','sub_historysmall.png','sub_politikbsmall.png','sub_biologysmall.png','sub_chinesesmall.png','sub_sciensesmall.png','sub_politikbsmall.png'];

//定义学科大图片数组
var imgBigArr=['sub_chinesebig.png','sub_mathbig.png','sub_englishbig.png','sub_physicsbig.png','sub_chemistrybig.png','sub_geographybig.png','sub_historybig.png','sub_politikbig.png','sub_biologybig.png','sub_chinesebig.png','sub_sciensebig.png','sub_politikbig.png'];

/**
 *
 * 获取左侧列表函数
 * */
function getLeftList(params){
    $.ajax({
        url:'http://192.168.8.251/banxue/app/microcourse/a/getSubjectList4Tv.do',
        type:'POST',
        data:params,
        success:function(data){
            console.log(data)
            var html='';
            if(data.data.length){
                $('#sideList').empty();
                $.each(data.data,function(key,val){
                    if(key==0&&params.gradeId<=6){
                        html+='<li class="active" data-id="'+val.id+'" data-gradeId="'+params.gradeId+'" data-versionId="'+val.versionId+'" style="text-align:left;">'+val.name+'&nbsp;<span>'+val.versionName+'</span></li>';
                        params.subjectId=val.id;
                        params.versionId=val.versionId;
                        params.pageSize=100;
                    }else if(key==0&&params.gradeId>6){
                        html+='<li class="active" data-id="'+val.id+'" data-gradeId="'+params.gradeId+'" data-versionId="'+val.versionId+'">'+val.name+'</li>';
                        params.subjectId=val.id;
                        params.versionId=val.versionId;
                        params.pageSize=100;
                    }else if(key>0&&params.gradeId<=6){
                        html+='<li data-id="'+val.id+'" data-gradeId="'+params.gradeId+'" data-versionId="'+val.versionId+'" style="text-align:left;">'+val.name+'&nbsp;<span>'+val.versionName+'</span></li>';
                    }else if(key>0&&params.gradeId>6){
                        html+='<li data-id="'+val.id+'" data-gradeId="'+params.gradeId+'" data-versionId="'+val.versionId+'">'+val.name+'</li>';
                    }
                });
                $('#sideList').append(html);
                localStorage.setItem("leftList",html);
                localStorage.setItem("grade",params.gradeId);
                getList(params);
            }else{
                alert("暂无此年级相关课程，敬请期待！")
            }
        }
    });
}
/**
 * 获取列表函数
 * */
function getList(paramData){
    $.ajax({
        url:'http://192.168.8.251/banxue/app/microcourse/a/getTopicList.do',
        type:'POST',
        data:paramData,
        success:function(data){
            var html='';
            //console.log(data);
            $('#content ul').empty();

            if(data.data.length==1&&data.data[0].isSkip==1){
                $.ajax({
                    url:'http://192.168.8.251/banxue/app/microcourse/a/getResourceList.do',
                    type:'POST',
                    data:paramData,
                    success:function(data){
                        //console.log(data)
                        $.each(data.data,function(key,val){
                            html+='<li data-resourceId="'+val.resourceId+'">'+
                                '<p>'+val.knowledgePoint+'</p>'+
                                '<img src="img/index/'+imgArr[paramData.subjectId-1]+'" alt="mathLogo"/>'+
                                '</li>';
                        });
                        $('#content ul').append(html);
                        localStorage.setItem("contentLi",html);
                    }
                });
            }else{
                $.each(data.data,function(key,val){
                    html+='<li data-topicId="'+val.topicId+'" data-subjectId="'+val.subjectId+'" data-gradeId="'+val.gradeId+'">'+
                        '<p>'+val.topicName+'</p>'+
                        '<img src="img/index/'+imgArr[paramData.subjectId-1]+'" alt="mathLogo"/>'+
                        '</li>';
                })
            }
            $('#content ul').append(html);
            localStorage.setItem("contentLi",html);
        }
    });
}

/**
 * 获取子列表函数
 * */
function getAjax(params,url,callback){
    $.ajax({
        url:'http://192.168.8.251/banxue/'+url,
        type:'POST',
        data:params,
        success:function(data){
            callback(data)
        }
    });
}
/**
* 特殊列表获取（奥数，小升初，中考）
* */
function getOtherList(params){
    $.ajax({
        url:'http://192.168.8.251/banxue/app/microcourse/a/getResourceList.do',
        type:'POST',
        data:params,
        success:function(data){
            console.log(data)
            var html='';
            $.each(data.data,function(key,val){
                html+='<li data-resourceId="'+val.resourceId+'">'+
                    '<p>'+val.knowledgePoint+'</p>'+
                    '<img src="img/index/'+imgArr[params.subjectId-1]+'" alt="mathLogo"/>'+
                    '</li>';
            });
            localStorage.setItem("contentLi",html);
            $('#content ul').empty().append(html);
        }
    });
}