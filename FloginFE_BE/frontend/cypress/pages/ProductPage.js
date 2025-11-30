class ProductPage {
    // 1. SELECTORS
    selectors = {
        // Nút và Form
        addProductBtn: '[data-testid="add-product-btn"]',
        searchProductInput: '[data-testid="search-input"]',
        productModal: '[data-testid="product-modal"]',
        submitFormBtn: '[data-testid="submit-form-btn"]',
        cancelFormBtn: '[data-testid="cancel-form-btn"]',

        // Inputs trong Form
        nameInput: '[data-testid="product-name-input"]',
        categoryInput: '[data-testid="product-category-input"]',
        priceInput: '[data-testid="product-price-input"]',
        quantityInput: '[data-testid="product-quantity-input"]',
        descriptionInput: '[data-testid="product-description-input"]',
        brandInput: '[data-testid="product-brand-input"]',
        imgInput: '[data-testid="product-img-input"]',

        // Bảng và Hàng
        productRow: '[data-testid="product-row"]',
        editButton: '[data-testid="edit-btn"]',
        deleteButton: '[data-testid="delete-btn"]',

        // SỬA LỖI 5: Selector chỉ chọn DIV chứa text lỗi, tránh trùng với input.error
        formErrorDiv: 'div.error',
    }

    // 2. ACTIONS

    visit() {
        cy.visit('/products');
    }

    clickAddNew() {
        cy.get(this.selectors.addProductBtn).click();
    }

    fillProductForm(product) {
        if (product.name !== undefined) cy.get(this.selectors.nameInput).clear().type(product.name);
        if (product.category !== undefined) cy.get(this.selectors.categoryInput).clear().type(product.category);
        if (product.price !== undefined) cy.get(this.selectors.priceInput).clear().type(product.price);
        if (product.quantity !== undefined) cy.get(this.selectors.quantityInput).clear().type(product.quantity);
        if (product.description !== undefined) cy.get(this.selectors.descriptionInput).clear().type(product.description);
        if (product.brand !== undefined) cy.get(this.selectors.brandInput).clear().type(product.brand);
        if (product.img !== undefined) cy.get(this.selectors.imgInput).clear().type(product.img);
    }

    submitForm() {
        cy.get(this.selectors.submitFormBtn).click();
    }

    /**
     *Xử lý chuỗi rỗng để tránh cy.type('')
     */
    searchProduct(searchTerm) {
        if (searchTerm === '') {
            cy.get(this.selectors.searchProductInput).clear();
        } else {
            cy.get(this.selectors.searchProductInput).clear().type(searchTerm);
        }
    }

    // 3. GETTERS/ASSERTIONS HELPERS

    /**
     Dùng .contains('tr', name) để tìm hàng đáng tin cậy hơn
     */
    getProductRow(name) {
        return cy.get(this.selectors.productRow).contains('tr', name);
    }

    getEditButton(name) {
        return this.getProductRow(name).find(this.selectors.editButton);
    }

    getDeleteButton(name) {
        return this.getProductRow(name).find(this.selectors.deleteButton);
    }

    getTableCell(name, colIndex) {
        return this.getProductRow(name).find('td').eq(colIndex);
    }

    getModal() {
        return cy.get(this.selectors.productModal);
    }

    /**
    Định nghĩa hàm getFormError() và dùng selector đã sửa (formErrorDiv)
     */
    getFormError() {
        return cy.get(this.selectors.formErrorDiv);
    }
}

export default ProductPage;