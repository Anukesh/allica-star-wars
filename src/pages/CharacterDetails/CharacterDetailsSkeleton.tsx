import "./CharacterDetailsSkeleton.css";

function CharacterDetailsSkeleton() {
  return (
    <div className="character-details" aria-label="character-details-skeleton">
      <div className="skeleton skeleton-back-link"></div>
      <div className="character-info">
        <div className="info-section">
          <div className="skeleton skeleton-character-name"></div>
          <div className="skeleton skeleton-detail-text"></div>
          <div className="skeleton skeleton-detail-text"></div>
          <div className="skeleton skeleton-detail-text"></div>
          <div className="skeleton skeleton-detail-text"></div>
          <div className="skeleton skeleton-detail-text"></div>
          <div className="skeleton skeleton-detail-text skeleton-films"></div>
          <div className="skeleton skeleton-detail-text skeleton-starships"></div>
        </div>
      </div>
    </div>
  );
}

export default CharacterDetailsSkeleton;
