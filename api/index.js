require("dotenv").config();
const express = require("express");
const routes = require("./routes");
const passport = require("passport");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require("./db/passport");

app.use(passport.initialize());

app.use("/users", routes.userRoute);
app.use("/comments", routes.commentRoute);
app.use("/posts", routes.postRoute);

app.listen(process.env.PORT, () => {
  console.log(`TOP-BLOG-API listening on port ${process.env.PORT}!`);
});
