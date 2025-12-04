package com.unifor.libsocial.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePostRequest {
    @NotBlank(message = "Conteúdo do post é obrigatório")
    private String content;
    
    private String bookId; // Opcional
    
    private String imageUrl; // Opcional
}

