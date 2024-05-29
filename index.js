// Here is the main entry point of the application.
const express = require("express");
const cors = require("cors");
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// Routes
app.get('/', (req, res) => {
    res.send('Server is running...');
});


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})