// Cypress.Commands.add("login", (role = "user") => {
//   const users = {
//     admin: {
//       id: 1,
//       name: "Admin User",
//       mail: "admin@example.com",
//       role: "admin",
//       favoriteEpisodes: [],
//     },
//     user: {
//       id: 2,
//       name: "Regular User",
//       mail: "user@example.com",
//       role: "user",
//       favoriteEpisodes: [],
//     },
//   };

//   const token = "fake-jwt-token-for-testing";

//   const user = users[role];

//   cy.visit("/", {
//     onBeforeLoad(win) {
//       win.sessionStorage.setItem("user", JSON.stringify(user));
//       win.sessionStorage.setItem("token", token);
//     },
//   });
// });

// Cypress.Commands.add("login", (role = "user") => {
//   const credentials = {
//     user: { mail: "user@mail.com", password: "12345678" },
//     admin: { mail: "admin@mail.com", password: "12345678" },
//   };

//   cy.request("POST", "http://localhost:3000/api/user/login", credentials[role])
//     .then((res) => {
//       const { token, user } = res.body.data;

//       cy.visit("/", {
//         onBeforeLoad(win) {
//           win.sessionStorage.setItem("token", token);
//           win.sessionStorage.setItem("user", JSON.stringify(user));
//         },
//       });
//     });
// });

import { users, fakeToken } from "../fixtures/auth/users";

Cypress.Commands.add("login", (role = "user") => {
  const user = users[role];

  cy.visit("/", {
    onBeforeLoad(win) {
      win.sessionStorage.setItem("user", JSON.stringify(user));
      win.sessionStorage.setItem("token", fakeToken);
    },
  });
});
