const mongoose = require("mongoose");
const { Schema } = mongoose;

const conversationSchema = new Schema({
  members: {
    type: Array,
    required: true,
  },

});

// const Users = mongoose.model("User", userSchema);

module.exports = mongoose.model("Conversations", conversationSchema);
