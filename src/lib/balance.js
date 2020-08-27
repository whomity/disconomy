const { has, get, set } = require('quick.db');

/**
 * Retrieves a user's balance
 * @param {string} userID ID of the user
 * @param {import('../../types').EcoOptions} ops ID of the guild where user is
 * @returns {number} Balance of the user (defaults to 0 if there its null)
 */
module.exports = (userID, ops = {}) => {
    const key = ops.guild ? `balance_${ops.guild}_${userID}` : `balance_${userID}`;

    if (!has(key))
        set(key, 0);
    
    return get(key);
};