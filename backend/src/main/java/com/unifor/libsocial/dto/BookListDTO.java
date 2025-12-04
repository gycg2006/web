package com.unifor.libsocial.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookListDTO {
    private Long id;
    private String title;
    private String description;
    private String coverImage;
    private int bookCount;
    private List<BookDTO> books;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

