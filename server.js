const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const bodyParser = require('body-parser');

const userRoute = require('./routes/user.route');
const authRoute = require('./routes/auth.route');
const uploadRoute = require('./routes/upload.route');

require('dotenv').config();
const app = express();

//BodyParser middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// below, also change this to
app.use('/public', express.static(__dirname + '/public'));

//CORS
app.use(cors());

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
})
    .then(() => console.log("Database connected"))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send("Hello node");
});

app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/uploads', uploadRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server run at port ${PORT}`));