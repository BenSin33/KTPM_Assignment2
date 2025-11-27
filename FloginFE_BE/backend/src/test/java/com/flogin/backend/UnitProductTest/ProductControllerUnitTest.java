package com.flogin.backend.UnitProductTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.controller.ProductController;
import com.flogin.entity.Product;
import com.flogin.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @Autowired
    private ObjectMapper objectMapper;

    private Product product;

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setId(1);
        product.setName("Laptop Gaming");
        product.setPrice(1500.0);
        product.setCategory("Electronics");
        product.setDescription("High performance laptop");
        product.setBrand("Dell");
        product.setImg("image.jpg");
        product.setQuantity(10);
        product.setCreate_at(LocalDate.now());
    }

    // --- TC_001: Get All ---
    @Test
    @DisplayName("API: Get All Products - Success (200 OK)")
    void testGetAll() throws Exception {
        when(productService.getAllProducts()).thenReturn(List.of(product));

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name", is("Laptop Gaming")));
    }

    // --- TC_002: Get By ID (Success) ---
    @Test
    @DisplayName("API: Get By ID - Found (200 OK)")
    void testGetById() throws Exception {
        when(productService.getProductById(1)).thenReturn(product);

        mockMvc.perform(get("/api/products/{id}", 1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Laptop Gaming")));
    }

    // --- TC_002: Get By ID (Not Found) ---
    @Test
    @DisplayName("API: Get By ID - Not Found (Exception Check)")
    void testGetById_NotFound() {
        // Mock Service ném lỗi
        when(productService.getProductById(99)).thenThrow(new IllegalStateException("Sản phẩm không tồn tại với id: 99"));

        // Controller không bắt lỗi -> MockMvc sẽ ném Exception ra ngoài -> Ta phải dùng assertThrows bắt lại
        Exception exception = org.junit.jupiter.api.Assertions.assertThrows(Exception.class, () -> {
            mockMvc.perform(get("/api/products/{id}", 99));
        });

        // Kiểm tra nguyên nhân gốc rễ (Cause)
        Throwable cause = exception.getCause();
        assertTrue(cause instanceof IllegalStateException);
        assertEquals("Sản phẩm không tồn tại với id: 99", cause.getMessage());
    }

    // --- TC_003: Create (Success) ---
    @Test
    @DisplayName("API: Create Product - Success (201 Created)")
    void testCreate_Success() throws Exception {
        when(productService.createProduct(any(Product.class))).thenReturn(product);

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(product)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name", is("Laptop Gaming")));
    }

    // --- TC_004: Create (Fail - Validate) ---
    @Test
    @DisplayName("API: Create Product - Fail (Exception Check)")
    void testCreate_Fail() {
        // Mock Service ném lỗi
        when(productService.createProduct(any(Product.class)))
                .thenThrow(new IllegalArgumentException("Tên sản phẩm không được để trống."));

        // Dùng assertThrows để bắt lỗi
        Exception exception = org.junit.jupiter.api.Assertions.assertThrows(Exception.class, () -> {
            mockMvc.perform(post("/api/products")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(product)));
        });

        // Kiểm tra nguyên nhân
        Throwable cause = exception.getCause();
        assertTrue(cause instanceof IllegalArgumentException);
        assertEquals("Tên sản phẩm không được để trống.", cause.getMessage());
    }

    // --- TC_005: Update (Success) ---
    @Test
    @DisplayName("API: Update Product - Success (200 OK)")
    void testUpdate_Success() throws Exception {
        when(productService.updateProduct(eq(1), any(Product.class))).thenReturn(product);

        mockMvc.perform(put("/api/products/{id}", 1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(product)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Laptop Gaming")));
    }

    // --- TC_007: Delete (Success) ---
    @Test
    @DisplayName("API: Delete Product - Success (204 No Content)")
    void testDelete() throws Exception {
        doNothing().when(productService).deleteProduct(1);

        mockMvc.perform(delete("/api/products/{id}", 1))
                .andExpect(status().isNoContent());
    }
}