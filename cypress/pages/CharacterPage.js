class CharacterPage {
  navigateToCharacters() {
    cy.visit("/characters");
  }

  navigateToCharacter(id) {
    cy.visit(`/characters/${id}`);
  }
}

export default CharacterPage;
