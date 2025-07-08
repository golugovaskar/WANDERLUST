if(process.env.NODE_ENV != "production") {
  require('dotenv').config();
}
const express = require("express");
const app = express();

// ✅ Rate Limiting Setup
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "⚠️ Too many requests from this IP. Please try again later.",
});
app.use(limiter); // Apply rate limit to all routes

const mongoose = require ("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./Utils/wrapAsync.js");
const ExpressError = require("./Utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Models/user.js");

const listingRouter = require("./Routes/listing.js");
const reviewRouter = require("./Routes/review.js");
const userRouter = require("./Routes/user.js");

const dbUrl = process.env.ATLASDB_URL;

main()
.then(() => {
  console.log("Connected to DB");
})
.catch((err) => {
  console.log(err);
});

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

// Middleware to serve static files from the public folder
app.use(express.static(path.join(__dirname, "Public")));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("error in mongo session store", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.currUser = req.user;
  next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Routes
app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Test route
app.get("/testListing",wrapAsync( async (req, res) => {
  let sampleListing = new Listing ({
    title: "Sample Listing",
    description: "by the beetch",
    price: 1200,
    location: "patna",
    country: "India",
  });
  await sampleListing.save();
  console.log("sample saved");
  res.send("successful teste");
}));

// 404 handler
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found!"));
});

// Error handler
app.use((err, req, res, next) => {
  let {statusCode= 500, message= "something went wrong"} = err;
   res.status(statusCode).render("error.ejs", {message});
});

// Start server
app.listen(8081, () => {
  console.log("server is listen to the port 8081");
});
