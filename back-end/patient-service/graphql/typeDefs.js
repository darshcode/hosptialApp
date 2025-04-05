const typeDefs = `#graphql

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

  type HealthDetails {
  medicalHistory: MedicalHistory
  physicalData: PhysicalData
  visits: [Visit]
  }

  type Visit {
    date: String!
    doctor : String!
    reason: String!
    diagnosis: String
    prescribedTreatments: [String]
    followUpDate: String
  }

  type MotivationCard {
  id: ID!
  topic : String!
  message : String!
  }

  type HelpAlert {
  id: ID!
  patientId: ID!
  message: String
  viewed: Boolean!
  createdAt: String!
}


  input ContactInfoInput {
    phone: String!
    email: String
    address: String
  }

  input EmergencyContactInput {
    name: String!
    phone: String!
    relation: String!
  }

  input MedicalHistoryInput {
    allergies: [String]
    chronicIllnesses: [String]
    pastSurgeries: [String]
    currentMedications: [String]
  }

  input PhysicalDataInput {
    height: Float
    weight: Float
    bloodPressure: String
    heartRate: Int
    bloodType: String
    symptoms: [String]
  }

  input VisitInput {
  date: String!
  doctor: String!
  reason: String!
  diagnosis: String
  prescribedTreatments: [String]
  followUpDate: String
}

#Note, motivatin returns a single and latest card.
  type Query {
    patients: [Patient!]!
    patient(id: ID!): Patient
    contactDetails(id: ID!): ContactDetails
    symptoms(id: ID!): [String]
    healthDetails(id: ID!): HealthDetails
    getMotivationCard: MotivationCard! 
  }

  type Mutation {

  login(email: String!, password: String!): AuthPayload!

    addPatient(
      fullName: String!
      dateOfBirth: String!
      gender: String!
      contactInfo: ContactInfoInput!
      password: String!
      emergencyContact: EmergencyContactInput!
      medicalHistory: MedicalHistoryInput!
      physicalData: PhysicalDataInput!
      visits: [VisitInput!]
    ): Patient!

    updatePatient(
      id: ID!
      fullName: String
      dateOfBirth: String
      gender: String
      contactInfo: ContactInfoInput
      emergencyContact: EmergencyContactInput
      medicalHistory: MedicalHistoryInput
      physicalData: PhysicalDataInput
      visits: [VisitInput]
    ): Patient!

    createMotivationCard(topic: String!, message: String!): MotivationCard!

    deletePatient(id: ID!): String!

    addVisit(id: ID!, visit: VisitInput!): Patient!

    addSymptoms(id: ID!, symptoms: [String]!): Patient!

    removeSymptom(id: ID!, symptom: String!): Patient!

    sendHelpAlert(patientId: ID!, message: String): HelpAlert!
  }
`;

export default typeDefs;
