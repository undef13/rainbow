const User = require(`../models/User`);

// GET => /
exports.getIndex = (req, res) => {
  res.render("start-page/start-page", {
    errors: req.flash("error"),
  });
};

// GET => /:profileId
exports.getProfileId = async (req, res, next) => {
  try {
    const user = await User.findOne({ profileId: req.params.profileId });

    if (!user) {
      console.log(`User with id '${req.params.profileId}' was not found`);
      return next();
    }
  } catch (error) {
    console.log(error);
  }

  res.render("profile/current-user-profile", {
    title: req.user.displayName,
    user: req.user,
  });
};

// GET => /settings
exports.getSettings = (req, res) => {
  res.render("profile/settings", {
    user: req.user,
  });
};

// POST => /settings/display-name
exports.postSettingsDisplayName = async (req, res) => {
  const { givenName, familyName } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { profileId: req.user.profileId },
      { givenName, familyName, displayName: `${givenName} ${familyName}` },
      { new: true }
    );
    res.json({
      isSuccessful: true,
      message: "Your name was successfully updated.",
      data: {
        givenName: user.givenName,
        familyName: user.familyName,
        displayName: user.displayName,
      },
    });
  } catch (error) {
    res.json({
      isSuccessful: false,
      message: "Something went wrong...",
    });
  }
};

// POST => /settings/bio
exports.postSettingsBio = async (req, res) => {
  const { bio } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { profileId: req.user.profileId },
      { bio },
      { new: true }
    );
    res.json({
      isSuccessful: true,
      message: "Your bio was successfully updated.",
      data: { bio: user.bio },
    });
  } catch (error) {
    console.error(error);
    res.json({
      isSuccessful: false,
      message: "Something went wrong...",
    });
  }
};

// POST => /settings/birthday
exports.postSettingsBirthday = async (req, res) => {
  const { month, year, day } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { profileId: req.user.profileId },
      { birthday: new Date(`${month}, ${day}, ${year}`) },
      { new: true }
    );
    res.json({
      isSuccessful: true,
      message: "Your birthday was successfully updated.",
      data: {
        month: user.birthday.getMonth(),
        year: user.birthday.getFullYear(),
        day: user.birthday.getDate(),
      },
    });
  } catch (error) {
    console.error(error);
    res.json({
      isSuccessful: false,
      message: "Something went wrong...",
    });
  }
};

// POST => /settings/gender
exports.postSettingsGender = async (req, res) => {
  const { gender } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { profileId: req.user.profileId }, 
      { gender },
      { new: true }
    );
    res.json({
      isSuccessful: true,
      message: "Your gender was successfully updated.",
      data: {
        gender: user.gender
      },
    });
  } catch (error) {
    console.error(error);
    res.json({
      isSuccessful: false,
      message: "Something went wrong...",
    });
  }
}