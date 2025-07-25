import { useSelector } from "react-redux";
import CharacterCard from "../../components/CharacterCard/CharacterCard";
import type { RootState } from "../../store/store";
import "./FavoritesList.css";

export function FavoritesList() {
  const favoriteCharacters = useSelector(
    (state: RootState) => state.favorites.favoriteCharacters
  );

  return (
    <div className="favorites-list">
      <h1>Favorite Characters</h1>
      {favoriteCharacters.length === 0 ? (
        <div className="no-favorites">
          <p>No favorite characters yet.</p>
          <p>
            Go to the characters page and click the heart icon to add favorites!
          </p>
        </div>
      ) : (
        <div className="favorites-grid">
          {favoriteCharacters.map((character) => (
            <CharacterCard
              key={character.url}
              character={character}
              showHeight={true}
              allowEditing={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesList;
