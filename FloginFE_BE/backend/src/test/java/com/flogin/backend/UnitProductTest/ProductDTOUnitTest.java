package com.flogin.backend.UnitProductTest;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import com.flogin.dto.ProductDTO;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class ProductDTOTest {

    @Test
    @DisplayName("DTO: Test Getters and Setters")
    void testGettersAndSetters() {
        ProductDTO dto = new ProductDTO();

        dto.setId(1);  // int, không phải long
        dto.setName("DTO Name");
        dto.setDescription("DTO Desc");
        dto.setPrice(200.0);
        dto.setQuantity(20);  // dùng quantity thay vì stockQuantity
        dto.setCategory("Electronics");
        dto.setBrand("BrandX");
        dto.setImg("img.png");
        dto.setCreate_at(LocalDate.of(2025, 11, 28));

        assertEquals(1, dto.getId());
        assertEquals("DTO Name", dto.getName());
        assertEquals("DTO Desc", dto.getDescription());
        assertEquals(200.0, dto.getPrice());
        assertEquals(20, dto.getQuantity());
        assertEquals("Electronics", dto.getCategory());
        assertEquals("BrandX", dto.getBrand());
        assertEquals("img.png", dto.getImg());
        assertEquals(LocalDate.of(2025, 11, 28), dto.getCreate_at());
    }

    @Test
    @DisplayName("DTO: Test Constructor")
    void testConstructor() {
        ProductDTO dto = new ProductDTO(
                1, "Name", 10.0,
                "Category", "Desc",
                "BrandY", "img.jpg",
                5, LocalDate.now()
        );

        assertEquals(1, dto.getId());
        assertEquals("Name", dto.getName());
        assertEquals(10.0, dto.getPrice());
        assertEquals("Category", dto.getCategory());
        assertEquals("Desc", dto.getDescription());
        assertEquals("BrandY", dto.getBrand());
        assertEquals("img.jpg", dto.getImg());
        assertEquals(5, dto.getQuantity());
        assertNotNull(dto.getCreate_at());
    }
}