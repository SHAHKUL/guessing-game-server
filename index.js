require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("./model/admin");

mongoose.connect(process.env.URL);

app.use(express.json());
app.use(cors());

app.get("/register", async (req, res) => {
  try {
    const data = await Admin.find();
    res.json(data);
  } catch (error) {
    console.log("can,t login");
  }
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let salt = bcryptjs.genSaltSync(10);
    var hash = bcryptjs.hashSync(password, salt);
    const data = await Admin.create({
      name,
      email,
      password: hash,
    });

    res.json(data);
  } catch (error) {
    console.log("can,t login");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    var user = await Admin.findOne({ email });
    if (user) {
      let compare = bcryptjs.compareSync(password, user.password);
      if (compare) {
        var sign = jwt.sign(
          { name: user.name, id: user._id },
          process.env.key
        );
        var decode = jwt.verify(sign, process.env.key);

        res.status(200).json({ token: true,name:decode.name });
      } else {
        res.json({ message: "password not match" });
      }
    } else {
      res.json({ message: "no user found" });
    }
  } catch (error) {
    console.log(error);
  }

  // authencitcate()
});

// function authencitcate(req, res, next) {

//   if (req.headers.validation) {
//     let decode = jwt.verify(req.headers.validation, process.env.key)
//     if (decode) {
//       next()
//     } else {
//       res.status(401).json({ message: 'it is nto crt token' })
//     }

//   } else {
//     res.status(401).json({ message: 'UNAUTUORIZED' })
//   }

// }

app.listen(process.env.PORT, () => {
  console.log("server connected");
});
