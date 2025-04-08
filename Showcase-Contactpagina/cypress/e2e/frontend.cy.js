describe('Profile Page Frontend UI Tests', () => {
    beforeEach(() => {
        cy.visit('https://localhost:7150/'); // Adjust this if your route is different
    });

    it('Should display the profile picture', () => {
        cy.get('img.person-logo')
            .should('be.visible')
            .and('have.attr', 'src')
            .and('include', 'images/doggo.png');
    });

    it('Should show the person\'s name and contact info', () => {
        cy.contains('h1.person-name', 'Swen de Jong').should('be.visible');
        cy.contains('h4.profile-content__title', 'swendejong@icloud.com').should('be.visible');
        cy.contains('h4.profile-content__title', '+31 6 27302201').should('be.visible');
    });

    it('Should display the Vaardigheden section with skills', () => {
        cy.contains('h3', 'Vaardigheden').should('be.visible');
        cy.contains('Coderen 4/5').should('exist');
        cy.contains('Probleem oplossing 4/5').should('exist');
        cy.contains('Engels 5/5').should('exist');
    });

    it('Should show the Profiel section with a description', () => {
        cy.contains('h3', 'Profiel').should('be.visible');
        cy.get('.profile-content__description')
            .should('be.visible')
            .and('contain', 'Software Engineering');
    });

    it('Should list education and work experience', () => {
        cy.contains('h3', 'Opleidingen').should('be.visible');
        cy.contains('HBO-ICT').should('exist');
        cy.contains('Windesheim').should('exist');

        cy.contains('h3', 'Werkervaring').should('be.visible');
        cy.contains('Webdeveloper').should('exist');
        cy.contains('Web1').should('exist');
    });
});

describe('Wordle GameScreen Frontend UI Tests', () => {
    beforeEach(() => {
        cy.visit('https://localhost:7150/Wordle/GameScreen'); // Pas dit aan als je route anders is
    });

    it('Should display the Wordle title', () => {
        cy.get('h1.title').should('contain.text', 'Wordle');
    });

    it('Should render the custom web component greeting', () => {
        cy.get('simple-greeting')
            .shadow()
            .should('not.exist'); // Web components don't have shadow DOM in this case
        cy.get('simple-greeting').should('contain.text', 'Hello, Player! 👋');
    });

    it('Should have a game board container', () => {
        cy.get('#board').should('exist').and('be.visible');
    });

    it('Should have a keyboard container', () => {
        cy.get('#keyboard-container').should('exist').and('be.visible');
    });

    it('Should not display opponent tracker initially', () => {
        cy.get('#opponent-tracker-wrapper').should('have.css', 'display', 'none');
    });
});
