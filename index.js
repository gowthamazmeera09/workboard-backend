const express = require('express');
const mongoose = require('mongoose');
const dotEnv = require('dotenv');
const cors = require('cors');
const bodyparser = require('body-parser');
const userRouter = require('./routes/userRouter');


dotEnv.config();


const app = express();
app.use(cors());
app.use(bodyparser.json());

const PORT = 2000
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("mongodb connected successfully");
})
.catch((error)=>{
    console.error(error)
})
app.use('/user',userRouter);

app.listen(PORT,()=>{
    console.log(`server started and running at ${PORT}`)
})