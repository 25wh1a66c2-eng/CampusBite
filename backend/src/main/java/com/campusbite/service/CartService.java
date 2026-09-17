package com.campusbite.service;

import com.campusbite.dto.CartItemRequest;
import com.campusbite.dto.CartResponse;
import com.campusbite.entity.Cart;
import com.campusbite.entity.CartItem;
import com.campusbite.entity.Product;
import com.campusbite.entity.User;
import com.campusbite.exception.InsufficientStockException;
import com.campusbite.exception.ResourceNotFoundException;
import com.campusbite.repository.CartItemRepository;
import com.campusbite.repository.CartRepository;
import com.campusbite.repository.ProductRepository;
import com.campusbite.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository,
                       ProductRepository productRepository, UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Cart getOrCreateCart(Long userId) {
        if (userId != null) {
            Optional<Cart> existingCart = cartRepository.findByUserId(userId);
            if (existingCart.isPresent()) {
                return existingCart.get();
            }
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                Cart newCart = new Cart(user);
                return cartRepository.save(newCart);
            }
        }
        // Fallback for guest or default demo cart
        return cartRepository.findAll().stream().findFirst().orElseGet(() -> {
            Cart fallback = new Cart();
            return cartRepository.save(fallback);
        });
    }

    @Transactional(readOnly = true)
    public CartResponse getCartResponse(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return mapToCartResponse(cart);
    }

    @Transactional
    public CartResponse addItemToCart(CartItemRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found with id: " + request.getProductId()));

        if (!product.getAvailable() || product.getStock() <= 0) {
            throw new InsufficientStockException("'" + product.getName() + "' is currently sold out or unavailable.");
        }

        Cart cart = getOrCreateCart(request.getUserId());
        Optional<CartItem> existingItemOpt = cartItemRepository.findByCartAndProduct(cart, product);

        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            int newQuantity = existingItem.getQuantity() + request.getQuantity();
            if (newQuantity > product.getStock()) {
                throw new InsufficientStockException("Only " + product.getStock() + " portions of '" + product.getName() + "' are available in stock.");
            }
            existingItem.setQuantity(newQuantity);
            cartItemRepository.save(existingItem);
        } else {
            if (request.getQuantity() > product.getStock()) {
                throw new InsufficientStockException("Cannot add " + request.getQuantity() + " portions. Only " + product.getStock() + " available.");
            }
            CartItem newItem = new CartItem(cart, product, request.getQuantity());
            cart.getItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
        return mapToCartResponse(cart);
    }

    @Transactional
    public CartResponse updateItemQuantity(Long itemId, int quantity, Long userId) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + itemId));

        Product product = item.getProduct();
        if (quantity <= 0) {
            cartItemRepository.delete(item);
        } else {
            if (quantity > product.getStock()) {
                throw new InsufficientStockException("Only " + product.getStock() + " items of '" + product.getName() + "' currently in stock.");
            }
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        Cart cart = getOrCreateCart(userId);
        cart.setUpdatedAt(LocalDateTime.now());
        return mapToCartResponse(cart);
    }

    @Transactional
    public CartResponse removeItem(Long itemId, Long userId) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + itemId));
        cartItemRepository.delete(item);
        Cart cart = getOrCreateCart(userId);
        return mapToCartResponse(cart);
    }

    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private CartResponse mapToCartResponse(Cart cart) {
        CartResponse response = new CartResponse();
        response.setId(cart.getId());
        response.setUserId(cart.getUser() != null ? cart.getUser().getId() : null);

        BigDecimal subtotal = BigDecimal.ZERO;
        int totalItems = 0;

        for (CartItem item : cart.getItems()) {
            CartResponse.CartItemDto dto = new CartResponse.CartItemDto();
            dto.setId(item.getId());
            dto.setProductId(item.getProduct().getId());
            dto.setName(item.getProduct().getName());
            dto.setCategory(item.getProduct().getCategory());
            dto.setFoodType(item.getProduct().getFoodType());
            dto.setImageUrl(item.getProduct().getImageUrl());
            dto.setRestaurantName(item.getProduct().getRestaurantName());
            dto.setPrice(item.getProduct().getPrice());
            dto.setQuantity(item.getQuantity());
            dto.setAvailableStock(item.getProduct().getStock());
            dto.setSubtotal(item.getSubtotal());

            subtotal = subtotal.add(item.getSubtotal());
            totalItems += item.getQuantity();

            response.getItems().add(dto);
        }

        response.setSubtotal(subtotal);
        response.setGrandTotal(subtotal);
        response.setTotalItems(totalItems);

        return response;
    }
}
