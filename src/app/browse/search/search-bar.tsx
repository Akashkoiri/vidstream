// app/browse/search/search-bar.tsx
import { SearchIcon } from "lucide-react";

type Props = {
  defaultValue?: string;
};

export function SearchBar({ defaultValue = "" }: Props) {
  return (
    <form
      action="/browse/search"
      className="flex w-full max-w-xl items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm shadow-sm"
    >
      <SearchIcon className="h-4 w-4 text-slate-500" />
      <input
        type="text"
        name="query"
        defaultValue={defaultValue}
        placeholder="Search for a movie..."
        className="flex-1 bg-transparent text-slate-100 placeholder:text-slate-500 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-full bg-cyan-500 px-3 py-1 text-xs font-medium text-slate-950 hover:bg-cyan-400"
      >
        Search
      </button>
    </form>
  );
}
