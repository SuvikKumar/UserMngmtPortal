const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // User IDs of tenant admins
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // User IDs of tenant members
});

module.exports = mongoose.model("Tenant", tenantSchema);
