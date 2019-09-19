export interface Page {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

export interface Hal {
  page: Page;
  _links: any;
  _embedded: any;
}
