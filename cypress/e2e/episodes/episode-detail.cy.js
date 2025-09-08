import { navigateTo } from "../../support/helpers/navigateTo";
import { episodes } from "../../fixtures/episodes";

describe("Episode Detail Page", () => {
  const episode = episodes[0];

  beforeEach(() => {
    cy.intercept(
      "GET",
      `https://rickandmortyapi.com/api/episode/${episode.id}`,
      {
        statusCode: 200,
        body: episode,
      }
    ).as("getEpisode");

    cy.login("user");
    navigateTo.episodeById(episode.id);
  });

  describe("Loader & Basic UI", () => {
    it("should show loader while episode is loading", () => {
      cy.get("app-loader").should("exist");
    });

    it("should display episode data from fixture", () => {
      cy.get("episode-info .card-body").within(() => {
        cy.contains(`Name: ${episode.name}`).should("exist");
        cy.contains(`Air date: ${episode.air_date}`).should("exist");
        cy.contains(`Episode code: ${episode.episode}`).should("exist");
      });

      cy.get("episode-characters-list > .container").within(() => {
        cy.contains("Characters in this episode").should("exist");
        cy.get("a").should("have.length", 15);
      });
    });
  });

  describe("Episode Info Details", () => {
    it("should display breadcrumb with episode name", () => {
      cy.get("app-breadcrumb").should("exist");

      cy.get("app-breadcrumb .breadcrumb-item")
        .eq(0)
        .should("contain.text", "Home");
      cy.get("app-breadcrumb .breadcrumb-item")
        .eq(1)
        .should("contain.text", "Episodes");
      cy.get("app-breadcrumb .breadcrumb-item")
        .eq(2)
        .should("contain.text", episode.name);
    });

    it("should open character detail when clicking an character", () => {
      cy.get("episode-characters-list a").first().click();
      cy.url().should("include", "/characters/");
    });

    it("should show 'more' button if there are many characters", () => {
      cy.get("episode-characters-list button")
        .contains("(more)")
        .should("exist");
    });
  });

  describe("Error Handling", () => {
    it("should show error component if episode not found", () => {
      cy.intercept("GET", "https://rickandmortyapi.com/api/episode/9999", {
        statusCode: 404,
        body: { error: "Episode not found" },
      }).as("getEpisodeNotFound");

      navigateTo.episodeById(9999);
      cy.wait("@getEpisodeNotFound");
      cy.get("app-error").should("exist");
    });
  });
});
