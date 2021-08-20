
'use strict';

const userModel = require("../models/userModel.js");
const settingsModal = require("../models/panelSettingModal.js");
const panelServerModal = require("../models/panelServerModal.js");
const salesModal = require("../models/salesModel.js");
const auditModal = require("../models/auditLogsModel.js");
const bundleModel = require("../models/bundleModel.js");

/**
 * Bootstrap the db tables and some initial data insertions
 */
const bootstrap = async ()=>{
    await userModel.createTheTableIfNotExists();
    await settingsModal.createTheTableIfNotExists();
    await panelServerModal.createTheTableIfNotExists();
    await salesModal.createTheTableIfNotExists();
    await auditModal.createTheTableIfNotExists();
    await bundleModel.createTheTableIfNotExists();
};

module.exports = bootstrap;