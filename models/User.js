const mongoose = require(`mongoose`);

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  givenName: {
    type: String,
    default: "",
  },
  familyName: {
    type: String,
    default: "",
  },
  displayName: {
    type: String,
    default: "",
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  accountActivationToken: String,
  accountActivationExpires: Date,
});

module.exports = User = mongoose.model("User", UserSchema);
