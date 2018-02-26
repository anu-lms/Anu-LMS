# React.js application

## Next.js

The current application is based on [Next.js 3](https://github.com/zeit/next.js).
It allows for server side rendeing (SSR) as well as comes with pre-defined development environment.

[This](https://zeit.co/blog/next2) and [this](https://zeit.co/blog/next3) articles give a very good overview and contains many examples of implementations.

## Structure overview

- `components/` - Folder for storage of all application components.
  - `GlobalFooter` - Example of a simple component which defines footer appearing on every page.
  - `GlobalHeader` - Example of complex component for global siteside header. Ships with example for sticky header behavior and expansion on toggle button click for mobile devices.
  - `HtmlHead` - Contains content placed inside of `<head/>` element for each page.
  - `Layouts` - Contains example of layout for all pages.
  - `MainMenu` - Contains main menu which appears within page header.
  - `PageWithContext` - Special component which provides `pathname` context to all other components. All pages from `pages/` folder **MUST** inherit from this component.
  - `ProgressBar` - A small component which adds a loading bar at the top of the page when a user clicks on another page link. Based on [NProgress library](http://ricostacruz.com/nprogress/).
- `lib/` - Folder for application-wide scripts.
  - `request.js` - Contains configured agent for ajax requests to the backend. See below for example of usage.
  - `url.js`- Contains URLs of the backend for production and development. See below for example of usage.
- `pages/` - Contains all available application pages.
  - `about.js` - A simple example of a page.
  - `ProgressBar.jsx` - A simple example of front page.
- `static/` - Folder which stores any files accessible via web url. All files stored in this folder will be accessible at `http://app.docker.localhost/static/folder/filename.ext`
  - `images/` - Folder which stores images for the application.
  - `robots.txt` - [Robots.txt](http://www.robotstxt.org/robotstxt.html) file for search engines.
- `.babelrc` - A file with configuration for code transpilation. Usually you'll want to leave it as it is.
- `.env.local` - Development environment variables.
- `.eslintrc.json` - A file with pre-defined code style guidelines.
- `next.config.js` - A file with custom configurarion on top of Next.js pre-defined configs for `webpack`.
- `server.js` - A file which describes how node.js should run this application on a server.


## Lock API

In asynchronous app there are still tasks which need to syncronise with each other.
For that purpose Lock API has been developed.

Add a new lock in your `FooComponent`:

```
const lock_id = lock.add('foo');
```

You can add more locks with the same name in different places of the app:

```
const second_lock_id = lock.add('foo');
```

You can release the lock by its id:

```
lock.release(lock_id);
```

To check if 'foo' is locked run:

```
const is_locked = lock.isNameLocked('foo');
```

If  `BarComponent` you can wait for locks before proceeding:

```
await lock.wait('foo');
// Some operation after all 'foo' locks are release.
```

You can wait for all locks to be released:

```
// Wait for the app to safely finish off before logging out.
await lock.waitAll();
// Do logout.
```