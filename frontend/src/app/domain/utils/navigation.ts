export interface NavigationItem {
  icon?: string;
  logo?: string;
  route?: string;
  title: string;
}

export interface NavigationGroup {
  title?: string;
  items: NavigationItem[];
}

export const ALL: NavigationItem = {
  icon: 'equalizer',
  title: 'All',
  route: 'c/all'
};

export const POPULAR: NavigationItem = {
  icon: 'trending_up',
  title: 'Popular',
  route: 'c/popular'
};

export const TOP_COMMUNITIES: NavigationItem = {
  icon: 'format_list_numbered',
  title: 'Top Communities',
  route: 'top-communities'
};

export const HOME: NavigationItem = {
  icon: 'home',
  title: 'Home',
  route: 'c/home'
};

export const LOGIN: NavigationItem = {
  icon: 'person',
  title: 'Login',
  route: 'login'
};

export const SIGN_UP: NavigationItem = {
  icon: 'person_add',
  title: 'Sign up',
  route: 'sign-up'
};

export const PAGE_NOT_FOUND: NavigationItem = {
  icon: 'error_outline',
  title: 'Page Not Found',
  route: 'page-not-found'
};
