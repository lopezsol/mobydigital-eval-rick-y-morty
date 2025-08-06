import { navigateTo } from "../../support/helpers/navigateTo";

describe("Episode Detail Page", () => {
  beforeEach(() => {
    cy.login("user");
    navigateTo.episodeById(1); 
  });

  it("should display loader while episode is loading", () => {
    cy.get("app-loader").should("exist");
  });

  it("should display episode title, air date and characters", () => {
    cy.get("app-loader").should("not.exist");
    cy.get("h5").should("exist").and("not.be.empty"); 
    cy.contains("Air date").should("exist");
    cy.get("episode-characters-list > .container").within(() => {
      cy.contains("Characters in this episode").should("exist");
      cy.get("a").should("have.length.greaterThan", 0);
    });
  });

  it("should show error component if episode is not found", () => {
    navigateTo.episodeById(99999);
    cy.get("app-error").should("exist");
  });

  //DUDA: es relevante poner el nombre real de lo que deberia decir el episodio, ej "Pilot"
  it("should display breadcrumb with episode name", () => {
    cy.get("app-breadcrumb").should("exist");
    cy.get("app-breadcrumb").contains(/Episode/i);
  });
});
