package com.flogin.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flogin.model.Product;
import com.flogin.repository.ProductRepository;

@RestController
@RequestMapping("products")
@CrossOrigin(origins="*")
public class ProductController {
    private final ProductRepository productRepository;
    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Thêm sản phẩm mới (tùy chọn)
    @PostMapping
    public Product adddProduct(@RequestBody Product product) {
        

        return productRepository.save(product);
    }


   

}
