var CryptoJS = require("crypto-js");

let appkey = "0123456789123456";
let ivKey = "eThWmZq4t7w!z%C*";
export function CryptoJSAesEncrypt(plain_text) {
  try {
    var salt = CryptoJS.lib.WordArray.random(256);
    var iv = CryptoJS.lib.WordArray.random(16);
    var key = CryptoJS.PBKDF2(appkey, salt, {
      hasher: CryptoJS.algo.SHA512,
      keySize: 64 / 8,
      iterations: 999,
    });
    var encrypted = CryptoJS.AES.encrypt(plain_text, key, { iv: iv });
    let data = {
      ciphertext: CryptoJS.enc.Base64.stringify(encrypted.ciphertext),
      salt: CryptoJS.enc.Base64.stringify(salt),
      iv: CryptoJS.enc.Base64.stringify(iv),
    };

    data = JSON.stringify(data);
    data = CryptoJS.enc.Utf8.parse(data);
    return CryptoJS.enc.Base64.stringify(data);
  } catch (error) {}
}

export function CryptoJSAesDecrypt(encryption) {
  try {
    let param = atob(encryption);
    param = JSON.parse(param);
    let salt = CryptoJS.enc.Base64.parse(param.salt);
    let iv = CryptoJS.enc.Base64.parse(param.iv);
    let ciphertext = param.ciphertext;
    //for more random entropy can use : https://github.com/wwwtyro/cryptico/blob/master/random.js instead CryptoJS random() or another js PRNG
    var key = CryptoJS.PBKDF2(appkey, salt, {
      hasher: CryptoJS.algo.SHA512,
      keySize: 64 / 8,
      iterations: 999,
    });
    var decrypt = CryptoJS.AES.decrypt(ciphertext, key, { iv: iv });
    let decryptParse = decrypt.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptParse);
  } catch (error) {}
}

export const encryptLocal = (param) => {
  param = JSON.stringify(param);

  // let plaintext = CryptoJS.enc.Utf8.parse(param);
  let secSpec = CryptoJS.enc.Utf8.parse(appkey);
  let ivSpec = CryptoJS.enc.Utf8.parse(ivKey);

  var encrypted = CryptoJS.AES.encrypt(param, secSpec, {
    iv: ivSpec,
    mode: CryptoJS.mode.CBC,
  });

  encrypted = encrypted.ciphertext.toString(CryptoJS.enc.Base64);

  encrypted = String(encrypted).replaceAll("/", "*");
  return encrypted;
};

export const decryptLocal = (param) => {
  param = param.replaceAll("*", "/");
  let secSpec = CryptoJS.enc.Utf8.parse(appkey);
  let ivSpec = CryptoJS.enc.Utf8.parse(ivKey);

  var decryptedWA = CryptoJS.AES.decrypt(param, secSpec, {
    iv: ivSpec,
  });

  return JSON.parse(decryptedWA.toString(CryptoJS.enc.Utf8));
};
