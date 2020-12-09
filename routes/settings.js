// Dependencies
const express = require(`express`);
const router = express.Router();

// Login checker
const isLoggedIn = require(`../config/auth`).isLoggedIn;

// Controller
const settingsController = require(`../controllers/settings`);

router.get(`/`, isLoggedIn, settingsController.getSettings);

router.post(`/display-name`, isLoggedIn, settingsController.postSettingsDisplayName);

router.post(`/bio`, isLoggedIn, settingsController.postSettingsBio);

router.post(`/birthday`, isLoggedIn, settingsController.postSettingsBirthday);

router.post(`/gender`, isLoggedIn, settingsController.postSettingsGender);

router.post(`/change-password`, isLoggedIn, settingsController.postSettingsChangePassword);

router.post(`/upload-photo`, isLoggedIn, settingsController.postSettingsUploadPhoto);

module.exports = router;