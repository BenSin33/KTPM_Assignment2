package com.flogin.backend.UnitProductTest;

import org.junit.jupiter.api.DisplayName;
import com.flogin.entity.Product;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class ProductTest {

    @Test
    @DisplayName("Entity: Test Getters and Setters")
    void testGettersAndSetters() {
        Product product = new Product();

        product.setId(1);
        product.setName("Test Product");
        product.setPrice(100.0);
        product.setCategory("Electronics");
        product.setDescription("Desc");
        product.setBrand("BrandX");
        product.setImg("img.png");
        product.setQuantity(10);
        product.setCreate_at(LocalDate.of(2025, 11, 27));

        assertEquals(1, product.getId());
        assertEquals("Test Product", product.getName());
        assertEquals(100.0, product.getPrice());
        assertEquals("Electronics", product.getCategory());
        assertEquals("Desc", product.getDescription());
        assertEquals("BrandX", product.getBrand());
        assertEquals("img.png", product.getImg());
        assertEquals(10, product.getQuantity());
        assertEquals(LocalDate.of(2025, 11, 27), product.getCreate_at());
    }

    @Test
    @DisplayName("Entity: Test Constructor with args")
    void testConstructorWithArgs() {
        Product product = new Product("Name", 50.0, "Category", "Desc", "BrandY", "img.jpg", 5);

        assertNotNull(product);
        assertEquals("Name", product.getName());
        assertEquals(50.0, product.getPrice());
        assertEquals("Category", product.getCategory());
        assertEquals("Desc", product.getDescription());
        assertEquals("BrandY", product.getBrand());
        assertEquals("img.jpg", product.getImg());
        assertEquals(5, product.getQuantity());
    }
}