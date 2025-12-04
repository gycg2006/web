package com.unifor.libsocial.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false, length = 7)
    @NotBlank(message = "Matrícula é obrigatória")
    @Pattern(regexp = "\\d{7}", message = "Matrícula deve ter exatamente 7 dígitos")
    private String matricula;
    
    @Column(nullable = false, length = 255)
    @NotBlank(message = "Senha é obrigatória")
    private String senha; // Armazena o hash BCrypt (60 caracteres)
    
    @Column(length = 100)
    private String nome;
    
    @Column(length = 200)
    private String bio;
    
    @Column(name = "foto_perfil")
    private String fotoPerfil;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relacionamentos
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserBook> userBooks = new ArrayList<>();
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookList> bookLists = new ArrayList<>();
    
    @OneToMany(mappedBy = "user1", cascade = CascadeType.ALL)
    private List<Friendship> friendshipsAsUser1 = new ArrayList<>();
    
    @OneToMany(mappedBy = "user2", cascade = CascadeType.ALL)
    private List<Friendship> friendshipsAsUser2 = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

