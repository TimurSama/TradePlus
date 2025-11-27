/**
 * Сервис для работы с биржами через CCXT
 */
import ccxt from "ccxt";
import type { Exchange } from "ccxt";

export interface ExchangePrice {
  exchange: string;
  price: number | null;
  volume24h?: number;
  timestamp?: number;
}

export interface SymbolData {
  symbol: string;
  prices: Record<string, number | null>;
  maxPrice: number | null;
  minPrice: number | null;
  difference: number | null;
  higherExchange: string | null;
  lowerExchange: string | null;
  timestamp: Date;
}

export class ExchangeService {
  private exchanges: Map<string, Exchange> = new Map();
  private readonly supportedExchanges = [
    "bybit",
    "binance",
    "okx",
    "kucoin",
    "gateio",
    "huobi",
    "kraken",
    "bitget",
    "mexc",
  ];

  private readonly popularPairs = [
    "BTC/USDT",
    "ETH/USDT",
    "BNB/USDT",
    "SOL/USDT",
    "XRP/USDT",
    "ADA/USDT",
    "DOGE/USDT",
    "DOT/USDT",
    "MATIC/USDT",
    "AVAX/USDT",
    "LINK/USDT",
    "UNI/USDT",
    "ATOM/USDT",
    "ETC/USDT",
    "LTC/USDT",
    "NEAR/USDT",
    "APT/USDT",
    "ARB/USDT",
    "OP/USDT",
    "SUI/USDT",
    "INJ/USDT",
    "SEI/USDT",
    "TIA/USDT",
    "FTM/USDT",
    "ALGO/USDT",
    "AAVE/USDT",
    "MKR/USDT",
    "SNX/USDT",
    "COMP/USDT",
    "CRV/USDT",
    "SHIB/USDT",
    "PEPE/USDT",
    "FLOKI/USDT",
    "BONK/USDT",
    "WIF/USDT",
    "SUSHI/USDT",
    "1INCH/USDT",
    "CAKE/USDT",
    "GMX/USDT",
    "RDNT/USDT",
    "STRK/USDT",
    "MANTA/USDT",
    "METIS/USDT",
    "AXS/USDT",
    "SAND/USDT",
    "MANA/USDT",
    "ENJ/USDT",
    "GALA/USDT",
  ];

  constructor(enabledExchanges?: string[]) {
    const exchangesToInit = enabledExchanges || this.supportedExchanges;
    this.initializeExchanges(exchangesToInit);
  }

  private initializeExchanges(exchangeNames: string[]) {
    for (const exchangeName of exchangeNames) {
      try {
        const ExchangeClass = ccxt[exchangeName as keyof typeof ccxt] as typeof ccxt.Exchange;
        if (!ExchangeClass) {
          console.warn(`Биржа ${exchangeName} не найдена в CCXT`);
          continue;
        }

        const exchange = new ExchangeClass({
          enableRateLimit: true,
          timeout: 10000,
        }) as Exchange;

        this.exchanges.set(exchangeName, exchange);
      } catch (error) {
        console.error(`Ошибка инициализации биржи ${exchangeName}:`, error);
      }
    }
  }

  getEnabledExchanges(): string[] {
    return Array.from(this.exchanges.keys());
  }

  getPopularPairs(): string[] {
    return [...this.popularPairs];
  }

  async getPrices(symbol: string, exchanges?: string[]): Promise<Record<string, number | null>> {
    const targetExchanges = exchanges || this.getEnabledExchanges();
    const prices: Record<string, number | null> = {};

    const promises = targetExchanges.map(async (exchangeName) => {
      const exchange = this.exchanges.get(exchangeName);
      if (!exchange) {
        prices[exchangeName] = null;
        return;
      }

      try {
        const ticker = await exchange.fetchTicker(symbol);
        prices[exchangeName] = ticker.last || null;
      } catch (error) {
        console.error(`Ошибка получения цены с ${exchangeName} для ${symbol}:`, error);
        prices[exchangeName] = null;
      }
    });

    await Promise.allSettled(promises);
    return prices;
  }

  async getSymbolData(symbol: string, exchanges?: string[]): Promise<SymbolData> {
    const prices = await this.getPrices(symbol, exchanges);

    // Фильтруем валидные цены
    const validPrices = Object.entries(prices).filter(
      ([_, price]) => price !== null
    ) as [string, number][];

    if (validPrices.length < 2) {
      return {
        symbol,
        prices,
        maxPrice: null,
        minPrice: null,
        difference: null,
        higherExchange: null,
        lowerExchange: null,
        timestamp: new Date(),
      };
    }

    // Находим максимальную и минимальную цены
    const maxEntry = validPrices.reduce((max, curr) => (curr[1] > max[1] ? curr : max));
    const minEntry = validPrices.reduce((min, curr) => (curr[1] < min[1] ? curr : min));

    const maxPrice = maxEntry[1];
    const minPrice = minEntry[1];
    const difference = this.calculatePriceDifference(maxPrice, minPrice);

    return {
      symbol,
      prices,
      maxPrice,
      minPrice,
      difference,
      higherExchange: maxEntry[0],
      lowerExchange: minEntry[0],
      timestamp: new Date(),
    };
  }

  calculatePriceDifference(price1: number, price2: number): number {
    if (price2 === 0) return 0;
    return ((price1 - price2) / price2) * 100;
  }

  async checkArbitrage(symbol: string, threshold: number = 1.0): Promise<SymbolData | null> {
    const data = await this.getSymbolData(symbol);
    if (data.difference && data.difference >= threshold) {
      return data;
    }
    return null;
  }
}

// Глобальный экземпляр сервиса
export const exchangeService = new ExchangeService();

