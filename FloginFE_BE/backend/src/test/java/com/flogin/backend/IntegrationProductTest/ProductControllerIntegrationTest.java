package com.flogin.backend.IntegrationProductTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import com.flogin.controller.ProductController;
import com.flogin.dto.ProductDTO;
import com.flogin.entity.Product; // Import Entity
import com.flogin.service.ProductService;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.hasSize;

@WebMvcTest(ProductController.class)
@DisplayName("Product API Integration Test")
class ProductControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProductService productService;

    private ProductDTO createRequest;
    
    // Khai báo Entity giả để dùng cho Mock
    private Product productEntity1;
    private Product productEntity2;

    @BeforeEach
    void setUp() {
        // 1. Chuẩn bị DTO để Gửi đi (Request)
        createRequest = new ProductDTO(
            0, "Sản phẩm mới", 5000000.0, "Điện thoại", "Mô tả mới", "Samsung", "samsung.jpg", 20, LocalDate.now()
        );

        // 2. Chuẩn bị ENTITY để Mock Service trả về
        // (Giả sử Product Entity có các setter hoặc constructor tương tự)
        productEntity1 = new Product();
        productEntity1.setId(1);
        productEntity1.setName("Laptop Dell");
        productEntity1.setPrice(15000000.0);
        // ... set các trường khác nếu cần thiết cho việc test

        productEntity2 = new Product();
        productEntity2.setId(2);
        productEntity2.setName("Macbook Air");
        productEntity2.setPrice(25000000.0);
    }

    @Test
    @DisplayName("a) Test POST /api/products (Create)")
    void testCreateProduct() throws Exception {
        // Given
        // Tạo một Entity giả mà Service sẽ trả về sau khi lưu thành công
        Product savedEntity = new Product();
        savedEntity.setId(3);
        savedEntity.setName("Sản phẩm mới");
        
        // QUAN TRỌNG: Mock Service nhận vào Entity và trả về Entity
        doReturn(savedEntity).when(productService).createProduct(any(Product.class));

        // When & Then
        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createRequest))) // Controller tự convert DTO này thành Entity
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(3)))
                .andExpect(jsonPath("$.name", is("Sản phẩm mới")));
    }

    @Test
    @DisplayName("b) Test GET /api/products (Read all)")
    void testGetAllProducts() throws Exception {
        
        // Service trả về List<Product> (Entity)
        List<Product> entityList = Arrays.asList(productEntity1, productEntity2);
        
        when(productService.getAllProducts()).thenReturn(entityList);

        mockMvc.perform(get("/api/products")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name", is("Laptop Dell")))
                .andExpect(jsonPath("$[1].name", is("Macbook Air")));
    }

    @Test
    @DisplayName("c) Test GET /api/products/{id} (Read one)")
    void testGetProductById() throws Exception {
        // Service trả về Product (Entity)
        when(productService.getProductById(1)).thenReturn(productEntity1);

        mockMvc.perform(get("/api/products/{id}", 1)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("Laptop Dell")));
    }

    @Test
    @DisplayName("d) Test PUT /api/products/{id} (Update)")
    void testUpdateProduct() throws Exception {
        ProductDTO updatedInfo = new ProductDTO(
            0, "Tên đã cập nhật", 16000000.0, "Laptop", "Mô tả mới", "Dell", "dell.jpg", 11, LocalDate.now()
        );
        
        // Entity sau khi update xong
        Product updatedEntity = new Product();
        updatedEntity.setId(1);
        updatedEntity.setName("Tên đã cập nhật");
        // Mock Service nhận Entity và trả về Entity
        doReturn(updatedEntity).when(productService).updateProduct(eq(1), any(Product.class));
        when(productService.updateProduct(eq(1), any(Product.class))).thenReturn(updatedEntity);

        mockMvc.perform(put("/api/products/{id}", 1)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedInfo)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("Tên đã cập nhật")));
    }

    @Test
    @DisplayName("e) Test DELETE /api/products/{id} (Delete)")
    void testDeleteProduct() throws Exception {
        doNothing().when(productService).deleteProduct(1);

        mockMvc.perform(delete("/api/products/{id}", 1))
                .andExpect(status().isNoContent()); 
    }
}