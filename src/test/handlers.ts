// src/mocks/handlers.ts
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("https://swapi.dev/api/people/:id", ({ params }) => {
    if (params.id === "1") {
      return HttpResponse.json({
        name: "Luke Skywalker",
        height: "172",
        gender: "male",
        hair_color: "blond",
        eye_color: "blue",
        homeworld: "https://swapi.dev/api/planets/1/",
        films: ["https://swapi.dev/api/films/1/"],
        starships: ["https://swapi.dev/api/starships/12/"],
      });
    }
    return HttpResponse.json({}, { status: 404 });
  }),

  http.get("https://swapi.dev/api/planets/:id", () => {
    return HttpResponse.json({
      name: "Tatooine",
    });
  }),

  http.get("https://swapi.dev/api/films/1/", () => {
    return HttpResponse.json({
      title: "A New Hope",
    });
  }),

  http.get("https://swapi.dev/api/starships/12/", () => {
    return HttpResponse.json({
      name: "X-wing",
    });
  }),
];
