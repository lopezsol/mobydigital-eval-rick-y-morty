Cypress.Commands.add("login", (role = "user") => {
  const users = {
    admin: {
      id: 1,
      name: "Admin User",
      mail: "admin@example.com",
      role: "admin",
      favoriteEpisodes: []
    },
    user: {
      id: 2,
      name: "Regular User",
      mail: "user@example.com",
      role: "user",
      favoriteEpisodes: []
    },
  };

  const token = "fake-jwt-token-for-testing"; 

  const user = users[role];

  cy.visit("/", {
    onBeforeLoad(win) {
      win.sessionStorage.setItem("user", JSON.stringify(user));
      win.sessionStorage.setItem("token", token);
    },
  });
});
