const { getAllProperties, getPropertyAvailability } = require('../src/controllers/property.controller');
const { Property } = require('../src/models');

// Mock Sequelize methods
jest.mock('../src/models', () => ({
  Property: {
    findAndCountAll: jest.fn(),
    findByPk: jest.fn()
  }
}));

describe('Property Controller', () => {
  beforeEach(() => jest.clearAllMocks());

  test('getAllProperties returns paginated properties', async () => {
    const mockReq = { query: { page: 1, limit: 2 } };
    const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    Property.findAndCountAll.mockResolvedValue({
      count: 2,
      rows: [{ id: 1, title: 'Test Property' }]
    });

    await getAllProperties(mockReq, mockRes);

    expect(Property.findAndCountAll).toHaveBeenCalled();
    expect(mockRes.json).toHaveBeenCalledWith({
      total: 2,
      page: 1,
      totalPages: 1,
      data: [{ id: 1, title: 'Test Property' }]
    });
  });

  test('getPropertyAvailability returns availability for a property', async () => {
    const mockReq = { params: { id: 1 } };
    const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    Property.findByPk.mockResolvedValue({
      id: 1,
      available_from: '2025-08-01',
      available_to: '2025-08-10'
    });

    await getPropertyAvailability(mockReq, mockRes);

    expect(Property.findByPk).toHaveBeenCalledWith(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      id: 1,
      available_from: '2025-08-01',
      available_to: '2025-08-10'
    });
  });
});
