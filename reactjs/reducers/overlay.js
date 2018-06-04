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

      // When overlay is opened, the body content should become not
      // scrollable.
      document.body.classList.add('no-scroll');

      return {
        ...state,
        content: action.content,
        header: action.header,
        onClose: action.onClose,
        isLoading: action.isLoading,
        isError: false,
        isOpened: true,
      };

    case 'OVERLAY_CLOSE':

      // When overlay is closed, the body content should become scrollable
      // again.
      document.body.classList.remove('no-scroll');

      return {
        ...state,
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
