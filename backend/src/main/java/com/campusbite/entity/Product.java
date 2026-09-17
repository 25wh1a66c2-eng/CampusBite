package com.campusbite.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private String category; // Breakfast, Meals, Snacks, Beverages, Desserts, Fast Food, Healthy Food, Combos, Other

    @Column(nullable = false)
    private String foodType; // Vegetarian, Non-Vegetarian, Vegan

    @Column(length = 1000)
    private String imageUrl;

    @Column(nullable = false)
    private String restaurantName; // e.g., "Campus Food Court", "South Canteen", "Night Cafe"

    @Column(nullable = false)
    private Integer stock = 0;

    @Column(nullable = false)
    private Boolean available = true;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Product() {}

    public Product(String name, String description, BigDecimal price, String category, String foodType, String imageUrl, String restaurantName, Integer stock, Boolean available) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.foodType = foodType;
        this.imageUrl = imageUrl;
        this.restaurantName = restaurantName;
        this.stock = stock;
        this.available = (available != null) ? available : (stock > 0);
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getFoodType() {
        return foodType;
    }

    public void setFoodType(String foodType) {
        this.foodType = foodType;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getRestaurantName() {
        return restaurantName;
    }

    public void setRestaurantName(String restaurantName) {
        this.restaurantName = restaurantName;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
        this.available = (stock != null && stock > 0);
    }

    public Boolean getAvailable() {
        return available && (stock != null && stock > 0);
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
