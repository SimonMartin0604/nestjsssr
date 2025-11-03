import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

interface BookingData {
  name: string;
  email: string;
  dateTime: string;
  numberOfGuests: number;
}

@Injectable()
export class AppService {
  private readonly csvFilePath = path.join(process.cwd(), 'bookings.csv');

  constructor() {
    if (!fs.existsSync(this.csvFilePath)) {
      fs.writeFileSync(this.csvFilePath, 'Név,Email,Dátum,Nézők száma\n');
    }
  }

  validateBooking(booking: BookingData) {
    const errors: string[] = [];
    
    if (!booking.name) {
      errors.push('A név megadása kötelező');
    }

    if (!booking.email || !/^[^@]+@[^@]+\.[^@]+$/.test(booking.email)) {
      errors.push('Érvényes email cím megadása kötelező');
    }

    const bookingDate = new Date(booking.dateTime);
    const now = new Date();
    if (!booking.dateTime || bookingDate <= now) {
      errors.push('A dátum nem lehet korábbi az aktuális időpontnál');
    }

    const guests = Number(booking.numberOfGuests);
    if (!Number.isInteger(guests) || guests < 1 || guests > 10) {
      errors.push('A vendégek száma 1 és 10 között lehet');
    }

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
  }

  createBooking(bookingData: BookingData) {
    this.validateBooking(bookingData);
    const csvLine = `${bookingData.name},${bookingData.email},${bookingData.dateTime},${bookingData.numberOfGuests}\n`;
    fs.appendFileSync(this.csvFilePath, csvLine);
    return { success: true };
  }
}
