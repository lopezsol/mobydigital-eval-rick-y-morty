describe("Register Page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:4200/auth/register");
  });

  it("should display all input fields", () => {
    cy.get('input[formcontrolname="name"]').should("exist");
    cy.get('input[formcontrolname="email"]').should("exist");
    cy.get('input[formcontrolname="password"]').should("exist");
    cy.get('input[formcontrolname="password2"]').should("exist");
    cy.get('input[formcontrolname="street"]').should("exist");
    cy.get('input[formcontrolname="city"]').should("exist");
    cy.get('select[formcontrolname="country"]').should("exist");
    cy.get('input[formcontrolname="zip"]').should("exist");
  });

  it("should show validation errors when submitting empty form", () => {
    cy.contains("Sign Up").click();
    cy.get("app-error-message-form").should("have.length.at.least", 1);
  });

  it("should register when form is valid", () => {
    cy.intercept("POST", "http://localhost:3000/api/user/register").as(
      "registerRequest"
    );

    cy.get('input[formcontrolname="name"]').type("Cosme Fulanito");
    cy.get('input[formcontrolname="email"]').type("cosme@fulano.com");
    cy.get('input[formcontrolname="password"]').type("123456ABC");
    cy.get('input[formcontrolname="password2"]').type("123456ABC");
    cy.get('input[formcontrolname="street"]').type("123 Fake St");
    cy.get('input[formcontrolname="city"]').type("Springfield");
    cy.get(".form-select").select("Argentina");
    // cy.get('select[formcontrolname="country"]').select("Argentina");
    cy.get('input[formcontrolname="zip"]').type("5000");

    cy.intercept("POST", "/api/auth/register").as("registerRequest");
    cy.contains("Sign Up").click();
    cy.wait("@registerRequest").its("response.statusCode").should("eq", 201);
  });

  it("should show loader if loading", () => {
    // Esto depende de si podés controlar el $authResource en pruebas
    // Alternativamente, podés interceptar un delay artificial para forzarlo:
    cy.intercept("POST", "/api/auth/register", (req) => {
      req.reply((res) => {
        res.delay(3000); // fuerza que el loader se vea
        res.send({ statusCode: 201 });
      });
    }).as("slowRegister");

    // completar y enviar el formulario como en el test anterior
    // y verificar que se muestre <app-loader>
  });
});
