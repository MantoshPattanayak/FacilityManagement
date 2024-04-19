import CryptoJS from "crypto-js";
import instance from "../../env";

const key = instance().ENCRYPT_DECRYPT_KEY;
const iv = instance().IV;

export function encryptData (val) {
    let parsedKey = CryptoJS.enc.Base64.parse(key);
    let parsediv = CryptoJS.enc.Base64.parse(iv);
    let encryptedData = null;
    if (typeof val === 'string' && val !== null) {
        encryptedData = CryptoJS.AES.decrypt(val,parsedKey,{iv:parsediv}).toString(CryptoJS.enc.Utf8);
    }
    else {
        encryptedData = CryptoJS.AES.encrypt(JSON.stringify(val),parsedKey,{iv:parsediv}).toString();
    }
    return encryptedData;
}

export function decryptData (val) {
    let parsedKey = CryptoJS.enc.Base64.parse(key);
    let parsediv = CryptoJS.enc.Base64.parse(iv);
    let decryptedData = null;
    if (typeof val === 'string' && val !== null) {
        decryptedData = CryptoJS.AES.decrypt(val,parsedKey,{iv:parsediv}).toString(CryptoJS.enc.Utf8);
    }
    else {
        decryptedData = JSON.parse(CryptoJS.AES.decrypt(val,parsedKey,{iv:parsediv}).toString(CryptoJS.enc.Utf8));
    }
    return decryptedData;
}

