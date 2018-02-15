import { Router } from '../routes';
import jsCookie from 'js-cookie';
import * as userActions from '../actions/user';

/**
 * Get state of note sync with backend.
 *
 * @todo: consider to move function to withAuth file,
 * currently dispatch isn't available there after page reload.
 */
export function userLogout(dispatch) {
  dispatch(userActions.userLogout());

  // Remove access cookies and redirect to the Front page.
  jsCookie.remove('accessToken');
  jsCookie.remove('refreshToken');
  Router.replace('/');
}
