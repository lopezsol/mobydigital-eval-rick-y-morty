export const users = {
  admin: {
    id: '1',
    role: 'admin',
    name: 'Admin Test',
    mail: 'admin@mail.com',
  },
  user: {
    id: '2',
    role: 'user',
    name: 'User Test',
    mail: 'user@mail.com',
    nickname: 'user',
    phone: '12345678',
    birthday: '1998-10-10',
    favoriteEpisodes: [1, 2],
    avatarUrl: 'https://example.com/avatar.png',
    address: {
      street: 'Fake St 123',
      city: 'Córdoba',
      country: 'Argentina',
      location: 'Córdoba',
      cp: 5000,
    },
  },
};

export const fakeToken = 'fake-jwt-token-for-testing';

export const loginResponseUser = {
  header: { message: 'authenticated user', resultCode: 0 },
  data: { user: users['user'], token: fakeToken },
};
