import NProgress from 'nprogress';
import { Router } from '../../../routes';

Router.onRouteChangeStart = () => {
  NProgress.start()
};

Router.onRouteChangeComplete = () => NProgress.done();

Router.onRouteChangeError = () => NProgress.done();
