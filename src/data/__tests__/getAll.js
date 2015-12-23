
import { expect } from 'chai';
import { describe, it, before } from 'mocha';
import { connect } from '../../../sequelize/index';


describe('getAll', () => {
  let db;


  before((done) => {
    connect().then((_db) => {
      db = _db;
      done();
    });
  });

  it('connects to the database', () => {
    expect(db).to.not.be.an('undefined');
  });





  it('retreives all people', (done) => {
    db.Person.findAll().then((ppl) => {
      done();
    });
  });




});
