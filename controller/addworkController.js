const Addwork = require('../model/Addwork');
const User = require('../model/User');

const workadding = async(req, res)=>{
    const {workname,experience,location} = req.body;
    try {
        const user = await User.findById(req.userId);
        if(!user){
            return res.status(400).json({error:"user not found"});
        }

        const newwork = new Addwork({
            workname,
            experience,
            location,
            user:user
        })
        const savedwork = await newwork.save();
        user.addwork.push(savedwork);
        await user.save();

        res.status(202).json({message:"work added successfully"});

        
    } catch (error) {
        console.error(error);
        res.status(500).json({error:"failed to add the work"})
    }
}
const workdelete = async(req, res)=>{
    const workId = req.params.workId
    try {
        const user = await User.findById(req.userId);
        if(!user){
            return res.status(400).json({error:"user not found"});
        }

        const work = await Addwork.findByIdAndDelete(workId);
        if(!work){
            return res.status(403).json({error:"no work found"})
        }
        
        user.addwork.pull(workId);
        await user.save();


        res.status(222).json({message:"work deleted successfully"});
        
    } catch (error) {
        console.error(error);
        res.status(404).json({error:"failed to delete the work"})
    }
}
module.exports = {workadding,workdelete}