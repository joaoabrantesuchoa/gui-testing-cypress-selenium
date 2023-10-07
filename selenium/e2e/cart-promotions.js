const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe('cart promotions', () => {
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('firefox').build();
  });

  after(async () => {
    await driver.quit();
  });

  beforeEach(async () => {
    driver.manage().deleteAllCookies();
    await driver.get('http://localhost:9990/admin');
    // await driver.get('http://150.165.75.99:9990/admin');
    await driver.findElement(By.id('_username')).sendKeys('sylius');
    await driver.findElement(By.id('_password')).sendKeys('sylius');
    await driver.findElement(By.css('.primary')).click();
    // await driver.sleep(1000);
  });

  // Remove .only and implement others test cases!
  it.only('increase percentage of christmas promotion', async () => {
    // Click in attributes in side menu
    await driver.findElement(By.linkText('Cart promotions')).click();

    // Type in value input to search for specify cart promotion
    await driver.findElement(By.id('criteria_search_value')).sendKeys('christmas');

    // Click in filter blue button
    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();

    // Click in edit of the remain cart promotion
    const buttons = await driver.findElements(By.css('*[class^="ui labeled icon button "]'));
    await buttons[1].click();

    // Edit cart promotion percentage inside configuration
    const inputName = await driver.findElement(By.id('sylius_promotion_actions_0_configuration_percentage'));
    inputName.click();
    inputName.clear();
    inputName.sendKeys('10');

    // Click on Save changes button
    await driver.findElement(By.id('sylius_save_changes_button')).click();

    // Assert that cart promotion name has been updated
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Promotion has been successfully updated.'));
  });

  it('create new promotion', async () => {
    // Implement your test case 2 code here
  });

  it('create new promotion cupom based', async () => {
    // Implement your test case 3 code here
  });

  // Implement the remaining test cases in a similar manner

  it('filter cupom based promotions', async () => {
    // Implement your test case 4 code here
  });

  it('filter not cupom based promotions', async () => {
    // Implement your test case 5 code here
  });

  // Implement the remaining test cases in a similar manner

  
  it('order promotions by priority', async () => {
    // Implement your test case 6 code here
  });

  it('list cupoms from cupom based promotion', async () => {
    // Implement your test case 7 code here
  });

  it('create new cupom for cupom based promotion', async () => {
    // Implement your test case 8 code here
  });

  
  it('generate new cupom for cupom based for cupom based promotion', async () => {
    // Implement your test case 9 code here
  });

  it('should create a new promotion and delete it', async () => {
    // Implement your test case 10 code here
  });

});
