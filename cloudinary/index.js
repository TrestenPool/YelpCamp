const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET 
})

function deleteFile(fileObject){
  let file = fileObject['url'].split('YelpCamp/')[1].split('.')[0];
  let deleteSrc = 'YelpCamp/' + file;

  cloudinary.uploader.destroy(
    deleteSrc,
    {
      invalidate: true
    },
    function (error, result) {
      // console.log(`error = ${error}, result = ${result}`);
    }
  );
}

// setting up an instance of cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'YelpCamp',
    allowedFormats: ['jpeg', 'png', 'jpg']
  }
});


module.exports = {
  cloudinary,
  storage,
  deleteFile
}