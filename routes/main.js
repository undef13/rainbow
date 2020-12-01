// Dependencies
const express = require(`express`);
const router = express.Router();

// Login checker
const isLoggedIn = require(`../config/auth`).isLoggedIn;
const displayIndex = require(`../config/auth`).displayIndex;

// Controller
const mainController = require(`../controllers/main`);

router.get(`/`, displayIndex, mainController.getIndex);

router.get(`/settings`, isLoggedIn, mainController.getSettings);

router.get(`/:profileId`, isLoggedIn, mainController.getProfileId);

router.post(`/settings/display-name`, isLoggedIn, mainController.postSettingsDisplayName);

router.post(`/settings/bio`, isLoggedIn, mainController.postSettingsBio);

router.post(`/settings/birthday`, isLoggedIn, mainController.postSettingsBirthday);

router.post(`/settings/gender`, isLoggedIn, mainController.postSettingsGender);

router.post(`/settings/change-password`, isLoggedIn, mainController.postSettingsChangePassword);

module.exports = router;
