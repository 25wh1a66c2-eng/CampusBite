package com.campusbite.controller;

import com.campusbite.dto.CartItemRequest;
import com.campusbite.dto.CartResponse;
import com.campusbite.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart(@RequestParam(required = false) Long userId) {
        CartResponse cart = cartService.getCartResponse(userId);
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItemToCart(@Valid @RequestBody CartItemRequest request) {
        CartResponse updatedCart = cartService.addItemToCart(request);
        return ResponseEntity.ok(updatedCart);
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<CartResponse> updateItemQuantity(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> body,
            @RequestParam(required = false) Long userId) {
        Integer quantity = body.getOrDefault("quantity", 1);
        CartResponse updatedCart = cartService.updateItemQuantity(id, quantity, userId);
        return ResponseEntity.ok(updatedCart);
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<CartResponse> removeItem(
            @PathVariable Long id,
            @RequestParam(required = false) Long userId) {
        CartResponse updatedCart = cartService.removeItem(id, userId);
        return ResponseEntity.ok(updatedCart);
    }

    @DeleteMapping
    public ResponseEntity<Map<String, String>> clearCart(@RequestParam(required = false) Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok(Map.of("message", "Cart cleared successfully"));
    }
}
