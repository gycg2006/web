package com.unifor.libsocial.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "books")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Book {
    
    @Id
    @Column(name = "google_books_id", nullable = false, unique = true)
    private String googleBooksId;
    
    @Column(nullable = false, length = 500)
    private String title;
    
    @Column(length = 1000)
    private String authors; // Armazenado como string separada por vírgulas
    
    @Column(length = 200)
    private String publisher;
    
    @Column(name = "published_date", length = 50)
    private String publishedDate;
    
    @Column(length = 5000)
    private String description;
    
    @Column(name = "page_count")
    private Integer pageCount;
    
    @Column(length = 500)
    private String categories; // Armazenado como string separada por vírgulas
    
    @Column(name = "average_rating")
    private Double averageRating;
    
    @Column(name = "ratings_count")
    private Integer ratingsCount;
    
    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;
    
    @Column(name = "small_thumbnail_url", length = 500)
    private String smallThumbnailUrl;
    
    @Column(name = "preview_link", length = 500)
    private String previewLink;
    
    @Column(name = "info_link", length = 500)
    private String infoLink;
    
    // Relacionamentos
    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserBook> userBooks = new ArrayList<>();
    
    @ManyToMany(mappedBy = "books")
    private List<BookList> bookLists = new ArrayList<>();
}

