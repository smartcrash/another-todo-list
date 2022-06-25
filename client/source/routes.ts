import { compile } from 'path-to-regexp';

export const routes = {
  index: '/',
  login: '/login',
  signUp: '/signup',
  project: '/p/:slug',
};

export const route = (name: keyof typeof routes, params = {}) => {
  const patter = routes[name];

  try {
    return compile(patter, { validate: false })(params);
  } catch (_) {
    return patter;
  }
};
