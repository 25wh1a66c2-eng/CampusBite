package com.campusbite.service;

import com.campusbite.dto.OrderRequest;
import com.campusbite.dto.OrderResponse;
import com.campusbite.entity.*;
import com.campusbite.exception.InsufficientStockException;
import com.campusbite.exception.ResourceNotFoundException;
import com.campusbite.repository.OrderRepository;
import com.campusbite.repository.ProductRepository;
import com.campusbite.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CartService cartService;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository,
                        UserRepository userRepository, CartService cartService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.cartService = cartService;
    }

    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        User user = null;
        if (request.getUserId() != null) {
            user = userRepository.findById(request.getUserId()).orElse(null);
        }
        if (user == null) {
            // Find default user or create guest student
            user = userRepository.findByEmail("student@campus.edu").orElseGet(() -> {
                User guest = new User("Campus Student", "student@campus.edu", "password123");
                return userRepository.save(guest);
            });
        }

        Cart cart = cartService.getOrCreateCart(user.getId());
        List<CartItem> cartItems = cart.getItems();

        if (cartItems.isEmpty() && (request.getItems() == null || request.getItems().isEmpty())) {
            throw new IllegalArgumentException("Cannot place an order with an empty cart.");
        }

        // Validate stock before proceeding
        List<OrderItem> itemsToSave = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;
        boolean hasVegOrVegan = false;
        int totalQuantity = 0;

        Order order = new Order();
        order.setUser(user);
        order.setPickupLocation(request.getPickupLocation());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setOrderStatus("PLACED");
        order.setEstimatedTime("12-18 mins");
        order.setCreatedAt(LocalDateTime.now());

        if (!cartItems.isEmpty()) {
            for (CartItem cartItem : cartItems) {
                Product product = cartItem.getProduct();
                int qty = cartItem.getQuantity();

                if (product.getStock() < qty) {
                    throw new InsufficientStockException("Insufficient stock for '" + product.getName() + "'. Available: " + product.getStock());
                }

                // Reduce stock
                product.setStock(product.getStock() - qty);
                productRepository.save(product);

                OrderItem orderItem = new OrderItem(order, product, qty, product.getPrice());
                itemsToSave.add(orderItem);

                totalAmount = totalAmount.add(orderItem.getSubtotal());
                totalQuantity += qty;

                if ("Vegetarian".equalsIgnoreCase(product.getFoodType()) || "Vegan".equalsIgnoreCase(product.getFoodType())) {
                    hasVegOrVegan = true;
                }
            }
        }

        // EcoScore calculation
        StringBuilder ecoMessage = new StringBuilder();
        if (hasVegOrVegan) {
            ecoMessage.append("🌱 Great choice! You made a more sustainable food choice. ");
        }
        if (totalQuantity > 1 || itemsToSave.size() > 1) {
            ecoMessage.append("♻️ Smart ordering! Combining items into one pickup helps reduce unnecessary trips.");
        }
        order.setEcoMessage(ecoMessage.toString().trim());

        order.setTotalAmount(totalAmount);
        order.setOrderItems(itemsToSave);

        Order savedOrder = orderRepository.save(order);

        // Clear cart after placing order
        cartService.clearCart(user.getId());

        return mapToOrderResponse(savedOrder);
    }

    public List<OrderResponse> getOrdersForUser(Long userId) {
        List<Order> orders;
        if (userId != null) {
            orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        } else {
            orders = orderRepository.findAllByOrderByCreatedAtDesc();
        }
        return orders.stream().map(this::mapToOrderResponse).collect(Collectors.toList());
    }

    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        return mapToOrderResponse(order);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        order.setOrderStatus(newStatus);
        Order updated = orderRepository.save(order);
        return mapToOrderResponse(updated);
    }

    private OrderResponse mapToOrderResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setUserId(order.getUser() != null ? order.getUser().getId() : null);
        response.setUserName(order.getUser() != null ? order.getUser().getName() : "Campus Student");
        response.setTotalAmount(order.getTotalAmount());
        response.setPickupLocation(order.getPickupLocation());
        response.setPaymentMethod(order.getPaymentMethod());
        response.setOrderStatus(order.getOrderStatus());
        response.setEcoMessage(order.getEcoMessage());
        response.setEstimatedTime(order.getEstimatedTime());
        response.setCreatedAt(order.getCreatedAt());

        if (order.getOrderItems() != null) {
            for (OrderItem item : order.getOrderItems()) {
                OrderResponse.OrderItemDto itemDto = new OrderResponse.OrderItemDto(
                        item.getId(),
                        item.getProduct() != null ? item.getProduct().getId() : null,
                        item.getProductName(),
                        item.getQuantity(),
                        item.getPrice(),
                        item.getSubtotal()
                );
                response.getItems().add(itemDto);
            }
        }
        return response;
    }
}
