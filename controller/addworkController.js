const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const Addwork = require('../model/Addwork');
const User = require('../model/User');

// Configure Cloudinary directly in the controller
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer to use CloudinaryStorage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'addwork_photos', // Folder name in Cloudinary
    allowed_formats: ['jpeg', 'jpg', 'png'], // File formats
  },
});

const upload = multer({ storage });

// Add Work Controller
const workadding = async (req, res) => {
  const {
    role,
    experience,
    location,
    standard,
    subject,
    vehicletype,
    paintertype,
    weldingtype,
    marbultype,
  } = req.body;

  try {
    // Verify user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Check for existing work
    const existingwork = await Addwork.findOne({
      role,
      experience,
      location,
      standard,
      subject,
      vehicletype,
      paintertype,
      weldingtype,
      marbultype,
    });
    if (existingwork) {
      return res.status(400).json({ error: 'This work already exists' });
    }

    // Get Cloudinary URLs from Multer files
    const photos = req.files.map((file) => file.path);  // Cloudinary URL

    // Create new work entry
    const newwork = new Addwork({
      role,
      experience,
      location,
      standard,
      subject,
      vehicletype,
      paintertype,
      photos, // Store Cloudinary URLs
      weldingtype,
      marbultype,
      user: user,
    });

    const savedwork = await newwork.save();

    // Update user's addwork field
    user.addwork.push(savedwork);
    await user.save();

    res
      .status(202)
      .json({ message: 'Work added successfully', addedWork: user.addwork });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add the work' });
  }
};

// Delete Work Controller
const workdelete = async (req, res) => {
  const workId = req.params.workId;
  try {
    const work = await Addwork.findById(workId);
    if (!work) {
      return res.status(404).json({ error: 'Work not found' });
    }

    // Delete photos from Cloudinary
    for (const photoUrl of work.photos) {
      const publicId = photoUrl.split('/').pop().split('.')[0]; // Extract Cloudinary public ID
      await cloudinary.uploader.destroy(`addwork_photos/${publicId}`);
    }

    // Delete work from MongoDB
    await Addwork.findByIdAndDelete(workId);

    res.status(200).json({ message: 'Work deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete the work' });
  }
};

module.exports = {
  workadding: [upload.array('photos', 10), workadding],
  workdelete,
};
