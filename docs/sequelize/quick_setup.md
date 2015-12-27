# Sequelize - Quick setup
![Sequelize Logo](sequelize.png)


## Overview

- We need to setup models, this can be done with CLI tools or boilerplate.
- We need to setup the database, for this doc we are using sqlite3
- We need to make sure the connection to the database is established before we try to do anything else.


## Model setup

We need to create some model so we have a table that we can use with sequelize.

### Setup models by cloning the repo

You can have a similar setup that the documentation assumes by copying the files from the [repo here](https://github.com/MattMcFarland/sequelize-relay/tree/master/sequelize).

### Create models of your own

The easiest way to add sequelize models is to use the sequelize CLI tool.  More information is available [here](http://docs.sequelizejs.com/en/latest/docs/migrations/?highlight=CLI).

```sh
npm install -g sequelize-cli && sequelize init
```

You should see a `models` directory with an `index.js` file that will import all sibling files, as well as a config.json file in a subdirectory labelled `config` 


## Database setup

Setup a database and configure it with the boilerplate config.json file

### sqlite3
```sh
npm install sqlite3 --save-dev
```

Open up your `models/config/config.json` and edit like this:
```javascript
{
  "development": {
    "dialect": "sqlite",
    "storage": "./db.development.sqlite",
    "logging": false
  },
  "test": {
    "dialect": "sqlite",
    "storage": "./db.test.sqlite",
    "logging": false
  }
}
```

## Connection setup

Last we want to make sure we are connected to the database before trying to do anything else.  This is done with the `sequelize`.`sync` method.


### express.js connection

With express.js you can wrap the http connection methods like so:

```javascript
var models = require("../data/models");
models.sequelize.sync().then( () => {
  server.listen(port);
});
```



### custom connection

You can also write your own, the important part is you want to make sure your connection is established before doing much of anything else.

The following is taken from sequelize-relay's test server:

```javascript
export const models = require('./models/index');
export const connect = () => {
  return new Promise((resolve, reject) => {
    try {
      models.sequelize.sync().then(() => {
          resolve(models);
      });
    } catch (error) {
      reject(error);
    }
  });
};
```
