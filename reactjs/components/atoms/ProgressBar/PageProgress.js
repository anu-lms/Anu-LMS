import NProgress from 'nprogress';
import routerEvents from '../../../router-events';

routerEvents.on('routeChangeStart', () => {
  NProgress.start();
});

routerEvents.on('routeChangeComplete', () => {
  NProgress.done();
});

routerEvents.on('routeChangeError', () => {
  NProgress.done();
});
