package com.unifor.libsocial.repository;

import com.unifor.libsocial.model.BookList;
import com.unifor.libsocial.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookListRepository extends JpaRepository<BookList, Long> {
    List<BookList> findByUser(User user);
    List<BookList> findByUserOrderByCreatedAtDesc(User user);
}

