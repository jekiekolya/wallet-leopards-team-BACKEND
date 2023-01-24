const { User } = require('../../models');
const fs = require('fs/promises');
const jimp = require('jimp');
const { BadRequest } = require('http-errors');
const { uploadFileToCloudinary } = require('../../helpers');

const updateAvatar = async (req, res) => {
  if (!req.file) {
    throw new BadRequest('Avatar not attach');
  }

  const { path: tempUpload } = req.file;

  try {
    // change file size (with the help of jimp)
    const img = await jimp.read(req.file.path);
    await img
      .autocrop()
      .cover(
        250,
        250,
        jimp.HORIZONTAL_ALIGN_CENTER || jimp.VERTICAL_ALIGN_MIDDLE
      )
      .writeAsync(req.file.path);

    // Upload file to cloud service
    const { secure_url: avatarURL, public_id: idCloudAvatar } =
      await uploadFileToCloudinary(tempUpload, req.user.idCloudAvatar);
    await fs.unlink(tempUpload);

    await User.findByIdAndUpdate(req.user._id, { avatarURL, idCloudAvatar });

    res.json({
      status: 'success',
      code: 200,
      data: {
        avatarURL,
      },
    });
  } catch (error) {
    await fs.unlink(tempUpload);
    throw error;
  }
};

module.exports = updateAvatar;
