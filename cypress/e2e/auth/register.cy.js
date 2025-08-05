import { navigateTo } from "../../support/helpers/navigateTo";

describe("Register Page", () => {
  beforeEach(() => {
    navigateTo.register();
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
    cy.intercept("POST", "/api/user/register").as("registerRequest");

    cy.get('input[formcontrolname="name"]').type("Cosme Fulanito");
    cy.get('input[formcontrolname="email"]').type("cosme@fulanito.com");
    cy.get('input[formcontrolname="password"]').type("123456ABC");
    cy.get('input[formcontrolname="password2"]').type("123456ABC");
    cy.get('input[formcontrolname="street"]').type("123 Fake St");
    cy.get('input[formcontrolname="city"]').type("Springfield");
    cy.get(".form-select").select("Argentina");
    cy.get('input[formcontrolname="zip"]').type("5000");

    cy.contains("Sign Up").click();
    cy.wait("@registerRequest").its("response.statusCode").should("eq", 201);
  });

  it("should show loader if loading", () => {
    cy.intercept("POST", "/api/user/register", {
      delay: 3000,
      statusCode: 201,
      body: {
        header: {
          resultCode: 0,
          message: "Usuario creado exitosamente",
        },
        data: {
          id: "fake-id",
          name: "Cosme Fulano",
          mail: "cosme@fulano.com",
        },
      },
    }).as("slowRegister");

    cy.get('input[formcontrolname="name"]').type("Cosme Fulano");
    cy.get('input[formcontrolname="email"]').type("cosme@fulano.com");
    cy.get('input[formcontrolname="password"]').type("123456ABC");
    cy.get('input[formcontrolname="password2"]').type("123456ABC");
    cy.get('input[formcontrolname="street"]').type("123 Fake St");
    cy.get('input[formcontrolname="city"]').type("Springfield");
    cy.get(".form-select").select("Argentina");
    cy.get('input[formcontrolname="zip"]').type("5000");
    cy.contains("Sign Up").click();

    cy.get("app-loader").should("be.visible");

    cy.wait("@slowRegister");

    cy.get("app-loader").should("not.exist");
  });

  it("should display error message when email is already registered", () => {
    cy.intercept("POST", "/api/user/register").as("registerConflict");

    // Visitá el formulario y llenalo como siempre
    cy.get('input[formControlName="name"]').type("Cosme Fulanito");
    cy.get('input[formControlName="email"]').type("cosme@fulanito.com");
    cy.get('input[formControlName="password"]').type("123456ABC");
    cy.get('input[formControlName="password2"]').type("123456ABC");
    cy.get('input[formControlName="street"]').type("123 Fake St");
    cy.get('input[formControlName="city"]').type("Springfield");
    cy.get("select.form-select").select("Argentina");
    cy.get('input[formControlName="zip"]').type("5000");

    cy.contains("Sign Up").click();

    cy.wait("@registerConflict");

    cy.get('.snackbar').should("be.visible");
    cy.get('.snackbar').should(
      "contain.text",
      "Mail already registered"
    );
  });
});
