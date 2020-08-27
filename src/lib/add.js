const { add } = require('quick.db');

/**
 * Add an amount to a user's balance
 * @param {string} userID ID of the user to add
 * @param {number} amount Amount to add to balance
 * @param {import('../../types').EcoOptions} ops ID of the guild where user is
 * @returns {number} New balance of the user
 */
module.exports = (userID, amount, ops = {}) => {
    if (typeof userID !== 'string') throw new Error(`User id "${userID}" is not a string`);
    if (!/^[0-9]{16,19}$/.test(userID)) throw new Error(`User id "${userID}" does not match user-id regex`);
    if (isNaN(Number(amount)) || typeof amount !== 'number') throw new Error(`Amount "${amount}" is not a number`);

    return add(ops.guild ? `balance_${ops.guild}_${userID}` : `balance_${userID}`, amount);
}