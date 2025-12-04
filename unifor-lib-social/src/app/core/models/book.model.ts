export interface Book {
  id: string;
  kind?: string;
  etag?: string;
  selfLink?: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publisher?: string;       // O culpado de tudo! Agora ele existe.
    publishedDate?: string;
    description?: string;
    industryIdentifiers?: Array<{ type: string; identifier: string }>;
    readingModes?: { text: boolean; image: boolean };
    pageCount?: number;
    printType?: string;
    categories?: string[];
    averageRating?: number;
    ratingsCount?: number;
    maturityRating?: string;
    allowAnonLogging?: boolean;
    contentVersion?: string;
    imageLinks?: {
      thumbnail: string;
      smallThumbnail: string;
    };
    language?: string;
    previewLink?: string;
    infoLink?: string;
    canonicalVolumeLink?: string;
  };
  saleInfo?: {
    country: string;
    saleability: string;
    isEbook: boolean;
    buyLink?: string;
  };
  accessInfo?: {
    country: string;
    viewability: string;
    embeddable: boolean;
    publicDomain: boolean;
    textToSpeechPermission: string;
    epub: { isAvailable: boolean };
    pdf: { isAvailable: boolean };
    webReaderLink: string;
    accessViewStatus: string;
    quoteSharingAllowed: boolean;
  };
}

export interface GoogleBooksResponse {
  kind?: string;
  totalItems: number;
  items: Book[];
}