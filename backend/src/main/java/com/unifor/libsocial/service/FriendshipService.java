package com.unifor.libsocial.service;

import com.unifor.libsocial.dto.UserDTO;
import com.unifor.libsocial.mapper.ModelMapper;
import com.unifor.libsocial.model.Friendship;
import com.unifor.libsocial.model.User;
import com.unifor.libsocial.repository.FriendshipRepository;
import com.unifor.libsocial.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class FriendshipService {
    
    @Autowired
    private FriendshipRepository friendshipRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ModelMapper modelMapper;
    
    public void sendFriendRequest(Long userId, Long friendId) {
        if (userId.equals(friendId)) {
            throw new RuntimeException("Não é possível adicionar a si mesmo como amigo");
        }
        
        User user1 = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        User user2 = userRepository.findById(friendId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        // Verificar se já existe amizade
        Optional<Friendship> existing1 = friendshipRepository.findByUser1AndUser2(user1, user2);
        Optional<Friendship> existing2 = friendshipRepository.findByUser2AndUser1(user1, user2);
        
        if (existing1.isPresent() || existing2.isPresent()) {
            throw new RuntimeException("Amizade já existe ou solicitação já foi enviada");
        }
        
        Friendship friendship = new Friendship();
        friendship.setUser1(user1);
        friendship.setUser2(user2);
        friendship.setStatus(Friendship.FriendshipStatus.PENDING);
        friendshipRepository.save(friendship);
    }
    
    public void acceptFriendRequest(Long userId, Long friendId) {
        User user1 = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        User user2 = userRepository.findById(friendId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        Optional<Friendship> friendship = friendshipRepository.findByUser1AndUser2(user2, user1);
        if (friendship.isEmpty()) {
            friendship = friendshipRepository.findByUser2AndUser1(user2, user1);
        }
        
        if (friendship.isEmpty() || friendship.get().getStatus() != Friendship.FriendshipStatus.PENDING) {
            throw new RuntimeException("Solicitação de amizade não encontrada");
        }
        
        friendship.get().setStatus(Friendship.FriendshipStatus.ACCEPTED);
        friendshipRepository.save(friendship.get());
    }
    
    public void removeFriend(Long userId, Long friendId) {
        User user1 = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        User user2 = userRepository.findById(friendId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        Optional<Friendship> friendship = friendshipRepository.findByUser1AndUser2(user1, user2);
        if (friendship.isEmpty()) {
            friendship = friendshipRepository.findByUser2AndUser1(user1, user2);
        }
        
        if (friendship.isPresent()) {
            friendshipRepository.delete(friendship.get());
        }
    }
    
    public List<UserDTO> getFriends(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        List<Friendship> friendships = friendshipRepository.findByUser1OrUser2(user, user);
        
        return friendships.stream()
            .filter(f -> f.getStatus() == Friendship.FriendshipStatus.ACCEPTED)
            .map(f -> {
                User friend = f.getUser1().getId().equals(userId) ? f.getUser2() : f.getUser1();
                return modelMapper.toUserDTO(friend);
            })
            .collect(Collectors.toList());
    }
    
    public List<UserDTO> getPendingRequests(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        List<Friendship> pending = friendshipRepository.findByUser2AndStatus(user, Friendship.FriendshipStatus.PENDING);
        
        return pending.stream()
            .map(f -> modelMapper.toUserDTO(f.getUser1()))
            .collect(Collectors.toList());
    }
    
    public List<UserDTO> searchUsers(String query) {
        List<User> users = userRepository.findByMatriculaContainingOrNomeContaining(query, query);
        return users.stream()
            .map(modelMapper::toUserDTO)
            .collect(Collectors.toList());
    }
}

