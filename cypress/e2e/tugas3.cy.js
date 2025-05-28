context('Add New Employee', function() {
    
    describe('Login as Admin', function(){

        beforeEach(()=>{

            //default condition
            cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
            cy.xpath("//input[contains(@name, 'username')]").should('be.empty');
            cy.xpath("//input[contains(@name, 'password')]").should('be.empty');
            cy.xpath("//button[@type='submit']").should('be.enabled');
        })


        it(`Can't Login`, function(){
            cy.fixture('adminLogin').then((admin) => {
                
                //invalid condition
                cy.xpath("//button[@type='submit']").click();
                cy.get('.oxd-text.oxd-text--span.oxd-input-field-error-message.oxd-input-group__message', { timeout: 10000 }).should('be.visible');

                //invalid account
                cy.xpath("//input[contains(@name, 'username')]").type(admin.invalidUsername);
                cy.xpath("//input[contains(@name, 'password')]").type(admin.invalidPassword);
                cy.xpath("//button[@type='submit']").click();
                cy.get('.oxd-text.oxd-text--p.oxd-alert-content-text', { timeout: 10000 }).should('be.visible');
                cy.xpath("//input[contains(@name, 'username')]").should('be.empty');
                cy.xpath("//input[contains(@name, 'password')]").should('be.empty');
            }
            )  
        })

        it(`Can Login and Add New Employee`, function(){
            cy.fixture('adminLogin').then((admin) => {
                
                //valid account
                cy.xpath("//input[contains(@name, 'username')]").type(admin.username);
                cy.xpath("//input[contains(@name, 'password')]").type(admin.password);
                cy.xpath("//button[@type='submit']").click();
                cy.url().should('include', 'index.php/dashboard/index')

                //add new employee
                cy.wait(10000)
                cy.get('.oxd-text.oxd-text--span.oxd-main-menu-item--name').contains('PIM').click()
                cy.xpath("//button[@type='button']").contains('Add').click();

            }
            )  

            cy.fixture('employeeData').then((data)=>{
                cy.get('.orangehrm-firstname').should('be.empty').type(data.firstName);
                cy.get('.orangehrm-lastname').should('be.empty').type(data.lastName);
                cy.get('.oxd-button.oxd-button--medium.oxd-button--secondary.orangehrm-left-space').contains('Save').click();
                // cy.xpath("//button[@type='button']").contains('Save').click();

            })

        })
    })
})