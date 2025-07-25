import { useParams, Link } from "react-router-dom";
import "./CharacterDetails.css";
import {
  useGetCharacterByIdQuery,
  useGetPlanetByIdQuery,
  useFetchFilmsQuery,
  useFetchStarshipsQuery,
} from "../../store/api";
import { getIdFromUrl } from "../../utils/url";
import CharacterDetailsSkeleton from "./CharacterDetailsSkeleton";

export function CharacterDetails() {
  const { id } = useParams<{ id: string }>();
  const {
    data: character,
    isLoading: isLoadingCharacter,
    error: characterError,
  } = useGetCharacterByIdQuery(id || "");

  const planetId = character ? getIdFromUrl(character.homeworld) : "";
  const {
    data: planet,
    isLoading: isLoadingPlanet,
    error: planetError,
  } = useGetPlanetByIdQuery(planetId, {
    skip: !character,
  });

  const filmUrls = character?.films || [];
  const starshipUrls = character?.starships || [];

  const {
    data: films = [],
    isLoading: isLoadingFilms,
    error: filmError,
  } = useFetchFilmsQuery(filmUrls, {
    skip: !character || filmUrls.length === 0,
  });

  const {
    data: starships = [],
    isLoading: isLoadingStarships,
    error: starshipError,
  } = useFetchStarshipsQuery(starshipUrls, {
    skip: !character || starshipUrls.length === 0,
  });

  if (isLoadingCharacter) {
    return <CharacterDetailsSkeleton />;
  }

  if (characterError) {
    return (
      <div className="character-details">
        <Link to="/" className="back-link">
          ← Back to Characters
        </Link>
        <div className="error">Error loading character details</div>
      </div>
    );
  }

  return (
    <div className="character-details">
      <Link to="/" className="back-link">
        ← Back to Characters
      </Link>
      <div className="info-section">
        <h2>{character?.name}</h2>
        <p>
          <strong>Gender:</strong> {character?.gender}
        </p>
        <p>
          <strong>Height:</strong> {character?.height}
        </p>
        <p>
          <strong>Hair Color:</strong> {character?.hair_color}
        </p>
        <p>
          <strong>Eye Color:</strong> {character?.eye_color}
        </p>
        <p>
          <strong>Home Planet:</strong>{" "}
          {isLoadingPlanet
            ? "Loading..."
            : planetError
            ? "Error loading planet"
            : planet?.name || "Unknown"}
        </p>
        <p>
          <strong>Films:</strong>{" "}
          {isLoadingFilms
            ? "Loading..."
            : filmError
            ? "Error loading films"
            : films?.map((film) => film.title).join(", ") || "Unknown"}
        </p>
        <p>
          <strong>Starships:</strong>{" "}
          {isLoadingStarships
            ? "Loading..."
            : starshipError
            ? "Error loading starships"
            : starships?.map((starship) => starship?.name).join(", ") ||
              "Unknown"}
        </p>
      </div>
    </div>
  );
}

export default CharacterDetails;
