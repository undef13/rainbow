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
  lastChangePassword: {
    type: Date,
    default: null
  },
  profileId: {
    type: String,
    unique: true,
    required: true
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
  bio: {
    type: String,
    default: ""
  },
  birthday: {
    type: Date,
    default: null
  },
  gender: {
    type: String,
    default: "None"
  },
  imageUrl: {
    type: String,
    default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  accountActivationToken: String,
  accountActivationExpires: Date,
  provider: {
    type: String,
    default: "local"
  }
});

module.exports = User = mongoose.model("User", UserSchema);
