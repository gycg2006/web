package com.unifor.libsocial.service;

import com.unifor.libsocial.dto.CreatePostRequest;
import com.unifor.libsocial.dto.PostDTO;
import com.unifor.libsocial.model.Book;
import com.unifor.libsocial.model.Post;
import com.unifor.libsocial.model.User;
import com.unifor.libsocial.repository.BookRepository;
import com.unifor.libsocial.repository.PostLikeRepository;
import com.unifor.libsocial.repository.PostRepository;
import com.unifor.libsocial.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional
public class PostService {
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BookRepository bookRepository;
    
    @Autowired
    private PostLikeRepository postLikeRepository;
    
    public PostDTO createPost(Long userId, CreatePostRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        Post post = new Post();
        post.setUser(user);
        post.setContent(request.getContent());
        post.setImageUrl(request.getImageUrl());
        
        if (request.getBookId() != null && !request.getBookId().isEmpty()) {
            Book book = bookRepository.findById(request.getBookId())
                .orElse(null);
            post.setBook(book);
        }
        
        post = postRepository.save(post);
        return convertToDTO(post, userId);
    }
    
    public Page<PostDTO> getFeed(Long userId, Pageable pageable) {
        // Verificar se usuário existe
        userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        // Por enquanto, retornar todos os posts ordenados por data
        // TODO: Filtrar apenas posts de amigos quando implementar
        Page<Post> posts = postRepository.findAllByOrderByCreatedAtDesc(pageable);
        
        return posts.map(post -> convertToDTO(post, userId));
    }
    
    public Page<PostDTO> getUserPosts(Long userId, Pageable pageable) {
        Page<Post> posts = postRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        return posts.map(post -> convertToDTO(post, userId));
    }
    
    public void likePost(Long userId, Long postId) {
        if (postLikeRepository.existsByUserIdAndPostId(userId, postId)) {
            throw new RuntimeException("Post já foi curtido");
        }
        
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post não encontrado"));
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        com.unifor.libsocial.model.PostLike like = new com.unifor.libsocial.model.PostLike();
        like.setUser(user);
        like.setPost(post);
        postLikeRepository.save(like);
    }
    
    public void unlikePost(Long userId, Long postId) {
        postLikeRepository.deleteByUserIdAndPostId(userId, postId);
    }
    
    private PostDTO convertToDTO(Post post, Long currentUserId) {
        PostDTO dto = new PostDTO();
        dto.setId(post.getId());
        dto.setUserId(post.getUser().getId());
        dto.setUserName(post.getUser().getNome());
        dto.setUserAvatar(post.getUser().getFotoPerfil());
        dto.setContent(post.getContent());
        dto.setImageUrl(post.getImageUrl());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        dto.setLikeCount(post.getLikeCount());
        dto.setLiked(postLikeRepository.existsByUserIdAndPostId(currentUserId, post.getId()));
        
        if (post.getBook() != null) {
            dto.setBookId(post.getBook().getGoogleBooksId());
            dto.setBookTitle(post.getBook().getTitle());
            dto.setBookCover(post.getBook().getThumbnailUrl());
        }
        
        return dto;
    }
}

