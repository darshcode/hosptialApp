const typeDefs = `#graphql

type MotivationCard {
    id: ID!
    topic: String!
    message: String!
  }
  
  type Query {
    getAllMotivationCards: [MotivationCard!]!
    getMotivationCard: MotivationCard
  }
  
  type Mutation {
    createMotivationCard(topic: String!, message: String!): MotivationCard!
    deleteMotivationCard(id: ID!): Boolean!
  }
  
  `;

export default typeDefs;
