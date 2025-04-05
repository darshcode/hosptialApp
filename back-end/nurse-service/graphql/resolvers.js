import MotivationCard from "../models/MotivationCard.js";
import HelpAlert from "../models/HelpAlert.js";

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

    getAllHelpAlerts: async () => {
      return await HelpAlert.find().sort({ createdAt: -1 });
    },
  },

  Mutation: {
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
