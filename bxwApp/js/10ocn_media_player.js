/**
       x：横坐标
       y：纵坐标
       w：宽度
       h：高度
       url：HTTP视频播放地址
       status:播放状态
       type：播放类型
*/
var _videotype;
var _callback_end;
 function ocnmediaplayer(x,y,w,h,url,status,type,callback_end){
     _videotype = type;
     _callback_end = callback_end;
     //视频状态
     if (status == "play") {
			
         //设置视频位置

         ntv.stb.mediaplayer.position(x,y,w,h);

         //播放视频
         ntv.stb.mediaplayer.play("HTTP", url);


      //暂停播放   
      } else if (status == "pause") {

          ntv.stb.mediaplayer.pause();
          
      //恢复播放
      } else if (status == "resume") {

          ntv.stb.mediaplayer.resume();
      }
      
      

  }


  　