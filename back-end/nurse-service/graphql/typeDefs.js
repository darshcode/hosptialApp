const typeDefs = `#graphql

type MotivationCard {
    id: ID!
    topic: String!
    message: String!
  }

  type HelpAlert {
  id: ID!
  patientId: ID!
  message: String
  viewed: Boolean!
  createdAt: String!
}
  
  type Query {
    getAllMotivationCards: [MotivationCard!]!
    getMotivationCard: MotivationCard
    getAllHelpAlerts: [HelpAlert!]!
  }
  
  type Mutation {
    createMotivationCard(topic: String!, message: String!): MotivationCard!
    deleteMotivationCard(id: ID!): Boolean!
    markAlertViewed(id: ID!): Boolean!
  }
  
  `;

export default typeDefs;
