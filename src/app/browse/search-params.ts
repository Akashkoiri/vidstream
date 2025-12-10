import { parseAsInteger, parseAsStringEnum, createLoader } from "nuqs/server";

export const browseSearchParams = {
  page: parseAsInteger.withDefault(1),
  sort: parseAsStringEnum([
    "popular",
    "top_rated",
    "upcoming",
  ] as const).withDefault("popular"),
};

export const loadBrowseSearchParams = createLoader(browseSearchParams);
