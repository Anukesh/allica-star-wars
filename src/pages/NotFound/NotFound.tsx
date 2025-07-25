import "./NotFound.css";

export function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">
          This is not the page you're looking for
        </h2>
        <p className="not-found-message">
          The page you requested has vanished into the depths of space. Perhaps
          the Empire destroyed it, or maybe it's hiding on a distant planet.
        </p>
      </div>
    </div>
  );
}

export default NotFound;
