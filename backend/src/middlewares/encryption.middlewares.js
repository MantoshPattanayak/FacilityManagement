var CryptoJS = require("crypto-js");

let encrypt =  (val)=>{
    let key = process.env.Encrypt_Decrypt_key
    let iv= process.env.IV
    let parsedKey = CryptoJS.enc.Hex.parse(key)
    let parsedIv = CryptoJS.enc.Hex.parse(iv)
    let encryptedValue = CryptoJS.AES.encrypt(val, parsedKey, { iv: parsedIv
        });
        
        let ciphertext = encryptedValue.ciphertext;
        let encryptedString = ciphertext.toString();

        console.log('ecnrytp', encryptedString)
        return encryptedString;
}

module.exports = {
    encrypt
}