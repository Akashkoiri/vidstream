import { parseAsInteger, parseAsStringEnum, createLoader } from "nuqs/server";

export const browseSearchParams = {
  page: parseAsInteger.withDefault(1),
  sort: parseAsStringEnum([
    "popular",
    "top_rated",
    "upcoming",
    "trending",
    "netflix",
    "prime",
    "disney",
    "max"
  ] as const).withDefault("popular"),
  type: parseAsStringEnum(["movie", "tv"] as const).withDefault("movie"),
};

export const loadBrowseSearchParams = createLoader(browseSearchParams);
