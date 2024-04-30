import CryptoJS from "crypto-js";
import instance from "../../env";

const key = instance().ENCRYPT_DECRYPT_KEY;
const iv = instance().IV;

export function encryptData (val) {
    let parsedKey = CryptoJS.enc.Hex.parse(key);
    let parsediv = CryptoJS.enc.Hex.parse(iv);
    let encryptedData = null;
    
    if(val == null || val == '')    return null;
    encryptedData = CryptoJS.AES.encrypt(val,parsedKey,{iv:parsediv});
    let ciphertext = encryptedData.ciphertext;
    let encryptedString = ciphertext.toString();
    return encryptedString;

}

export function decryptData (val) {
    let parsedKey = CryptoJS.enc.Base64.parse(key);
    let parsediv = CryptoJS.enc.Base64.parse(iv);
    let decryptedData = null;

    if(val == null || val == '')    return;

    decryptedData = CryptoJS.AES.decrypt(val,parsedKey,{iv:parsediv}).toString(CryptoJS.enc.Utf8);
    
    // console.log('decryptData', val, typeof val, decryptedData);
    return decryptedData;
}