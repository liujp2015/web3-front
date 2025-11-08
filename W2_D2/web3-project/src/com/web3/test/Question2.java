package com.web3.test;

import java.security.*;
import java.util.Base64;

/**
 * @author liujunpeng
 * @date 2025-11-08
 */
public class Question2 {
    public static void main(String[] args) throws Exception {
        //获取符合pow 0000开头的昵称+nonce
        String str = Question1.getlastFourZeroStr();
        System.out.println("符合pow 0000的hash值:"+str);
        // 1. 生成密钥对
        KeyPair keyPair = generateKeyPair();
//        PublicKey publicKey = keyPair.getPublic();
//        PrivateKey privateKey = keyPair.getPrivate();
//        byte[] publicKeyBytes = publicKey.getEncoded();      // X.509 格式
//        byte[] privateKeyBytes = privateKey.getEncoded();    // PKCS#8 格式
//        String pubKeyBase64 = Base64.getEncoder().encodeToString(publicKeyBytes);
//        String privKeyBase64 = Base64.getEncoder().encodeToString(privateKeyBytes);
//        System.out.println("pubKeyBase64:"+pubKeyBase64);
//        System.out.println("privKeyBase64:"+privKeyBase64);

        // 2. 使用私钥对字符签名
        Signature sign = Signature.getInstance("SHA256withRSA");
        sign.initSign(keyPair.getPrivate());
        sign.update(str.getBytes("UTF-8"));
        System.out.println("私钥签名 sign");
        byte[] signatureBytes = sign.sign();
        // 3. 公钥验证
        Signature verify = Signature.getInstance("SHA256withRSA");
        verify.initVerify(keyPair.getPublic());
        verify.update(str.getBytes("UTF-8"));
        System.out.println("公钥验证");
        boolean isVerified = verify.verify(signatureBytes);
        System.out.println("Verification result: " + isVerified); // 应为 true

    }
    public static KeyPair generateKeyPair() throws NoSuchAlgorithmException {
        // 1. 获取 KeyPairGenerator 实例，指定算法为 "RSA"
        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
        // 2. 初始化密钥生成器，指定密钥长度（推荐 2048 或 4096 位）
        // 密钥长度越长，安全性越高，但计算速度越慢
        keyPairGenerator.initialize(2048);
        // 3. 生成密钥对
        KeyPair keyPair = keyPairGenerator.generateKeyPair();
        return keyPair;
    }
}
