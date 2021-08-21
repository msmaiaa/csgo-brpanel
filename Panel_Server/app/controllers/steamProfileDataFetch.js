

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
      data: { "res": result, "message": "Dados recuperados", "notifType": "success" }
    });
  } catch (error) {
    logger.error("Error fetching user data->", error);
    res.json({
      success: false,
      data: { "error": "Algo deu errado! Erro ao recuperar dados do usuário steam" }
    });
  }
};