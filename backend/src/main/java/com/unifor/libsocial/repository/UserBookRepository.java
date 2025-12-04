package com.unifor.libsocial.repository;

import com.unifor.libsocial.model.User;
import com.unifor.libsocial.model.UserBook;
import com.unifor.libsocial.model.UserBook.ReadingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserBookRepository extends JpaRepository<UserBook, Long> {
    List<UserBook> findByUserAndStatus(User user, ReadingStatus status);
    List<UserBook> findByUser(User user);
    Optional<UserBook> findByUserAndBook_GoogleBooksId(User user, String googleBooksId);
    boolean existsByUserAndBook_GoogleBooksId(User user, String googleBooksId);
}

