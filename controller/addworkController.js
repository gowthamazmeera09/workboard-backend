const Addwork = require('../model/Addwork');
const User = require('../model/User');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Set up memory storage without saving buffers in MongoDB
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({ storage, fileFilter });

const workadding = async (req, res) => {
    const { role, experience, location, standard, subject, vehicletype, paintertype } = req.body;
    const photos = req.files.map(file => uuidv4() + '-' + Date.now() + path.extname(file.originalname));

    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        // Check for existing work entry
        const existingWork = await Addwork.findOne({ role, experience, location, standard, subject, vehicletype, paintertype });
        if (existingWork) {
            return res.status(400).json({ error: "This work already exists" });
        }

        // Create and save new work
        const newWork = new Addwork({
            role,
            experience,
            location,
            standard,
            subject,
            vehicletype,
            paintertype,
            photos,
            user: user._id // Reference the user by ID only
        });
        const savedWork = await newWork.save();

        // Update user's work list
        user.addwork.push(savedWork._id);
        await user.save();

        res.status(202).json({ message: "Work added successfully", addedWork: user.addwork });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add the work" });
    }
};

const workdelete = async (req, res) => {
    const workId = req.params.workId;
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        // Find and delete work
        const work = await Addwork.findByIdAndDelete(workId);
        if (!work) {
            return res.status(403).json({ error: "No work found" });
        }

        // Remove work reference from user
        user.addwork.pull(workId);
        await user.save();

        res.status(200).json({ message: "Work deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete the work" });
    }
};

module.exports = {
    workadding: [upload.array('photos', 10), workadding],
    workdelete
};
