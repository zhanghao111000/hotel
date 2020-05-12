package cn.com.ssm.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateUtils {
    //将yyyy/MM/dd HH:mm:ss 字符串转为Date格式
    private static final SimpleDateFormat sdf=new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");

    public static Date strToDate(String str){
        try {
            return sdf.parse(str);
        } catch (ParseException e) {
            e.printStackTrace();
            return null;
        }
    }
}
