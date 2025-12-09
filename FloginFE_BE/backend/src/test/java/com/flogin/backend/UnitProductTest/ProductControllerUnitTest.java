package com.flogin.backend.UnitProductTest;


import com.flogin.controller.ProductController;
import com.flogin.entity.Product;
import com.flogin.service.ProductService;

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
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;        // tạo đối tượng mockMvc mô phỏng gửi HTTP request

    @MockBean
    private ProductService productService; // tạo mock cho controller (controller sẽ dùng đối tượng này nhằm tách controller khỏi service thật)

    @Autowired
    private ObjectMapper objectMapper;  // sử lý dữ liệu JSON, chuyển đổi object java thành chuỗi JSON khi cần gửi dữ liệu (POST/PUT)

    private Product product;  // tạo biến lưu trữ dữ liệu mẫu

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setId(1);
        product.setName("Laptop Pro");
        product.setPrice(25000000);
        product.setCategory("Electronics");
        product.setDescription("High performance laptop");
        product.setBrand("Dell");
        product.setImg("image.jpg");
        product.setQuantity(150);
        product.setCreate_at(LocalDate.now());
    }

    // --- TC_001: Get All ---
    @Test
    @DisplayName("API: get all products ")
    void testGetAll () throws Exception {
        when(productService.getAllProducts()).thenReturn(List.of(product));

        mockMvc.perform(get("/api/products")).
                andExpect(status().isOk()).
                andExpect(jsonPath("$[0].name",is("Laptop Pro")));
    }

    // --- TC_002: Get By ID (Success) ---
    @Test
    @DisplayName("API: Get By ID - Found (200 OK)")
    void testGetById() throws Exception {
        when(productService.getProductById(1)).thenReturn(product);

        mockMvc.perform(get("/api/products/{id}", 1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Laptop Pro")));
    }

    // --- TC_002: Get By ID (Not Found) ---
    @Test
    @DisplayName("API: Get By ID - Not Found (Exception Check)")
    void testGetById_NotFound() {
        // Mock Service ném lỗi
        when(productService.getProductById(99)).thenThrow(new IllegalStateException("Sản phẩm không tồn tại với id: 99"));

        // Controller không bắt lỗi -> MockMvc sẽ ném Exception ra ngoài -> Ta phải dùng assertThrows bắt lại
        Exception exception = assertThrows(Exception.class, () -> {
            mockMvc.perform(get("/api/products/{id}", 99));
        });

        // Kiểm tra nguyên nhân gốc rễ (Cause)
        Throwable cause = exception.getCause();
        assertTrue(cause instanceof IllegalStateException);
        assertEquals("Sản phẩm không tồn tại với id: 99", cause.getMessage());
    }

    // --- TC_003: Create (Success) ---
    @Test
    @DisplayName("API: create product")
    void testCreateProduct() throws Exception{
        when(productService.createProduct(any(Product.class))).thenReturn(product);

        mockMvc.perform(post("/api/products").
                        contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(product)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name",is("Laptop Pro")))
                .andExpect(jsonPath("$.price", is((double)25000000)))
                .andExpect(jsonPath("$.category", is("Electronics")))
                .andExpect(jsonPath("$.quantity", is(150)));
    }

    // --- TC_004: Create (Fail - Validate) ---
    @Test
    @DisplayName("API: create fail (validation test price <= 0)")
    void testCreatePriceBelowZero () throws Exception {

        Product invalidproduct = new Product();
        invalidproduct.setPrice((double)0);

        when(productService.createProduct(any(Product.class))).
                thenThrow(new IllegalArgumentException("giá sản phẩm không được nhỏ hơn 0"));

        Exception exception = assertThrows(Exception.class, () -> {

            mockMvc.perform(post("/api/products").
                    contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(product)));
        });

        //kiểm tra nguyên nhân
        Throwable cause = exception.getCause();
        assertTrue(cause instanceof IllegalArgumentException);
        assertEquals("giá sản phẩm không được nhỏ hơn 0", cause.getMessage());
    }

    // test số lượng vượt mức 99999
    @Test
    @DisplayName("API: test create invalid quantity ")
    void testCreateInvalidQuantity () throws Exception{

        Product invalidProductQuantity = new Product();
        invalidProductQuantity.setQuantity(1000000);

        when(productService.createProduct(any(Product.class))).
                thenThrow(new IllegalArgumentException("số lượng không được vượt quá 99.999"));

        Exception exception = assertThrows(Exception.class, () -> {

            mockMvc.perform(post("/api/products")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(product)));

        });

        Throwable cause = exception.getCause();
        assertTrue(cause instanceof IllegalArgumentException);
        assertEquals("số lượng không được vượt quá 99.999", cause.getMessage());

    }

    // --- TC_005: Update (Success) ---
    @Test
    @DisplayName("API: update Product success")
    void testUpdateProduct () throws  Exception {

        // set up dữ liệu sau khi update (update giá và số lượng)
        Product updatedProduct = new Product();
        updatedProduct.setId(product.getId());
        updatedProduct.setPrice((double) 26000000);
        updatedProduct.setQuantity(100);

        when(productService.updateProduct(eq(1),any(Product.class))).thenReturn(updatedProduct);

        mockMvc.perform(put("/api/products/{id}",1)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(product)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.price", is((double)26000000)))
                .andExpect(jsonPath("$.quantity", is(100)));
    }


    // --- TC_007: Delete (Success) ---
    @Test
    @DisplayName("API: test delete product success")
    void testDeleteProduct () throws Exception {

        doNothing().when(productService).deleteProduct(1);

        mockMvc.perform(delete("/api/products/{id}",1)).andExpect(status().isNoContent());

    }
}