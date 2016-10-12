const Browser = require('zombie');
const fixtures = require('sequelize-fixtures');
const models = require('../../models'); 

Browser.localhost('example.com', 3000);

describe('login', function() {

  var browser, agent;

  beforeEach(function(done) {
    browser = new Browser();
    models.sequelize.sync({ force: true }).then(function(obj) {
      fixtures.loadFile('fixtures/agents.json', models).then(function() {
        models.Agent.findOne().then(function(results) {
          agent = results;
          browser.visit('/', function() {
            browser.assert.success();
            done();
          });
        });
      });
    }).catch(function(error) {
      done.fail(error);
    });

  });

  it('shows the home page', function() {
    browser.assert.text('h1', 'Accountant');
  });

  it('displays the login form if not logged in', function() {
    browser.assert.attribute('form', 'action', '/login')
  });

  it('does not display the logout button if not logged in', function() {
    expect(browser.query("a[href='/logout']")).toBeNull();
  });


  describe('login process', function() {
    beforeEach(function(done) {
      browser
        .fill('email', agent.email)
        .fill('password', 'secret')
        .pressButton('Login', function(err) {
          browser.assert.success();
          done();
        });
    });

    it('does not display the login form', function() {
      expect(browser.query("form[action='/login']")).toBeNull();
    });

    describe('logout', function() {
      it('does not display the logout button if not logged in', function(done) {
        browser
          .clickLink('Logout', function(err) {
            browser.assert.success();
            expect(browser.query("a[href='/logout']")).toBeNull();
            browser.assert.attribute('form', 'action', '/login')
            done()
          });
      });
    });
  });
});
