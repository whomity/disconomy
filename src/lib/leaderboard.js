const { all } = require('quick.db');

/**
 * Creates a leaderboard, sorted by users balance
 * @param {number?} limit Maximum amount of users in the leaderboard
 * @param {boolean?} reverse Whether to reverse the array from least to greatest
 * @param {import('../../types').EcoOptions} ops Guild id where to fetch the leaderboard
 * @returns {Array<object>} Sorted array with a object containing user id and balance respectively
 */
module.exports = (limit = 10, reverse = false, ops = {}) => {
    const data =
        ops.guild ? all().filter(c => c.ID.split('_')[1] === ops.guild) :
            all();

    data.length = limit;
    data.sort((a, b) => reverse ? a.data - b.data : b.data - a.data);

    const resp = [];
    data.forEach(k => {
        if (!k) return;
        resp.push({
            id: k.ID.split('_')[ops.guild ? 2 : 1],
            value: JSON.parse(k.data)
        });
    });

    return resp;
}