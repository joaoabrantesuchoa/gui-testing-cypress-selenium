describe('cart promotions', () => {
  beforeEach(() => {
    cy.visit('/admin');
    cy.get('[id="_username"]').type('sylius');
    cy.get('[id="_password"]').type('sylius');
    cy.get('.primary').click();
  });

  // Remove .only and implement others test cases!
  it('increase percentage of christmas promotion', () => {
    // Click in cart promotions in side menu
    cy.clickInFirst('a[href="/admin/promotions/"]');
    // Type in value input to search for specify cart promotion
    cy.get('[id="criteria_search_value"]').type('christmas');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the remain cart promotion
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // Edit cart promotion percentage inside configuration
    cy.get('[id="sylius_promotion_actions_0_configuration_percentage"]').scrollIntoView().clear().type('10');
    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert that cart promotion name has been updated
    cy.get('body').should('contain', 'Promotion has been successfully updated.');
  });

  it('create new promotion', () => {
    cy.clickInFirst('a[href="/admin/promotions/"]');

    //Create new promotion and type the code and name.
    cy.get('a.ui.labeled.icon.button.primary').click();

    cy.get('[name="sylius_promotion[code]"]').type('new_promotion_code');

    cy.get('[name="sylius_promotion[name]"]').type('New promotion name');

    cy.get('button.ui.labeled.icon.primary.button').click();

    //Return to promotion page
    cy.clickInFirst('a[href="/admin/promotions/"]');

    cy.get('body').should('contain', 'new_promotion_code');
    cy.get('body').should('contain', 'New promotion name');

    //Remove recent created promotion
    cy.get('input.bulk-select-checkbox').last().check();

    cy.get('button.ui.red.labeled.icon.button').first().click();

    cy.get('div.ui.green.ok.inverted.button#confirmation-button').click();
  });

  it('create new promotion cupom based', () => {
    cy.clickInFirst('a[href="/admin/promotions/"]');

    //Create new promotion and type the code and name.
    cy.get('a.ui.labeled.icon.button.primary').click();

    cy.get('[name="sylius_promotion[code]"]').type('new_promotion_code');

    cy.get('[name="sylius_promotion[name]"]').type('New promotion name');

    //CUPOM based checkbox
    cy.get('label[for="sylius_promotion_couponBased"]').click();

    cy.get('button.ui.labeled.icon.primary.button').click();

    //Return to promotion page
    cy.clickInFirst('a[href="/admin/promotions/"]');

    cy.get('body').find('span.ui.basic.label').filter(':contains("Yes")').filter(':has(i.checkmark.icon)').should('have.length', 2);
    cy.get('span.ui.basic.label').contains('Yes').first().click();

    //Remove recent created promotion
    cy.get('input.bulk-select-checkbox').last().check();

    cy.get('button.ui.red.labeled.icon.button').first().click();

    cy.get('div.ui.green.ok.inverted.button#confirmation-button').click();
  });

  it('should throw an error if the code and name is not typed when create the promotion', () => {
    cy.clickInFirst('a[href="/admin/promotions/"]');

    cy.get('a.ui.labeled.icon.button.primary').click();

    cy.get('[name="sylius_promotion[code]"]').type('new_promotion_code');

    cy.get('#sylius_promotion_description').type('Promotion Description');

    cy.get('button.ui.labeled.icon.primary.button').click();

    cy.get('body').should('contain', 'This form contains errors.');
  });

  it('filter cupom based promotions', () => {
    cy.clickInFirst('a[href="/admin/promotions/"]');

    cy.get('a.ui.labeled.icon.button').contains('Clear filters').click();

    cy.get('#criteria_couponBased').select('true');

    cy.get('*[class^="ui blue labeled icon button"]').click();

    cy.get('body').should('contain', 'Christmas');
    cy.get('body').should('not.contain', 'New Year');
  });

  it('filter not cupom based promotions', () => {
    cy.clickInFirst('a[href="/admin/promotions/"]');

    cy.get('a.ui.labeled.icon.button').contains('Clear filters').click();

    cy.get('#criteria_couponBased').select('false');

    cy.get('*[class^="ui blue labeled icon button"]').click();

    cy.get('body').should('contain', 'New Year');
    cy.get('body').should('not.contain', 'Christmas');
  });

  it('order promotions by priority', () => {
    cy.clickInFirst('a[href="/admin/promotions/"]');

    //Create new promotion and type the code and name.
    cy.get('a.ui.labeled.icon.button.primary').click();

    cy.get('[name="sylius_promotion[code]"]').type('new_promotion_code');

    cy.get('[name="sylius_promotion[name]"]').type('New promotion name');

    cy.get('#sylius_promotion_priority').clear();

    cy.get('#sylius_promotion_priority').type('5');

    cy.get('button.ui.labeled.icon.primary.button').click();

    //Return to promotion page
    cy.clickInFirst('a[href="/admin/promotions/"]');

    cy.contains('a', 'Priority').click();

    cy.get('tr.item')
      .should('have.length', 3)
      .then(($elements) => {
        const $firstElement = $elements[0];
        const $secondElement = $elements[1];
        const $thirdElement = $elements[2];

        expect($firstElement.querySelector('td:nth-child(2)').textContent.trim()).to.equal('0');
        expect($secondElement.querySelector('td:nth-child(2)').textContent.trim()).to.equal('2');
        expect($thirdElement.querySelector('td:nth-child(2)').textContent.trim()).to.equal('5');

        expect(parseInt($firstElement.querySelector('td:nth-child(2)').textContent)).to.be.lessThan(parseInt($secondElement.querySelector('td:nth-child(2)').textContent));
        expect(parseInt($secondElement.querySelector('td:nth-child(2)').textContent)).to.be.lessThan(parseInt($thirdElement.querySelector('td:nth-child(2)').textContent));
      });

    //Remove recent created promotion
    cy.get('input.bulk-select-checkbox').last().check();

    cy.get('button.ui.red.labeled.icon.button').first().click();

    cy.get('div.ui.green.ok.inverted.button#confirmation-button').click();
  });

  it('list cupoms from cupom based promotion and edit it', () => {
    cy.clickInFirst('a[href="/admin/promotions/"]');
    // Clique em "Manage coupons" para abrir o submenu
    cy.contains('.ui.labeled.icon.floating.dropdown.link.button', 'Manage coupons').click();
    // Clique em "List coupons" no submenu
    cy.get('.menu.transition.visible').contains('List coupons').click();

    cy.contains('a.ui.labeled.icon.button', 'Edit').click();

    cy.get('#sylius_promotion_coupon_usageLimit').clear();

    cy.get('#sylius_promotion_coupon_usageLimit').type('20');

    cy.contains('button.ui.labeled.icon.primary.button', 'Save changes').click();

    cy.get('body').should('contain', 'Promotion coupon has been successfully updated.');

    cy.contains('a.ui.labeled.icon.button', 'Edit').click();

    cy.get('#sylius_promotion_coupon_usageLimit').clear();

    cy.get('#sylius_promotion_coupon_usageLimit').type('10');

    cy.contains('button.ui.labeled.icon.primary.button', 'Save changes').click();
  });

  it('create new cupom for cupom based promotion', () => {
    cy.clickInFirst('a[href="/admin/promotions/"]');
    // Clique em "Manage coupons" para abrir o submenu
    cy.contains('.ui.labeled.icon.floating.dropdown.link.button', 'Manage coupons').click();
    // Clique em "List coupons" no submenu
    cy.get('.menu.transition.visible').contains('Create').click();

    cy.get('#sylius_promotion_coupon_code').type('new_cupom');

    cy.get('button.ui.labeled.icon.primary.button').contains('Create').click();

    cy.get('body').should('contain', 'Promotion coupon has been successfully created.');

    cy.get('tr.item').eq(1).find('button.ui.red.labeled.icon.button').contains('Delete').click();
    cy.get('div.ui.green.ok.inverted.button').contains('Yes').click();
  });

  it('generate new cupom for cupom based for cupom based promotion', () => {
    cy.clickInFirst('a[href="/admin/promotions/"]');
    // Clique em "Manage coupons" para abrir o submenu
    cy.contains('.ui.labeled.icon.floating.dropdown.link.button', 'Manage coupons').click();
    // Clique em "List coupons" no submenu
    cy.get('.menu.transition.visible').contains('Generate').click();

    cy.get('#sylius_promotion_coupon_generator_instruction_codeLength').type('10');

    cy.get('#sylius_promotion_coupon_generator_instruction_amount').type('20');

    cy.get('button.ui.labeled.icon.primary.button').contains('Generate').click();

    cy.get('body').should('contain', 'Promotion coupons have been successfully generated.');
  });
});
