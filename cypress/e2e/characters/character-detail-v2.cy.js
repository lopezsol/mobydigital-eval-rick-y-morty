import { navigateTo } from "../../support/helpers/navigateTo";
import { characters, characterUnknown } from "../../fixtures/characters";

describe("Character Detail Page", () => {
  beforeEach(() => {
    cy.login("user");
  });

  describe("Loader & Initial State", () => {
    it("should show loader while character is loading", () => {
      const character = characters[0];
      cy.intercept(
        "GET",
        `https://rickandmortyapi.com/api/character/${character.id}`,
        {
          statusCode: 200,
          body: character,
        }
      ).as("getCharacter");

      navigateTo.characterById(character.id);

      cy.get("app-loader").should("exist");
    });
  });

  describe("Character Info Display", () => {
    characters.forEach((character) => {
      beforeEach(() => {
        cy.intercept(
          "GET",
          `https://rickandmortyapi.com/api/character/${character.id}`,
          {
            statusCode: 200,
            body: character,
          }
        ).as(`getCharacter${character.id}`);

        navigateTo.characterById(character.id);
        cy.wait(`@getCharacter${character.id}`);
      });

      it(`should display full info for ${character.name}`, () => {
        cy.contains("h5", "Character Info").should("exist");
        cy.get("img")
          .should("have.attr", "src", character.image)
          .and("have.attr", "alt", `Imagen de ${character.name}`);

        cy.contains(`Name: ${character.name}`).should("exist");
        cy.contains("Status:").should("exist");
        cy.contains(`Species: ${character.species}`).should("exist");
        cy.contains("Gender:").should("exist");

        // Origin y Location
        cy.get("p.card-text")
          .contains("Origin:")
          .find("a")
          .should("have.attr", "href", character.origin.url)
          .and("contain", character.origin.name);

        cy.get("p.card-text")
          .contains("Location:")
          .find("a")
          .should("have.attr", "href", character.location.url)
          .and("contain", character.location.name);
      });

      it(`should display correct status and gender for ${character.name}`, () => {
        let expectedStatus = "";
        switch (character.status) {
          case "Alive":
            expectedStatus = "Vivo";
            break;
          case "Dead":
            expectedStatus = "Muerto";
            break;
          default:
            expectedStatus = "Desconocido";
        }
        cy.contains("p.card-text", `Status: ${expectedStatus}`).should("exist");

        let expectedGender = "";
        switch (character.gender) {
          case "Male":
            expectedGender = "Masculino";
            break;
          case "Female":
            expectedGender = "Femenino";
            break;
          case "Genderless":
            expectedGender = "Sin género";
            break;
          default:
            expectedGender = "Desconocido";
        }
        cy.contains("p.card-text", `Gender: ${expectedGender}`).should("exist");
      });
    });
  });

  describe("Episodes Section", () => {
    const character = characters[0];

    beforeEach(() => {
      cy.intercept(
        "GET",
        `https://rickandmortyapi.com/api/character/${character.id}`,
        {
          statusCode: 200,
          body: character,
        }
      ).as("getCharacter");
      navigateTo.characterById(character.id);
      cy.wait("@getCharacter");
    });

    it("should display episodes list and 'more' button if many episodes", () => {
      cy.get("character-episodes", { timeout: 20000 }).should("exist");
      cy.get("character-episodes .card-body", { timeout: 10000 }).should(
        "exist"
      );
      cy.get("character-episodes > .container").within(() => {
        cy.contains("List of Episodes appearances").should("exist");
        cy.get("a").should("have.length.greaterThan", 0);
      });
      cy.get("character-episodes button").contains("(more)").should("exist");
    });

    it("should open episode detail when clicking an episode", () => {
      cy.get("character-episodes a").first().click();
      cy.url().should("include", "/episodes/");
    });
  });

  describe("Breadcrumb & Navigation", () => {
    const character = characters[0];

    beforeEach(() => {
      cy.intercept(
        "GET",
        `https://rickandmortyapi.com/api/character/${character.id}`,
        {
          statusCode: 200,
          body: character,
        }
      ).as("getCharacter");
      navigateTo.characterById(character.id);
      cy.wait("@getCharacter");
    });

    it("should show breadcrumb with character name", () => {
      cy.get("app-breadcrumb").should("exist");
      cy.get("app-breadcrumb").should("contain.text", character.name);
    });
  });

  describe("Error & Unknown Fields", () => {
    it("should show error component if character not found", () => {
      cy.intercept("GET", "https://rickandmortyapi.com/api/character/9999", {
        statusCode: 404,
        body: { error: "Character not found" },
      }).as("getCharacterNotFound");

      cy.visit("/characters/9999");
      cy.wait("@getCharacterNotFound");
      cy.get("app-error").should("exist");
    });

    it("should display unknown fields as plain text", () => {
      cy.intercept(
        "GET",
        `https://rickandmortyapi.com/api/character/${characterUnknown.id}`,
        {
          statusCode: 200,
          body: characterUnknown,
        }
      );
      navigateTo.characterById(characterUnknown.id);

      cy.contains("p.card-text", `Origin: ${characterUnknown.origin.name}`)
        .should("exist")
        .and("not.have.descendants", "a");
      cy.contains("p.card-text", `Location: ${characterUnknown.location.name}`)
        .should("exist")
        .and("not.have.descendants", "a");
    });
  });
});
