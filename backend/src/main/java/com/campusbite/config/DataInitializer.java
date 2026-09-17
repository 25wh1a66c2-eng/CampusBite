package com.campusbite.config;

import com.campusbite.entity.Product;
import com.campusbite.entity.User;
import com.campusbite.repository.ProductRepository;
import com.campusbite.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initDatabase(ProductRepository productRepository, UserRepository userRepository) {
        return args -> {
            // 1. Seed demo user if no users exist
            if (userRepository.count() == 0) {
                User demoStudent = new User("Rahul Sharma", "student@campus.edu", "password123");
                demoStudent.setRole("STUDENT");
                userRepository.save(demoStudent);

                User adminUser = new User("Canteen Manager", "admin@campusbite.com", "admin123");
                adminUser.setRole("ADMIN");
                userRepository.save(adminUser);

                System.out.println(">>> Demo users seeded successfully: student@campus.edu (pw: password123)");
            }

            // 2. Seed food items if none exist
            if (productRepository.count() == 0) {
                List<Product> demoProducts = Arrays.asList(
                    new Product(
                        "Crispy Masala Dosa",
                        "Golden crisp fermented crepe made from rice and lentils, stuffed with spiced potato mash, served with coconut chutney & piping hot sambar.",
                        new BigDecimal("70.00"),
                        "Breakfast",
                        "Vegetarian",
                        "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80",
                        "South Canteen",
                        25,
                        true
                    ),
                    new Product(
                        "Royal Dum Chicken Biryani",
                        "Fragrant basmati rice slow-cooked on dum with tender marinated chicken, saffron, ghee, and authentic whole spices. Accompanied by mirchi ka salan and raita.",
                        new BigDecimal("180.00"),
                        "Meals",
                        "Non-Vegetarian",
                        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
                        "Biryani Hub",
                        20,
                        true
                    ),
                    new Product(
                        "Hyderabadi Veg Biryani",
                        "Aromatic long-grain basmati rice layered with garden-fresh vegetables, paneer cubes, fried onions, mint, and saffron.",
                        new BigDecimal("130.00"),
                        "Meals",
                        "Vegetarian",
                        "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80",
                        "Campus Food Court",
                        30,
                        true
                    ),
                    new Product(
                        "Steamed Idli Sambar Platter",
                        "Four pillowy soft steamed rice cakes served with aromatic lentil vegetable sambar and fresh grated coconut chutney.",
                        new BigDecimal("50.00"),
                        "Breakfast",
                        "Vegan",
                        "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
                        "South Canteen",
                        35,
                        true
                    ),
                    new Product(
                        "Paneer Fried Rice & Manchurian Combo",
                        "Wok-tossed basmati rice with golden paneer cubes, bell peppers, scallions paired with flavorful vegetable Manchurian gravy.",
                        new BigDecimal("140.00"),
                        "Combos",
                        "Vegetarian",
                        "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
                        "Night Cafe",
                        18,
                        true
                    ),
                    new Product(
                        "Grilled Cheese & Veggie Sandwich",
                        "Toasted jumbo artisanal bread layered with cucumber, tomato, capsicum, mint chutney, and molten cheddar mozzarella cheese.",
                        new BigDecimal("65.00"),
                        "Snacks",
                        "Vegetarian",
                        "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
                        "Bistro 101",
                        22,
                        true
                    ),
                    new Product(
                        "Crispy Fried Chicken Burger",
                        "Crisp buttermilk fried chicken fillet topped with fresh crunchy iceberg lettuce, pickled gherkins, and creamy chipotle mayo in a brioche bun.",
                        new BigDecimal("120.00"),
                        "Fast Food",
                        "Non-Vegetarian",
                        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
                        "Burger Street",
                        15,
                        true
                    ),
                    new Product(
                        "Peri Peri Masala French Fries",
                        "Golden shoestring potatoes deep fried to perfection and tossed in tangy spicy African peri-peri seasoning. Served with garlic dip.",
                        new BigDecimal("75.00"),
                        "Fast Food",
                        "Vegan",
                        "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80",
                        "Fast Bites",
                        40,
                        true
                    ),
                    new Product(
                        "Punjabi Samosa Plate (2 Pcs)",
                        "Crispy triangular pastry crust filled with spiced potatoes, green peas, cumin, and coriander. Served with sweet tamarind and spicy green chutney.",
                        new BigDecimal("35.00"),
                        "Snacks",
                        "Vegan",
                        "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
                        "Central Canteen",
                        50,
                        true
                    ),
                    new Product(
                        "Thick Chilled Cold Coffee",
                        "Creamy blended brewed espresso with rich chilled milk, vanilla syrup, and a scoop of vanilla cream.",
                        new BigDecimal("60.00"),
                        "Beverages",
                        "Vegetarian",
                        "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80",
                        "Campus Brews",
                        30,
                        true
                    ),
                    new Product(
                        "Fresh Mint Lime Cooler",
                        "Invigorating freshly squeezed whole lemon with crushed garden mint leaves, rock salt, and sparkling soda.",
                        new BigDecimal("40.00"),
                        "Beverages",
                        "Vegan",
                        "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
                        "Juice Junction",
                        40,
                        true
                    ),
                    new Product(
                        "Belgian Dark Chocolate Cake Slice",
                        "Moist Dutch cocoa sponge layered with velvety Belgian dark chocolate ganache and chocolate shavings.",
                        new BigDecimal("90.00"),
                        "Desserts",
                        "Vegetarian",
                        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
                        "Sweet Treats Bakery",
                        12,
                        true
                    )
                );

                productRepository.saveAll(demoProducts);
                System.out.println(">>> 12 Demo food products loaded into MySQL database!");
            }
        };
    }
}
