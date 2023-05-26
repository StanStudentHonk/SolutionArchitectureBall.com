import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, lastValueFrom } from 'rxjs';
import { Currency } from './currency.enum';

@Injectable()
export class CurrencyService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async getCurrencyConversion(from: Currency, to: Currency): Promise<number> {
    const apiUrl = 'https://api.freecurrencyapi.com/v1/latest';
    const apiKey = this.configService.get<string>('API_TOKEN');

    const res = await lastValueFrom(
      this.httpService.get(apiUrl, {
        params: {
          base_currency: from,
          currencies: to,
        },
        headers: {
            apikey: apiKey,
        },
      }),
    );

    return res.data['data'][to];
  }
}
