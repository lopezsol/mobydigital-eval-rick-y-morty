export const episodes = [
  {
    id: 1,
    name: 'Pilot',
    air_date: 'December 2, 2013',
    episode: 'S01E01',
    characters: [
      'https://rickandmortyapi.com/api/character/1',
      'https://rickandmortyapi.com/api/character/2',
      'https://rickandmortyapi.com/api/character/35',
      'https://rickandmortyapi.com/api/character/38',
      'https://rickandmortyapi.com/api/character/62',
      'https://rickandmortyapi.com/api/character/92',
      'https://rickandmortyapi.com/api/character/127',
      'https://rickandmortyapi.com/api/character/144',
      'https://rickandmortyapi.com/api/character/158',
      'https://rickandmortyapi.com/api/character/175',
      'https://rickandmortyapi.com/api/character/179',
      'https://rickandmortyapi.com/api/character/181',
      'https://rickandmortyapi.com/api/character/239',
      'https://rickandmortyapi.com/api/character/249',
      'https://rickandmortyapi.com/api/character/271',
      'https://rickandmortyapi.com/api/character/338',
      'https://rickandmortyapi.com/api/character/394',
      'https://rickandmortyapi.com/api/character/395',
      'https://rickandmortyapi.com/api/character/435',
    ],
    url: 'https://rickandmortyapi.com/api/episode/1',
    created: '2017-11-10T12:56:33.798Z',
  },
  {
    id: 2,
    name: 'Lawnmower Dog',
    air_date: 'December 9, 2013',
    episode: 'S01E02',
    characters: [
      'https://rickandmortyapi.com/api/character/1',
      'https://rickandmortyapi.com/api/character/2',
    ],
    url: 'https://rickandmortyapi.com/api/episode/2',
    created: '2017-11-10T12:56:33.916Z',
  },
];

export const episodesPage2 = [
  {
    id: 21,
    name: 'The Wedding Squanchers',
    air_date: 'October 4, 2015',
    episode: 'S02E10',
    characters: [
      'https://rickandmortyapi.com/api/character/1',
      'https://rickandmortyapi.com/api/character/2',
      'https://rickandmortyapi.com/api/character/3',
    ],
    url: 'https://rickandmortyapi.com/api/episode/21',
    created: '2017-11-10T12:56:35.875Z',
  },
  {
    id: 22,
    name: 'The Rickshank Rickdemption',
    air_date: 'April 1, 2017',
    episode: 'S03E01',
    characters: [
      'https://rickandmortyapi.com/api/character/1',
      'https://rickandmortyapi.com/api/character/2',
      'https://rickandmortyapi.com/api/character/3',
    ],
    url: 'https://rickandmortyapi.com/api/episode/22',
    created: '2017-11-10T12:56:35.983Z',
  },
  {
    id: 23,
    name: 'Rickmancing the Stone',
    air_date: 'July 30, 2017',
    episode: 'S03E02',
    characters: [
      'https://rickandmortyapi.com/api/character/1',
      'https://rickandmortyapi.com/api/character/2',
      'https://rickandmortyapi.com/api/character/3',
      'https://rickandmortyapi.com/api/character/4',
    ],
    url: 'https://rickandmortyapi.com/api/episode/23',
    created: '2017-11-10T12:56:36.100Z',
  },
];

export const episodesResponse = {
  info: {
    count: 2,
    pages: 2,
    next: 'https://rickandmortyapi.com/api/episode?page=2',
    prev: null,
  },
  results: episodes,
};

export const episodesPage2Response = {
  info: {
    count: 2,
    pages: 2,
    next: 'https://rickandmortyapi.com/api/episode?page=3',
    prev: 'https://rickandmortyapi.com/api/episode?page=1',
  },
  results: episodesPage2,
};
