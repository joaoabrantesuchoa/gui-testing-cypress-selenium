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

    await driver.findElement(By.linkText('Cart promotions')).click();

    const buttons = await driver.findElement(By.css('*[class^="ui labeled icon button primary"]'));
    await buttons[1].click();

    const inputCode = await driver.findElement(By.id('sylius_promotion_code'));
    inputCode.click();
    inputCode.sendKeys('new_promotion_code');

    const inputProm = await driver.findElement(By.id('sylius_protion_name'));
    inputProm.click();
    inputProm.sendKeys('New promotion name')

    const createPromotion = await driver.findElement(By.css('*[class^="ui labeled icon button primary button"]'));
    await createPromotion[1].click();

    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Promotion has been successfully created.'));

  });

  it('create new promotion cupom based', async () => {

    await driver.findElement(By.linkText('Cart promotions')).click();
    const buttons = await driver.findElement(By.css('*[class^="ui labeled icon button primary"]'));
    await buttons[1].click();

    const inputCode = await driver.findElement(By.id('sylius_promotion_code'));
    inputCode.click();
    inputCode.sendKeys('new_promotion_code');

    const inputProm = await driver.findElement(By.id('sylius_protion_name'));
    inputProm.click();
    inputProm.sendKeys('New promotion name')
   
    const couponBased = await driver.findElement(By.id('sylius_promotion_couponBased'));
    couponBased.click();

    const createPromotion = await driver.findElement(By.css('*[class^="ui labeled icon button primary button"]'));
    await createPromotion[1].click();

    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Promotion has been successfully created.'));
  });

  it('should throw an error if the code and name is not typed when create the promotion', async () => {
    await driver.findElement(By.linkText('Cart promotions')).click();
    const buttons = await driver.findElement(By.css('*[class^="ui labeled icon button primary"]'));
    await buttons[1].click();

    const inputCode = await driver.findElement(By.id('sylius_promotion_code'));
    inputCode.click();
    inputCode.sendKeys('new_promotion_code');

    const inputDesc = await driver.findElement(By.id('sylius_protion_description'));
    inputDesc.click();
    inputDesc.sendKeys('Promotion Description')

    const createPromotion = await driver.findElement(By.css('*[class^="ui labeled icon button primary button"]'));
    await createPromotion[1].click();

    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('This form contains errors.'));

  })

  it('filter cupom based promotions', async () => {
    await driver.findElement(By.linkText('Cart promotions')).click();

    await driver.findElement(By.id('criteria_search_type')).sendKeys('Contains');

    await driver.findElement(By.id('criteria_couponBased')).select('true')

    const filter = await driver.findElement(By.css('*[class^="ui blue labeled icon button"]'));
    filter.click();

    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Christmas'));

  });

  it('filter not cupom based promotions', async () => {
    await driver.findElement(By.linkText('Cart promotions')).click();

    await driver.findElement(By.id('criteria_search_type')).sendKeys('Contains');

    await driver.findElement(By.id('criteria_couponBased')).select('false')

    const filter = await driver.findElement(By.css('*[class^="ui blue labeled icon button"]'));
    filter.click();

    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('New Year'));
  });

  it('order promotions by priority', async () => {
    await driver.findElement(By.linkText('Cart promotions')).click();

    await driver.findElement(By.id('criteria_search_type')).sendKeys('Contains');

    await driver.findElement(By.id('criteria_couponBased')).sendKeys('All')

    const filter = await driver.findElement(By.css('*[class^="ui blue labeled icon button"]'));
    filter.click();

    const priority = await driver.findElement(By.css('*[class^="sortable sorted ascending sylius-table-column-priority"]'));
    priority.click();

    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes(''));

  });

  it('list cupoms from cupom based promotion and edit it', async () => {
    await driver.findElement(By.linkText('Cart promotions')).click();

    const manageCoupons = await driver.findElement(By.css('*[class^="ui labeled icon floating dropdown link button"]'));
    manageCoupons.click();

    await driver.findElement(By.id('menu transition visible')).sendKeys('List coupons');

    const edit = await driver.findElement(By.css('*[class^="a ui labeled icon button"]'));
    edit[1].click();
    
    await driver.findElement(By.id('#sylius_promotion_coupon_usageLimit')).clear();

    await driver.findElement(By.id('#sylius_promotion_coupon_usageLimit')).sendKeys('20');

    const createPromotion = await driver.findElement(By.css('*[class^="ui labeled icon button primary button"]'));
    await createPromotion[1].click();

    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Promotion coupon has been successfully updated.'));

  });

  it('create new cupom for cupom based promotion', async () => {
    await driver.findElement(By.linkText('Cart promotions')).click();

    const manageCoupons = await driver.findElement(By.css('*[class^="ui labeled icon floating dropdown link button"]'));
    manageCoupons.click();

    await driver.findElement(By.id('menu transition visible')).sendKeys('create');

    const inputCoupon = await driver.findElement(By.id('sylius_promotion_coupon_code'));
    inputCode.click();
    inputCode.sendKeys('new_cupom');

    const createPromotion = await driver.findElement(By.css('*[class^="ui labeled icon button primary button"]'));
    await createPromotion[1].click();

    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Promotion coupon has been successfully created.'));

    const deletePromotion = await driver.findElement(By.css('*[class^="ui red labeled icon button"]'));
    await deletePromotion[1].click();
    const confirmDelete = await driver.findElement(By.css('*[class^="ui green ok inverted button"]')); 
    await confirmDelete[1].click();

    const bodyTxt = await driver.findElement(By.tagName('body')).getText();
    assert(bodyTxt.includes('Promotion has been successfully deleted.'));
  });

  it('generate new cupom for cupom based for cupom based promotion', async () => {

  });

})
