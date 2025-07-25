import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetCharactersQuery } from "../../store/api";
import CharacterCard from "../../components/CharacterCard/CharacterCard";
import CharacterCardSkeleton from "../../components/CharacterCard/CharacterCardSkeleton";
import SearchBar from "../../components/SearchBar/SearchBar";
import Pagination from "../../components/Pagination/Pagination";
import "./CharacterList.css";

export function CharacterList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const currentSearch = searchParams.get("query") || "";

  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(currentSearch);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      const newParams = new URLSearchParams(searchParams);
      if (searchTerm) {
        newParams.set("query", searchTerm);
      } else {
        newParams.delete("query");
      }
      newParams.set("page", "1");
      setSearchParams(newParams);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, error, isFetching } = useGetCharactersQuery({
    search: debouncedSearch,
    page: currentPage,
  });

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
  };

  const totalPages = data ? Math.ceil(data.count / 10) : 0;

  return (
    <div className="character-list">
      <h1 className="app-heading">Star Wars</h1>
      <SearchBar searchQuery={searchTerm} onSearchChange={setSearchTerm} />
      <div className="characters-grid">
        {isFetching ? (
          <>
            {Array.from({ length: 10 }).map((_, index) => (
              <CharacterCardSkeleton key={`skeleton-${index}`} />
            ))}
          </>
        ) : error ? (
          <div className="error">Error loading characters</div>
        ) : data?.results.length === 0 ? (
          <div className="no-results">No characters found</div>
        ) : (
          <>
            {data?.results.map((character) => (
              <CharacterCard key={character.url} character={character} />
            ))}
          </>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default CharacterList;
