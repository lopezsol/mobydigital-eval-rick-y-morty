import { navigateTo } from "../../support/helpers/navigateTo";
import { loginResponseUser } from "../../fixtures/auth/users";

describe("Login Page", () => {
  beforeEach(() => {
    navigateTo.login();
  });

  describe("UI Elements & Form Behavior", () => {
    it("should display the login form", () => {
      cy.get('input[formControlName="email"]').should("exist");
      cy.get('input[formControlName="password"]').should("exist");
      cy.contains("Sign In").should("exist");
      cy.contains("Sign Up").should(
        "have.attr",
        "routerlink",
        "/auth/register"
      );
    });

    it("should allow typing into input fields", () => {
      cy.get('input[formControlName="email"]').type("test@example.com");
      cy.get('input[formControlName="password"]').type("12345678");
    });
  });

  describe("Failure Scenarios", () => {
    it("should show error message when submitting empty form", () => {
      cy.get(".login-form > .btn").click();
      cy.contains("Please check your credentials and try again").should("be.visible");
    });

    it("should show error snackbar on failed login attempt", () => {
      cy.intercept("POST", "/api/user/login", {
        statusCode: 401,
        body: {
          header: { resultCode: 1002 },
          error: "Invalid credentials",
        },
      }).as("loginFail");

      cy.get('input[formControlName="email"]').type("wrong@example.com");
      cy.get('input[formControlName="password"]').type("wrongpassword");

      cy.get(".login-form > .btn").click();
      cy.wait("@loginFail");

      cy.get("app-snackbar-error")
        .should("exist")
        .and("contain.text", "Please check your credentials and try again");
    });
  });

  describe("Success Scenarios", () => {
    beforeEach(() => {
      cy.intercept("POST", "/api/user/login", {
        statusCode: 201,
        body: loginResponseUser,
      }).as("loginSuccess");
    });

    it("should log in successfully and navigate to dashboard", () => {
      cy.get('input[formControlName="email"]').type("user@mail.com");
      cy.get('input[formControlName="password"]').type("12345678");
      cy.get(".login-form > .btn").click();

      cy.wait("@loginSuccess");
      cy.url().should("include", "/characters");
      cy.get("app-snackbar-error").should("not.exist");
    });
  });

  describe("Access Control", () => {
    it("should redirect to login if not authenticated and tries to visit protected route", () => {
      cy.visit("/characters");
      cy.url().should("include", "/auth/login");
    });
  });
});
