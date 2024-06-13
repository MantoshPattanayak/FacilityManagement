let fs = require('fs')
let  imageUpload = async (imageData,entityType,subDir,filePurpose,insertionData,errors)=>{
    // sub dir = "facility Images"
    // insertionData is the object whose work is to give the data in the format {id:2, name:'US'}
    try {
        let uploadFilePath = null;
        let uploadFilePath2 = null;
        const uploadDir = process.env.UPLOAD_DIR;
        const base64ImageFile = imageData ? imageData.replace(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/, "") : null;
        const mimeMatch = imageData.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
        const mime = mimeMatch ? mimeMatch[1] : null;

        if ([
          "image/jpeg",
          "image/png",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(mime)) {
          // convert base 64 to buffer for image or document or set to null if not present
          const uploadImageFileBuffer = imageData ? Buffer.from(base64ImageFile, "base64") : null;
          if (uploadImageFileBuffer) {
            const imageFileDir = path.join(uploadDir, subDir);

            // ensure the event image directory exists
            if (!fs.existsSync(imageFileDir)) {
              fs.mkdirSync(imageFileDir, { recursive: true });
            }
            const fileExtension = mime ? mime.split("/")[1] : "txt";

            uploadFilePath = `${imageFileDir}/${insertionData.id}${insertionData.name}.${fileExtension}`;

            fs.writeFileSync(uploadFilePath, uploadImageFileBuffer);
            uploadFilePath2 = `/${subDir}/${insertionData.id}${insertionData.name}.${fileExtension}`;

            let fileName = `${insertionData.id}${insertionData.name}.${fileExtension}`;
            let fileType = mime ? mime.split("/")[0] : 'unknown';

            // insert to file table and file attachment table
            let createFile = await file.create({
              fileName: fileName,
              fileType: fileType,
              url: uploadFilePath2,
              statusId: 1,
              createdDt: now(),
              updatedDt: now()
            });

            if (!createFile) {
              errors.push(`Failed to create file  for facility file at index ${i}`);
            } else {
              // Insert into file attachment table
              let createFileAttachment = await fileAttachment.create({
                entityId: insertionData.name,
                entityType: entityType,
                fileId: createFile.fileId,
                statusId: 1,
                filePurpose: filePurpose
              });

              if (!createFileAttachment) {
                errors.push(`Failed to create file attachment for facility file at index ${i}`);
              }
            }
          }
        } else {
          errors.push(`Invalid File type for facility file at index ${i}`);
        }
    } catch (err) {
      errors.push(`something went wrong`)
    }


      
    }


module.exports = imageUpload