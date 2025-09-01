// models/Client.js
import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  middleName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  suffix: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  mailingAddress: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  zipCode: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    default: "United States",
    trim: true
  },
  phoneMobile: {
    type: String,
    trim: true
  },
  phoneAlternate: {
    type: String,
    trim: true
  },
  phoneWork: {
    type: String,
    trim: true
  },
  fax: {
    type: String,
    trim: true
  },
  ssn: {
    type: String,
    trim: true
  },
  experianReportNumber: {
    type: String,
    trim: true
  },
  transUnionFileNumber: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive"
  },
  // Document references
  documents: {
    driversLicense: {
      filename: String,
      originalName: String,
      size: Number,
      uploadedAt: Date
    },
    proofOfSS: {
      filename: String,
      originalName: String,
      size: Number,
      uploadedAt: Date
    },
    proofOfAddress: {
      filename: String,
      originalName: String,
      size: Number,
      uploadedAt: Date
    },
    ftcReport: {
      filename: String,
      originalName: String,
      size: Number,
      uploadedAt: Date
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
clientSchema.index({ email: 1 });
clientSchema.index({ status: 1 });
clientSchema.index({ createdBy: 1 });

export default mongoose.model("Client", clientSchema);