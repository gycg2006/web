package com.unifor.libsocial.service;

import com.unifor.libsocial.dto.BookDTO;
import com.unifor.libsocial.dto.UserBookDTO;
import com.unifor.libsocial.mapper.ModelMapper;
import com.unifor.libsocial.model.Book;
import com.unifor.libsocial.model.User;
import com.unifor.libsocial.model.UserBook;
import com.unifor.libsocial.repository.UserBookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserBookService {
    
    @Autowired
    private UserBookRepository userBookRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private BookService bookService;
    
    @Autowired
    private ModelMapper modelMapper;
    
    public UserBookDTO addBookToUser(Long userId, BookDTO bookDTO, UserBook.ReadingStatus status) {
        User user = userService.getUserEntity(userId);
        
        // Salvar ou atualizar o livro
        Book book = bookService.getBookEntity(bookDTO.getGoogleBooksId());
        if (book == null) {
            bookService.saveOrUpdateBook(bookDTO);
            book = bookService.getBookEntity(bookDTO.getGoogleBooksId());
        }
        
        // Verificar se já existe
        if (userBookRepository.existsByUserAndBook_GoogleBooksId(user, bookDTO.getGoogleBooksId())) {
            throw new RuntimeException("Livro já está na sua estante");
        }
        
        UserBook userBook = new UserBook();
        userBook.setUser(user);
        userBook.setBook(book);
        userBook.setStatus(status);
        
        if (status == UserBook.ReadingStatus.LENDO) {
            userBook.setStartedAt(LocalDateTime.now());
        }
        
        UserBook savedUserBook = userBookRepository.save(userBook);
        return modelMapper.toUserBookDTO(savedUserBook);
    }
    
    public List<UserBookDTO> getUserBooksByStatus(Long userId, UserBook.ReadingStatus status) {
        User user = userService.getUserEntity(userId);
        List<UserBook> userBooks = userBookRepository.findByUserAndStatus(user, status);
        return userBooks.stream()
            .map(modelMapper::toUserBookDTO)
            .collect(Collectors.toList());
    }
    
    public List<UserBookDTO> getAllUserBooks(Long userId) {
        User user = userService.getUserEntity(userId);
        List<UserBook> userBooks = userBookRepository.findByUser(user);
        return userBooks.stream()
            .map(modelMapper::toUserBookDTO)
            .collect(Collectors.toList());
    }
    
    public UserBookDTO updateUserBookStatus(Long userId, String bookId, UserBook.ReadingStatus newStatus) {
        User user = userService.getUserEntity(userId);
        UserBook userBook = userBookRepository.findByUserAndBook_GoogleBooksId(user, bookId)
            .orElseThrow(() -> new RuntimeException("Livro não encontrado na sua estante"));
        
        userBook.setStatus(newStatus);
        
        if (newStatus == UserBook.ReadingStatus.LENDO && userBook.getStartedAt() == null) {
            userBook.setStartedAt(LocalDateTime.now());
        } else if (newStatus == UserBook.ReadingStatus.LIDO && userBook.getFinishedAt() == null) {
            userBook.setFinishedAt(LocalDateTime.now());
        }
        
        UserBook updatedUserBook = userBookRepository.save(userBook);
        return modelMapper.toUserBookDTO(updatedUserBook);
    }
    
    public void removeBookFromUser(Long userId, String bookId) {
        User user = userService.getUserEntity(userId);
        UserBook userBook = userBookRepository.findByUserAndBook_GoogleBooksId(user, bookId)
            .orElseThrow(() -> new RuntimeException("Livro não encontrado na sua estante"));
        
        userBookRepository.delete(userBook);
    }
    
    public UserBookDTO updateRatingAndReview(Long userId, String bookId, Integer rating, String review) {
        User user = userService.getUserEntity(userId);
        UserBook userBook = userBookRepository.findByUserAndBook_GoogleBooksId(user, bookId)
            .orElseThrow(() -> new RuntimeException("Livro não encontrado na sua estante"));
        
        userBook.setRating(rating);
        userBook.setReview(review);
        
        UserBook updatedUserBook = userBookRepository.save(userBook);
        return modelMapper.toUserBookDTO(updatedUserBook);
    }
}

