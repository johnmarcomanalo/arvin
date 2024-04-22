var CryptoJS = require("crypto-js");

let appkey = "0123456789123456";
let ivKey = "eThWmZq4t7w!z%C*";
let keys = "+/qS2MCwXdqI+tUuY3oxWDfiwl/n4cm73OlD9ywVnpE=";
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
    var key = ivKey;
    var data = encryption;
    let encrypted = window.atob(data);
    encrypted = JSON.parse(encrypted);
    let iv = CryptoJS.enc.Base64.parse(encrypted.iv);
    const value = encrypted.value;
    key = CryptoJS.enc.Base64.parse(key);
    var decrypted = CryptoJS.AES.decrypt(value, key, {
      iv: iv,
    });
    console.log({
      value: value,
      key: key,
      data: data,
      encrypted: encrypted,
      iv: iv,
      value: value,
      decrypted: decrypted,
    });
    decrypted = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
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
