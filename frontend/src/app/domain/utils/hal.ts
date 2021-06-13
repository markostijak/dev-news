export interface Page {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

export interface Link {
  href: string;
  templated?: boolean;
}

export interface Links {
  self: Link;

  [key: string]: Link;
}

export interface Embedded<T> {
  [key: string]: T;
}

export interface Hal<T> {
  page: Page;
  _links: Links;
  _embedded: {
    [key: string]: T
  };
}

export class LinkAware {

  private static LENGTH: number = '{?projection}'.length;

  public static createUrl(link: string | Link): string {
    if (typeof link === 'string') {
      return link;
    }

    return link.templated ? link.href.substring(0, link.href.length - LinkAware.LENGTH) : link.href;
  }
}
