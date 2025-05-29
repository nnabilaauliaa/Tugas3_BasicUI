context('Add New Employee', function() {
    
    describe('Login as Admin', function(){

        beforeEach(()=>{

            //default condition
            cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
            cy.xpath("//input[contains(@name, 'username')]").should('be.empty');
            cy.xpath("//input[contains(@name, 'password')]").should('be.empty');
            cy.xpath("//button[@type='submit']").should('be.enabled');
        })

        function logout () {
            cy.get('.oxd-userdropdown-tab').click()
            cy.contains('Logout').click()
        }

        it(`Can't Login`, function(){
            cy.fixture('adminLogin').then((admin) => {
                
                //invalid condition
                cy.xpath("//button[@type='submit']").click();
                cy.get('.oxd-text.oxd-text--span.oxd-input-field-error-message.oxd-input-group__message', { timeout: 5000 }).contains('Required').should('be.visible');

                //invalid account
                cy.xpath("//input[contains(@name, 'username')]").type(admin.invalidUsername);
                cy.xpath("//input[contains(@name, 'password')]").type(admin.invalidPassword);
                cy.xpath("//button[@type='submit']").click();
                cy.get('.oxd-text.oxd-text--p.oxd-alert-content-text', { timeout: 5000 }).should('be.visible');
            }
            )  
        })

        it(`Adding New Employee`, function(){
            cy.fixture('adminLogin').then((admin) => {
                
                //valid account
                cy.xpath("//input[contains(@name, 'username')]").type(admin.username);
                cy.xpath("//input[contains(@name, 'password')]").type(admin.password);
                cy.xpath("//button[@type='submit']").click();
                cy.url().should('include', 'index.php/dashboard/index')

            }
            )  

            // invalid condition
            cy.wait(5000)
            cy.get('.oxd-text.oxd-text--span.oxd-main-menu-item--name').contains('PIM').click()
            cy.xpath("//button[@type='button']").contains('Add').click();
            cy.get('.oxd-button.oxd-button--medium.oxd-button--secondary.orangehrm-left-space').contains('Save').click();
            cy.get('.oxd-text.oxd-text--span.oxd-input-field-error-message.oxd-input-group__message', { timeout: 5000 }).contains('Required').should('be.visible');

            // input data
            cy.fixture('employeeData').then((data)=>{
                cy.get('.orangehrm-firstname').should('be.empty').type(data.firstName);
                cy.get('.orangehrm-lastname').should('be.empty').type(data.lastName);
                cy.get('.oxd-button.oxd-button--medium.oxd-button--secondary.orangehrm-left-space').contains('Save').click();
                cy.contains('Personal Details', { timeout: 5000 }).should('be.visible');
                cy.contains(data.firstName).should('be.visible');
                cy.contains(data.lastName).should('be.visible');

                // create account for new employee
                cy.wait(5000)
                cy.get('.oxd-text.oxd-text--span.oxd-main-menu-item--name').contains('Admin').click()
                cy.xpath("//button[@type='button']").contains('Add').click();
                cy.get('.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow').eq(0).click()
                cy.get('.oxd-select-dropdown > :nth-child(3)').click()
                cy.get('.oxd-autocomplete-text-input.oxd-autocomplete-text-input--active').type(data.firstName + data.lastName)
                cy.wait(5000)
                cy.contains('No Records Found')
                cy.get('.oxd-autocomplete-text-input > input').clear()
                cy.get('.oxd-autocomplete-text-input > input').type(data.firstName + " "+data.lastName)
                cy.wait(5000)
                cy.contains(data.firstName + " "+data.lastName).click()

                cy.get('.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow').eq(1).click()
                cy.get('.oxd-select-dropdown > :nth-child(2)').click()
                
                cy.get('.oxd-input.oxd-input--active').eq(1).type(data.username).wait(5000);
                cy.xpath("//input[@type='password']").eq(0).type(data.password);
                cy.xpath("//input[@type='password']").eq(1).type(data.username);
                cy.get('.oxd-text.oxd-text--span.oxd-input-field-error-message.oxd-input-group__message').should('be.visible');
                cy.xpath("//input[@type='password']").eq(1).clear().type(data.password);
                cy.xpath("//button[@type='submit']").click();
                cy.wait(10000)

                logout();
            })
        })

        it('Add On Leave', function (){

            cy.fixture('adminLogin').then((admin) => {
                
                //valid account
                cy.xpath("//input[contains(@name, 'username')]").type(admin.username);
                cy.xpath("//input[contains(@name, 'password')]").type(admin.password);
                cy.xpath("//button[@type='submit']").click();
                cy.url().should('include', 'index.php/dashboard/index')

            }
            )

            cy.get('.oxd-text.oxd-text--span.oxd-main-menu-item--name').contains('Leave').click()
            cy.get('.oxd-topbar-body-nav-tab.--parent').contains('Entitlements').click()
            cy.contains('Add Entitlements').click()
            cy.url().should('include', 'addLeaveEntitlement')

            cy.fixture('employeeData').then((data) => {

                cy.get('input[placeholder="Type for hints..."]').type(data.lastName)
                cy.wait(1000)

                cy.get('.oxd-autocomplete-option') 
                .contains(data.firstName)
                .click()

                cy.get('.oxd-select-text.oxd-select-text--active').eq(0).click()
                cy.wait(1000)
                cy.get('.oxd-select-dropdown') 
                    .contains("CAN - Matternity")
                    .click()

                cy.get('.oxd-input.oxd-input--active').eq(1).type(data.invalidReason)
                cy.xpath("//span[@class='oxd-text oxd-text--span oxd-input-field-error-message oxd-input-group__message']").should('be.visible')
                cy.get(':nth-child(2) > .oxd-input').clear().type(data.validReason);

                cy.xpath("//button[@type='submit']").click();

                cy.get('.oxd-sheet').should('be.visible')
                cy.get('.orangehrm-modal-footer > .oxd-button--secondary', {timeout: 5000}).contains('Confirm').click();

                logout()

            })





        })
    })
})