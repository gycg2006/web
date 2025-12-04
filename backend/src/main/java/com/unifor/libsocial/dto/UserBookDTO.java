package com.unifor.libsocial.dto;

import com.unifor.libsocial.model.UserBook;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserBookDTO {
    private Long id;
    private BookDTO book;
    private UserBook.ReadingStatus status;
    private LocalDateTime addedAt;
    private LocalDateTime startedAt;
    private LocalDateTime finishedAt;
    private Integer rating;
    private String review;
}

