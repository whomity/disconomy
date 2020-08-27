module.exports = {
    // View/update balance
    set: require('./lib/set'),
    add: require('./lib/add'),
    subtract: require('./lib/subtract'),
    balance: require('./lib/balance'),
    transfer: require('./lib/transfer'),

    leaderboard: require('./lib/leaderboard'),
    
    // 'Paychecks' related
    daily: require('./lib/daily'),
    cooldown: require('./lib/cooldown'),
    weekly: require('./lib/weekly'),
    monthly: require('./lib/monthly')
}