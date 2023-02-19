// require modules for the BusinessContacts Model
const mongoose = require("mongoose");

const BusinessContacts = mongoose.Schema(
  {
    contactName: {
      type: String,
      trim: true,
      index: true,
    },
    contactNumber: {
      type: String,
    },
    emailAddress: {
      type: String,
    },
  },
  {
    collection: "business-contacts",
  }
);

module.exports.BusinessContacts = mongoose.model(
  "BusinessContacts",
  BusinessContacts
);
