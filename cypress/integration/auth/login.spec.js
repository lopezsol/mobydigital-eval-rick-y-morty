describe("Login Page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:4200");
  });

  it("should display the login form", () => {
    cy.get(":nth-child(1) > .form-control").should("exist");
    cy.get('input[formControlName="password"]').should("exist");
    cy.contains("Sign In").should("exist");
    cy.contains("Sign Up").should("have.attr", "routerlink", "/auth/register");
  });

  it("should allow typing into input fields", () => {
    cy.get('input[formControlName="email"]').type("test@example.com");
    cy.get('input[formControlName="password"]').type("123456");
  });

  it("should show error message when submitting empty form", () => {
    cy.get(".login-form > .btn").click();
    cy.contains("Please check your credentials").should("be.visible");
  });

  it("should log in successfully and navigate to dashboard", () => {
    // Intercept login request with a mocked response
    cy.intercept("POST", "http://localhost:3000/api/user/login", {
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

    // Fill in the form
    cy.get('input[formControlName="email"]').type("sol@gmail.com");
    cy.get('input[formControlName="password"]').type("12345678");

    // Submit the form
    cy.get(".login-form > .btn").click();

    // Wait for the intercepted login request and verify status
    cy.wait("@loginRequest").its("response.statusCode").should("eq", 201);

    // Verify successful navigation
    cy.url().should("include", "/characters"); // adjust to your actual route

    // Confirm no error snackbar is displayed
    cy.get("app-snackbar-error").should("not.exist");
  });
});
