/**
 * Returns pager object.
 *
 * @param page
 *   Current page number from the page query,
 * @param limit
 *   Amount of items per page.
 */
const initializePager = (page, limit) => ({
  limit,
  currentPage: page,
  offset: limit * page,
});

export default initializePager;
