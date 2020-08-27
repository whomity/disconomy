const { add, subtract } = require('quick.db');
const balance = require('./balance');

/**
 * Transfers an amount of balance from one user to another
 * @param {string} id_from User to take amount from
 * @param {string} id_to User to receive amount
 * @param {number} amount Amount
 * @param {import('../../types').EcoOptions} ops ID of the guild where the users are
 * @returns {boolean} If the transfer was completed successfully
 */
module.exports = (id_from, id_to, amount, ops = {}) => {
    if (typeof id_from !== 'string') throw new Error(`User id "${id_from}" is not a string`);
    if (typeof id_to !== 'string') throw new Error(`User id "${to}" is not a string`);

    if (!/^[0-9]{16,19}$/.test(id_from)) throw new Error(`User id "${id_from}" does not match user-id regex`);
    if (!/^[0-9]{16,19}$/.test(id_to)) throw new Error(`User id "${id_to} does not match user-id regex`);
    
    if (isNaN(Number(amount)) || typeof amount !== 'number') throw new Error(`Amount "${amount}" is not a number`);

    if (balance(id_from, ops) < amount) throw new Error(`"${id_from}" does not have enough to transfer "${amount}"`);

    add(ops.guild ? `balance_${ops.guild}_${id_to}` : `balance_${id_to}`, amount);
    subtract(ops.guild ? `balance_${ops.guild}_${id_from}` : `balance_${id_from}`, amount);

    return true;
}