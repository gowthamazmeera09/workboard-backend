const Addwork = require('../model/Addwork');
const User = require('../model/User');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotEnv = require('dotenv');

dotEnv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'workboard',
        allowed_formats: ['jpg', 'jpeg', 'png'],
    },
});

const upload= multer({ storage });

const workadding = async (req, res) => {
    const { role, experience, location, standard, subject, vehicletype, paintertype, weldingtype, marbultype } = req.body;
    const photos = req.files.map(file => file.path); // Array of Cloudinary URLs
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(400).json({ error: "user not found" });
        }
        const existingwork = await Addwork.findOne({ role, experience, location, standard, subject, vehicletype, paintertype, weldingtype, marbultype });
        if (existingwork) {
            return res.status(400).json({ error: "these work is already exists" })
        }
        const newwork = new Addwork({
            role,
            experience,
            location,
            standard,
            subject,
            vehicletype,
            paintertype,
            photos,
            weldingtype,
            marbultype,
            user: user
        })
        const savedwork = await newwork.save();
        user.addwork.push(savedwork);
        await user.save();



        res.status(202).json({ message: "work added successfully", addedWork: user.addwork });


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "failed to add the work" })
    }
}
const workdelete = async (req, res) => {
    const workId = req.params.workId;
    try {
        const work = await Addwork.findById(workId);
        if (!work) return res.status(404).json({ error: "Work not found" });

        // Delete associated images from Cloudinary
        const publicIds = work.photos.map(photo => {
            const urlParts = photo.split('/');
            return urlParts[urlParts.length - 1].split('.')[0];
        });
        await cloudinary.api.delete_resources(publicIds);

        // Delete work from database
        await Addwork.findByIdAndDelete(workId);

        res.status(200).json({ message: "Work deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete work" });
    }
};
const deleteImage = async (req, res) => {
    const { workId, publicId } = req.body;
    try {
        const work = await Addwork.findById(workId);
        if (!work) return res.status(404).json({ error: "Work not found" });

        // Remove the image from Cloudinary
        await cloudinary.uploader.destroy(publicId);

        // Remove the image from the database
        work.photos = work.photos.filter(photo => !photo.includes(publicId));
        await work.save();

        res.status(200).json({ message: "Image deleted successfully", updatedPhotos: work.photos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete image" });
    }
};
const addImagesToWork = async (req, res) => {
    const { workId } = req.params;
  
    try {
      // Find the work by ID
      const work = await Addwork.findById(workId);
      if (!work) {
        return res.status(404).json({ error: 'Work not found' });
      }
  
      // Get the uploaded images from Cloudinary URLs
      const photos = req.files.map(file => file.path);
  
      // Add the new images to the existing photos array
      work.photos.push(...photos);
  
      // Save the updated work entry
      await work.save();
  
      res.status(200).json({ message: 'Images added successfully', updatedPhotos: work.photos });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to add images' });
    }
  };

module.exports = {
    workadding,
    workdelete,
    deleteImage,
    addImagesToWork,
    upload
}