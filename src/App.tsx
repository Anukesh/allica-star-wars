import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { CharacterList } from "./pages/CharacterList/CharacterList";
import { FavoritesList } from "./pages/FavoritesList/FavoritesList";
import { CharacterDetails } from "./pages/CharacterDetails/CharacterDetails";
import { NotFound } from "./pages/NotFound/NotFound";
import { ROUTES } from "./config/routes";
import type { RootState } from "./store/store";
import "./App.css";

function App() {
  const favoriteCount = useSelector(
    (state: RootState) => state.favorites.favoriteCharacters.length
  );

  return (
    <Router>
      <div className="app">
        <nav>
          <ul>
            <li>
              <Link to={ROUTES.HOME}>Characters</Link>
            </li>
            <li>
              <Link to={ROUTES.FAVORITES}>
                Favorites{" "}
                {favoriteCount > 0 && (
                  <span className="favorites-count"> {favoriteCount}</span>
                )}
              </Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path={ROUTES.HOME} element={<CharacterList />} />
          <Route path={ROUTES.FAVORITES} element={<FavoritesList />} />
          <Route
            path={ROUTES.CHARACTER_DETAILS}
            element={<CharacterDetails />}
          />
          <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
