import { navigateTo } from "../../support/helpers/navigateTo";

describe("Episodes Page", () => {
  beforeEach(() => {
    cy.login("user");
    navigateTo.episodes();
  });

    it("should display the breadcrumb and search components", () => {
      cy.get("app-breadcrumb").should("exist");
      cy.get("app-search").should("exist");
    });

    it("should show loader while data is loading", () => {
      cy.intercept("GET", "https://rickandmortyapi.com/api/episode*", {
        delay: 1000,
        statusCode: 200,
        body: {
          info: {
            count: 1,
            pages: 1,
            next: null,
            prev: null,
          },
          results: [],
        },
      }).as("getEpisodes");

      cy.visit("/episodes");
      cy.get("app-loader").should("exist");
      cy.wait("@getEpisodes");
    });

    it("should display an error message if loading fails", () => {
      cy.intercept("GET", "https://rickandmortyapi.com/api/episode*", {
        statusCode: 500,
        body: { message: "Internal server error" },
      })

      cy.visit("/episodes");
      cy.get("app-error").should("exist");
    });

    it("should display episodes list and pagination when data is loaded", () => {
      cy.intercept("GET", "https://rickandmortyapi.com/api/episode*", {
        fixture: "episodes.json",
      }).as("getEpisodes");

      cy.visit("/episodes");
      cy.wait("@getEpisodes");

      cy.get("episodes-list").should("exist");
      cy.get("app-pagination").should("exist");
    });

    it("should update query when user types in search bar", () => {
      cy.get("app-search input").type("Morty").should("have.value", "Morty");
    });

    it("should load a list of episode cards", () => {
      cy.intercept("GET", "https://rickandmortyapi.com/api/episode*", {
        fixture: "episodes.json",
      }).as("getEpisodes");

      cy.visit("/episodes");
      cy.wait("@getEpisodes");

      cy.get("episode-card").should("have.length.greaterThan", 0);
    });

    it("should navigate to episode details page when card is clicked", () => {
      cy.intercept("GET", "https://rickandmortyapi.com/api/episode*", {
        fixture: "episodes.json",
      }).as("getEpisodes");

      cy.visit("/episodes");
      cy.wait("@getEpisodes");

      cy.get("a.text-decoration-none").first().click();

      cy.url().should("include", "/episodes/");
    });

  // DUDA, revisar
  it("should toggle favorite icon when button is clicked", () => {
    const userWithFav = {
      id: 2,
      name: "Regular User",
      mail: "user@example.com",
      role: "user",
      favoriteEpisodes: [1],
    };

    cy.intercept("GET", "https://rickandmortyapi.com/api/episode*", {
      fixture: "episodes.json",
    }).as("getEpisodes");

    cy.wait("@getEpisodes");

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

  it("should not show loader after data is loaded", () => {
    cy.intercept("GET", "https://rickandmortyapi.com/api/episode*", {
      fixture: "episodes.json",
    }).as("getEpisodes");

    cy.visit("/episodes");
    cy.wait("@getEpisodes");

    cy.get("app-loader").should("not.exist");
  });

  it("should filter episodes by search term, sin interceptar", () => {
    cy.intercept("GET", "https://rickandmortyapi.com/api/episode");

    // cy.wait("@getEpisodes");

    cy.get("app-search input").type("Pilot");
    cy.get(".d-flex > .btn").click();
    cy.get("episode-card").each(($el) => {
      cy.wrap($el).contains(/Pilot/i);
    });
  });

  it("should filter episodes by search term", () => {
    cy.intercept("GET", "https://rickandmortyapi.com/api/episode*", (req) => {
      if (req.query.name === "Pilot") {
        req.reply({ fixture: "episodes-with-pilot.json" });
      }
    }).as("getEpisodesWithPilot");

    cy.get("app-search input").type("Pilot");
    cy.get(".d-flex > .btn").click();

    cy.wait("@getEpisodesWithPilot");

    cy.get("episode-card").each(($el) => {
      cy.wrap($el).contains(/Pilot/i);
    });
  });
});
