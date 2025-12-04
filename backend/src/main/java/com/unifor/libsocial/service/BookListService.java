package com.unifor.libsocial.service;

import com.unifor.libsocial.dto.BookDTO;
import com.unifor.libsocial.dto.BookListDTO;
import com.unifor.libsocial.mapper.ModelMapper;
import com.unifor.libsocial.model.Book;
import com.unifor.libsocial.model.BookList;
import com.unifor.libsocial.model.User;
import com.unifor.libsocial.repository.BookListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BookListService {
    
    @Autowired
    private BookListRepository bookListRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private BookService bookService;
    
    @Autowired
    private ModelMapper modelMapper;
    
    public BookListDTO createBookList(Long userId, BookListDTO bookListDTO) {
        User user = userService.getUserEntity(userId);
        
        BookList bookList = new BookList();
        bookList.setTitle(bookListDTO.getTitle());
        bookList.setDescription(bookListDTO.getDescription());
        bookList.setCoverImage(bookListDTO.getCoverImage());
        bookList.setUser(user);
        
        BookList savedList = bookListRepository.save(bookList);
        return modelMapper.toBookListDTO(savedList);
    }
    
    public List<BookListDTO> getUserBookLists(Long userId) {
        User user = userService.getUserEntity(userId);
        List<BookList> lists = bookListRepository.findByUserOrderByCreatedAtDesc(user);
        return lists.stream()
            .map(modelMapper::toBookListDTO)
            .collect(Collectors.toList());
    }
    
    public BookListDTO getBookListById(Long listId) {
        BookList bookList = bookListRepository.findById(listId)
            .orElseThrow(() -> new RuntimeException("Lista não encontrada"));
        return modelMapper.toBookListDTO(bookList);
    }
    
    public BookListDTO updateBookList(Long listId, BookListDTO bookListDTO) {
        BookList bookList = bookListRepository.findById(listId)
            .orElseThrow(() -> new RuntimeException("Lista não encontrada"));
        
        if (bookListDTO.getTitle() != null) bookList.setTitle(bookListDTO.getTitle());
        if (bookListDTO.getDescription() != null) bookList.setDescription(bookListDTO.getDescription());
        if (bookListDTO.getCoverImage() != null) bookList.setCoverImage(bookListDTO.getCoverImage());
        
        BookList updatedList = bookListRepository.save(bookList);
        return modelMapper.toBookListDTO(updatedList);
    }
    
    public void deleteBookList(Long listId) {
        if (!bookListRepository.existsById(listId)) {
            throw new RuntimeException("Lista não encontrada");
        }
        bookListRepository.deleteById(listId);
    }
    
    public BookListDTO addBookToList(Long listId, BookDTO bookDTO) {
        BookList bookList = bookListRepository.findById(listId)
            .orElseThrow(() -> new RuntimeException("Lista não encontrada"));
        
        // Salvar ou atualizar o livro
        Book book = bookService.getBookEntity(bookDTO.getGoogleBooksId());
        if (book == null) {
            bookService.saveOrUpdateBook(bookDTO);
            book = bookService.getBookEntity(bookDTO.getGoogleBooksId());
        }
        
        // Verificar se já está na lista
        if (bookList.getBooks().contains(book)) {
            throw new RuntimeException("Livro já está na lista");
        }
        
        bookList.getBooks().add(book);
        BookList updatedList = bookListRepository.save(bookList);
        return modelMapper.toBookListDTO(updatedList);
    }
    
    public BookListDTO removeBookFromList(Long listId, String bookId) {
        BookList bookList = bookListRepository.findById(listId)
            .orElseThrow(() -> new RuntimeException("Lista não encontrada"));
        
        Book book = bookService.getBookEntity(bookId);
        if (book == null) {
            throw new RuntimeException("Livro não encontrado");
        }
        
        bookList.getBooks().remove(book);
        BookList updatedList = bookListRepository.save(bookList);
        return modelMapper.toBookListDTO(updatedList);
    }
}

