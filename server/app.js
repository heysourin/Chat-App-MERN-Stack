const express = require("express");
const db = require("./db/connection"); //db from MongoDB
const Users = require("./models/Users"); // Users schema
const Conversations = require("./models/Conversations"); // Converstaion schema
const Messages = require("./models/Messages"); // Converstaion schema
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
//const { body, validationResult } = require("express-validator");

const app = express();

//@note defining port
const port = process.env.PORT || 5000;
const router = express.Router();

//@note calling db
db();

//@note These two are for receiving data from frontend, correct way
app.use(cors());
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
      { expiresIn: 86400 },
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

app.post("/api/conversation", async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    const newCoversation = new Conversations({
      members: [senderId, receiverId],
    });
    await newCoversation.save();
    res.status(200).send("Conversation created successfully");
  } catch (error) {
    console.error(error);
  }
});

app.get("/api/conversations/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const conversations = await Conversations.find({
      members: { $in: [userId] },
    });

    console.log(conversations);
    const conversationUserData = await Promise.all(
      conversations.map(async (conversation) => {
        const receiverId = conversation.members.find(
          (member) => member !== userId
        );
        const user = await Users.findById(receiverId);
        return {
          user: {
            receiverId: user._id,
            email: user.email,
            fullName: user.fullName,
          },
          conversationId: conversation._id,
        };
      })
    );

    res.status(200).json(conversationUserData);
  } catch (error) {
    console.log(error, "Error");
  }
});

app.post("/api/message", async (req, res) => {
  try {
    const { conversationId, senderId, message, receiverId = "" } = req.body;
    if (!senderId || !message)
      return res.status(400).send("please fill the required fields");

    if (conversationId === "new" && receiverId) {
      const newCoversation = new Conversations({
        members: [senderId, receiverId],
      });
      await newCoversation.save();
      const newMessage = new Messages({
        conversationId: newCoversation._id,
        senderId,
        message,
      });

      await newMessage.save();
      return res.status(200).send("Message sent successfully");
    } else if (!conversationId && !receiverId) {
      return res.status(400).send("please fill the required fields2");
    }

    const newMessage = new Messages({ conversationId, senderId, message });
    await newMessage.save();
    res.status(200).send("Message sent successfully");
  } catch (error) {
    console.log("Error", error);
  }
});

app.get("/api/message/:conversationId", async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    if (conversationId === "new") return res.status(200).json([]);

    const message = await Messages.find({ conversationId });
    const messageUserData = Promise.all(
      message.map(async (message) => {
        const user = await Users.findById(message.senderId);
        return {
          user: { email: user.email, fullName: user.fullName },
          message: message.message,
        };
      })
    );
    res.status(200).json(await messageUserData);
  } catch (error) {
    console.error("Error", error);
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await Users.find();
    const usersData = Promise.all(
      users.map(async (user) => {
        return {
          user: { email: user.email, fullName: user.fullName },
          userId: user._id,
        };
      })
    );
    res.status(200).json(await usersData);
  } catch (error) {
    console.error(error);
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
