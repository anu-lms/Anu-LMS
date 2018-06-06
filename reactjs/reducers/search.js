export default (state = {
  results: [],
  query: '',
  category: 'all',
  isFetching: false,
  isFetched: false,
  isError: false,
}, action) => {
  switch (action.type) {
    case 'SEARCH_RECEIVED':
      return {
        ...state,
        results: action.results,
        isFetching: false,
        isFetched: true,
        isError: false,
      };

    case 'SEARCH_REQUESTED':
      return {
        ...state,
        query: action.text,
        category: action.category,
        isFetching: true,
        isFetched: false,
        isError: false,
      };

    case 'SEARCH_REQUEST_FAILED':
      return {
        ...state,
        isFetching: false,
        isFetched: true,
        isError: true,
      };

    case 'SEARCH_CLEAR':
      return {
        ...state,
        query: '',
        category: 'all',
        results: [],
        isFetching: false,
        isFetched: false,
        isError: false,
      };

    default:
      return state;
  }
};
