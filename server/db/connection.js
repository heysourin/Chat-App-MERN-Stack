const mongoose = require("mongoose");

const dbURI =
  "mongodb+srv://<uname>:<pw>@cluster0.9sy7br8.mongodb.net/ChatApp?retryWrites=true&w=majority";

const db = async () => {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    const fetchedData = await mongoose.connection.db.collection("Users");
    const data = await fetchedData.find({}).toArray();
    console.log(data);

    // You can also iterate over the data and print each item individually
    // data.forEach(item => console.log(item));
  } catch (err) {
    console.error("Error:", err);
  }
};

module.exports = db;

// mongoose.connection.close();
// console.log("Disconnected from MongoDB");
