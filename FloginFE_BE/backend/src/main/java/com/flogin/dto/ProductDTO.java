package com.flogin.dto;

import java.time.LocalDate;

public class ProductDTO {
    private int id;
    private String name;
    private double price;
    private String category;
    private String description;
    private String brand;
    private String img;
    private int quantity;
    private LocalDate create_at;

    public ProductDTO() {}

    public ProductDTO(int id, String name, double price, String category, String description,
                      String brand, String img, int quantity, LocalDate create_at) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.description = description;
        this.brand = brand;
        this.img = img;
        this.quantity = quantity;
        this.create_at = create_at;
    }

    // --- Getters & Setters ---
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getImg() { return img; }
    public void setImg(String img) { this.img = img; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public LocalDate getCreate_at() { return create_at; }
    public void setCreate_at(LocalDate create_at) { this.create_at = create_at; }
}