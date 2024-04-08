let CryptoJS = require('crypto-js')

let decryptdata= async(val)=>{
    let key = process.env.Encrypt_Decrypt_key
    let iv = process.env.IV
    let parsedKey = CryptoJS.enc.Base64.parse(key)
    let parsediv = CryptoJS.enc.Base64.parse(iv)
    return CryptoJS.AES.decrypt(val,parsedKey,{iv:parsediv}).toString(CryptoJS.enc.Utf8)
}


module.exports ={
    decryptdata
}