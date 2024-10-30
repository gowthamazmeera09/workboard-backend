const express = require('express');
const mongoose = require('mongoose');
const dotEnv = require('dotenv');
const bodyparser = require('body-parser');
const userRouter = require('./routes/userRouter');
const path = require('path');
const cors = require('cors');
const addworkRouter = require('./routes/addworkRouter');

dotEnv.config();


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const PORT = 2000
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("mongodb connected successfully");
})
.catch((error)=>{
    console.error(error)
})
app.use('/user',userRouter);
app.use('/work',addworkRouter);



app.listen(PORT,()=>{
    console.log(`server started and running at ${PORT}`)
})
app.use('/',(req, res)=>{
    res.send("<h1> hello gowtham how are you </h1>")
})