const express = require("express");
const { connectToDb } = require("./app/config/dbConfig");
const { PORT } = require("./app/config/serverConfig");
const {appRouter} =require("./app/Routes/index");
const app = express();

const port = PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api',appRouter);


connectToDb();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});