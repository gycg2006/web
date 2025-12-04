package com.unifor.libsocial.repository;

import com.unifor.libsocial.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, String> {
    Optional<Book> findByGoogleBooksId(String googleBooksId);
}

