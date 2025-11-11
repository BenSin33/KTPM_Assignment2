package com.flogin.backend;

import java.nio.channels.IllegalChannelGroupException;

import com.flogin.model.Product;
import com.flogin.repository.ProductRepository;
import com.flogin.service.ProductService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
public class TestProductService {

    @MockBean
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService;

    private Product validProduct;

    @BeforeEach
    public void setup() {
        validProduct = new Product("Sản phẩm 1", 100, "Điện tử", "Mô tả hợp lệ", "Apple", "https://example.com/img.jpg", 10);
    }

    // ================= CREATE =================
    @Test
    public void testCreateProduct_ValidProduct_ShouldSave() {
        productService.createProduct(validProduct);
        verify(productRepository, times(1)).save(validProduct);
    }

    @Test
    public void testcaseCreate_product_with_emptyName(){
        validProduct.setName("    ");
        assertThrows(IllegalArgumentException.class, () -> {
            productService.createProduct(validProduct);
        });
    }

    @Test
    public void testCreateProduct_EmptyName_ShouldThrow() {
        validProduct.setName("  ");
        assertThrows(IllegalArgumentException.class, () -> {
            productService.createProduct(validProduct);
        });
    }


    @Test
    public void testCreateProduct_InvalidPrice_ShouldThrow() {
        validProduct.setPrice(0);
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            productService.createProduct(validProduct);
        });
        assertEquals("Giá không hợp lệ.", exception.getMessage());

        validProduct.setPrice(1_000_000_000);
        exception = assertThrows(IllegalArgumentException.class, () -> {
            productService.createProduct(validProduct);
        });
        assertEquals("Giá không hợp lệ.", exception.getMessage());
    }

    @Test
    public void testCreateProduct_EmptyCategory_ShouldThrow() {
        validProduct.setCategory(" ");
        assertThrows(IllegalArgumentException.class, () -> {
            productService.createProduct(validProduct);
        });
    }

    @Test
    public void testCreateProduct_InvalidDescription_ShouldThrow() {
        validProduct.setDescription("ab"); 
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            productService.createProduct(validProduct);
        });
        assertEquals("Mô tả phải từ 3 - 100 ký tự.", exception.getMessage());

        validProduct.setDescription("a".repeat(101)); 
        exception = assertThrows(IllegalArgumentException.class, () -> {
            productService.createProduct(validProduct);
        });
        assertEquals("Mô tả phải từ 3 - 100 ký tự.", exception.getMessage());
    }

    @Test
    public void testCreateProduct_InvalidQuantity_ShouldThrow() {
        validProduct.setQuantity(0);
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            productService.createProduct(validProduct);
        });
        assertEquals("Số lượng không hợp lệ.", exception.getMessage());

        validProduct.setQuantity(100_000);
        exception = assertThrows(IllegalArgumentException.class, () -> {
            productService.createProduct(validProduct);
        });
        assertEquals("Số lượng không hợp lệ.", exception.getMessage());
    }

    // ================= READ =================
    @Test
    public void testGetAllProducts_ShouldReturnList() {
        List<Product> mockProducts = Arrays.asList(validProduct);
        when(productRepository.findAll()).thenReturn(mockProducts);

        List<Product> result = productService.getAllProducts();
        assertEquals(1, result.size());
        verify(productRepository, times(1)).findAll();
    }

    @Test
    public void testGetProductById_Existing_ShouldReturnProduct() {
        when(productRepository.findById(1)).thenReturn(Optional.of(validProduct));
        Product result = productService.getProductById(1);
        assertEquals(validProduct.getName(), result.getName());
    }

    @Test
    public void testGetProductById_NotExist_ShouldThrow() {
        when(productRepository.findById(9999)).thenReturn(Optional.empty());
        Exception exception = assertThrows(IllegalStateException.class, () -> {
            productService.getProductById(9999);
        });
        assertEquals("Sản phẩm không tồn tại với id: 9999", exception.getMessage());
    }

    // ================= UPDATE =================
    @Test
    public void testUpdateProduct_Valid_ShouldUpdate() {
        when(productRepository.findById(1)).thenReturn(Optional.of(validProduct));
        Product updated = new Product("Sản phẩm mới", 200, "Thiết bị", "Mô tả mới", "Samsung", "https://example.com/new.jpg", 20);

        productService.updateProduct(1, updated);

        verify(productRepository, times(1)).save(validProduct);
        assertEquals("Sản phẩm mới", validProduct.getName());
        assertEquals(200, validProduct.getPrice());
        assertEquals("Thiết bị", validProduct.getCategory());
        assertEquals("Mô tả mới", validProduct.getDescription());
        assertEquals(20, validProduct.getQuantity());
    }

    @Test
    public void testUpdateProduct_NotExist_ShouldThrow() {
        when(productRepository.findById(9999)).thenReturn(Optional.empty());
        Product updated = new Product();
        Exception exception = assertThrows(IllegalStateException.class, () -> {
            productService.updateProduct(9999, updated);
        });
        assertEquals("Sản phẩm không tồn tại với id: 9999", exception.getMessage());
    }

    // ================= DELETE =================
    @Test
    public void testDeleteProduct_Existing_ShouldDelete() {
        when(productRepository.findById(1)).thenReturn(Optional.of(validProduct));

        productService.deleteProduct(1);

        verify(productRepository, times(1)).delete(validProduct);
    }

    @Test
    public void testDeleteProduct_NotExist_ShouldThrow() {
        when(productRepository.findById(9999)).thenReturn(Optional.empty());

        Exception exception = assertThrows(IllegalStateException.class, () -> {
            productService.deleteProduct(9999);
        });
        assertEquals("Sản phẩm không tồn tại với id: 9999", exception.getMessage());
    }
}
