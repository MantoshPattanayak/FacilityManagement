var CryptoJS = require("crypto-js");

let encryptData = function(value){
    let key = process.env.Encrypt_Decrypt_key
    let iv= process.env.IV
    let parsedKey = CryptoJS.enc.Base64.parse(key)
    let parsediv = CryptoJS.enc.Base64.parse(iv)

    return CryptoJS.AES.encrypt(val,parsedKey,{iv:parsediv}).toString()

}

module.exports = {
    encryptData
}                                                                                                                                                                                                                                                                                                                            