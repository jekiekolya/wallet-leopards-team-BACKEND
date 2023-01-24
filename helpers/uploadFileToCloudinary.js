const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure cloud service
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadFile = (pathFile, idCloudAvatar) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      pathFile,
      { folder: 'avatars_phonebook' },
      (error, result) => {
        cloudinary.uploader.destroy(idCloudAvatar);
        if (error) reject(error);
        resolve(result);
      }
    );
  });
};

module.exports = uploadFile;
