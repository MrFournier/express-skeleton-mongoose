const Browser = require('zombie');
const fixtures = require('sequelize-fixtures');
const models = require('../../models'); 

Browser.localhost('example.com', 3000);

describe('login', function() {

  const browser = new Browser();

  beforeEach(function(done) {
    models.sequelize.sync({ force: true }).then(function(obj) {
      fixtures.loadFile('fixtures/agents.json', models).then(function() {
        browser.visit('/', done);
      });
    }).catch(function(error) {
      done.fail(error);
    });

  });

  it('shows the home page', function() {
    browser.assert.success();
    browser.assert.text('h1', 'Accountant');
  });

  it('displays the login form if not logged in', function() {
    browser.assert.attribute('form', 'action', '/login')
  });

  it('does not display the login form if logged in', function() {
    expect(browser.query("form[action='/login']")).not.toBeDefined();
  });
});
