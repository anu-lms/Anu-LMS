export default (state = {
  results: [],
  query: '',
  page: 0,
  category: 'all',
  isFetching: false,
  isFetched: false,
  isError: false,
  isLoadMoreFetching: false,
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
        organization: action.organization,
        category: action.category,
        page: 0,
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

    case 'SEARCH_LOAD_MORE':
      return {
        ...state,
        page: state.page + 1,
        isLoadMoreFetching: true,
      };

    case 'SEARCH_RECEIVED_MORE': {
      return {
        ...state,
        results: [...state.results, ...action.results],
        isLoadMoreFetching: false,
      };
    }

    case 'SEARCH_REQUEST_MORE_FAILED':
      return {
        ...state,
        isLoadMoreFetching: false,
      };

    case 'SEARCH_CLEAR':
      return {
        ...state,
        query: '',
        page: 0,
        category: 'all',
        results: [],
        isFetching: false,
        isFetched: false,
        isError: false,
        isLoadMoreFetching: false,
      };

    default:
      return state;
  }
};
