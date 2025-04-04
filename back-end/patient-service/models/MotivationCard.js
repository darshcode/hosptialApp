import mongoose from "mongoose";

const MotivationCardSchema = new mongoose.Schema({
  Topic: { type: String, required: true },
  message: { type: String, required: true },
});

const MotivationCard = mongoose.model("MotivationCard", MotivationCardSchema);
export default MotivationCard;
