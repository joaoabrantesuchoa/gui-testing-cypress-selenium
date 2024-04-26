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
  it('increase percentage of christmas promotion', async () => {
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

    const button = await driver.findElement(By.css('a.ui.labeled.icon.button.primary'));
    await button.click();

    const inputPromotionCode = await driver.findElement(By.id('sylius_promotion_code'));
    inputPromotionCode.click();
    inputPromotionCode.sendKeys('new_promotion_code');

    const inputPromotionName = await driver.findElement(By.id('sylius_promotion_name'));
    inputPromotionName.click();
    inputPromotionName.sendKeys('New promotion name');

    const createPromotionButton = await driver.findElement(By.xpath("//button[text()='Create']"));
    await createPromotionButton.click();

    const bodyText = await driver.findElement(By.css('body')).getText();
    assert(bodyText.includes('Promotion has been successfully created.'));

    await driver.findElement(By.linkText('Cart promotions')).click();

    //Métodos para deletar o teste recém criado.
    const tdElements = await driver.findElements(By.css('td.center.aligned input[type="checkbox"]'));
    const lastCheckbox = tdElements[tdElements.length - 1];
    await lastCheckbox.click();

    const deleteButton = await driver.findElement(By.css('button.ui.red.labeled.icon.button'));
    await deleteButton.click();

    const confirmationButton = await driver.findElement(By.id('confirmation-button'));
    await confirmationButton.click();
  });

  it('create new promotion cupom based', async () => {
    await driver.findElement(By.linkText('Cart promotions')).click();

    const button = await driver.findElement(By.css('a.ui.labeled.icon.button.primary'));
    await button.click();

    const inputPromotionCode = await driver.findElement(By.id('sylius_promotion_code'));
    inputPromotionCode.click();
    inputPromotionCode.sendKeys('new_promotion_code');

    const inputPromotionName = await driver.findElement(By.id('sylius_promotion_name'));
    inputPromotionName.click();
    inputPromotionName.sendKeys('New promotion name');

    const label = await driver.findElement(By.xpath('//label[text()="Coupon based"]'));

    await driver.executeScript('arguments[0].click()', label);

    const createPromotionButton = await driver.findElement(By.xpath("//button[text()='Create']"));
    await createPromotionButton.click();

    const bodyText = await driver.findElement(By.css('body')).getText();
    assert(bodyText.includes('Promotion has been successfully created.'));

    await driver.findElement(By.linkText('Cart promotions')).click();

    //Métodos para deletar o teste recém criado.
    const tdElements = await driver.findElements(By.css('td.center.aligned input[type="checkbox"]'));
    const lastCheckbox = tdElements[tdElements.length - 1];
    await lastCheckbox.click();

    const deleteButton = await driver.findElement(By.css('button.ui.red.labeled.icon.button'));
    await deleteButton.click();

    const confirmationButton = await driver.findElement(By.id('confirmation-button'));
    await confirmationButton.click();
  });

  it('should throw an error if the code and name is not typed when create the promotion', async () => {
    await driver.findElement(By.linkText('Cart promotions')).click();

    const button = await driver.findElement(By.css('a.ui.labeled.icon.button.primary'));
    await button.click();

    const createPromotionButton = await driver.findElement(By.xpath("//button[text()='Create']"));
    await createPromotionButton.click();

    const bodyText = await driver.findElement(By.css('body')).getText();
    assert(bodyText.includes('This form contains errors.'));
  });

  it('filter cupom based promotions', async () => {
    await driver.findElement(By.linkText('Cart promotions')).click();

    const selectElement = await driver.findElement(By.id('criteria_couponBased'));
    await selectElement.findElement(By.css('option[value="true"]')).click();

    const filterButton = await driver.findElement(By.xpath('//button[contains(., "Filter")]'));
    await filterButton.click();

    const bodyText = await driver.findElement(By.css('body')).getText();
    assert(bodyText.includes('Christmas'));
    assert(!bodyText.includes('New Year'));
  });

  it('filter not cupom based promotions', async () => {
    await driver.findElement(By.linkText('Cart promotions')).click();

    const selectElement = await driver.findElement(By.id('criteria_couponBased'));
    await selectElement.findElement(By.css('option[value="false"]')).click();

    const filterButton = await driver.findElement(By.xpath('//button[contains(., "Filter")]'));
    await filterButton.click();

    const bodyText = await driver.findElement(By.css('body')).getText();
    assert(bodyText.includes('New Year'));
    assert(!bodyText.includes('Christmas'));
  });

  it('order promotions by priority', async () => {
    await driver.findElement(By.linkText('Cart promotions')).click();

    const clearFiltersButton = await driver.findElement(By.xpath('//a[contains(., "Clear filters")]'));
    await clearFiltersButton.click();

    const priorityColumnButton = await driver.findElement(By.xpath('//th[contains(., "Priority")]/a'));
    await priorityColumnButton.click();

    const elements = await driver.findElements(By.xpath('//tbody/tr/td[2]/div/span[@class="ui circular label"]'));

    const values = await Promise.all(
      elements.map(async (element) => {
        return await element.getText();
      })
    );

    const index0 = values.indexOf('0');
    const index2 = values.indexOf('2');

    assert(index0 < index2);
  });

  it('list cupoms from cupom based promotion and edit it', async () => {
    await driver.findElement(By.linkText('Cart promotions')).click();

    const dropdown = await driver.findElement(By.css('.ui.labeled.icon.floating.dropdown.link.button'));
    await dropdown.click();

    const listIcon = await driver.findElement(By.xpath('//a[@href="/admin/promotions/1/coupons/"]//i[@class="list icon"]'));
    await listIcon.click();

    const editLink = await driver.findElement(By.css('a[href="/admin/promotions/1/coupons/1/edit"]'));
    await editLink.click();

    const inputElement = await driver.findElement(By.id('sylius_promotion_coupon_perCustomerUsageLimit'));
    await inputElement.clear();
    await inputElement.sendKeys('10');

    const saveButton = await driver.findElement(By.id('sylius_save_changes_button'));
    await saveButton.click();

    const bodyText = await driver.findElement(By.css('body')).getText();
    assert(bodyText.includes('Promotion coupon has been successfully updated.'));
  });

  it('create new cupom for cupom based promotion', async () => {
    await driver.findElement(By.linkText('Cart promotions')).click();

    const dropdown = await driver.findElement(By.css('.ui.labeled.icon.floating.dropdown.link.button'));
    await dropdown.click();

    const createCouponLink = await driver.findElement(By.css('a[href="/admin/promotions/1/coupons/new"]'));
    await createCouponLink.click();

    const inputField = await driver.findElement(By.id('sylius_promotion_coupon_code'));
    await inputField.clear();
    await inputField.sendKeys('new_cupom');

    const createButton = await driver.findElement(By.css('button.ui.labeled.icon.primary.button'));
    await createButton.click();

    const bodyText = await driver.findElement(By.css('body')).getText();
    assert(bodyText.includes('Promotion coupon has been successfully created.'));
  });

  it('generate new cupom for cupom based for cupom based promotion', async () => {
    await driver.findElement(By.linkText('Cart promotions')).click();

    const dropdown = await driver.findElement(By.css('.ui.labeled.icon.floating.dropdown.link.button'));
    await dropdown.click();

    const createLink = await driver.findElement(By.linkText('Generate'));
    await createLink.click();

    const inputField = await driver.findElement(By.id('sylius_promotion_coupon_generator_instruction_codeLength'));
    await inputField.clear();
    await inputField.sendKeys('30');

    const amountInputField = await driver.findElement(By.id('sylius_promotion_coupon_generator_instruction_amount'));
    await amountInputField.clear();
    await amountInputField.sendKeys('42');

    const generateButton = await driver.findElement(By.css('button.ui.labeled.icon.primary.button'));
    await generateButton.click();

    const bodyText = await driver.findElement(By.css('body')).getText();
    assert(bodyText.includes('Promotion coupons have been successfully generated.'));
  });
});
