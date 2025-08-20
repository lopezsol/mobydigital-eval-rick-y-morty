import { navigateTo } from "../../support/helpers/navigateTo";
import { characters, characterUnknown } from "../../fixtures/characters";

describe("Character Detail Page", () => {
  const character = characters[0];

  beforeEach(() => {
    cy.intercept("GET", "https://rickandmortyapi.com/api/character/1", {
      statusCode: 200,
      body: character,
    }).as("getCharacters");

    cy.login("user");
    navigateTo.characterById(character.id);
  });

  it("should show loader while character is loading", () => {
    cy.get("app-loader").should("exist");
  });

  it("should display character info and episodes when loaded", () => {
    cy.get("character-info", { timeout: 10000 }).should("exist");

    cy.get("character-info .card-body").within(() => {
      cy.contains("Name:").should("exist");
      cy.contains("Status:").should("exist");
      cy.contains("Species:").should("exist");
      cy.contains("Gender:").should("exist");
      cy.contains("Origin:").should("exist");
      cy.contains("Location:").should("exist");
    });

    // Esperamos a que character-episodes tenga contenido
    cy.get("character-episodes", { timeout: 20000 }).should("exist");

    // Ahora esperamos a que se renderice el contenido dentro
    cy.get("character-episodes .card-body", { timeout: 10000 }).should("exist");

    cy.get("character-episodes > .container").within(() => {
      cy.contains("List of Episodes appearances").should("exist");
      cy.get("a").should("have.length.greaterThan", 0);
    });
  });

  it("should display full character info", () => {
    cy.contains("h5", "Character Info").should("exist");
    cy.get("img").should("have.attr", "src", character.image);
    cy.contains(`Name: ${character.name}`).should("exist");
    cy.contains("Status:").should("exist"); // el texto traducido lo testearías aparte si tenés pipes
    cy.contains(`Species: ${character.species}`).should("exist");
    cy.contains("Gender:").should("exist"); // lo mismo para traducido

    // Origin
    cy.get("p.card-text")
      .contains("Origin:")
      .find("a")
      .should("have.attr", "href", character.origin.url)
      .and("contain", character.origin.name);

    // Location
    cy.get("p.card-text")
      .contains("Location:")
      .find("a")
      .should("have.attr", "href", character.location.url)
      .and("contain", character.location.name);
  });

  it("should show breadcrumb with character name", () => {
    cy.get("app-breadcrumb").should("exist");
    cy.get("app-breadcrumb").should("contain.text", character.name);
  });

  it("should show 'more' button if there are many episodes", () => {
    cy.get("character-episodes button").contains("(more)").should("exist");
  });

  it("should open episode detail when clicking an episode", () => {
    cy.get("character-episodes a").first().click();
    cy.url().should("include", "/episodes/");
  });

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
    cy.intercept("GET", "https://rickandmortyapi.com/api/character/13", {
      statusCode: 200,
      body: characterUnknown,
    });
    navigateTo.characterById(characterUnknown.id);
    cy.contains(`Name: ${characterUnknown.name}`).should("exist");
    cy.contains(`Species: ${characterUnknown.species}`).should("exist");

    // Name
    // cy.contains("h2", characterUnknown.name).should("exist");

    // Status
    cy.contains("p.card-text", `Status: Desconocido`).should("exist");



    // Type (está vacío, deberías mostrar 'unknown' también en tu app)
    // cy.contains("p.card-text", "Type: unknown").should("exist");

    // Gender
    cy.contains("p.card-text", `Gender: Desconocido`).should("exist");

    // Origin (sin link)
    cy.contains("p.card-text", `Origin: ${characterUnknown.origin.name}`)
      .should("exist")
      .and("not.have.descendants", "a");

    // Location (sin link)
    cy.contains("p.card-text", `Location: ${characterUnknown.location.name}`)
      .should("exist")
      .and("not.have.descendants", "a");

    // Imagen
    cy.get("img")
      .should("have.attr", "src", characterUnknown.image)
      .and("have.attr", "alt", characterUnknown.name);
  });
});
