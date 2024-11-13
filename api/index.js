require("dotenv").config();
const express = require("express");
const routes = require("./routes");
const passport = require("passport");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require("./db/passport");

app.use(passport.initialize());

app.use("/users", routes.userRoute);
app.use(
  "/comments",
  passport.authenticate("jwt", { session: false }),
  routes.commentRoute
);
app.use(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  routes.postRoute
);
app.use("/sessions", routes.sessionRoute);

app.listen(process.env.PORT, () => {
  console.log(`TOP-BLOG-API listening on port ${process.env.PORT}!`);
});
