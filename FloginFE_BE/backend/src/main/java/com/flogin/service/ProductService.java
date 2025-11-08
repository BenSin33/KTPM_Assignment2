package com.flogin.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.flogin.model.Product;
import com.flogin.repository.ProductRepository;
@Service
public class ProductService {

    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    // CREATE
    public void createProduct(Product product) {
        if (product.getName() == null || product.getName().trim().isEmpty()) {
            // return 1 ;
            throw new IllegalArgumentException("Tên sản phẩm không được để trống.");
        }

        if (product.getPrice() <= 0 || product.getPrice() >= 999_999_999) {
            // return 1;
            throw new IllegalArgumentException("Giá không hợp lệ.");
        }

        if (product.getCategory() == null || product.getCategory().trim().isEmpty()) {
            // return 1;
            throw new IllegalArgumentException("Danh mục không được để trống.");
        }

        if (product.getDescription() == null || product.getDescription().length() < 3 || product.getDescription().length() > 100) {
            // return 1;
            throw new IllegalArgumentException("Mô tả phải từ 3 - 100 ký tự.");
        }

        if (product.getQuantity() <= 0 || product.getQuantity() >= 99_999) {
            // return 1;
            throw new IllegalArgumentException("Số lượng không hợp lệ.");
        }
        
        this.repo.save(product);
        // return 0;
    }

    // READ
    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    public Product getProductById(int id) {
        return repo.findById(id)
                .orElseThrow(() -> new IllegalStateException("Sản phẩm không tồn tại với id: " + id));
    }

    // UPDATE
    public void updateProduct(int id, Product updatedProduct) {
        Product existing = repo.findById(id)
                .orElseThrow(() -> new IllegalStateException("Sản phẩm không tồn tại với id: " + id));

        if (updatedProduct.getName() != null && !updatedProduct.getName().trim().isEmpty()) {
            existing.setName(updatedProduct.getName());
        } else {
            throw new IllegalArgumentException("Tên sản phẩm không được để trống.");
        }

        if (updatedProduct.getPrice() > 0 && updatedProduct.getPrice() < 999_999_999) {
            existing.setPrice(updatedProduct.getPrice());
        } else {
            throw new IllegalArgumentException("Giá không hợp lệ.");
        }

        if (updatedProduct.getCategory() != null && !updatedProduct.getCategory().trim().isEmpty()) {
            existing.setCategory(updatedProduct.getCategory());
        } else {
            throw new IllegalArgumentException("Danh mục không được để trống.");
        }

        if (updatedProduct.getDescription() != null && updatedProduct.getDescription().length() >= 3
                && updatedProduct.getDescription().length() <= 100) {
            existing.setDescription(updatedProduct.getDescription());
        } else {
            throw new IllegalArgumentException("Mô tả phải từ 3 - 100 ký tự.");
        }

        if (updatedProduct.getBrand() != null) {
            existing.setBrand(updatedProduct.getBrand());
        }

        if (updatedProduct.getImg() != null) {
            existing.setImg(updatedProduct.getImg());
        }

        if (updatedProduct.getQuantity() > 0 && updatedProduct.getQuantity() < 99_999) {
            existing.setQuantity(updatedProduct.getQuantity());
        } else {
            throw new IllegalArgumentException("Số lượng không hợp lệ.");
        }

        repo.save(existing);
    }

    // DELETE
    public void deleteProduct(int id) {
        Product existing = repo.findById(id)
                .orElseThrow(() -> new IllegalStateException("Sản phẩm không tồn tại với id: " + id));
        repo.delete(existing);
    }
}
