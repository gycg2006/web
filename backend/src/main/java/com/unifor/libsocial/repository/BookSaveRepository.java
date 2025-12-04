package com.unifor.libsocial.repository;

import com.unifor.libsocial.model.BookSave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookSaveRepository extends JpaRepository<BookSave, Long> {
    
    @Query("SELECT bs FROM BookSave bs WHERE bs.user.id = :userId AND bs.book.googleBooksId = :bookId")
    Optional<BookSave> findByUserIdAndBookId(@Param("userId") Long userId, @Param("bookId") String bookId);
    
    @Query("SELECT COUNT(bs) > 0 FROM BookSave bs WHERE bs.user.id = :userId AND bs.book.googleBooksId = :bookId")
    boolean existsByUserIdAndBookId(@Param("userId") Long userId, @Param("bookId") String bookId);
    
    @Modifying
    @Query("DELETE FROM BookSave bs WHERE bs.user.id = :userId AND bs.book.googleBooksId = :bookId")
    void deleteByUserIdAndBookId(@Param("userId") Long userId, @Param("bookId") String bookId);
}

