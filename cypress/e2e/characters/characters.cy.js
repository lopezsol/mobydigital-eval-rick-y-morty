import { navigateTo } from "../../support/helpers/navigateTo";
import {
  charactersResponse,
  charactersPage2Response,
} from "../../fixtures/characters";

describe("Characters Page", () => {
  beforeEach(() => {
    cy.intercept("GET", "https://rickandmortyapi.com/api/character?page=1", {
      statusCode: 200,
      body: charactersResponse,
    }).as("getCharacters");
  

    cy.login("user");
    navigateTo.characters();
  });

  describe("UI Components", () => {
    it("should display the breadcrumb component", () => {
      cy.get("app-breadcrumb").should("exist");
    });

    it("should display the character search component", () => {
      cy.get("character-search").should("exist");
    });

    it("should display the loader while loading", () => {
      cy.get("app-loader").should("exist");
    });
  });

  describe("Error Handling", () => {
    it("should display error message if characterResource has an error", () => {
      cy.intercept("GET", "https://rickandmortyapi.com/api/character?page=1", {
        statusCode: 500,
        body: {},
      }).as("getCharactersError");

      cy.reload(); // Forzamos de nuevo la carga
      cy.wait("@getCharactersError");

      cy.get("app-error").should("exist");
    });
  });

  describe("Character List & Pagination", () => {
    it("should display the characters list when characters are loaded", () => {
      cy.get("characters-list", { timeout: 10000 }).should("exist");
      cy.get("character-pagination").should("exist");
    });

    it("should update displayed characters on pagination click", () => {
      cy.intercept("GET", "https://rickandmortyapi.com/api/character?page=2", {
        statusCode: 200,
        body: charactersPage2Response,
      }).as("getCharactersPage2");

      cy.get("characters-list character-card")
        .first()
        .invoke("text")
        .then((firstCharacterBefore) => {
          cy.get("character-pagination button").eq(2).click();

          cy.wait("@getCharactersPage2");

          cy.get("characters-list character-card")
            .first()
            .invoke("text")
            .should((firstCharacterAfter) => {
              expect(firstCharacterAfter.trim()).to.not.eq(
                firstCharacterBefore.trim()
              );
            });
        });
    });
  });

  describe("Navigation", () => {
    it("should navigate to character detail when a character card is clicked", () => {
      cy.get("characters-list character-card").should(
        "have.length.at.least",
        1
      );

      cy.get("characters-list character-card").first().click();

      cy.url().should("match", /\/characters\/\d+$/);

      cy.contains("Character Info").should("be.visible");
    });
  });
});


//TODO: agregar test search cuando cambie a app-search
//TODO: cambiar el componente navegacion cuando se cambie a app-navigation