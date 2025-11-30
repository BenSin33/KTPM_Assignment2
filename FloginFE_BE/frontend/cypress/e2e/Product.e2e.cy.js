import ProductPage from '../pages/ProductPage';

describe('📝 Product E2E Tests (CRUD, Search & Validation)', () => {
    const productPage = new ProductPage();
    // Dùng timestamp để đảm bảo tên sản phẩm là duy nhất qua các lần chạy
    const uniqueId = new Date().getTime();

    const newProduct = {
        name: `Laptop Test E2E ${uniqueId}`,
        category: 'Điện tử',
        price: '15000000',
        quantity: '10',
        description: 'Mô tả test cho laptop Dell mới',
        brand: 'Dell',
        img: 'https://via.placeholder.com/50',
    };

    const updatedPrice = '14999000';
    const updatedQuantity = '5';

    // Sử dụng formErrorDiv selector mới đã sửa trong POM
    const checkErrorForField = (selector, expectedError) => {
        cy.get(selector).next(productPage.selectors.formErrorDiv).should('contain', expectedError);
    };

    beforeEach(() => {
        productPage.visit();
    });

    // --- 1. CREATE PRODUCT FLOW (a) ---
    it('1. Nên tạo sản phẩm mới thành công và hiển thị trong danh sách (Create)', () => {
        productPage.clickAddNew();
        productPage.getModal().should('be.visible');

        productPage.fillProductForm(newProduct);
        productPage.submitForm();

        productPage.getModal().should('not.exist');

        // SỬ DỤNG getProductRow đã sửa
        productPage.getProductRow(newProduct.name)
            .should('exist')
            .and('contain', '15.000.000');
    });

    // --- 2. READ/LIST products (b) ---
    it('2. Nên hiển thị danh sách sản phẩm và chứa sản phẩm vừa tạo (Read/List)', () => {
        cy.get(productPage.selectors.productRow).should('have.length.of.at.least', 1);
        productPage.getProductRow(newProduct.name).should('exist');
    });

    // --- 3. UPDATE product (c) ---
    it('3. Nên cập nhật thông tin sản phẩm thành công (Update)', () => {
        productPage.getEditButton(newProduct.name).click();
        productPage.getModal().should('be.visible');

        productPage.fillProductForm({
            price: updatedPrice,
            quantity: updatedQuantity
        });
        productPage.submitForm();

        productPage.getModal().should('not.exist');

        productPage.getTableCell(newProduct.name, 3) // Cột Giá
            .should('contain', '14.999.000');
        productPage.getTableCell(newProduct.name, 4) // Cột Số lượng
            .should('contain', updatedQuantity);
    });

    // --- 4. SEARCH/FILTER functionality (e) ---
    it('4. Nên lọc/tìm kiếm sản phẩm chính xác theo tên (Search/Filter)', () => {
        const partialName = 'Laptop Test';

        // Sử dụng hàm searchProduct đã sửa (khắc phục lỗi cy.type)
        productPage.searchProduct(partialName);

        productPage.getProductRow(newProduct.name).should('exist');
        cy.get(productPage.selectors.productRow).should('have.length', 1);

        // Khôi phục danh sách
        productPage.searchProduct('');
        cy.get(productPage.selectors.productRow).should('have.length.of.at.least', 1);
    });

    // --- 5. TEST VALIDATION FORM (Khắc phục lỗi đếm phần tử) ---
    it('5. Nên hiển thị TẤT CẢ các lỗi validation khi submit dữ liệu không hợp lệ', () => {
        productPage.clickAddNew();

        productPage.fillProductForm({
            name: "A",
            category: " ",
            price: '500',
            quantity: '0',
            description: "AB",
        });

        productPage.submitForm();

        // SỬA LỖI: getFormError() giờ chỉ đếm 5 DIV lỗi (formErrorDiv)
        productPage.getFormError().should('have.length', 5);

        checkErrorForField(productPage.selectors.nameInput, "Tên sản phẩm phải có ít nhất 3 ký tự");
        checkErrorForField(productPage.selectors.categoryInput, "Danh mục không được để trống");
        checkErrorForField(productPage.selectors.priceInput, "Giá phải từ 1,000 đến dưới 999,999,999");
        checkErrorForField(productPage.selectors.quantityInput, "Số lượng phải lớn hơn 0 và nhỏ hơn 99,999");
        checkErrorForField(productPage.selectors.descriptionInput, "Mô tả phải từ 3 đến 500 ký tự");

        cy.get(productPage.selectors.cancelFormBtn).click();
    });

    // --- 6. DELETE product (d) ---
    it('6. Nên xóa sản phẩm thành công (Delete)', () => {
        productPage.getDeleteButton(newProduct.name).click();

        // SỬ DỤNG getProductRow đã sửa
        productPage.getProductRow(newProduct.name).should('not.exist');
    });
});