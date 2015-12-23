### Notes:

Seeder is used to generate db.development.sqlite, which is then manually
copied to db.fixture.sqlite for unit tests. if db changes unit tests have
to changes, so it makes more sense to just have a fixed db.

```
npm run seed
```


But db is subject to change, so keeping the seeding feature in for now.