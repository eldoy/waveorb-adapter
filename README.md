# Waveorb database adapter specification

This repository defines the Waveorb database adapter specification. It contains tests for writing adapters that are compatible with Waveorb generated actions. The idea is that you should be able to use the same code with different backends when writing your [Waveorb app.](https://waveorb.com)

The API is based on the MongoDB API but not necessarily 100% compatible.

At the moment these adapters exist:

* [RunDB](https://github.com/eldoy/rundb) - based on [NeDB](https://github.com/louischatriot/nedb)
* [MongoWave](https://github.com/eldoy/mongowave) - based on [MongoDB](https://mongodb.github.io/node-mongodb-native/)
* [WaveDB](https://github.com/eldoy/wavedb) - based on [LevelDB](https://github.com/Level/level)
* [ConfigDB](https://github.com/eldoy/configdb) - human readable YAML DB for development.

### API Interface

The adaptor should at least include these functions and properties:

* __connection__ - function that returns a usable connection to the database
* __create__ - creates a new document and returns its id, takes a values object as parameter.
* __update__ - updates a document, takes query and values objects as parameters, returns the number of updated documents (updates multiple)
* __delete__ - deletes a document, takes a query parameter and returns the number of deleted documents (deletes multiple)
* __find__ - finds documents, takes a query parameter, returns an array of matching documents
* __get__ - get a single document, takes a query parameter, returns an object with first matching document or null
* __count__ - same options as find, but returns the number of matching documents

The functions can be async functions or regular functions. The `connection` function is usually used as a plugin, the rest of the database functions are used in corresponding Waveorb actions.

### Usage
This example uses MongoWave as an example. If you want to write your own adaptor, clone this repository and use the tests, but change the content of the `index.js` file.

You can actually run the tests out of the box to get you started:
```sh
npm install
npm run tests
```

**Connect to database**
```js
const connection = require('mongowave')
const db = await connection()
```

**Create document**
```js
// Returns the created id: { id: '507f191e810c19729de860ea' }
// Takes only 1 argument: values
const result = await db('project').create({ name: 'hello' })
```

**Create multiple documents**
```js
// Returns the the created count and the created ids:
// { n: 2, ids: ['507f191e810c19729de860ea', '607f191e810c19729de860eb'] }
// Takes only 1 argument: values, must be array of objects
const result = await db('project').create([{ name: 'hello' }, { name: 'bye' }])
```

**Update document (updates multiple if query matches)**
```js
// Returns the number of updated documents: { n: 1 }
// Takes 2 arguments: query, values
const result = await db('project').update({ id: '507f191e810c19729de860ea' }, { name: 'bye' })
```

**Delete document (deletes multiple if query matches)**
```js
// Returns the number of deleted documents: { n: 1 }
// Takes 1 argument: query
const result = await db('project').delete({ id: '507f191e810c19729de860ea' })
```

**Find document**
```js
// Returns an array of matching documents
// Takes 2 arguments: query, options

// Find all
const result = await db('project').find()

// Find all with name 'bye'
const result = await db('project').find({ name: 'bye' })

// Find with sorting on 'name' field descending, use 1 for ascending
const result = await db('project').find({}, { sort: { name: -1 } })

// Find only 2
const result = await db('project').find({}, { limit: 2 })

// Find but skip 2
const result = await db('project').find({}, { skip: 2 })

// Find all but don't include the 'name' field in the result
const result = await db('project').find({}, { fields: { name: false } })

// Find all with 'level' field greater than 5
const result = await db('project').find({ level: { $gt: 5 }})
```
All of the [mongodb query operators](https://docs.mongodb.com/manual/reference/operator/query/) work.

**Get document**
```js
// Returns the first matching document
// Takes 2 arguments: query, options
const result = await db('project').get({ name: 'bye' })
```

**Count documents**
```js
// Returns the count of the matching query
// Takes 2 arguments: query, options
const result = await db('project').count({ name: 'bye' })
```

**The database client**
```js
db.client
```

MIT Licensed. Enjoy!
