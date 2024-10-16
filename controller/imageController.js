const Image = require ('../model/Image')

const uploadImage = async (req, res) => {
    try {
        const imageUrl = `/uploads/${req.file.filename}`;
        const newImage = new Image({ imageUrl });
        await newImage.save();
        res.json({ message: 'Image uploaded successfully', image: newImage });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getImages = async (req, res) => {
    try {
        const images = await Image.find();
        res.json(images);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { uploadImage, getImages };
