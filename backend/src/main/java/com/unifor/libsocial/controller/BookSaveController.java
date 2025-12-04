package com.unifor.libsocial.controller;

import com.unifor.libsocial.model.BookSave;
import com.unifor.libsocial.repository.BookRepository;
import com.unifor.libsocial.repository.BookSaveRepository;
import com.unifor.libsocial.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "http://localhost:4200")
public class BookSaveController {
    
    @Autowired
    private BookSaveRepository bookSaveRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BookRepository bookRepository;
    
    @PostMapping("/{bookId}/save/{userId}")
    public ResponseEntity<?> saveBook(@PathVariable String bookId, @PathVariable Long userId) {
        try {
            if (bookSaveRepository.existsByUserIdAndBookId(userId, bookId)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Livro já foi salvo");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
            
            var user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            var book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));
            
            BookSave save = new BookSave();
            save.setUser(user);
            save.setBook(book);
            bookSaveRepository.save(save);
            
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    @DeleteMapping("/{bookId}/save/{userId}")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<?> unsaveBook(@PathVariable String bookId, @PathVariable Long userId) {
        bookSaveRepository.deleteByUserIdAndBookId(userId, bookId);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/{bookId}/save/{userId}")
    public ResponseEntity<Map<String, Boolean>> isSaved(@PathVariable String bookId, @PathVariable Long userId) {
        boolean saved = bookSaveRepository.existsByUserIdAndBookId(userId, bookId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("saved", saved);
        return ResponseEntity.ok(response);
    }
}

