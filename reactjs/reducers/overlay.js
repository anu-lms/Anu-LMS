export default (state = {
  content: null,
  header: null,
  isError: false,
  isLoading: false,
  isOpened: false,
  onClose: () => {},
}, action) => {
  switch (action.type) {
    case 'OVERLAY_OPEN':
      return {
        ...state,
        id: action.id,
        content: action.content,
        header: action.header,
        onClose: action.onClose, // @todo: this function doesn't stored properly in store.
        isLoading: action.isLoading,
        isError: false,
        isOpened: true,
      };

    case 'OVERLAY_CLOSE':
      return {
        ...state,
        id: '',
        content: null,
        header: null,
        onClose: () => {},
        isError: false,
        isLoading: false,
        isOpened: false,
      };

    case 'OVERLAY_IS_LOADING':
      return {
        ...state,
        isLoading: true,
      };

    case 'OVERLAY_IS_LOADED':
      return {
        ...state,
        isLoading: false,
      };

    case 'OVERLAY_IS_ERROR':
      return {
        ...state,
        isError: true,
        isLoading: false,
        content: action.message,
      };

    default:
      return state;
  }
};
