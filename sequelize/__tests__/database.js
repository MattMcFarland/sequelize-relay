/**
 * Module Dependencies
 */

import { expect } from 'chai';
import { describe, it, before } from 'mocha';
import { connect } from '../seed';


const getPeople = (db => db.Person.findAll);

const getArticles = (db => db.Article.findAll);


describe('Database', () => {
  let db;

  before((done) => {
    connect().then((_db) => {
      db = _db;
      done();
    });
  });

  it('connects to the database', (done) => {
    expect(db).to.not.be.an('undefined');
    done();
  });

  it('has Person Model', (done) => {
    expect(db.Person).to.not.be.an('undefined');
    done();
  });

  it('has Article Model', (done) => {
    expect(db.Article).to.not.be.an('undefined');
    done();
  });

  describe('Populates', () => {

    it('populates articles', done => {
      expect(getArticles(db)).to.not.be.an('undefined');
      done();
    });
    it('populates people', done => {
      expect(getPeople(db)).to.not.be.an('undefined');
      done();
    });

  });

  describe('Relationships', () => {

    it('articles have author', (done) => {
      db.Article.findAll().then(articles => {
        articles[0].getAuthor().then(author => {
          if (author) {
            done();
          }
        }).catch(done);
      }).catch(done);
    });

  });


});

