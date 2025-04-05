// models/HelpAlert.js
import mongoose from "mongoose";

const HelpAlertSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, required: true },
  message: { type: String }, // optional: "I need help"
  viewed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const HelpAlert = mongoose.model("HelpAlert", HelpAlertSchema);
export default HelpAlert;
