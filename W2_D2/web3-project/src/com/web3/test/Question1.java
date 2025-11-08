package com.web3.test;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Random;

/**
 * @author liujunpeng
 * @date 2025-11-08
 */
public class Question1 {

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int LENGTH = 5;
    private static final Random RANDOM = new Random();

    public static void main(String[] args) {
        System.out.println("符合pow 0000的hash值");
        // 1. 开始时间
        long startTime = System.currentTimeMillis();
        System.out.println("开始时间: " + startTime + " 毫秒");
        // 2. 打印结果
        System.out.println(getlastFourZeroStr());
        // 3. 记录结束时间 (毫秒)
        long endTime = System.currentTimeMillis();
        System.out.println("结束时间: " + endTime + " 毫秒");
        // 4. 计算时间差 (毫秒)
        long duration = endTime - startTime;
        System.out.println("执行耗时: " + duration + " 毫秒");
        System.out.println("================================================================");
        System.out.println("符合pow 00000的hash值");
        // 1. 开始时间
        long startTime1 = System.currentTimeMillis();
        System.out.println("开始时间: " + startTime1 + " 毫秒");
        // 2. 打印结果
        System.out.println(getlastFiveZeroStr());
        // 3. 记录结束时间 (毫秒)
        long endTime1 = System.currentTimeMillis();
        System.out.println("结束时间: " + endTime1 + " 毫秒");
        // 4. 计算时间差 (毫秒)
        long duration1 = endTime1 - startTime1;
        System.out.println("执行耗时: " + duration1 + " 毫秒");
    }


    public static String getlastFourZeroStr(){
        String nameStr = "npc";
        String changeStr = "nonce";
        boolean continue_ = true;
        boolean first = true;
        String lastStr = "";
        while (continue_){
            if(first){
                first = false;
                lastStr =  getSHA256(nameStr+changeStr);
            }else {
                lastStr = getSHA256(nameStr + generateRandomString());
            }
            continue_ =  !lastStr.substring(0,4).equals("0000");
            //continue_ =  !lastStr.substring(0,5).equals("00000");
        }
        return lastStr;
    }

    public static String getlastFiveZeroStr(){
        String nameStr = "npc";
        String changeStr = "nonce";
        boolean continue_ = true;
        boolean first = true;
        String lastStr = "";
        while (continue_){
            if(first){
                first = false;
                lastStr =  getSHA256(nameStr+changeStr);
            }else {
                lastStr = getSHA256(nameStr + generateRandomString());
            }
//            continue_ =  !lastStr.substring(0,4).equals("0000");
            continue_ =  !lastStr.substring(0,5).equals("00000");
        }
        return lastStr;
    }


    /**
     * 生成5位隨機字符串
     * @return
     */
    public static String generateRandomString() {
        StringBuilder sb = new StringBuilder(LENGTH);
        for (int i = 0; i < LENGTH; i++) {
            // 随机选择一个字符
            int index = RANDOM.nextInt(CHARACTERS.length());
            sb.append(CHARACTERS.charAt(index));
        }
        return sb.toString();
    }

    /**
     * 獲取 SHA256 字符串
     * @param input
     * @return
     */
    public static String getSHA256(String input) {
        try {
            // 获取 SHA-256 的 MessageDigest 实例
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            // 将输入字符串转换为字节数组并进行哈希计算
            byte[] hashBytes = digest.digest(input.getBytes("UTF-8"));

            // 将字节数组转换为十六进制字符串
            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }

            return hexString.toString();

        } catch (NoSuchAlgorithmException | java.io.UnsupportedEncodingException e) {
            throw new RuntimeException("SHA-256 计算失败", e);
        }
    }
}
