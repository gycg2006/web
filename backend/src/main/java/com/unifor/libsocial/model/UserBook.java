package com.unifor.libsocial.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_books", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "book_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserBook {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ReadingStatus status;
    
    @Column(name = "added_at")
    private LocalDateTime addedAt;
    
    @Column(name = "started_at")
    private LocalDateTime startedAt;
    
    @Column(name = "finished_at")
    private LocalDateTime finishedAt;
    
    @Column(name = "rating")
    private Integer rating; // 1 a 5
    
    @Column(name = "review", length = 2000)
    private String review;
    
    @PrePersist
    protected void onCreate() {
        addedAt = LocalDateTime.now();
        if (status == ReadingStatus.LENDO && startedAt == null) {
            startedAt = LocalDateTime.now();
        }
    }
    
    public enum ReadingStatus {
        QUERO_LER,
        LENDO,
        LIDO
    }
}

