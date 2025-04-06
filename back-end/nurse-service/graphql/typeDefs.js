const typeDefs = `#graphql

type AuthPayload {
  id: ID!
  fullName: String!
}

type Nurse {
  id: ID!
  fullName: String!
  email: String!
  dateOfBirth: String!
  gender: String!
  password: String!
  patients: [Patient!]!
}

type Patient {
    id: ID!
    fullName: String!
    dateOfBirth: String!
    gender: String!
    contactInfo: ContactInfo!
    password: String!
    emergencyContact: EmergencyContact!
    medicalHistory: MedicalHistory
    physicalData: PhysicalData!
    visits: [Visit]
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
  id: ID!
  fullName: String!
  }

  type ContactInfo {
    phone: String!
    email: String
    address: String
  }

  type EmergencyContact {
    name: String!
    phone: String!
    relation: String!
  }

  type ContactDetails {
  contactInfo: ContactInfo
  emergencyContact: EmergencyContact
  }

  type MedicalHistory {
    allergies: [String]
    chronicIllnesses: [String]
    pastSurgeries: [String]
    currentMedications: [String]
  }

  type PhysicalData {
    height: Float
    weight: Float
    bloodPressure: String
    heartRate: Int
    bloodType: String
    symptoms: [String]
  }

type Visit {
    date: String!
    doctor : String!
    reason: String!
    diagnosis: String
    prescribedTreatments: [String]
    followUpDate: String
  }

  input VisitInput {
  date: String!
  doctor: String!
  reason: String!
  diagnosis: String
  prescribedTreatments: [String]
  followUpDate: String
}

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
  getNurse(id: ID!): Nurse
  getAllPatients: [Patient!]!
  patient(id: ID!): Patient
}
  
type Mutation {
  createMotivationCard(topic: String!, message: String!): MotivationCard!
  deleteMotivationCard(id: ID!): Boolean!
  markAlertViewed(id: ID!): Boolean!

  nurseLogin(email: String!, password: String!): AuthPayload!

  registerNurse(
    fullName: String!
    dateOfBirth: String!
    gender: String!
    email: String!
    password: String!
  ): Nurse!

  deletePatient(id: ID!): Boolean!

  assignPatientToNurse(nurseId: ID!, patientId: ID!): Nurse!
  addVisit(id: ID!, visit: VisitInput!): Patient!
}
  
`;

export default typeDefs;
