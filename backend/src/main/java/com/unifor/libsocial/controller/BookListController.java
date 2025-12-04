package com.unifor.libsocial.controller;

import com.unifor.libsocial.dto.BookDTO;
import com.unifor.libsocial.dto.BookListDTO;
import com.unifor.libsocial.service.BookListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users/{userId}/lists")
@CrossOrigin(origins = "http://localhost:4200")
public class BookListController {
    
    @Autowired
    private BookListService bookListService;
    
    @PostMapping
    public ResponseEntity<?> createBookList(
            @PathVariable Long userId,
            @RequestBody BookListDTO bookListDTO) {
        try {
            BookListDTO created = bookListService.createBookList(userId, bookListDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @GetMapping
    public ResponseEntity<List<BookListDTO>> getUserBookLists(@PathVariable Long userId) {
        List<BookListDTO> lists = bookListService.getUserBookLists(userId);
        return ResponseEntity.ok(lists);
    }
    
    @GetMapping("/{listId}")
    public ResponseEntity<BookListDTO> getBookListById(@PathVariable Long listId) {
        try {
            BookListDTO list = bookListService.getBookListById(listId);
            return ResponseEntity.ok(list);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{listId}")
    public ResponseEntity<?> updateBookList(
            @PathVariable Long listId,
            @RequestBody BookListDTO bookListDTO) {
        try {
            BookListDTO updated = bookListService.updateBookList(listId, bookListDTO);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @DeleteMapping("/{listId}")
    public ResponseEntity<?> deleteBookList(@PathVariable Long listId) {
        try {
            bookListService.deleteBookList(listId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @PostMapping("/{listId}/books")
    public ResponseEntity<?> addBookToList(
            @PathVariable Long listId,
            @RequestBody Map<String, Object> request) {
        try {
            BookDTO bookDTO = convertToBookDTO(request);
            BookListDTO updated = bookListService.addBookToList(listId, bookDTO);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @DeleteMapping("/{listId}/books/{bookId}")
    public ResponseEntity<?> removeBookFromList(
            @PathVariable Long listId,
            @PathVariable String bookId) {
        try {
            BookListDTO updated = bookListService.removeBookFromList(listId, bookId);
            return ResponseEntity.ok(updated);
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

