package com.flogin.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flogin.model.Product;
import com.flogin.service.ProductService;

@RestController
@RequestMapping("products")
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

    @PostMapping
    public void addProduct(@RequestBody Product product) {
        this.productService.createProduct(product);
    }

     @PutMapping("/{id}")
    public void updateProduct(@PathVariable int id, @RequestBody Product product) {
        this.productService.updateProduct(id, product);
    }


     @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable int id) {
        this.productService.deleteProduct(id);
    }

   

}
