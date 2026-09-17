package com.campusbite.service;

import com.campusbite.dto.ProductRequest;
import com.campusbite.entity.Product;
import com.campusbite.exception.ResourceNotFoundException;
import com.campusbite.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts(String search, String category, String foodType) {
        String cleanSearch = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        String cleanCategory = (category != null && !category.trim().equalsIgnoreCase("all") && !category.trim().isEmpty()) ? category.trim() : null;
        String cleanFoodType = (foodType != null && !foodType.trim().equalsIgnoreCase("all") && !foodType.trim().isEmpty()) ? foodType.trim() : null;

        if (cleanSearch != null || cleanCategory != null || cleanFoodType != null) {
            return productRepository.searchProducts(cleanSearch, cleanCategory, cleanFoodType);
        }
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found with id: " + id));
    }

    @Transactional
    public Product createProduct(ProductRequest request) {
        String defaultImage = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";
        String imageUrl = (request.getImageUrl() != null && !request.getImageUrl().trim().isEmpty()) 
                          ? request.getImageUrl().trim() 
                          : defaultImage;

        Product product = new Product(
                request.getName().trim(),
                request.getDescription(),
                request.getPrice(),
                request.getCategory().trim(),
                request.getFoodType().trim(),
                imageUrl,
                request.getRestaurantName().trim(),
                request.getStock(),
                request.getAvailable()
        );

        return productRepository.save(product);
    }

    @Transactional
    public Product updateStock(Long id, int quantityToReduce) {
        Product product = getProductById(id);
        int currentStock = product.getStock() != null ? product.getStock() : 0;
        int newStock = Math.max(0, currentStock - quantityToReduce);
        product.setStock(newStock);
        return productRepository.save(product);
    }
}
