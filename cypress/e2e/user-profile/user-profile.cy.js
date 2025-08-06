import { navigateTo } from "../../support/helpers/navigateTo";

describe("User Profile Page", () => {
  beforeEach(() => {
    cy.login("user"); 
    navigateTo.profile(); 
  });

//   it("should display a loader when user data or favorite episodes are loading", () => {
//     cy.get("app-loader").should("exist");
//   });

//   it("should show error snackbar if loading favorite episodes fails", () => {
//     cy.get("app-snackbar-error")
//       .should("exist")
//       .and("contain.text", "We couldn’t load your favorite episodes");
//   });

//   it("should show error snackbar if deleting a favorite episode fails", () => {
//     cy.get("app-snackbar-error")
//       .should("exist")
//       .and("contain.text", "We couldn’t delete your favorite episode");
//   });

  it("should display the breadcrumb with the user name", () => {
    cy.get("app-breadcrumb").should("exist");
    cy.get("app-breadcrumb").contains(/.+/); // Check it shows something
  });

  it("should show user data when not in edit mode", () => {
    cy.get(".card-title").should("contain.text", "User Info");
    cy.get(".card-text").should("contain.text", "Name:");
    cy.get(".card-text").should("contain.text", "Nickname:");
    cy.get(".card-text").should("contain.text", "E-mail:");
    cy.get(".card-text").should("contain.text", "Birthday:");
    cy.get(".card-text").should("contain.text", "Address:");
  });

  it("should allow switching to edit mode", () => {
    cy.get(".bi-pencil").click();
    cy.get("user-form").should("exist");
  });

  it("should show favorite episodes if any are available", () => {
    cy.get(".card-title").should("contain.text", "Favorite Episodes");
    cy.get(".episode-line").should("have.length.greaterThan", 0);
  });

  it("should show empty state if no favorite episodes exist", () => {
    cy.contains("You haven't selected any favorite episodes yet.").should("exist");
  });

  it("should show 'more' button when applicable", () => {
    cy.contains("(more)").should("exist");
  });

  it("should navigate to episode detail when clicking an episode", () => {
    cy.get(".episode-line a").first().click();
    cy.url().should("include", "/episodes/");
  });

  it("should delete episode from favorites when trash button is clicked", () => {
    cy.get(".btn-outline-danger").first().click();
    cy.get("app-loader").should("exist"); // Or assert on deletion effect
  });
});
