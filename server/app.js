const express = require("express");
const db = require("./db/connection"); //db from MongoDB
const Users = require("./models/Users"); // Users schema
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
//const { body, validationResult } = require("express-validator");

const app = express();

//@note defining port
const port = process.env.PORT || 5000;
const router = express.Router();

//@note calling db
db();

//@note These two are for receiving data from frontend, correct way
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Todo: ROUTES
app.get("/", (req, res) => {
  res.send("welcome");
});

app.post("/api/register", async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      res.status(400).send("Please fill all required fields");
    } else {
      const isAlreadyExist = await Users.findOne({ email: email });
      if (isAlreadyExist) {
        res.status(400).send("User already exists");
      } else {
        const newUser = new Users({ fullName, email });
        bcryptjs.hash(password, 10, (err, hashedPassword) => {
          newUser.set("password", hashedPassword);
          newUser.save();
          next();
        });
        return res.status(200).send("User registered successfully");
      }
    }
  } catch (error) {
    console.log(error, "Error");
  }
});

app.post("/api/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Please fill all required fields");
    }

    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(400).send("Invalid email or password");
    }

    const validateUser = await bcryptjs.compare(password, user.password);

    if (!validateUser) {
      return res.status(400).send("Invalid email or password");
    }

    const payload = {
      userId: user._id,
      email: user.email,
    };

    const JWT_SECRET_KEY =
      process.env.JWT_SECRET_KEY || `This is a JWT secret key`;

    jwt.sign(
      payload,
      JWT_SECRET_KEY,
      { expiresIn: 84600 },
      async (err, token) => {
        user.token = token;
        await user.save();
        return res.status(200).json({
          user: {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
          },
          token: token,
        });
      }
    );
  } catch (error) {
    console.log(error, "Error");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

//-----------------------------------------------------------------//

//@note Another way of doing register
/**
 *   const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const salt = await bcryptjs.genSalt(10);
  let secPassword = await bcryptjs.hash(req.body.password, salt);

  try {
    await Users.create({
      fullName: req.body.fullName,
      email: req.body.email,
      password: secPassword,
    });

    res.json({ success: true }); //To notify: update successful
  } catch (error) {
    res.json({ success: false });

    console.error("hehe", error);
  }
 */