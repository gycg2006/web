package com.unifor.libsocial.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @NotBlank(message = "Matrícula é obrigatória")
    @Pattern(regexp = "\\d{7}", message = "Matrícula deve ter exatamente 7 dígitos")
    private String matricula;
    
    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 8, max = 8, message = "Senha deve ter exatamente 8 caracteres")
    private String senha;
}

