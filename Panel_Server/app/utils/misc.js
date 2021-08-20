

'use strict';

/**
 * Wait for `ms` milliseconds
 * @param {Number} ms Milliseconds
 */
const wait = ms => new Promise(r => setTimeout(r, ms));

module.exports = {
    wait
}