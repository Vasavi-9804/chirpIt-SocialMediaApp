const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require('body-parser');
const express = require("express");
const app = express();
const {authRouter} = require("./app/Routes/authentication/auth-router");
const { connectToDb } = require("./app/config/dbConfig");

const port = 4000;

connectToDb();
app.use(bodyParser.text());
app.use(express.json());
app.use('/api/authentication',authRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});