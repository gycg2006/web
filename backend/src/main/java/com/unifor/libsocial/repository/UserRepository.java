package com.unifor.libsocial.repository;

import com.unifor.libsocial.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByMatricula(String matricula);
    boolean existsByMatricula(String matricula);
}

