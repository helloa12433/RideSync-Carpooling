import { Request, Response } from 'express';
import { bookingService } from '../services/booking.service';
import { sendResponse } from '../utils/response';
import { HTTP_STATUS } from '../utils/constants';
import { mapBookingToDto } from '../utils/mapper';
import { logger } from '../config/logger';

export class BookingController {
  async createBooking(req: Request, res: Response) {
    try {
      const { rideId, seats, totalPrice } = req.body;
      const userId = req.user!.id;

      const booking = await bookingService.createBooking({
        rideId,
        userId,
        seats,
        totalPrice,
      });

      return sendResponse(res, HTTP_STATUS.CREATED, true, 'Booking created successfully', mapBookingToDto(booking));
    } catch (error: any) {
      logger.error('Error in createBooking controller', error);
      return sendResponse(res, HTTP_STATUS.BAD_REQUEST, false, error.message || 'Failed to create booking');
    }
  }

  async getBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const booking = await bookingService.getBooking(id);

      if (!booking) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, false, 'Booking not found');
      }

      return sendResponse(res, HTTP_STATUS.OK, true, 'Booking retrieved successfully', mapBookingToDto(booking));
    } catch (error: any) {
      logger.error('Error in getBooking controller', error);
      return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, false, 'Failed to retrieve booking');
    }
  }

  async cancelBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      await bookingService.cancelBooking(id, userId);

      return sendResponse(res, HTTP_STATUS.OK, true, 'Booking cancelled successfully');
    } catch (error: any) {
      logger.error('Error in cancelBooking controller', error);
      return sendResponse(res, HTTP_STATUS.BAD_REQUEST, false, error.message || 'Failed to cancel booking');
    }
  }

  async getUserBookings(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const bookings = await bookingService.getUserBookings(userId);

      const data = bookings.map(mapBookingToDto);
      return sendResponse(res, HTTP_STATUS.OK, true, 'User bookings retrieved successfully', data);
    } catch (error: any) {
      logger.error('Error in getUserBookings controller', error);
      return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, false, 'Failed to retrieve user bookings');
    }
  }
}

export const bookingController = new BookingController();
