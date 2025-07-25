import type { ChangeEvent } from "react";
import "./SearchBar.css";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
}: SearchBarProps) {
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search characters..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input"
      />
    </div>
  );
}
