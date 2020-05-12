package cn.com.ssm.utils;

import java.io.FileWriter;
import java.io.IOException;

/* *
 *类名：AlipayConfig
 *功能：基础配置类
 *详细：设置帐户有关信息及返回路径
 *修改日期：2017-04-05
 *说明：  ksfxhw3818@sandbox.com   111111
 *以下代码只是为了方便商户测试而提供的样例代码，商户可以根据自己网站的需要，按照技术文档编写,并非一定要使用该代码。
 *该代码仅供学习和研究支付宝接口使用，只是提供一个参考。
 */

public class AlipayConfig {
	
//↓↓↓↓↓↓↓↓↓↓请在这里配置您的基本信息↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

	// 应用ID,您的APPID，收款账号既是您的APPID对应支付宝账号
	public static String app_id = "2016101800718783";
	
	// 商户私钥，您的PKCS8格式RSA2私钥
    public static String merchant_private_key ="MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQClwPMssrCTX1NfctQvcM7xPaSHrXiFYNsnISpLbvniyebOJiqsPe+HIIXS8iEG4FeVO6tKHhjvTFkH3peLof1Kj5+jQL8tHa8iVTc7w5K20e3TGpSbRccsDqzUjoEqNYuom7bNtiOrpLINE4X1ICaOgC/S8Uu/WUx4YSsBGULIhl8dTIJ22A6opoCuuhfwv/IeQ+qtEAAj16rl12V7acbFeDUvaT/0eoCZaGNMHv818svZNwXM9H+ccWcsK5bkND6Y7DSgLUVXNNotRzKrc8zMdAZzIYpfuGa7Ylc6yCwvCWoBJ7vaKhlNnw1pNDFPc5iUkeMBn4uhN5LhC5mtaB/TAgMBAAECggEBAJ77CYLGxTwlA2eaUNBL6AFU+Zk1FlL/ylOmqNV/VOhkdR8nVmisYzD9Tb49hNX+maLGf41wfsQPO5mjs0E3lyVLyncgI/3W6eMJTxfghrkZc322kfC4JcgpLzYUlOjyQMjwyY5Xc7EvH6QRJLwvISwu4S/3Ror60LDpqgC8xORlB4SDEglqHsLb7fZzGHTd8V6IRkdcEkjX5Sb3Dy5SDhn4F1k7B8j1sf3bCdGuk6AWajVqR6ZJEmqpzLfNh3KreY/jxVFId2PEDfo2egaRG1m9KUxBAgfuG2y0CI1Dc2+1+JiJ3S5QCgC4Tn2vlYSrCNEc+drBOxCOMnU3+gqk1CECgYEA6JhIT1LPgsaAeSRBNeGTXAL8KUJG6tPnA4ZYW/mIgXLnBVAhDrjWcTxTzf+2zVUUbMYwn4EG0N26L/aR06YC74H84xvi8UZwkEl6XqS/J8sBRXnDRbE3kKp1SaSiBYdhFaHPihc8F5xo2RJ9P4NdqEmc3YAmzrv6ME1H90tnPUMCgYEAtm7RfEVE8Dp7B5FgAgiRF9/KAq+sFWsi3W/9S6YlQ+vkUNWmE/vJ39aNzkA9kuGQnKUJxoi4rLz/BKuBc8cFMpV8VON/HmybNp8KWiUl2Nm/FBDYdzgI3jMrsVtn3ihkF4BNX+Y3zAEImC7LbMGe9JjRbEh8xDPdTdeEtRgLojECgYEA4Wlbgox1kH6BWWWaUPZ40g4OhIm3orKTymWzUgdllFZfr1V1hAf7wqe9bAFrDllqvvPfgWUQzvBjFUJ3Fs9nPugRxaNr73ndcufS0NAGdTEW3VbguLTDbc7Udfc4EfWeT9GOCXz0/sjVD7IMcbYE2Sfl/v/IHEgucgsjOHT563MCgYA4D2fKY1Li62WhFrhFB7LmfjuKhcdAsbJ+D4rrszuiWpvHh0/Itkf7w+fBqJYDS9Nvf3u4iY0Ob+mB2t4l4NOlDrCtOVd31vH/X/IDb4To1UjVdrO+NvbqqRjVIHyTlR/k5OViAdHFm8+zTDXwzrL1APzh5IiKllF8OS0rpR72EQKBgQCzZAWPuCmE/TtDcRsoF4faWvyBXpEPWg1NrBKGvqFuvrTot31m5UnLkyrMbRuDbacwu3iKoQwlwmR28W4lbv5Z4L+0DOCrkqPNqp7abEHbWR9OvYVymJKlPqM8eXEVFXmvMgbBJloBAgLTm16yHKYvuZztHgaDeqb4O2xX7nyZtA==";

	// 支付宝公钥,查看地址：https://openhome.alipay.com/platform/keyManage.htm 对应APPID下的支付宝公钥。
    public static String alipay_public_key ="MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApcDzLLKwk19TX3LUL3DO8T2kh614hWDbJyEqS2754snmziYqrD3vhyCF0vIhBuBXlTurSh4Y70xZB96Xi6H9So+fo0C/LR2vIlU3O8OSttHt0xqUm0XHLA6s1I6BKjWLqJu2zbYjq6SyDROF9SAmjoAv0vFLv1lMeGErARlCyIZfHUyCdtgOqKaArroX8L/yHkPqrRAAI9eq5ddle2nGxXg1L2k/9HqAmWhjTB7/NfLL2TcFzPR/nHFnLCuW5DQ+mOw0oC1FVzTaLUcyq3PMzHQGcyGKX7hmu2JXOsgsLwlqASe72ioZTZ8NaTQxT3OYlJHjAZ+LoTeS4QuZrWgf0wIDAQAB";

	// 服务器异步通知页面路径  需http://格式的完整路径，不能加?id=123这类自定义参数，必须外网可以正常访问
	public static String notify_url = "http://工程公网访问地址/alipay.trade.page.pay-JAVA-UTF-8/notify_url.jsp";

	// 页面跳转同步通知页面路径 需http://格式的完整路径，不能加?id=123这类自定义参数，必须外网可以正常访问
    //支付成功后的地址回调（系统发送get请求，并且请求中有我们需要的参数订单编号out_trade_no）
    //完成支付后项目中的其它操作  修改订单状态，添加销售记录数据
	public static String return_url = "http://localhost:8080/orders/afterOrdersPay";

	// 签名方式
	public static String sign_type = "RSA2";
	
	// 字符编码格式
	public static String charset = "utf-8";
	
	// 支付宝网关
	public static String gatewayUrl = "https://openapi.alipaydev.com/gateway.do";
	
	// 支付宝网关
	public static String log_path = "C:\\";


//↑↑↑↑↑↑↑↑↑↑请在这里配置您的基本信息↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

    /** 
     * 写日志，方便测试（看网站需求，也可以改成把记录存入数据库）
     * @param sWord 要写入日志里的文本内容
     */
    public static void logResult(String sWord) {
        FileWriter writer = null;
        try {
            writer = new FileWriter(log_path + "alipay_log_" + System.currentTimeMillis()+".txt");
            writer.write(sWord);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (writer != null) {
                try {
                    writer.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}

