import { navigateTo } from "../../support/helpers/navigateTo";
import {
  episodesPage2Response,
  episodesResponse,
} from "../../fixtures/episodes";

describe("Episodes Page", () => {
  beforeEach(() => {
    cy.intercept("GET", "https://rickandmortyapi.com/api/episode?page=1", {
      statusCode: 200,
      body: episodesResponse,
    }).as("getEpisodes");

    cy.login("user");
    navigateTo.episodes();
  });

  describe("UI Components", () => {
    it("should display the breadcrumb component", () => {
      cy.get("app-breadcrumb").should("exist");
    });

    it("should display the character search component", () => {
      cy.get("app-search").should("exist");
    });

    it("should display the loader while loading", () => {
      cy.get("app-loader").should("exist");
    });
    it("should not show loader after data is loaded", () => {
      cy.get("app-loader").should("not.exist");
    });
  });

  describe("Episodes List & Pagination", () => {
    it("should display episodes list and pagination when data is loaded", () => {
      cy.get("episodes-list").should("exist");
      cy.get("app-pagination").should("exist");
    });

    it("should load a list of episode cards", () => {
      cy.get("episode-card").should("have.length.greaterThan", 0);
    });

    it("should update displayed episode on pagination click", () => {
      cy.intercept("GET", "https://rickandmortyapi.com/api/episode?page=2", {
        statusCode: 200,
        body: episodesPage2Response,
      }).as("getEpisodesPage2");

      cy.get("episodes-list episode-card")
        .first()
        .invoke("text")
        .then((firstEpisodeBefore) => {
          cy.get("app-pagination button").eq(2).click();

          cy.wait("@getEpisodesPage2");

          cy.get("episodes-list episode-card")
            .first()
            .invoke("text")
            .should((firstEpisodeAfter) => {
              expect(firstEpisodeAfter.trim()).to.not.eq(
                firstEpisodeBefore.trim()
              );
            });
        });
    });
  });

  describe("Search bar", () => {
    it("should update query when user types in search bar", () => {
      cy.get("app-search input").type("Pilot").should("have.value", "Pilot");
    });

    it("should filter episodes by search term", () => {
      cy.get("app-search input").type("Pilot");
      cy.get(".d-flex > .btn").click();

      cy.get("episode-card").each(($el) => {
        cy.wrap($el).contains(/Pilot/i);
      });
    });
  });

  describe("Navigation", () => {
    it("should navigate to episode details page when card is clicked", () => {
      cy.get("episodes-list episode-card").should("have.length.at.least", 1);

      cy.get("episodes-list episode-card").first().click();

      cy.url().should("match", /\/episodes\/\d+$/);
      cy.url().should("include", "/episodes/");

      cy.contains("Info of the episode").should("be.visible");
    });
  });

  describe("Favorite Episode", () => {
    // TODO, revisar
    // falta cuando el episodio ya es favorito y se desclickea?

    it("should toggle favorite icon when button is clicked", () => {
      const userWithFav = {
        id: 2,
        name: "Regular User",
        mail: "user@example.com",
        role: "user",
        favoriteEpisodes: [1],
      };

      cy.get("episodes-list > section")
        .find("div.card")
        .first()
        .find("button.btn-outline-primary")
        .click()
        .then(() => {
          // Actualizar manualmente sessionStorage simulando que el favorito fue agregado
          cy.window().then((win) => {
            win.sessionStorage.setItem("user", JSON.stringify(userWithFav));
          });
        });

      // Forzar un refresco o re-render (depende de tu app)
      // Por ejemplo, volver a visitar la página
      cy.reload();

      // Verificar que el ícono cambió
      cy.get("episodes-list > section")
        .find("div.card")
        .first()
        .find("button.btn-outline-primary i")
        .should("have.class", "bi-star-fill");
    });
  });

  describe("Error Handling", () => {
    it("should display error message if characterResource has an error", () => {
      cy.intercept("GET", "https://rickandmortyapi.com/api/episode*", {
        statusCode: 500,
        body: {},
      }).as("getEpisodesError");

      cy.reload(); // Forzamos de nuevo la carga
      cy.wait("@getEpisodesError");

      cy.get("app-error").should("exist");
    });
  });
});
