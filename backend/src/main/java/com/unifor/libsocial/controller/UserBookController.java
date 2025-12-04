package com.unifor.libsocial.controller;

import com.unifor.libsocial.dto.BookDTO;
import com.unifor.libsocial.dto.UserBookDTO;
import com.unifor.libsocial.model.UserBook;
import com.unifor.libsocial.service.UserBookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users/{userId}/books")
@CrossOrigin(origins = "http://localhost:4200")
public class UserBookController {
    
    @Autowired
    private UserBookService userBookService;
    
    @PostMapping
    public ResponseEntity<?> addBookToUser(
            @PathVariable Long userId,
            @RequestBody Map<String, Object> request) {
        try {
            BookDTO bookDTO = convertToBookDTO(request);
            String statusStr = (String) request.getOrDefault("status", "QUERO_LER");
            UserBook.ReadingStatus status = UserBook.ReadingStatus.valueOf(statusStr);
            
            UserBookDTO userBook = userBookService.addBookToUser(userId, bookDTO, status);
            return ResponseEntity.status(HttpStatus.CREATED).body(userBook);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @GetMapping
    public ResponseEntity<List<UserBookDTO>> getAllUserBooks(@PathVariable Long userId) {
        List<UserBookDTO> books = userBookService.getAllUserBooks(userId);
        return ResponseEntity.ok(books);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<UserBookDTO>> getUserBooksByStatus(
            @PathVariable Long userId,
            @PathVariable String status) {
        try {
            UserBook.ReadingStatus readingStatus = UserBook.ReadingStatus.valueOf(status);
            List<UserBookDTO> books = userBookService.getUserBooksByStatus(userId, readingStatus);
            return ResponseEntity.ok(books);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{bookId}/status")
    public ResponseEntity<?> updateBookStatus(
            @PathVariable Long userId,
            @PathVariable String bookId,
            @RequestBody Map<String, String> request) {
        try {
            UserBook.ReadingStatus newStatus = UserBook.ReadingStatus.valueOf(request.get("status"));
            UserBookDTO updated = userBookService.updateUserBookStatus(userId, bookId, newStatus);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @PutMapping("/{bookId}/review")
    public ResponseEntity<?> updateRatingAndReview(
            @PathVariable Long userId,
            @PathVariable String bookId,
            @RequestBody Map<String, Object> request) {
        try {
            Integer rating = request.get("rating") != null ? 
                Integer.valueOf(request.get("rating").toString()) : null;
            String review = (String) request.get("review");
            
            UserBookDTO updated = userBookService.updateRatingAndReview(userId, bookId, rating, review);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @DeleteMapping("/{bookId}")
    public ResponseEntity<?> removeBookFromUser(
            @PathVariable Long userId,
            @PathVariable String bookId) {
        try {
            userBookService.removeBookFromUser(userId, bookId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    private BookDTO convertToBookDTO(Map<String, Object> map) {
        BookDTO dto = new BookDTO();
        if (map.containsKey("googleBooksId")) dto.setGoogleBooksId((String) map.get("googleBooksId"));
        if (map.containsKey("id")) dto.setGoogleBooksId((String) map.get("id"));
        if (map.containsKey("volumeInfo")) {
            @SuppressWarnings("unchecked")
            Map<String, Object> volumeInfo = (Map<String, Object>) map.get("volumeInfo");
            if (volumeInfo.containsKey("title")) dto.setTitle((String) volumeInfo.get("title"));
            if (volumeInfo.containsKey("authors")) {
                @SuppressWarnings("unchecked")
                List<String> authors = (List<String>) volumeInfo.get("authors");
                dto.setAuthors(authors);
            }
            if (volumeInfo.containsKey("publisher")) dto.setPublisher((String) volumeInfo.get("publisher"));
            if (volumeInfo.containsKey("publishedDate")) dto.setPublishedDate((String) volumeInfo.get("publishedDate"));
            if (volumeInfo.containsKey("description")) dto.setDescription((String) volumeInfo.get("description"));
            if (volumeInfo.containsKey("pageCount")) dto.setPageCount(((Number) volumeInfo.get("pageCount")).intValue());
            if (volumeInfo.containsKey("categories")) {
                @SuppressWarnings("unchecked")
                List<String> categories = (List<String>) volumeInfo.get("categories");
                dto.setCategories(categories);
            }
            if (volumeInfo.containsKey("averageRating")) dto.setAverageRating(((Number) volumeInfo.get("averageRating")).doubleValue());
            if (volumeInfo.containsKey("ratingsCount")) dto.setRatingsCount(((Number) volumeInfo.get("ratingsCount")).intValue());
            if (volumeInfo.containsKey("imageLinks")) {
                @SuppressWarnings("unchecked")
                Map<String, String> imageLinks = (Map<String, String>) volumeInfo.get("imageLinks");
                if (imageLinks.containsKey("thumbnail")) dto.setThumbnailUrl(imageLinks.get("thumbnail"));
                if (imageLinks.containsKey("smallThumbnail")) dto.setSmallThumbnailUrl(imageLinks.get("smallThumbnail"));
            }
            if (volumeInfo.containsKey("previewLink")) dto.setPreviewLink((String) volumeInfo.get("previewLink"));
            if (volumeInfo.containsKey("infoLink")) dto.setInfoLink((String) volumeInfo.get("infoLink"));
        }
        return dto;
    }
}

