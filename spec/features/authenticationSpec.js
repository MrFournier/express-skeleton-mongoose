const Browser = require('zombie');
const fixtures = require('sequelize-fixtures');
const models = require('../../models'); 

// Start test server
//
// Watch out for this. I may need to shutdown this server
// once more test files are written.
const app = require('../../app');
const http = require('http').createServer(app).listen(3000);

Browser.localhost('example.com', 3000);

describe('authentication', function() {

  var browser, agent;

  beforeEach(function(done) {
    browser = new Browser();
    models.sequelize.sync({ force: true }).then(function(obj) {
      fixtures.loadFile('fixtures/agents.json', models).then(function() {
        models.Agent.findOne().then(function(results) {
          agent = results;
          // browser.debug();
          browser.visit('/', function(err) {
            if (err) console.log(err);
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
    browser.assert.text('h1', 'Express Skeleton');
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
