// let CryptoJS = require('crypto-js')

// let decrypt= async(val)=>{
//     let key = process.env.Encrypt_Decrypt_key
//     let iv = process.env.IV
//     let parsedKey = CryptoJS.enc.Base64.parse(key)
//     let parsediv = CryptoJS.enc.Base64.parse(iv)
//     return CryptoJS.AES.decrypt(val,parsedKey,{iv:parsediv}).toString(CryptoJS.enc.Utf8)
// }


// module.exports ={
//     decrypt
// }


let CryptoJS = require('crypto-js')

let decrypt = async (val) => {
    try {
        console.log('jfd')
        let key = process.env.Encrypt_Decrypt_key;
        console.log('key')
        let iv = process.env.IV;
        console.log('keu')
        let parsedKey = CryptoJS.enc.Base64.parse(key);
        console.log('jf')
        let parsedIv = CryptoJS.enc.Base64.parse(iv);
        console.log('llfj')
        
        // Decrypt the value
        console.log('1klm')
        let decryptedData = CryptoJS.AES.decrypt(val, parsedKey, { iv: parsedIv });
        console.log('3',decryptedData)
        // Convert the decrypted data to a string using Utf8 encoding
        let decryptedString = decryptedData.toString(CryptoJS.enc.Utf8);
        
        return decryptedString;
    } catch (error) {
        console.error('Error decrypting value:', error);
        throw error;
    }
}

module.exports = {
    decrypt
};
