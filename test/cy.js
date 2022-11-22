const cypress = require('cypress')

cypress.run({
  spec: './cypress/e2e/browser.cy.js',
  browser: 'chrome',
  headless: true,
  config: {
    screenshotOnRunFailure: false,
    video: false,
    retries: 0
  }
}).then((results) => {
  console.log(results)
})
