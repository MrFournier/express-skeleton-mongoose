describe('Agent', function() {
  var Sequelize = require('sequelize');
  var db = require('../../models');
  var Agent = db.Agent;

  var agent;

  describe('basic validation', function() {
    beforeEach(function(done) {
      db.sequelize.sync({ force: true }).then(function(obj) {
        agent = Agent.build({ email: 'someguy@example.com', password: 'secret' });
        done();
      }).catch(function(error) {
        done.fail(error);
      });
    });
  
    it('sets the createdAt and updatedAt fields', function(done) {
      expect(agent.createdAt).toBe(undefined);
      expect(agent.updatedAt).toBe(undefined);
      agent.save().then(function(obj) {
        expect(agent.createdAt instanceof Date).toBe(true);
        expect(agent.updatedAt instanceof Date).toBe(true);
        done();
      }).catch(function(error) {
        done.fail(error);
      });
    });
  
    it("encrypts the agent's password", function(done) {
      expect(agent.password).toEqual('secret');
      agent.save().then(function(obj) {
        expect(agent.password).not.toEqual('secret');
        done();
      }).catch(function(error) {
        done.fail(error);
      });
    });

    it('does not allow two identical emails', function(done) {
      agent.save().then(function(obj) {
        Agent.create({ email: 'someguy@example.com', password: 'secret' }).then(function(obj) {
          done.fail('This should not have saved');
        }).catch(function(error) {
          expect(error.errors.length).toEqual(1);
          expect(error.errors[0].message).toEqual('That email is taken');
          done();
        });
      }).catch(function(error) {
        done.fail(error);
      });
    });

    it('does not allow an empty email field', function(done) {
      Agent.create({ email: ' ', password: 'secret' }).then(function(obj) {
        done.fail('This should not have saved');
      }).catch(function(error) {
        done();
      });
    });

    it('does not allow an undefined email field', function(done) {
      Agent.create({ password: 'secret' }).then(function(obj) {
        done.fail('This should not have saved');
      }).catch(function(error) {
        done();
      });
    });

    it('does not allow an empty password field', function(done) {
      Agent.create({ email: 'someguy@example.com', password: '   ' }).then(function(obj) {
        done.fail('This should not have saved');
      }).catch(function(error) {
        done();
      });
    });

    it('does not allow an undefined password field', function(done) {
      Agent.create({ email: 'someguy@example.com' }).then(function(obj) {
        done.fail('This should not have saved');
      }).catch(function(error) {
        done();
      });
    });

    it('does not re-hash a password on update', function(done) {
      agent.save().then(function(obj) {
        var passwordHash = agent.password;
        agent.email = 'newemail@example.com';
        agent.save().then(function(obj) {
          expect(agent.password).toEqual(passwordHash); 
          done();
        });
      });
    });
  });
});
