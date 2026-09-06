const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;

const toPositiveInteger = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const getPaginationParams = (query, options = {}) => {
  const defaultLimit = options.defaultLimit || DEFAULT_LIMIT;
  const maxLimit = options.maxLimit || MAX_LIMIT;
  const page = toPositiveInteger(query.page, DEFAULT_PAGE);
  const requestedLimit = toPositiveInteger(query.limit, defaultLimit);
  const limit = Math.min(requestedLimit, maxLimit);

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

const buildPaginationMeta = ({ page, limit, total }) => {
  const totalPages = Math.max(Math.ceil(total / limit), 1);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

module.exports = {
  buildPaginationMeta,
  getPaginationParams,
};
