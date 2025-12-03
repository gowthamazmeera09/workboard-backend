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
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 2000;

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("mongodb connected successfully");
})
.catch((error)=>{
    console.error(error)
})
app.use('/user',userRouter);
app.use('/work',addworkRouter);





const server = app.listen(PORT, () => {
    console.log(`server started and running at ${PORT}`);
});

// Graceful error handling for server startup (useful when port is already in use)
server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the process using that port or set a different PORT environment variable.`);
        // Exit with non-zero so process managers (nodemon) know it failed
        process.exit(1);
    } else {
        console.error('Server error:', err);
    }
});

app.use('/', (req, res) => {
    res.send('<h1> hello gowtham how are you </h1>');
});