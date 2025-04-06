import MotivationCard from "../models/MotivationCard.js";
import HelpAlert from "../models/HelpAlert.js";
import Nurse from "../models/Nurse.js";
import Patient from "../models/Patient.js";

const resolvers = {
  Query: {
    getAllMotivationCards: async () => {
      try {
        const cards = await MotivationCard.find().sort({ _id: -1 });
        return cards.map((card) => ({
          id: card._id.toString(),
          topic: card.Topic,
          message: card.message,
        }));
      } catch (err) {
        throw new Error("Failed to fetch motivation cards: " + err.message);
      }
    },

    getMotivationCard: async () => {
      const latest = await MotivationCard.findOne().sort({ _id: -1 });
      if (!latest) return null;
      return {
        id: latest._id.toString(),
        topic: latest.Topic,
        message: latest.message,
      };
    },

    patient: async (_, { id }) => {
      try {
        const patient = await Patient.findById(id);
        if (!patient) {
          throw new Error("Patient not found");
        }
        return patient;
      } catch (error) {
        throw new Error("Error finding patient: " + error.message);
      }
    },

    getAllHelpAlerts: async () => {
      return await HelpAlert.find().sort({ createdAt: -1 });
    },

    getAllPatients: async () => {
      const patients = await Patient.find();
      return patients.map((patient) => ({
        id: patient._id.toString(),
        fullName: patient.fullName,
      }));
    },

    getNurse: async (_, { id }) => {
      const nurse = await Nurse.findById(id).populate("patients");
      if (!nurse) return null;

      const nurseObj = nurse.toObject();

      return {
        ...nurseObj,
        id: nurse._id.toString(),
        patients: nurse.patients.map((p) => ({
          id: p._id.toString(),
          fullName: p.fullName,
        })),
      };
    },
  },

  Mutation: {
    nurseLogin: async (_, { email, password }) => {
      const nurse = await Nurse.findOne({ email });

      if (!nurse || nurse.password !== password) {
        throw new Error("Invalid email or password");
      }

      return {
        id: nurse._id.toString(),
        fullName: nurse.fullName,
      };
    },

    registerNurse: async (
      _,
      { fullName, dateOfBirth, gender, email, password }
    ) => {
      const newNurse = new Nurse({
        fullName,
        dateOfBirth,
        gender,
        email,
        password,
      });
      return await newNurse.save();
    },

    assignPatientToNurse: async (_, { nurseId, patientId }) => {
      const nurse = await Nurse.findById(nurseId);
      if (!nurse) throw new Error("Nurse not found");

      if (!nurse.patients.includes(patientId)) {
        nurse.patients.push(patientId);
        await nurse.save();
      }

      return await Nurse.findById(nurseId).populate("patients");
    },

    deletePatient: async (_, { id }) => {
      const result = await Patient.findByIdAndDelete(id);
      return !!result;
    },

    addVisit: async (_, { id, visit }) => {
      try {
        const patient = await Patient.findById(id);
        if (!patient) {
          throw new Error("Patient not found");
        }

        patient.visits.push(visit);
        await patient.save();

        return patient;
      } catch (error) {
        throw new Error("Error adding visit: " + error.message);
      }
    },

    createMotivationCard: async (_, { topic, message }) => {
      try {
        const newCard = new MotivationCard({ Topic: topic, message });
        const saved = await newCard.save();
        return {
          id: saved._id.toString(),
          topic: saved.Topic,
          message: saved.message,
        };
      } catch (error) {
        throw new Error("Failed to create motivation card: " + error.message);
      }
    },
    deleteMotivationCard: async (_, { id }) => {
      try {
        const result = await MotivationCard.findByIdAndDelete(id);
        return !!result;
      } catch (error) {
        throw new Error("Failed to delete card: " + error.message);
      }
    },

    markAlertViewed: async (_, { id }) => {
      const updated = await HelpAlert.findByIdAndUpdate(id, { viewed: true });
      return !!updated;
    },
  },
};

export default resolvers;
