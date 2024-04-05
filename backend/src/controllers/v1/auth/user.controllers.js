const db = require("../../../models/index");
let statusCode = require("../../../utils/statusCode");
const bcrypt = require("bcrypt");
const user = db.publicuser;

const { encrypt } = require("../../../middlewares/encryption.middlewares");
const { decrypt } = require("../../../middlewares/decryption.middlewares");

let signUp = async (req, res) => {
  const {
    userName,
    email,
    password,
    roleId,
    title,
    firstName,
    middleName,
    lastName,
    phoneNo,
    altPhoneNo,
    userImage,
    remarks,
  } = req.body;

  const decryptUserName = decrypt(userName);
  const decryptEmailId = decrypt(email);
  const decryptPhoneNumber = decrypt(phoneNo);

  let lastLogin = new Date();
  let updatedOn = new Date();
  let createdOn = new Date();
  let deletedOn = new Date();
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  let createdBy = req.user.id;
  let updatedBy = req.user.id;

  try {
    // Create a new user record in the database

    const uploadDir = process.env.UPLOAD_DIR;

    // Ensure that the base64-encoded image data is correctly decoded before writing it to the file. Use the following code to decode the base64 data:
    const base64Data = userImage
      ? userImage.replace(/^data:image\/\w+;base64,/, "")
      : null;
    console.log(base64Data, "3434559");

    // Convert Base64 to Buffer for driver image
    const userImageBuffer = omnerImage
      ? Buffer.from(base64Data, "base64")
      : null;
    let userImagePath = null;
    let userImagePath2 = null;
    // Save the driver image to the specified path
    console.log(userImageBuffer, "fhsifhskhk");
    if (userImageBuffer) {
      const userDocDir = path.join(uploadDir, "publicUsers"); // Path to drivers directory
      // Ensure the drivers directory exists
      if (!fs.existsSync(userDocDir)) {
        fs.mkdirSync(userDocDir, { recursive: true });
      }
      userImagePath = `${uploadDir}/publicUsers/${userId}_user_image.png`; // Set your desired file name

      fs.writeFileSync(userImagePath, userImageBuffer);
      userImagePath2 = `/publicUsers/${userId}_driver_image.png`;
    }

    const newUser = await user.create({
      roleId: roleId,
      title: title,
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      userName: userName,
      password: hashedPassword,
      phoneNo: phoneNo,
      altPhoneNo: altPhoneNo,
      emailId: email,
      profilePicture: userImagePath, // Assuming profilePicture is the field for storing the image path
      lastLogin: new Date(), // Example of setting a default value
      status: 1, // Example of setting a default value
      remarks: remarks,
      createdBy: createdBy,
      updatedBy: updatedBy,
      createdOn: new Date(), // Set current timestamp for createdOn
      updatedOn: new Date(), // Set current timestamp for updatedOn
      // Ensure to set other fields accordingly
      deletedBy: null,
      deletedOn: null,
    });

    // Return success response
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    // Handle errors
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  signUp,
};
