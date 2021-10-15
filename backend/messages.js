import mongoose from "mongoose";

const whatsappMessages = new mongoose.Schema({
  message: String,
  name: String,
  timeStamp: String,
  received: Boolean,
});

export default mongoose.model("messagecontents", whatsappMessages);
