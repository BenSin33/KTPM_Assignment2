package com.flogin.backend.UnitProductTest;

import com.flogin.entity.Product;
import com.flogin.repository.ProductRepository;
import com.flogin.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product product;

    @BeforeEach
    void setUp() {
        product = new Product("Laptop", 1000.0, "Electronics",
                "High end", "BrandX", "img.png", 10);
        product.setId(1);
        product.setCreate_at(LocalDate.now());
    }

    // --- TC_PRODUCT_001: Get All ---
    @Test
    @DisplayName("TC_001: Get All - Success")
    void testGetAllProducts() {
        when(productRepository.findAll()).thenReturn(List.of(product));

        List<Product> result = productService.getAllProducts();
        assertEquals(1, result.size());
        assertEquals("Laptop", result.get(0).getName());
    }

    @Test
    @DisplayName("TC_001: Get All - Empty")
    void testGetAllProducts_Empty() {
        when(productRepository.findAll()).thenReturn(Collections.emptyList());

        List<Product> result = productService.getAllProducts();
        assertTrue(result.isEmpty());
    }

    // --- TC_PRODUCT_002: Get By ID ---
    @Test
    @DisplayName("TC_002: Get By ID - Found")
    void testGetProductById_Found() {
        when(productRepository.findById(1)).thenReturn(Optional.of(product));

        Product result = productService.getProductById(1);
        assertEquals("Laptop", result.getName());
    }

    @Test
    @DisplayName("TC_002: Get By ID - Not Found")
    void testGetProductById_NotFound() {
        when(productRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(IllegalStateException.class, () -> productService.getProductById(99));
    }

    // --- TC_PRODUCT_003: Create ---
    @Test
    @DisplayName("TC_003: Create - Success")
    void testCreateProduct_Success() {
        when(productRepository.save(any(Product.class))).thenReturn(product);

        Product created = productService.createProduct(product);
        assertNotNull(created);
        assertEquals("Laptop", created.getName());
    }

    @Test
    @DisplayName("TC_003: Create - Invalid Name")
    void testCreateProduct_InvalidName() {
        product.setName("");
        assertThrows(IllegalArgumentException.class, () -> productService.createProduct(product));
        verify(productRepository, never()).save(any());
    }

    // --- TC_PRODUCT_004: Update ---
    @Test
    @DisplayName("TC_004: Update - Success")
    void testUpdateProduct_Success() {
        when(productRepository.findById(1)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenReturn(product);

        Product updated = productService.updateProduct(1, product);
        assertNotNull(updated);
        assertEquals("Laptop", updated.getName());
    }

    @Test
    @DisplayName("TC_004: Update - Not Found")
    void testUpdateProduct_NotFound() {
        when(productRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(IllegalStateException.class, () -> productService.updateProduct(99, product));
    }

    // --- TC_PRODUCT_005: Delete ---
    @Test
    @DisplayName("TC_005: Delete - Success")
    void testDeleteProduct_Success() {
        when(productRepository.findById(1)).thenReturn(Optional.of(product));
        doNothing().when(productRepository).delete(product);

        productService.deleteProduct(1);
        verify(productRepository, times(1)).delete(product);
    }

    @Test
    @DisplayName("TC_005: Delete - Not Found")
    void testDeleteProduct_NotFound() {
        when(productRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(IllegalStateException.class, () -> productService.deleteProduct(99));
    }
}