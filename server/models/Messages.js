const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema({
  conversationId: {
    type: String,
  },
  sender: {
    type: String,
  },
  message: {
    type: String,
  },
});

// const Users = mongoose.model("User", userSchema);

module.exports = mongoose.model("Message", messageSchema);
