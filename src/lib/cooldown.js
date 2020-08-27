const { get } = require('quick.db');
const ms = require('parse-ms');

/**
 * Gets the remaining time a user has to wait to run daily, weekly, or monthly 
 * @param {string} userID ID of the user
 * @param {string} type Type of "paycheck" Daily, weekly, or monthly 
 * @param {require('../../types').EcoOptions} ops Guild id where user is
 * @returns {object} Returns number of days/hours/minutes/seconds a user has to wait, all formatted in an object
 */
module.exports = (userID, type = 'daily', ops = {}) => {
    if (typeof userID !== 'string') throw new Error(`User id "${userID}" is not a string`);
    if (!/^[0-9]{16,19}$/.test(userID)) throw new Error(`User id "${userID}" does not match user-id regex`);

    type = type.toLowerCase();
    if (!['daily', 'weekly', 'monthly'].includes(type)) throw new Error(`Type "${type}" does not match one of the three values (daily, weekly, monthly)`);

    let cooldown;
    switch (type) {
        case 'daily':
            cooldown = 8.64e+7;
            break;
        case 'weekly':
            cooldown = 6.048e+8;
            break;
        case 'monthly':
            cooldown = 2.592e+9;
            break;
    }

    return ms(cooldown - (Date.now() - get(ops.guild ? `${type}_${ops.guild}_${userID}` : `${type}_${userID}`)));
}