A simple utility wrapper for economy-related features using [quick.db](https://npmjs.com/quick.db].

## Getting Started
```
npm install whomity/discord.eco
```

## Example usage
```js
const db = require('discord.eco');

// Retrieve balance of user with id: 313114429451665409
console.log(db.balance('313114429451665409')); // 0

// Sets a users balance to the specified value
db.set('313114429451665409', 500); // 500

console.log(db.balance('313114429451665409')); // 500

// Transfer balance from x to y
db.transfer('313114429451665409', '221221226561929217', 500); // Returns a truthy value (whether the transfer was successful)

// Per-guild balances
db.balance('313114429451665409', { guild: '343572980351107077' }); // 0
db.add('313114429451665409', 1000000, { guild: '343572980351107077' }); // 1000000
```

## Contributing
If you'd like to contribute to `discord.eco`, please consider forking the repo and creating a pull request. 
