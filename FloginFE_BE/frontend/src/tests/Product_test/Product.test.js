import { validate_Product } from '../utils/validate_Product';

describe('validate_Product()', () => {
    it('should validate product name', () => {
        const result = validate_Product({ name: '', price: 1000, quantity: 1, description: '', category: 'Laptop' });
        expect(result.name).toBeDefined();
    });

    it('should validate price boundaries', () => {
        expect(validate_Product({ name: 'A', price: 999, quantity: 1, description: '', category: 'Laptop' }).price).toBeDefined();
        expect(validate_Product({ name: 'A', price: 100000001, quantity: 1, description: '', category: 'Laptop' }).price).toBeDefined();
        expect(validate_Product({ name: 'A', price: 50000, quantity: 1, description: '', category: 'Laptop' }).price).toBeUndefined();
    });

    it('should validate quantity range', () => {
        expect(validate_Product({ name: 'A', price: 1000, quantity: -1, description: '', category: 'Laptop' }).quantity).toBeDefined();
        expect(validate_Product({ name: 'A', price: 1000, quantity: 1001, description: '', category: 'Laptop' }).quantity).toBeDefined();
        expect(validate_Product({ name: 'A', price: 1000, quantity: 10, description: '', category: 'Laptop' }).quantity).toBeUndefined();
    });

    it('should validate description length', () => {
        const longDesc = 'a'.repeat(501);
        expect(validate_Product({ name: 'A', price: 1000, quantity: 1, description: longDesc, category: 'Laptop' }).description).toBeDefined();
    });

    it('should validate category presence', () => {
        expect(validate_Product({ name: 'A', price: 1000, quantity: 1, description: '', category: '' }).category).toBeDefined();
    });
});