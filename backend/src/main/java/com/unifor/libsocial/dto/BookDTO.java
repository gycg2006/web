package com.unifor.libsocial.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookDTO {
    private String googleBooksId;
    private String title;
    private List<String> authors;
    private String publisher;
    private String publishedDate;
    private String description;
    private Integer pageCount;
    private List<String> categories;
    private Double averageRating;
    private Integer ratingsCount;
    private String thumbnailUrl;
    private String smallThumbnailUrl;
    private String previewLink;
    private String infoLink;
}

