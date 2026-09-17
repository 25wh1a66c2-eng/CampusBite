package com.campusbite.service;

import com.campusbite.dto.AuthRequest;
import com.campusbite.dto.AuthResponse;
import com.campusbite.entity.Cart;
import com.campusbite.entity.User;
import com.campusbite.repository.CartRepository;
import com.campusbite.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;

    public AuthService(UserRepository userRepository, CartRepository cartRepository) {
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
    }

    @Transactional
    public AuthResponse register(AuthRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new IllegalArgumentException("An account with email " + request.getEmail() + " already exists.");
        }

        String hashedPassword = hashPassword(request.getPassword());
        String name = (request.getName() != null && !request.getName().trim().isEmpty()) 
                      ? request.getName().trim() 
                      : request.getEmail().split("@")[0];

        User user = new User(name, request.getEmail().trim().toLowerCase(), hashedPassword);
        user.setRole("STUDENT");
        User savedUser = userRepository.save(user);

        // Initialize empty cart for user
        Cart cart = new Cart(savedUser);
        cartRepository.save(cart);

        String token = generateSimpleToken(savedUser);
        return new AuthResponse(savedUser.getId(), savedUser.getName(), savedUser.getEmail(), savedUser.getRole(), token, "Registration successful!");
    }

    public AuthResponse login(AuthRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        String hashedInput = hashPassword(request.getPassword());
        if (!user.getPassword().equals(hashedInput) && !user.getPassword().equals(request.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        String token = generateSimpleToken(user);
        return new AuthResponse(user.getId(), user.getName(), user.getEmail(), user.getRole(), token, "Login successful!");
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
    }

    private String hashPassword(String rawPassword) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawPassword.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            return rawPassword;
        }
    }

    private String generateSimpleToken(User user) {
        String tokenPayload = user.getId() + ":" + user.getEmail() + ":" + UUID.randomUUID();
        return Base64.getEncoder().encodeToString(tokenPayload.getBytes(StandardCharsets.UTF_8));
    }
}
