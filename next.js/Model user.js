const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // ... existing user schema fields
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" }, // Reference role document
  tenants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tenant" }], // User's associated tenants
});

module.exports = mongoose.model("User", userSchema);
