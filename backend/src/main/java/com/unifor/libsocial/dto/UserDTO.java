package com.unifor.libsocial.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String matricula;
    private String nome;
    private String bio;
    private String fotoPerfil;
    private LocalDateTime createdAt;
}

