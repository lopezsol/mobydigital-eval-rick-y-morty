export const navigateTo = {
  home: () => cy.visit('/'),
  register: () => cy.visit('/auth/register'),
  login: () => cy.visit('/auth/login'),
  characters: () => cy.visit('/characters'),
  characterById: (id: string) => cy.visit(`/characters/${id}`),
  episodes: () => cy.visit('/episodes'),
  episodeById: (id: string) => cy.visit(`/episodes/${id}`),
};
