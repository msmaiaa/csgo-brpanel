

'use strict';
const logger = require('../modules/logger')('Steam Profile Data Fetch');
const Steam = require('../modules/steam');

//-----------------------------------------------------------------------------------------------------
// 

exports.fetchProfileData = async (req, res) => {
  try {
    const steam = new Steam();
    const result = await steam.getProfile(req.body.profileUrl);
    res.json({
      success: true,
      data: { "res": result, "message": "Data fetched", "notifType": "success" }
    });
  } catch (error) {
    logger.error("Error fetching user data->", error);
    res.json({
      success: false,
      data: { "error": "Something went Wrong!, Error in Fetching user Data" }
    });
  }
};