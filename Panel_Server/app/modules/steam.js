

'use strict';
const needle = require('needle');

class Steam {
  constructor() {

  }

  /**
   * Retrieve profile info from steam
   * @param {String} profileURL 
   */
  async getProfile(profileURL) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!profileURL) throw {
          type: "actor",
          desc: "URL not provided"
        }
        const finalURL = profileURL + "?xml=1"
        needle('get', finalURL)
          .then(res => {
            resolve(res.body)
          })
          .catch(err => {
            return reject(err)
          });
      } catch (error) {
        logger.error("error in getProfile->", error);
        reject(error)
      }
    });
  }
}

module.exports = Steam;
