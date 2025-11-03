import { Controller, Get, Post, Body, Render, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  showForm() {
    return { errors: null, oldData: null };
  }

  @Post()
  async createBooking(@Body() bookingData: any, @Res() res: Response) {
    try {
      await this.appService.createBooking(bookingData);
      return res.redirect('/success');
    } catch (error) {
      return res.render('index', {
        errors: error.response.message,
        oldData: bookingData
      });
    }
  }

  @Get('success')
  @Render('success')
  success() {
    return {};
  }
}

