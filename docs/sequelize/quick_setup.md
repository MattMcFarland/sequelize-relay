# Sequelize - Quick setup
![Sequelize Logo](sequelize.png)

## Cloning the sequelize-relay models

You can have a similar setup that the documentation assumes by copying the files from the [repo here](https://github.com/MattMcFarland/sequelize-relay/tree/master/sequelize).

## Adding sequelize models

The easiest way to add sequelize models is to use the sequelize CLI tool.  More information is available [here](http://docs.sequelizejs.com/en/latest/docs/migrations/?highlight=CLI).

```sh
npm install -g sequelize-cli && sequelize init
```

You should see a `models` directory with an `index.js` file that will import all sibling files, as well as a config.json file in a subdirectory labelled `config` 

for a quick setup with sqlite3 you can do this:

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
