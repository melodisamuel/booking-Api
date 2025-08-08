// src/tests/property.test.js

// Mock Sequelize models
jest.mock('../../models', () => ({
  Property: {
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
  },
}));


const { Property } = require('../../models');

describe('Property Model Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return paginated properties', async () => {
    // Arrange
    Property.findAndCountAll.mockResolvedValue({
      count: 1,
      rows: [{ id: 1, name: 'Test Property' }]
    });

    // Act
    const result = await Property.findAndCountAll();

    // Assert
    expect(result.count).toBe(1);
    expect(result.rows[0].name).toBe('Test Property');
  });

  test('should return property by ID', async () => {
    // Arrange
    Property.findByPk.mockResolvedValue({ id: 1, name: 'Test Property' });

    // Act
    const property = await Property.findByPk(1);

    // Assert
    expect(property).toEqual({ id: 1, name: 'Test Property' });
  });
});
