package cn.com.ssm.controller;

import cn.com.ssm.entity.Rooms;
import cn.com.ssm.utils.FileUploadUtils;
import cn.com.ssm.utils.QiniuUploadUtils;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Controller
@Transactional(readOnly = false)
@RequestMapping("/rooms")
public class RoomsController extends BaseController<Rooms> {
    /**
     *   文件上传的方法
     * @param //path  文件上传的目标文件夹路径
     * @param myFile  //被上传的源文件
     * @return  上传操作的结果
     */

   /* @RequestMapping("/fileUpload")
   public @ResponseBody Map<String,Object> fileUpload(String path, MultipartFile myFile){
       return FileUploadUtils.fileUpload(path,myFile);
   }*/

   //上传到七牛云存储
    @RequestMapping("/fileUpload")
    public @ResponseBody Map<String,Object> fileUpload( MultipartFile myFile){
        return QiniuUploadUtils.upload(myFile);
    }
}
