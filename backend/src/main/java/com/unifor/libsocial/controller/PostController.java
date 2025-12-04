package com.unifor.libsocial.controller;

import com.unifor.libsocial.dto.CreatePostRequest;
import com.unifor.libsocial.dto.PostDTO;
import com.unifor.libsocial.service.PostService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:4200")
public class PostController {
    
    @Autowired
    private PostService postService;
    
    @PostMapping("/{userId}")
    public ResponseEntity<?> createPost(@PathVariable Long userId, @Valid @RequestBody CreatePostRequest request) {
        try {
            PostDTO post = postService.createPost(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(post);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    @GetMapping("/feed/{userId}")
    public ResponseEntity<Page<PostDTO>> getFeed(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PostDTO> posts = postService.getFeed(userId, pageable);
        return ResponseEntity.ok(posts);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<PostDTO>> getUserPosts(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PostDTO> posts = postService.getUserPosts(userId, pageable);
        return ResponseEntity.ok(posts);
    }
    
    @PostMapping("/{postId}/like/{userId}")
    public ResponseEntity<?> likePost(@PathVariable Long postId, @PathVariable Long userId) {
        try {
            postService.likePost(userId, postId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    @DeleteMapping("/{postId}/like/{userId}")
    public ResponseEntity<?> unlikePost(@PathVariable Long postId, @PathVariable Long userId) {
        postService.unlikePost(userId, postId);
        return ResponseEntity.ok().build();
    }
}

