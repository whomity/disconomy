const { add, get, set } = require('quick.db');

/**
 * 
 * @param {string} userID Id of the user
 * @param {number} amount How much they should get per daily
 * @param {import('../../types').EcoOptions?} ops Guild id where user is in
 * @returns {boolean} Whether the user received their daily amount
 */
module.exports = (userID, amount, ops = {}) => {
    if (typeof userID !== 'string') throw new Error(`User id "${userID}" is not a string`);
    if (!/^[0-9]{16,19}$/.test(userID)) throw new Error(`User id "${userID}" does not match user-id regex`);
    if (isNaN(Number(amount)) || typeof amount !== 'number') throw new Error(`Amount "${amount}" is not a number`);

    const cooldown = 8.64e+7;
    const lastDaily = get(ops.guild ? `daily_${ops.guild}_${userID}` : `daily_${userID}`);

    if (lastDaily && cooldown - (Date.now() - lastDaily) > 0) return false;

    set(ops.guild ? `daily_${ops.guild}_${userID}` : `daily_${userID}`, Date.now());
    add(ops.guild ? `balance${ops.guild}_${userID}` : `balance_${userID}`, amount);

    return true;
}