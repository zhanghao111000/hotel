package cn.com.ssm.utils;

import com.qiniu.common.QiniuException;
import com.qiniu.common.Zone;
import com.qiniu.http.Response;
import com.qiniu.storage.Configuration;
import com.qiniu.storage.UploadManager;
import com.qiniu.util.Auth;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class QiniuUploadUtils {

    //设置好账号的ACCESS_KEY和SECRET_KEY;这两个登录七牛账号里面可以找到 
  static   String ACCESS_KEY = "1Uooy7njMgqcj54tOQ9l72P-oMgFd8sOUGi6pTEL";
   static String SECRET_KEY = "XDHIh_xxxQZkRW-Xj47DELi71RJp3WtTI4ILksdD";
    //要上传的空间;对应到七牛上（自己建文件夹 注意设置公开）  
   static String bucketname = "zh1995";
   /* //上传文件的路径 ;本地要上传文件路径
   static String  FilePath = "E:\\JAVA北大青鸟\\U3\\layweb\\img\\renwu004.jpg";*/
   //七牛云存储空间域名
    static String yunName="http://q7dht7db5.bkt.clouddn.com/";
    //密钥配置  
    static Auth auth = Auth.create(ACCESS_KEY, SECRET_KEY);
    //创建上传对象  
   static UploadManager uploadManager = new UploadManager(new Configuration(Zone.zone2()));
    //简单上传，使用默认策略，只需要设置上传的空间名就可以了  
    public static String getUpToken(){
        return auth.uploadToken(bucketname);  
    }  
  
    //普通上传  

    public static Map<String,Object> upload( MultipartFile myFile) {
        Map<String,Object> jsonMap=new HashMap<String, Object>();
      try {
          //上传到七牛后保存的文件名
          String key = UUID.randomUUID().toString().replace("-", "");
        //调用put方法上传  
        Response res = uploadManager.put(myFile.getBytes(), key, getUpToken());
          jsonMap.put("code",0);  //向map中装入上传的状态，成功
          jsonMap.put("newFileName",yunName+key);  //向map中装入上传的目标文件名
        } catch (Exception e) {
          e.printStackTrace();
          jsonMap.put("code",200);  //向map中装入上传的状态，异常
        }
        return jsonMap;
    }  

}  
	

