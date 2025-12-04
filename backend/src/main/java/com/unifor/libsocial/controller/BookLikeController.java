package com.unifor.libsocial.controller;

import com.unifor.libsocial.model.BookLike;
import com.unifor.libsocial.repository.BookLikeRepository;
import com.unifor.libsocial.repository.BookRepository;
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
public class BookLikeController {
    
    @Autowired
    private BookLikeRepository bookLikeRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BookRepository bookRepository;
    
    @PostMapping("/{bookId}/like/{userId}")
    public ResponseEntity<?> likeBook(@PathVariable String bookId, @PathVariable Long userId) {
        try {
            if (bookLikeRepository.existsByUserIdAndBookId(userId, bookId)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Livro já foi curtido");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
            
            var user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            var book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));
            
            BookLike like = new BookLike();
            like.setUser(user);
            like.setBook(book);
            bookLikeRepository.save(like);
            
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    @DeleteMapping("/{bookId}/like/{userId}")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<?> unlikeBook(@PathVariable String bookId, @PathVariable Long userId) {
        bookLikeRepository.deleteByUserIdAndBookId(userId, bookId);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/{bookId}/like/{userId}")
    public ResponseEntity<Map<String, Boolean>> isLiked(@PathVariable String bookId, @PathVariable Long userId) {
        boolean liked = bookLikeRepository.existsByUserIdAndBookId(userId, bookId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("liked", liked);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{bookId}/likes/count")
    public ResponseEntity<Map<String, Long>> getLikeCount(@PathVariable String bookId) {
        long count = bookLikeRepository.countByBookId(bookId);
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }
}

