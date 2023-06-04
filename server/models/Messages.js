const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema({
  conversationId: {
    type: String,
  },
  senderId: {
    type: String,
  },
  message: {
    type: String,
  },
});

// const Users = mongoose.model("User", userSchema);

module.exports = mongoose.model("Messages", messageSchema);
