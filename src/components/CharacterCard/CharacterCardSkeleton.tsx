import "./CharacterCardSkeleton.css";

function CharacterCardSkeleton() {
  return (
    <div className="character-card character-card-skeleton">
      <div className="character-card-actions">
        <div className="skeleton skeleton-button"></div>
      </div>
      {/* Mimic the Link content structure */}
      <div className="skeleton-link-content">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text"></div>
      </div>
    </div>
  );
}

export default CharacterCardSkeleton;
