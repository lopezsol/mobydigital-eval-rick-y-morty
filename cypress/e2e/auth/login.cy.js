import { navigateTo } from "../../support/helpers/navigateTo";

describe("Login Page", () => {
  beforeEach(() => {
    navigateTo.login();
  });

  it("should display the login form", () => {
    cy.get(":nth-child(1) > .form-control").should("exist");
    cy.get('input[formControlName="password"]').should("exist");
    cy.contains("Sign In").should("exist");
    cy.contains("Sign Up").should("have.attr", "routerlink", "/auth/register");
  });

  it("should allow typing into input fields", () => {
    cy.get('input[formControlName="email"]').type("test@example.com");
    cy.get('input[formControlName="password"]').type("12345678");
  });

  it("should show error message when submitting empty form", () => {
    cy.get(".login-form > .btn").click();
    cy.contains("Please check your credentials").should("be.visible");
  });

  it("should log in successfully and navigate to dashboard", () => {
    // DUDA
    cy.intercept("POST", "/api/user/login", {
      statusCode: 201,
      body: {
        header: { resultCode: 0 },
        data: {
          user: {
            id: 1,
            name: "Cosme Fulanito",
            mail: "test@example.com",
            token: "mocked-jwt-token",
          },
        },
      },
    }).as("loginRequest");

    cy.get('input[formControlName="email"]').type("sol@gmail.com");
    cy.get('input[formControlName="password"]').type("12345678");

    cy.get(".login-form > .btn").click();

    // cy.wait("@loginRequest").its("response.statusCode").should("eq", 201);

    cy.url().should("include", "/characters");

    cy.get("app-snackbar-error").should("not.exist");
  });

  it("should log in successfully and navigate to dashboard, sin interceptar ", () => {
    // DUDA
    cy.intercept("POST", "/api/user/login")

    cy.get('input[formControlName="email"]').type("sol@gmail.com");
    cy.get('input[formControlName="password"]').type("12345678");
    cy.get(".login-form > .btn").click();

    // cy.wait("@loginRequest").its("response.statusCode").should("eq", 201);

    cy.url().should("include", "/characters");
    cy.get("app-snackbar-error").should("not.exist");
  });
});
