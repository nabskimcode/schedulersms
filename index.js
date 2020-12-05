const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const connetDB = require("./config/db");
const errorHandler = require("./middleware/error");
const cors = require("cors");
const cron = require("node-cron");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to DB
connetDB();

//Router files
const smsservice = require("./routes/sendText");

const app = express();

// body parser
app.use(express.json());

// Sanitize data prevent nosql injection
app.use(mongoSanitize());

//Dev logging middleware
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

// Rate limiting when making request to api
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10 mins
  max: 100, //request limit
});

app.use(limiter);

// Enable CORS - Cross-origin resource sharing
app.use(cors());

//Mount router
app.use("/v1", smsservice);

app.use(errorHandler);

// cron.schedule("* * * * *", function () {
//   console.log("running a task every minute");
// });

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandle promise rejections

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //Close server and exit process
  server.close(() => process.exit(1));
});
