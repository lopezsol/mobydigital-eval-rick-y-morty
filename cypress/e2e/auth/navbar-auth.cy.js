describe("Navbar", () => {
  beforeEach(() => {
    cy.visit("http://localhost:4200"); // Ajustá la ruta si es necesario
  });

  it("should display the navbar", () => {
    cy.get("nav.navbar").should("exist");
  });

  it("should contain brand link that navigates to /auth/login", () => {
    cy.get("a.navbar-brand")
      .should("have.attr", "routerlink", "/auth/login")
      .click();
    cy.url().should("include", "/auth/login");
  });

  it("should display the Log as Guest button", () => {
    cy.contains("Log as Guest").should("exist");
  });

  it("should allow clicking the Log as Guest button", () => {
    cy.contains("Log as Guest").click();
    //Este botón no hace nada
  });

  it("should toggle the navbar menu on small screens", () => {
    cy.viewport(320, 640); // Mobile view
    cy.get(".navbar-toggler").should("be.visible").click();
    cy.get("#navbarNavAltMarkup").should("have.class", "show");
  });
});
