const db = require('../src/index');

db.add('517016133694521374', 100000000);

console.log('517016133694521374 now has', db.balance('517016133694521374'));

db.transfer('517016133694521374', '221221226561929217', 100000000);

console.log('517016133694521374 now has', db.balance('517016133694521374'));

    
db.daily('517016133694521374', 5000);
db.weekly('517016133694521374', 10000);
db.monthly('517016133694521374', 1000000);

const daily = db.cooldown('517016133694521374', 'daily');
const weekly = db.cooldown('517016133694521374', 'weekly');
const monthly = db.cooldown('517016133694521374', 'monthly');

console.log('daily', daily);
console.log('weekly', weekly);
console.log('monthly', monthly);

console.log(db.leaderboard());