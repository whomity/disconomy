const { subtract } = require('quick.db');

/**
 * Subtract an amount from a user
 * @param {string} userID User to subtract amount from
 * @param {number} amount Amount to subtract
 * @param {import('../../types').EcoOptions} 
 * @returns {number} New balance of the user
 */
module.exports = (userID, amount, ops = {}) => {
    if (typeof userID !== 'string') throw new Error(`User id "${userID}" is not a string`);
    if (!/^[0-9]{16,19}$/.test(userID)) throw new Error(`User id "${userID}" does not match user-id regex`);
    if (isNaN(Number(amount)) || typeof amount !== 'number') throw new Error(`Amount "${amount}" is not a number`);

    return subtract(ops.guild ? `balance_${guild}_${userID}` : `balance_${userID}`, amount);
}