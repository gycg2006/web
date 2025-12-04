package com.unifor.libsocial.repository;

import com.unifor.libsocial.model.BookLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookLikeRepository extends JpaRepository<BookLike, Long> {
    
    @Query("SELECT bl FROM BookLike bl WHERE bl.user.id = :userId AND bl.book.googleBooksId = :bookId")
    Optional<BookLike> findByUserIdAndBookId(@Param("userId") Long userId, @Param("bookId") String bookId);
    
    @Query("SELECT COUNT(bl) > 0 FROM BookLike bl WHERE bl.user.id = :userId AND bl.book.googleBooksId = :bookId")
    boolean existsByUserIdAndBookId(@Param("userId") Long userId, @Param("bookId") String bookId);
    
    @Modifying
    @Query("DELETE FROM BookLike bl WHERE bl.user.id = :userId AND bl.book.googleBooksId = :bookId")
    void deleteByUserIdAndBookId(@Param("userId") Long userId, @Param("bookId") String bookId);
    
    @Query("SELECT COUNT(bl) FROM BookLike bl WHERE bl.book.googleBooksId = :bookId")
    long countByBookId(@Param("bookId") String bookId);
}

