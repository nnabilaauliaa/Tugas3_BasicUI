context('Add New Employee', function() {
    
    describe('Login as Admin', function(){

        it('Can Login', function(){
            cy.fixture('adminLogin').then((admin) => {
                
                //default condition
                cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
                cy.xpath("//input[contains(@name, 'username')]").should('be.empty');
                cy.xpath("//input[contains(@name, 'password')]").should('be.empty');
                cy.xpath("//button[@type='submit']").should('be.enabled');
                
                cy.xpath("//input[contains(@name, 'username')]").type(admin.username);
            }
            )  
        })
    })
})