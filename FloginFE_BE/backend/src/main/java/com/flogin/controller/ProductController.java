package com.flogin.controller;

import java.util.List;

import org.springframework.http.HttpStatus; // Import thêm HttpStatus
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus; // Import ResponseStatus
import org.springframework.web.bind.annotation.RestController;

import com.flogin.entity.Product;
import com.flogin.service.ProductService;

@RestController
@RequestMapping("/api/products") // 1. SỬA: Thêm "/api/" để khớp với file Test
@CrossOrigin(origins="*")
public class ProductController {
    
    private final ProductService productService;
    
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable int id ){
        return this.productService.getProductById(id);
    }

    // 2. SỬA: Đổi void -> Product và thêm status 201 Created
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED) 
    public Product addProduct(@RequestBody Product product) {
        // Hàm service.createProduct giờ đã trả về Product (như bạn vừa sửa service)
        // Nên controller cũng phải return nó ra cho Client/Test thấy
        return this.productService.createProduct(product);
    }

    // 3. SỬA: Đổi void -> Product
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable int id, @RequestBody Product product) {
        return this.productService.updateProduct(id, product);
    }

    // 4. SỬA: Thêm status 204 No Content cho hàm xóa
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable int id) {
        this.productService.deleteProduct(id);
    }
}