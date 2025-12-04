package com.unifor.libsocial.controller;

import com.unifor.libsocial.dto.UserDTO;
import com.unifor.libsocial.service.FriendshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/friendships")
@CrossOrigin(origins = "http://localhost:4200")
public class FriendshipController {
    
    @Autowired
    private FriendshipService friendshipService;
    
    @PostMapping("/{userId}/request/{friendId}")
    public ResponseEntity<?> sendFriendRequest(@PathVariable Long userId, @PathVariable Long friendId) {
        try {
            friendshipService.sendFriendRequest(userId, friendId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    @PostMapping("/{userId}/accept/{friendId}")
    public ResponseEntity<?> acceptFriendRequest(@PathVariable Long userId, @PathVariable Long friendId) {
        try {
            friendshipService.acceptFriendRequest(userId, friendId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    @DeleteMapping("/{userId}/remove/{friendId}")
    public ResponseEntity<?> removeFriend(@PathVariable Long userId, @PathVariable Long friendId) {
        try {
            friendshipService.removeFriend(userId, friendId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    @GetMapping("/{userId}/friends")
    public ResponseEntity<List<UserDTO>> getFriends(@PathVariable Long userId) {
        List<UserDTO> friends = friendshipService.getFriends(userId);
        return ResponseEntity.ok(friends);
    }
    
    @GetMapping("/{userId}/pending")
    public ResponseEntity<List<UserDTO>> getPendingRequests(@PathVariable Long userId) {
        List<UserDTO> pending = friendshipService.getPendingRequests(userId);
        return ResponseEntity.ok(pending);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<UserDTO>> searchUsers(@RequestParam String query) {
        List<UserDTO> users = friendshipService.searchUsers(query);
        return ResponseEntity.ok(users);
    }
}

