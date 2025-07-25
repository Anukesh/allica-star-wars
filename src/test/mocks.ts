import type { Character, Planet, Film, Starship } from "../types/starwars";

interface APIResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const mockPlanet: Planet = {
  name: "Tatooine",
  rotation_period: "23",
  orbital_period: "304",
  diameter: "10465",
  climate: "arid",
  gravity: "1 standard",
  terrain: "desert",
  surface_water: "1",
  population: "200000",
  residents: [
    "https://swapi.dev/api/people/1/",
    "https://swapi.dev/api/people/2/",
  ],
  films: [
    "https://swapi.dev/api/films/1/",
    "https://swapi.dev/api/films/3/",
    "https://swapi.dev/api/films/4/",
    "https://swapi.dev/api/films/5/",
    "https://swapi.dev/api/films/6/",
  ],
  created: "2014-12-09T13:50:49.641000Z",
  edited: "2014-12-20T20:58:18.411000Z",
  url: "https://swapi.dev/api/planets/1/",
};

export const mockFilm: Film = {
  title: "A New Hope",
  episode_id: 4,
  opening_crawl: "It is a period of civil war.",
  director: "George Lucas",
  producer: "Gary Kurtz, Rick McCallum",
  release_date: "1977-05-25",
  characters: [
    "https://swapi.dev/api/people/1/",
    "https://swapi.dev/api/people/2/",
  ],
  planets: ["https://swapi.dev/api/planets/1/"],
  starships: ["https://swapi.dev/api/starships/2/"],
  vehicles: [],
  species: [],
  created: "2014-12-10T14:23:31.880000Z",
  edited: "2014-12-20T19:49:45.256000Z",
  url: "https://swapi.dev/api/films/1/",
};

export const mockFilm2: Film = {
  title: "The Empire Strikes Back",
  episode_id: 5,
  opening_crawl: "It is a dark time for the Rebellion.",
  director: "Irvin Kershner",
  producer: "Gary Kurtz, Rick McCallum",
  release_date: "1980-05-17",
  characters: [
    "https://swapi.dev/api/people/1/",
    "https://swapi.dev/api/people/2/",
  ],
  planets: ["https://swapi.dev/api/planets/1/"],
  starships: ["https://swapi.dev/api/starships/2/"],
  vehicles: [],
  species: [],
  created: "2014-12-12T11:26:24.656000Z",
  edited: "2014-12-15T13:07:53.386000Z",
  url: "https://swapi.dev/api/films/2/",
};

export const mockStarship: Starship = {
  name: "X-wing",
  model: "T-65 X-wing",
  manufacturer: "Incom Corporation",
  cost_in_credits: "149999",
  length: "12.5",
  max_atmosphering_speed: "1050",
  crew: "1",
  passengers: "0",
  cargo_capacity: "110",
  consumables: "1 week",
  hyperdrive_rating: "1.0",
  MGLT: "100",
  starship_class: "Starfighter",
  pilots: ["https://swapi.dev/api/people/1/"],
  films: ["https://swapi.dev/api/films/1/"],
  created: "2014-12-12T11:19:05.340000Z",
  edited: "2014-12-20T21:23:49.886000Z",
  url: "https://swapi.dev/api/starships/12/",
};

export const mockStarship2: Starship = {
  name: "Imperial shuttle",
  model: "Lambda-class T-4a shuttle",
  manufacturer: "Sienar Fleet Systems",
  cost_in_credits: "240000",
  length: "20",
  max_atmosphering_speed: "850",
  crew: "6",
  passengers: "20",
  cargo_capacity: "80000",
  consumables: "2 months",
  hyperdrive_rating: "1.0",
  MGLT: "50",
  starship_class: "Armed government transport",
  pilots: ["https://swapi.dev/api/people/1/"],
  films: ["https://swapi.dev/api/films/3/"],
  created: "2014-12-15T13:04:47.235000Z",
  edited: "2014-12-20T21:23:49.900000Z",
  url: "https://swapi.dev/api/starships/22/",
};

export const mockCharacter: Character = {
  name: "Luke Skywalker",
  height: "172",
  mass: "77",
  hair_color: "blond",
  skin_color: "fair",
  eye_color: "blue",
  birth_year: "19BBY",
  gender: "male",
  homeworld: "https://swapi.dev/api/planets/1/",
  films: [
    "https://swapi.dev/api/films/1/",
    "https://swapi.dev/api/films/2/",
    "https://swapi.dev/api/films/3/",
    "https://swapi.dev/api/films/6/",
  ],
  species: [],
  vehicles: [
    "https://swapi.dev/api/vehicles/14/",
    "https://swapi.dev/api/vehicles/30/",
  ],
  starships: [
    "https://swapi.dev/api/starships/12/",
    "https://swapi.dev/api/starships/22/",
  ],
  created: "2014-12-09T13:50:51.644000Z",
  edited: "2014-12-20T21:17:56.891000Z",
  url: "https://swapi.dev/api/people/1/",
};

export const mockCharacterResponse: APIResponse<Character> = {
  count: 82,
  next: "https://swapi.dev/api/people/?page=2",
  previous: null,
  results: [
    mockCharacter,
    {
      ...mockCharacter,
      name: "C-3PO",
      height: "167",
      mass: "75",
      hair_color: "n/a",
      skin_color: "gold",
      eye_color: "yellow",
      birth_year: "112BBY",
      gender: "n/a",
      url: "https://swapi.dev/api/people/2/",
    },
    {
      ...mockCharacter,
      name: "R2-D2",
      height: "96",
      mass: "32",
      hair_color: "n/a",
      skin_color: "white, blue",
      eye_color: "red",
      birth_year: "33BBY",
      gender: "n/a",
      url: "https://swapi.dev/api/people/3/",
    },
  ],
};

export const mockEmptyResponse: APIResponse<Character> = {
  count: 0,
  next: null,
  previous: null,
  results: [],
};
