import { navigateTo } from "../../support/helpers/navigateTo";

describe("Character Detail Page", () => {
  beforeEach(() => {
    cy.login("user");
    navigateTo.characterById(1);
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

    cy.get('character-episodes > .container').within(() => {
      cy.contains("List of Episodes appearances").should("exist");
      cy.get("a").should("have.length.greaterThan", 0);
    });
  });

  it("should show breadcrumb with character name", () => {
    cy.get("app-breadcrumb").should("exist");
    cy.get("app-breadcrumb").should("contain.text", "Rick Sanchez");
  });

  it("should show 'more' button if there are many episodes", () => {
    cy.get("character-episodes button").contains("(more)").should("exist");
  });

  it("should open episode detail when clicking an episode", () => {
    cy.get("character-episodes a").first().click();
    cy.url().should("include", "/episodes/");
  });

  it("should show error component if character not found", () => {
    cy.visit("/characters/9999");
    cy.get("app-error").should("exist");
  });
});
