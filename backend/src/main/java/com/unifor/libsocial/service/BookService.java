package com.unifor.libsocial.service;

import com.unifor.libsocial.dto.BookDTO;
import com.unifor.libsocial.mapper.ModelMapper;
import com.unifor.libsocial.model.Book;
import com.unifor.libsocial.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class BookService {
    
    @Autowired
    private BookRepository bookRepository;
    
    @Autowired
    private ModelMapper modelMapper;
    
    public BookDTO saveOrUpdateBook(BookDTO bookDTO) {
        Optional<Book> existingBook = bookRepository.findByGoogleBooksId(bookDTO.getGoogleBooksId());
        
        Book book;
        if (existingBook.isPresent()) {
            book = existingBook.get();
            // Atualizar campos se necessário
            updateBookFields(book, bookDTO);
        } else {
            book = modelMapper.toBook(bookDTO);
        }
        
        Book savedBook = bookRepository.save(book);
        return modelMapper.toBookDTO(savedBook);
    }
    
    public BookDTO getBookByGoogleId(String googleBooksId) {
        Book book = bookRepository.findByGoogleBooksId(googleBooksId)
            .orElseThrow(() -> new RuntimeException("Livro não encontrado"));
        return modelMapper.toBookDTO(book);
    }
    
    public Book getBookEntity(String googleBooksId) {
        return bookRepository.findByGoogleBooksId(googleBooksId)
            .orElse(null);
    }
    
    private void updateBookFields(Book book, BookDTO dto) {
        if (dto.getTitle() != null) book.setTitle(dto.getTitle());
        if (dto.getAuthors() != null) book.setAuthors(String.join(",", dto.getAuthors()));
        if (dto.getPublisher() != null) book.setPublisher(dto.getPublisher());
        if (dto.getDescription() != null) book.setDescription(dto.getDescription());
        if (dto.getThumbnailUrl() != null) book.setThumbnailUrl(dto.getThumbnailUrl());
    }
}

