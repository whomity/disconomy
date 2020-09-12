const { Disconomy } = require('disconomy');

const db = new Disconomy();
console.log(db.version);

if (db.daily('313114429451665409')) {
    console.log('daily');
}

if (db.weekly('313114429451665409')) {
    console.log('weekly');
}

if (db.monthly('313114429451665409')) {
    console.log('monthly');
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

["673994591191564370",
"636944537062998046",
"723650702513275002",
"234551629876035596",
"577820665839878164",
"283720917664923649",
"721209333022457878",
"337829180832088065",
"439809308285206528"].forEach(id => {
    db.set(id, getRandomInt(1, 200), { guild: 'plexi' });
})

const lb = db.buildLeaderboard(10, false, { guild: 'plexi' });
console.log('lb', lb);