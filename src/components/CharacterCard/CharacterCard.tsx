import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./CharacterCard.css";
import { getCharacterDetailsPath } from "../../config/routes";
import { useGetPlanetByIdQuery } from "../../store/api";
import { getIdFromUrl } from "../../utils/url";
import {
  toggleFavorite,
  updateFavoriteCharacter,
} from "../../store/favoritesSlice";
import type { RootState } from "../../store/store";
import type { Character } from "../../types/starwars";
import { CHARACTER_CARD_TEXT } from "../../constants/text";

interface CharacterCardProps {
  character: Character;
  showHeight?: boolean;
  allowEditing?: boolean;
}

function CharacterCard({
  character,
  showHeight = false,
  allowEditing = false,
}: CharacterCardProps) {
  const dispatch = useDispatch();
  const favoriteCharacters = useSelector(
    (state: RootState) => state.favorites.favoriteCharacters
  );

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editHeight, setEditHeight] = useState(character.height);
  const [editGender, setEditGender] = useState(character.gender);

  // Extract IDs from URLs
  const planetId = getIdFromUrl(character.homeworld);
  const { data: planet } = useGetPlanetByIdQuery(planetId);

  const characterId = getIdFromUrl(character.url);

  // Check if character is in favorites
  const isFavorite = favoriteCharacters.some(
    (fav) => fav.url === character.url
  );

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();
    dispatch(toggleFavorite(character));
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(!isEditing);
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      updateFavoriteCharacter({
        url: character.url,
        updates: {
          height: editHeight,
          gender: editGender as "male" | "female" | "n/a",
        },
      })
    );
    setIsEditing(false);
  };

  const handleCancelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditHeight(character.height);
    setEditGender(character.gender);
    setIsEditing(false);
  };

  return (
    <Link
      className="character-card"
      to={isEditing ? "#" : getCharacterDetailsPath(characterId!)}
    >
      <div className="character-card-actions">
        <button
          className={`favorite-button ${isFavorite ? "favorite" : ""}`}
          onClick={handleFavoriteClick}
          title={
            isFavorite
              ? CHARACTER_CARD_TEXT.FAVORITE_BUTTON_REMOVE
              : CHARACTER_CARD_TEXT.FAVORITE_BUTTON_ADD
          }
        >
          ★
        </button>
        {allowEditing && isFavorite && (
          <button
            className="edit-button"
            onClick={handleEditClick}
            title={
              isEditing
                ? CHARACTER_CARD_TEXT.EDIT_BUTTON_CANCEL
                : CHARACTER_CARD_TEXT.EDIT_BUTTON_EDIT
            }
          >
            {isEditing ? "✖️" : "✏️"}
          </button>
        )}
      </div>

      <>
        <h2>{character.name}</h2>
        <p>
          {CHARACTER_CARD_TEXT.GENDER_LABEL}{" "}
          {isEditing ? (
            <select
              className="edit-field"
              value={editGender}
              onChange={(e) => setEditGender(e.target.value)}
              onClick={(e) => e.preventDefault()}
            >
              <option value={CHARACTER_CARD_TEXT.GENDER_OPTIONS.MALE}>
                {CHARACTER_CARD_TEXT.GENDER_OPTIONS.MALE}
              </option>
              <option value={CHARACTER_CARD_TEXT.GENDER_OPTIONS.FEMALE}>
                {CHARACTER_CARD_TEXT.GENDER_OPTIONS.FEMALE}
              </option>
              <option value={CHARACTER_CARD_TEXT.GENDER_OPTIONS.NOT_APPLICABLE}>
                {CHARACTER_CARD_TEXT.GENDER_OPTIONS.NOT_APPLICABLE}
              </option>
            </select>
          ) : (
            character.gender
          )}
        </p>
        {showHeight && (
          <p>
            {CHARACTER_CARD_TEXT.HEIGHT_LABEL}{" "}
            {isEditing ? (
              <input
                className="edit-field"
                type="text"
                value={editHeight}
                onChange={(e) => setEditHeight(e.target.value)}
                onClick={(e) => e.preventDefault()}
              />
            ) : (
              character.height
            )}
          </p>
        )}
        <p>
          {CHARACTER_CARD_TEXT.HOMEWORLD_LABEL}{" "}
          {planet ? planet.name : CHARACTER_CARD_TEXT.LOADING}
        </p>
        {isEditing && (
          <div className="edit-actions">
            <button onClick={handleSaveClick} className="save-button">
              {CHARACTER_CARD_TEXT.SAVE_BUTTON}
            </button>
            <button onClick={handleCancelClick} className="cancel-button">
              {CHARACTER_CARD_TEXT.CANCEL_BUTTON}
            </button>
          </div>
        )}
      </>
    </Link>
  );
}

export default CharacterCard;
