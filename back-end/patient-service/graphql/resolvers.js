import Patient from "../models/Patient.js";
import MotivationCard from "../models/MotivationCard.js";
import HelpAlert from "../models/HelpAlert.js";

const resolvers = {
  Query: {
    //all patients
    patients: async () => {
      try {
        const patients = await Patient.find();
        return patients.map((patient) => ({
          id: patient._id.toString(),

          ...patient.toObject(),
          createdAt: new Date(patient.createdAt).toISOString(),
          updatedAt: new Date(patient.updatedAt).toISOString(),
        }));
      } catch (error) {
        throw new Error("Error fetching patients: " + error.message);
      }
    },

    //patients by id
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

    getMotivationCard: async () => {
      try {
        const latestCard = await MotivationCard.findOne().sort({ _id: -1 });
        if (!latestCard) return null;

        return {
          id: latestCard._id.toString(),
          topic: latestCard.Topic,
          message: latestCard.message,
        };
      } catch (error) {
        throw new Error(
          "Failed to fetch latest motivation card: " + error.message
        );
      }
    },

    symptoms: async (_, { id }) => {
      try {
        const patient = await Patient.findById(id);
        if (!patient) {
          throw new Error("Patient not found");
        }
        // Return only the symptoms from the patient's physical data
        return patient.physicalData ? patient.physicalData.symptoms : [];
      } catch (error) {
        throw new Error("Error fetching symptoms: " + error.message);
      }
    },

    contactDetails: async (_, { id }) => {
      try {
        const patient = await Patient.findById(id);
        if (!patient) {
          throw new Error("Patient not found");
        }
        return {
          contactInfo: patient.contactInfo,
          emergencyContact: patient.emergencyContact,
        };
      } catch (error) {
        throw new Error("Error fetching contact details: " + error.message);
      }
    },
    healthDetails: async (_, { id }) => {
      try {
        const patient = await Patient.findById(id);
        if (!patient) {
          throw new Error("Patient not found");
        }
        return {
          medicalHistory: patient.medicalHistory,
          physicalData: patient.physicalData,
          visits: patient.visits,
        };
      } catch (error) {
        throw new Error("Error fetching health details: " + error.message);
      }
    },
  },

  Mutation: {
    login: async (_, { email, password }) => {
      try {
        const patient = await Patient.findOne({ "contactInfo.email": email });
        if (!patient || patient.password !== password) {
          throw new Error("Invalid email or password");
        }

        return {
          id: patient._id.toString(),
          fullName: patient.fullName,
        };
      } catch (error) {
        throw new Error("Login failed: " + error.message);
      }
    },

    createMotivationCard: async (_, { topic, message }) => {
      try {
        const newCard = new MotivationCard({
          Topic: topic,
          message,
        });
        const savedCard = await newCard.save();
        return {
          id: savedCard._id.toString(),
          topic: savedCard.Topic,
          message: savedCard.message,
        };
      } catch (error) {
        throw new Error("Failed to create motivation card: " + error.message);
      }
    },

    addPatient: async (_, args) => {
      try {
        const patient = new Patient(args);
        const newPatient = await patient.save();
        return { id: newPatient._id.toString(), ...newPatient.toObject() };
      } catch (error) {
        console.log(`Server-Error creating patient: ${error}`);
        throw new Error("Server-Error creating patient: " + error.message);
      }
    },

    deletePatient: async (_, { id }) => {
      try {
        // Find the patient by ID and delete it
        const patient = await Patient.findByIdAndDelete(id);

        if (!patient) {
          throw new Error("Patient not found");
        }

        // Return a success message
        return "Patient deleted successfully";
      } catch (error) {
        throw new Error("Error deleting patient: " + error.message);
      }
    },

    updatePatient: async (
      _,
      { id, contactInfo, emergencyContact, medicalHistory, physicalData }
    ) => {
      try {
        const patient = await Patient.findById(id);
        if (!patient) {
          throw new Error("Patient not found");
        }

        if (contactInfo) {
          patient.contactInfo = {
            ...patient.contactInfo,
            ...contactInfo,
          };
        }

        if (emergencyContact) {
          patient.emergencyContact = {
            ...patient.emergencyContact,
            ...emergencyContact,
          };
        }

        if (medicalHistory) {
          patient.medicalHistory = {
            ...patient.medicalHistory,
            ...medicalHistory,
          };
        }

        if (physicalData) {
          patient.physicalData = {
            ...patient.physicalData,
            ...physicalData,
          };
        }

        await patient.save();
        return patient;
      } catch (error) {
        throw new Error("Server - Error updating patient: " + error.message);
      }
    },

    addVisit: async (_, { id, visit }) => {
      try {
        const patient = await Patient.findById(id);
        if (!patient) {
          throw new Error("Patient not found");
        }

        patient.visits.push(visit);
        await patient.save();

        return {
          id: patient._id.toString(),
          createdAt: new Date(patient.createdAt).toISOString(),
          updatedAt: new Date(patient.updatedAt).toISOString(),
          ...patient.toObject(),
        };
      } catch (error) {
        throw new Error("Error adding visit: " + error.message);
      }
    },

    // Add symptoms to an existing patient's physical data
    addSymptoms: async (_, { id, symptoms }) => {
      try {
        const patient = await Patient.findById(id);
        if (!patient) {
          throw new Error("Patient not found");
        }

        // Add the symptoms to the patient's physical data
        patient.physicalData.symptoms = [
          ...patient.physicalData.symptoms,
          ...symptoms,
        ];

        await patient.save();

        return patient;
      } catch (error) {
        throw new Error("Error adding symptoms: " + error.message);
      }
    },

    removeSymptom: async (_, { id, symptom }) => {
      try {
        const patient = await Patient.findById(id);
        if (!patient) {
          throw new Error("Patient not found");
        }

        // Remove symptom if it exists in the array
        patient.physicalData.symptoms = patient.physicalData.symptoms.filter(
          (s) => s !== symptom
        );

        await patient.save();
        return patient;
      } catch (error) {
        throw new Error("Error removing symptom: " + error.message);
      }
    },

    sendHelpAlert: async (_, { patientId, message }) => {
      const newAlert = new HelpAlert({ patientId, message });
      return await newAlert.save();
    },
  },
};

export default resolvers;
