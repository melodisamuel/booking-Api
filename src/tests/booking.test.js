const bookingController = require('../controllers/bookingController');
const { Booking, Property } = require('../../models');

jest.mock('../../models', () => ({
  Booking: {
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn()
  },
  Property: {
    findByPk: jest.fn()
  }
}));

describe('Booking Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createBooking', () => {
    test('should return 400 if required fields missing', async () => {
      const req = { body: {} };
      const json = jest.fn();
      const status = jest.fn(() => ({ json }));

      await bookingController.createBooking(req, { status });

      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ message: 'Missing required fields' });
    });

    test('should return 400 if start_date >= end_date', async () => {
      const req = { body: { property_id: 1, user_name: 'John', start_date: '2025-08-10', end_date: '2025-08-01' } };
      const json = jest.fn();
      const status = jest.fn(() => ({ json }));

      await bookingController.createBooking(req, { status });

      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ message: 'start_date must be before end_date' });
    });

    test('should return 404 if property not found', async () => {
      Property.findByPk.mockResolvedValue(null);

      const req = { body: { property_id: 1, user_name: 'John', start_date: '2025-08-01', end_date: '2025-08-10' } };
      const json = jest.fn();
      const status = jest.fn(() => ({ json }));

      await bookingController.createBooking(req, { status });

      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({ message: 'Property not found' });
    });

    test('should return 400 if dates outside availability', async () => {
      Property.findByPk.mockResolvedValue({
        available_from: '2025-08-05',
        available_to: '2025-08-15'
      });

      const req = { body: { property_id: 1, user_name: 'John', start_date: '2025-08-01', end_date: '2025-08-10' } };
      const json = jest.fn();
      const status = jest.fn(() => ({ json }));

      await bookingController.createBooking(req, { status });

      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ message: 'Dates outside property availability range' });
    });

    test('should return 400 if overlapping booking exists', async () => {
      Property.findByPk.mockResolvedValue({
        available_from: '2025-08-01',
        available_to: '2025-08-31'
      });
      Booking.findOne.mockResolvedValue({ id: 1 });

      const req = { body: { property_id: 1, user_name: 'John', start_date: '2025-08-10', end_date: '2025-08-15' } };
      const json = jest.fn();
      const status = jest.fn(() => ({ json }));

      await bookingController.createBooking(req, { status });

      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ message: 'Booking dates overlap with existing booking' });
    });

    test('should create booking successfully', async () => {
      Property.findByPk.mockResolvedValue({
        available_from: '2025-08-01',
        available_to: '2025-08-31'
      });
      Booking.findOne.mockResolvedValue(null);
      Booking.create.mockResolvedValue({
        id: 1,
        property_id: 1,
        user_name: 'John',
        start_date: '2025-08-10',
        end_date: '2025-08-15',
        created_at: new Date()
      });

      const req = { body: { property_id: 1, user_name: 'John', start_date: '2025-08-10', end_date: '2025-08-15' } };
      const json = jest.fn();
      const status = jest.fn(() => ({ json }));

      await bookingController.createBooking(req, { status, json });

      expect(status).toHaveBeenCalledWith(201);
      expect(json).toHaveBeenCalledWith(expect.objectContaining({
        property_id: 1,
        user_name: 'John'
      }));
    });
  });

  describe('cancelBooking', () => {
    test('should return 404 if booking not found', async () => {
      Booking.findByPk.mockResolvedValue(null);
      const req = { params: { id: 1 } };
      const json = jest.fn();
      const status = jest.fn(() => ({ json }));

      await bookingController.cancelBooking(req, { status });

      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({ message: 'Booking not found' });
    });

    test('should delete booking successfully', async () => {
      const destroyMock = jest.fn().mockResolvedValue();
      Booking.findByPk.mockResolvedValue({ destroy: destroyMock });

      const req = { params: { id: 1 } };
      const json = jest.fn();
      const status = jest.fn(() => ({ json }));

      await bookingController.cancelBooking(req, { status, json });

      expect(destroyMock).toHaveBeenCalled();
      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({ message: 'Booking cancelled successfully' });
    });
  });
});
