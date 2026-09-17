package com.campusbite.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class OrderRequest {

    private Long userId;

    @NotBlank(message = "Pickup location is required")
    private String pickupLocation; // CSE Department, Library, Main Gate, Hostel, Student Activity Centre

    @NotBlank(message = "Payment method is required")
    private String paymentMethod; // Cash on Pickup, Demo Payment, Stripe / Card

    private String stripePaymentIntentId;

    // Optional direct items if order is created directly
    private List<OrderItemInput> items;

    public static class OrderItemInput {
        private Long productId;
        private Integer quantity;

        public OrderItemInput() {}
        public OrderItemInput(Long productId, Integer quantity) {
            this.productId = productId;
            this.quantity = quantity;
        }
        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }

    public OrderRequest() {}

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getPickupLocation() {
        return pickupLocation;
    }

    public void setPickupLocation(String pickupLocation) {
        this.pickupLocation = pickupLocation;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getStripePaymentIntentId() {
        return stripePaymentIntentId;
    }

    public void setStripePaymentIntentId(String stripePaymentIntentId) {
        this.stripePaymentIntentId = stripePaymentIntentId;
    }

    public List<OrderItemInput> getItems() {
        return items;
    }

    public void setItems(List<OrderItemInput> items) {
        this.items = items;
    }
}
