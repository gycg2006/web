package com.unifor.libsocial.repository;

import com.unifor.libsocial.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    
    Page<Post> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    
    @Query("SELECT p FROM Post p WHERE p.user.id IN :userIds ORDER BY p.createdAt DESC")
    Page<Post> findByUserIdsOrderByCreatedAtDesc(@Param("userIds") List<Long> userIds, Pageable pageable);
    
    @Query("SELECT p FROM Post p WHERE p.book.googleBooksId = :bookId ORDER BY p.createdAt DESC")
    Page<Post> findByBookIdOrderByCreatedAtDesc(@Param("bookId") String bookId, Pageable pageable);
    
    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);
}

