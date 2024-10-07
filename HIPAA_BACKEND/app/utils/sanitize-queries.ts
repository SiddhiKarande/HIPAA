import { IPaginationSearchQueries } from "./base-schema";

export const sanitizeQueryObject = (queryObject: IPaginationSearchQueries) => {
	const sanitizedQueryObject: any = {
		page: queryObject.page || 1,
		limit: !queryObject.limit || queryObject.limit > 20 ? 10 : queryObject.limit,
		searchQuery: queryObject.searchQuery || "",
		filters: queryObject.filters,
	};

	for (const key in sanitizedQueryObject.filters) {
		if (Object.prototype.hasOwnProperty.call(sanitizedQueryObject.filters, key)) {
			sanitizedQueryObject.filters[key] = sanitizedQueryObject.filters[key] || "";
		}
	}

	return sanitizedQueryObject;
};
