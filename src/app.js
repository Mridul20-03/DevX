const express = require("express");
const connectDb = require("./config/database.js");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());



const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);

connectDb()
  .then(() => {
    console.log("Database Connection established");
    app.listen(port, () => {
      console.log("Server Running successfully");
    });
  })
  .catch((err) => {
    console.error("Error connecting Database Connection:", err.message);
  });
