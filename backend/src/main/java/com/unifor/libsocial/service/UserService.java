package com.unifor.libsocial.service;

import com.unifor.libsocial.dto.LoginRequest;
import com.unifor.libsocial.dto.UserDTO;
import com.unifor.libsocial.mapper.ModelMapper;
import com.unifor.libsocial.model.User;
import com.unifor.libsocial.repository.UserRepository;
import com.unifor.libsocial.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ModelMapper modelMapper;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    public Map<String, Object> login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByMatricula(request.getMatricula());
        
        // Por segurança, não revelamos se o usuário existe ou não
        // Sempre retornamos a mesma mensagem genérica
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Matrícula ou senha incorretos");
        }
        
        User user = userOpt.get();
        if (!passwordEncoder.matches(request.getSenha(), user.getSenha())) {
            throw new RuntimeException("Matrícula ou senha incorretos");
        }
        
        // Gerar token JWT
        String token = jwtUtil.generateToken(user.getMatricula(), user.getId());
        
        // Retornar usuário e token
        Map<String, Object> response = new HashMap<>();
        response.put("user", modelMapper.toUserDTO(user));
        response.put("token", token);
        
        return response;
    }
    
    public Map<String, Object> createUser(LoginRequest request) {
        if (userRepository.existsByMatricula(request.getMatricula())) {
            throw new RuntimeException("Matrícula já cadastrada");
        }
        
        User user = new User();
        user.setMatricula(request.getMatricula());
        // Hash da senha com BCrypt
        user.setSenha(passwordEncoder.encode(request.getSenha()));
        user.setNome("Usuário " + request.getMatricula());
        
        User savedUser = userRepository.save(user);
        
        // Gerar token JWT
        String token = jwtUtil.generateToken(savedUser.getMatricula(), savedUser.getId());
        
        // Retornar usuário e token
        Map<String, Object> response = new HashMap<>();
        response.put("user", modelMapper.toUserDTO(savedUser));
        response.put("token", token);
        
        return response;
    }
    
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return modelMapper.toUserDTO(user);
    }
    
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        if (userDTO.getNome() != null) user.setNome(userDTO.getNome());
        if (userDTO.getBio() != null) user.setBio(userDTO.getBio());
        if (userDTO.getFotoPerfil() != null) user.setFotoPerfil(userDTO.getFotoPerfil());
        
        User updatedUser = userRepository.save(user);
        return modelMapper.toUserDTO(updatedUser);
    }
    
    public User getUserEntity(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }
}

