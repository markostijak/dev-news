export interface Page {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

export interface Links {
  self: {
    href: string;
    templated?: boolean;
  };
}

export interface Hal<T> {
  page: Page;
  _links: Links;
  _embedded: {
    [key: string]: T
  };
}
