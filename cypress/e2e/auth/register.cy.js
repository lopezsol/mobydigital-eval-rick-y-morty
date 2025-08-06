import { navigateTo } from "../../support/helpers/navigateTo";
import { registerResponseUser } from "../../fixtures/auth/users";

describe("Register Page", () => {
  beforeEach(() => {
    navigateTo.register();
  });

  describe("UI Elements & Form Behavior", () => {
    it("should display the registration form", () => {
      cy.get('input[formControlName="name"]').should("exist");
      cy.get('input[formControlName="email"]').should("exist");
      cy.get('input[formControlName="password"]').should("exist");
      cy.contains("Sign Up").should("exist");
      cy.contains("Sign In").should("have.attr", "routerlink", "/auth/login");
    });

    it("should allow typing into input fields", () => {
      cy.get('input[formControlName="name"]').type("New User");
      cy.get('input[formControlName="email"]').type("newuser@example.com");
      cy.get('input[formControlName="password"]').type("12345678");
    });
  });

  describe("Form Validation", () => {
    it("should show only basic errors if no fields are touched", () => {
      cy.contains("Sign Up").click();

      cy.get('input[formcontrolname="name"]')
        .parent()
        .should("contain.text", "This field is required");

      cy.get('input[formcontrolname="email"]')
        .parent()
        .should("contain.text", "This field is required");

      cy.get('input[formcontrolname="password"]')
        .parent()
        .should("contain.text", "This field is required");

      cy.get('input[formcontrolname="password2"]')
        .parent()
        .should("contain.text", "This field is required");

      // Asegurarse de que NO se muestran errores de campos de dirección
      cy.get('input[formcontrolname="street"]')
        .parent()
        .should("not.contain.text", "This field is required");

      cy.get('input[formcontrolname="city"]')
        .parent()
        .should("not.contain.text", "This field is required");

      cy.get(".form-select")
        .parent()
        .should("not.contain.text", "This field is required");

      cy.get('input[formcontrolname="zip"]')
        .parent()
        .should("not.contain.text", "This field is required");
    });

    it("should require all address fields if one of them is filled", () => {
      cy.get('input[formcontrolname="street"]').type("Av Siempre Viva 123");

      cy.contains("Sign Up").click();

      cy.get('input[formcontrolname="city"]')
        .parent()
        .should("contain.text", "This field is required");

      cy.get(".form-select")
        .parent()
        .should("contain.text", "This field is required");

      cy.get('input[formcontrolname="zip"]')
        .parent()
        .should("contain.text", "This field is required");
    });

    it("should show error if passwords do not match", () => {
      cy.get('input[formcontrolname="password"]').type("123456ABC");
      cy.get('input[formcontrolname="password2"]').type("654321CBA");

      cy.contains("Sign Up").click();

      cy.get('input[formcontrolname="password"]')
        .parent()
        .should("contain.text", "Passwords do not match");
    });

    it("should show error if email format is invalid", () => {
      cy.get('input[formcontrolname="email"]').type("not-an-email");

      cy.contains("Sign Up").click();

      cy.get('input[formcontrolname="email"]')
        .parent()
        .should(
          "contain.text",
          "The value does not look like a valid email address"
        );
    });
  });

  describe("Failure Scenarios", () => {
    it("should show error snackbar if email is already registered", () => {
      cy.intercept("POST", "/api/user/register", {
        statusCode: 400,
        body: {
          header: {
            resultCode: 2,
            error: "Mail already registered",
          },
        },
      }).as("registerFail");

      cy.get('input[formControlName="name"]').type("Existing User");
      cy.get('input[formControlName="email"]').type("user@mail.com");
      cy.get('input[formControlName="password"]').type("12345678");
      cy.get('input[formControlName="password2"]').type("12345678");

      cy.contains("Sign Up").click();

      cy.wait("@registerFail");
      cy.get("app-snackbar-error").should(
        "contain.text",
        "Mail already registered"
      );
    });
  });

  describe("Success Scenarios", () => {
    it("should redirect to login after successful registration", () => {
      cy.intercept("POST", "/api/user/register", {
        statusCode: 201,
        body: registerResponseUser,
      }).as("registerSuccess");

      cy.get('input[formControlName="name"]').type("New User");
      cy.get('input[formControlName="email"]').type("newuser@example.com");
      cy.get('input[formControlName="password"]').type("12345678");
      cy.get('input[formControlName="password2"]').type("12345678");
      cy.get('input[formControlName="street"]').type("Fake St 123");
      cy.get('input[formControlName="city"]').type("Córdoba");
      cy.get('select[formControlName="country"]').select("Argentina");
      cy.get('input[formControlName="zip"]').type("5000");

      cy.contains("Sign Up").click();

      cy.wait("@registerSuccess");
      //TODO: completar cuando se agregue el mensaje de registro exitoso
      cy.url().should("include", "/auth/login");
    });
  });

  describe("Access Control", () => {
    it("should redirect to login if not authenticated and tries to visit protected route", () => {
      cy.visit("/characters");
      cy.url().should("include", "/auth/login");
    });
  });
});
