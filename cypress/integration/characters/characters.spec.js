describe("Characters Page", () => {
  beforeEach(() => {
    // Simula login escribiendo en sessionStorage
    const user = {
      id: "1",
      name: "Test User",
      mail: "test@example.com",
    };

    const token = "fake-jwt-token";

    cy.visit("http://localhost:4200", {
      onBeforeLoad(win) {
        win.sessionStorage.setItem("user", JSON.stringify(user));
        win.sessionStorage.setItem("token", token);
      },
    });

    cy.visit("http://localhost:4200/characters");
  });

  it("should display the breadcrumb component", () => {
    cy.get("app-breadcrumb").should("exist");
  });

  it("should display the character search component", () => {
    cy.get("character-search").should("exist");
  });

  it("should display the loader while loading", () => {
    cy.get("app-loader").should("exist");
  });

  it("should display error message if characterResource has an error", () => {
    cy.intercept("GET", "https://rickandmortyapi.com/api/character?page=1", {
      statusCode: 500,
      body: {},
    }).as("getCharactersError");

    cy.reload(); // Forzamos de nuevo la carga
    cy.wait("@getCharactersError");

    cy.get("app-error").should("exist");
  });

  it("should display the characters list when characters are loaded", () => {
    cy.get("characters-list", { timeout: 10000 }).should("exist");
    cy.get("character-pagination").should("exist");
  });

  it("should update displayed characters on pagination click", () => {
    // Capturamos el nombre del primer personaje en la página actual
    cy.get("characters-list character-card")
      .first()
      .invoke("text")
      .then((firstCharacterBefore) => {
        // Click en el segundo botón de paginación (suele ser la página 2)
        cy.get("character-pagination button").eq(2).click();

        // Verificamos que el primer personaje haya cambiado (esperamos a que se actualice el DOM)
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

  it("should navigate to character detail when a character card is clicked", () => {
    // Espera que haya tarjetas
    cy.get("characters-list character-card").should("have.length.at.least", 1);

    // Clic en la primera tarjeta
    cy.get("characters-list character-card").first().click();

    // Verifica que navega al detalle (ej: /characters/1)
    cy.url().should("match", /\/characters\/\d+$/);

    // Verifica que hay contenido en el detalle (nombre o imagen)
    cy.get("h1, h2, .character-name, .card-title").should("exist");
  });
});
