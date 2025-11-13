import { navigateTo } from "../../support/helpers/navigateTo";
import { users } from "../../fixtures/auth/users";

describe("User Profile Page", () => {
  const user = users["user"];
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
  describe("User Info", () => {
    it("should show user data when not in edit mode", () => {
      cy.get(".card-title").should("contain.text", "User Info");
      cy.get(".card-text").should("contain.text", `Name: ${user.name}`);
      cy.get(".card-text").should("contain.text", `Nickname: ${user.nickname}`);
      cy.get(".card-text").should("contain.text", `E-mail: ${user.mail}`);
      cy.get(".card-text").should(
        "contain.text",
        `Address: ${user.address.street}, ${user.address.city}, ${user.address.location}, ${user.address.country}, ${user.address.cp}`
      );
    });

    it("should show user birthday formatted", () => {
      const date = new Date(user.birthday);
      const options = {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      };
      const formatted = date.toLocaleDateString("en-US", options);

      cy.contains(".card-text", `Birthday: ${formatted}`).should("exist");
    });

    it("should display the breadcrumb with the user name", () => {
      cy.get("app-breadcrumb").should("exist");
      cy.get("app-breadcrumb .breadcrumb-item")
        .eq(0)
        .should("contain.text", "Home");
      cy.get("app-breadcrumb .breadcrumb-item")
        .eq(1)
        .should("contain.text", user.name);
    });
  });

  describe("Favorite Episodes", () => {
    const user = users["userWithFavoriteEpisodes"];
    beforeEach(() => {
      cy.login("userWithFavoriteEpisodes");
      navigateTo.profile();
    });

    it("should show 'more' button", () => {
      cy.contains("(more)").should("exist");
    });

    it("should show favorite episodes if any are available", () => {
      cy.get(".card-title").should("contain.text", "Favorite Episodes");
      cy.get(".episode-line").should("have.length.greaterThan", 0);
    });

    it("should delete episode from favorites when trash button is clicked", () => {
      cy.intercept("PATCH", "/api/user/update/favorite-episodes", {
        statusCode: 200,
        body: { data: { user: { ...user, favoriteEpisodes: [2] } } },
      }).as("deleteFav");

      cy.get(".btn-outline-danger").first().click();

      cy.wait("@deleteFav");

      // Ahora sí podemos asegurar que desapareció el episodio
      cy.get(".episode-line").should("have.length", 1);
    });
  });

  describe("Empty user", () => {
    const user = users["emptyUser"];
    beforeEach(() => {
      cy.login("emptyUser");
      navigateTo.profile();
    });

    it("should show empty state if no favorite episodes exist", () => {
      cy.contains("You haven't selected any favorite episodes yet.").should(
        "exist"
      );
    });
  });

  describe("Edit mode", () => {
    it("should allow switching to edit mode", () => {
      cy.get(".bi-pencil").click();
      cy.get("user-form").should("exist");
    });
    //TODO: completar con el form de editar perfil
  });

  it("should navigate to episode detail when clicking an episode", () => {
    cy.get(".episode-line a").first().click();
    cy.url().should("include", "/episodes/");
  });
});


