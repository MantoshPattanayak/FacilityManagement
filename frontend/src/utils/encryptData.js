import CryptoJS from "crypto-js";
import instance from "../../env";

const key = instance().ENCRYPT_DECRYPT_KEY;
const iv = instance().IV;

export function encryptData (val) {
    let parsedKey = CryptoJS.enc.Base64.parse(key);
    let parsediv = CryptoJS.enc.Base64.parse(iv);
    return CryptoJS.AES.encrypt(JSON.stringify(val),parsedKey,{iv:parsediv}).toString();
}

export function decryptData (val) {
    let parsedKey = CryptoJS.enc.Base64.parse(key);
    let parsediv = CryptoJS.enc.Base64.parse(iv);

    return JSON.parse(CryptoJS.AES.decrypt(val,parsedKey,{iv:parsediv}).toString(CryptoJS.enc.Utf8));
}
