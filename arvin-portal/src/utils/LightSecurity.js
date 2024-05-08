import CryptoJS from "crypto-js";
import configure from "../apps/configure/configure.json";
export function decryptaes(data) {
  if (data == "" || data == null) {
    return [];
  }
  var key = configure.key;
  var data = data;

  let encrypted = atob(data);
  encrypted = JSON.parse(encrypted);
  const iv = CryptoJS.enc.Base64.parse(encrypted.iv);
  const value = encrypted.value;
  key = CryptoJS.enc.Base64.parse(key);
  var decrypted = CryptoJS.AES.decrypt(value, key, {
    iv: iv,
  });
  decrypted = decrypted.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decrypted);
}

export function decryptaesString(data) {
  // if (data == "" || data == null) {
  //   return [];
  // }
  // var key = config.key;
  // var data = data;
  // let encrypted = window.atob(data);
  // encrypted = JSON.parse(encrypted);
  // const iv = CryptoJS.enc.Base64.parse(encrypted.iv);
  // const value = encrypted.value;
  // key = CryptoJS.enc.Base64.parse(key);
  // var decrypted = CryptoJS.AES.decrypt(value, key, {
  //   iv: iv,
  // });
  // decrypted = decrypted.toString(CryptoJS.enc.Utf8);
  // return decrypted;
}

export function encryptaes(data) {
  let iv = CryptoJS.lib.WordArray.random(16),
    key = CryptoJS.enc.Base64.parse(configure.key);
  let options = {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  };
  let encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, options);
  encrypted = encrypted.toString();
  iv = CryptoJS.enc.Base64.stringify(iv);
  let result = {
    iv: iv,
    value: encrypted,
    mac: CryptoJS.HmacSHA256(iv + encrypted, key).toString(),
  };
  result = JSON.stringify(result);
  result = CryptoJS.enc.Utf8.parse(result);
  return CryptoJS.enc.Base64.stringify(result);
}
