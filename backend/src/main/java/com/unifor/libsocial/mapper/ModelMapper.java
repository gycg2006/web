package com.unifor.libsocial.mapper;

import com.unifor.libsocial.dto.*;
import com.unifor.libsocial.model.*;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class ModelMapper {
    
    public UserDTO toUserDTO(User user) {
        if (user == null) return null;
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setMatricula(user.getMatricula());
        dto.setNome(user.getNome());
        dto.setBio(user.getBio());
        dto.setCurso(user.getCurso());
        dto.setFotoPerfil(user.getFotoPerfil());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
    
    public BookDTO toBookDTO(Book book) {
        if (book == null) return null;
        BookDTO dto = new BookDTO();
        dto.setGoogleBooksId(book.getGoogleBooksId());
        dto.setTitle(book.getTitle());
        dto.setAuthors(book.getAuthors() != null ? 
            java.util.Arrays.asList(book.getAuthors().split(",")) : null);
        dto.setPublisher(book.getPublisher());
        dto.setPublishedDate(book.getPublishedDate());
        dto.setDescription(book.getDescription());
        dto.setPageCount(book.getPageCount());
        dto.setCategories(book.getCategories() != null ? 
            java.util.Arrays.asList(book.getCategories().split(",")) : null);
        dto.setAverageRating(book.getAverageRating());
        dto.setRatingsCount(book.getRatingsCount());
        dto.setThumbnailUrl(book.getThumbnailUrl());
        dto.setSmallThumbnailUrl(book.getSmallThumbnailUrl());
        dto.setPreviewLink(book.getPreviewLink());
        dto.setInfoLink(book.getInfoLink());
        return dto;
    }
    
    public Book toBook(BookDTO dto) {
        if (dto == null) return null;
        Book book = new Book();
        book.setGoogleBooksId(dto.getGoogleBooksId());
        book.setTitle(dto.getTitle());
        book.setAuthors(dto.getAuthors() != null ? 
            String.join(",", dto.getAuthors()) : null);
        book.setPublisher(dto.getPublisher());
        book.setPublishedDate(dto.getPublishedDate());
        book.setDescription(dto.getDescription());
        book.setPageCount(dto.getPageCount());
        book.setCategories(dto.getCategories() != null ? 
            String.join(",", dto.getCategories()) : null);
        book.setAverageRating(dto.getAverageRating());
        book.setRatingsCount(dto.getRatingsCount());
        book.setThumbnailUrl(dto.getThumbnailUrl());
        book.setSmallThumbnailUrl(dto.getSmallThumbnailUrl());
        book.setPreviewLink(dto.getPreviewLink());
        book.setInfoLink(dto.getInfoLink());
        return book;
    }
    
    public UserBookDTO toUserBookDTO(UserBook userBook) {
        if (userBook == null) return null;
        UserBookDTO dto = new UserBookDTO();
        dto.setId(userBook.getId());
        dto.setBook(toBookDTO(userBook.getBook()));
        dto.setStatus(userBook.getStatus());
        dto.setAddedAt(userBook.getAddedAt());
        dto.setStartedAt(userBook.getStartedAt());
        dto.setFinishedAt(userBook.getFinishedAt());
        dto.setRating(userBook.getRating());
        dto.setReview(userBook.getReview());
        return dto;
    }
    
    public BookListDTO toBookListDTO(BookList bookList) {
        if (bookList == null) return null;
        BookListDTO dto = new BookListDTO();
        dto.setId(bookList.getId());
        dto.setTitle(bookList.getTitle());
        dto.setDescription(bookList.getDescription());
        dto.setCoverImage(bookList.getCoverImage());
        dto.setBookCount(bookList.getBookCount());
        dto.setBooks(bookList.getBooks().stream()
            .map(this::toBookDTO)
            .collect(Collectors.toList()));
        dto.setCreatedAt(bookList.getCreatedAt());
        dto.setUpdatedAt(bookList.getUpdatedAt());
        return dto;
    }
}

