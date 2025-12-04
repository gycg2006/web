// CORREÇÃO: Usamos ../../ para voltar pastas. Não existe .../
import { Book, GoogleBooksResponse } from '../../models/book.model';

export const MOCK_BOOK: Book = {
  kind: 'books#volume',
  id: 'ABC_123',
  etag: 'etag123',
  volumeInfo: {
    title: 'O Guia do Mochileiro das Galáxias',
    authors: ['Douglas Adams'],
    publisher: 'Editora Teste',
    publishedDate: '1979-10-12',
    description: 'Um livro muito engraçado sobre o fim do mundo e toalhas.',
    industryIdentifiers: [{ type: 'ISBN_10', identifier: '0345391802' }],
    readingModes: { text: true, image: false },
    pageCount: 224,
    printType: 'BOOK',
    categories: ['Fiction', 'Science Fiction'],
    averageRating: 4.5,
    ratingsCount: 1000,
    maturityRating: 'NOT_MATURE',
    allowAnonLogging: true,
    contentVersion: '1.0.0',
    imageLinks: {
      smallThumbnail: 'https://books.google.com/books/content?id=zyTCAlFPjgYC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
      thumbnail: 'https://books.google.com/books/content?id=zyTCAlFPjgYC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
    },
    language: 'pt-BR',
    previewLink: 'http://link.para.preview',
    infoLink: 'http://link.para.info',
    canonicalVolumeLink: 'http://link.para.volume',
  },
  saleInfo: {
    country: 'BR',
    saleability: 'FOR_SALE',
    isEbook: true,
  },
  accessInfo: {
    country: 'BR',
    viewability: 'PARTIAL',
    embeddable: true,
    publicDomain: false,
    textToSpeechPermission: 'ALLOWED',
    epub: { isAvailable: true },
    pdf: { isAvailable: false },
    webReaderLink: 'http://link.para.reader',
    accessViewStatus: 'SAMPLE',
    quoteSharingAllowed: false,
  },
};

export const MOCK_BOOKS: GoogleBooksResponse = {
  kind: 'books#volumes',
  totalItems: 1,
  items: [MOCK_BOOK],
};