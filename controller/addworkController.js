const Addwork = require('../model/Addwork');
const User = require('../model/User');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.memoryStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
    }
});

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
    const { role, experience, location, standard, subject, vehicletype, paintertype, weldingtype, marbultype } = req.body;
    const photos = req.files.map(file => file.filename); // Save filename, not buffer

    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const existingwork = await Addwork.findOne({ role, experience, location, standard, subject, vehicletype, paintertype, weldingtype, marbultype });
        if (existingwork) {
            return res.status(400).json({ error: "This work already exists" });
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
            user: user._id
        });

        const savedwork = await newwork.save();
        user.addwork.push(savedwork);
        await user.save();

        res.status(202).json({ message: "Work added successfully", addedWork: user.addwork });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add work" });
    }
};

const workdelete = async (req, res) => {
    const workId = req.params.workId;
    try {
        const work = await Addwork.findById(workId);
        if (!work) {
            return res.status(404).json({ error: "Work not found" });
        }

        await Addwork.findByIdAndDelete(workId);
        res.status(200).json({ message: "Work deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete work" });
    }
};

module.exports = {
    workadding: [upload.array('photos', 10), workadding],
    workdelete
};
