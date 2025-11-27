/**
 * Сервис для получения рыночных данных из CoinGecko
 */
import axios from "axios";

export interface MarketData {
  symbol: string;
  marketCap: number | null;
  volume24h: number | null;
  priceChange24h: number | null;
  priceChangePercent24h: number | null;
  currentPrice: number | null;
}

// Маппинг символов токенов на CoinGecko ID
const COINGECKO_IDS: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  BNB: "binancecoin",
  SOL: "solana",
  XRP: "ripple",
  ADA: "cardano",
  DOGE: "dogecoin",
  DOT: "polkadot",
  MATIC: "matic-network",
  AVAX: "avalanche-2",
  LINK: "chainlink",
  UNI: "uniswap",
  ATOM: "cosmos",
  ETC: "ethereum-classic",
  LTC: "litecoin",
  NEAR: "near",
  APT: "aptos",
  ARB: "arbitrum",
  OP: "optimism",
  SUI: "sui",
  INJ: "injective-protocol",
  SEI: "sei-network",
  TIA: "celestia",
  FTM: "fantom",
  ALGO: "algorand",
  AAVE: "aave",
  MKR: "maker",
  SNX: "havven",
  COMP: "compound-governance-token",
  CRV: "curve-dao-token",
  SHIB: "shiba-inu",
  PEPE: "pepe",
  FLOKI: "floki",
  BONK: "bonk",
  WIF: "dogwifcoin",
  SUSHI: "sushi",
  "1INCH": "1inch",
  CAKE: "pancakeswap-token",
  GMX: "gmx",
  RDNT: "radiant-capital",
  STRK: "starknet",
  MANTA: "manta-network",
  METIS: "metis-token",
  AXS: "axie-infinity",
  SAND: "the-sandbox",
  MANA: "decentraland",
  ENJ: "enjincoin",
  GALA: "gala",
};

export class MarketService {
  private baseUrl = "https://api.coingecko.com/api/v3";
  private apiKey: string | undefined;
  private cache: Map<string, { data: MarketData; timestamp: number }> = new Map();
  private readonly cacheTTL = 300000; // 5 минут

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.COINGECKO_API_KEY;
  }

  private getCoinId(symbol: string): string | null {
    // Извлекаем базовый токен из пары (например, BTC из BTC/USDT)
    const baseToken = symbol.split("/")[0];
    return COINGECKO_IDS[baseToken] || null;
  }

  async getMarketData(symbol: string): Promise<MarketData> {
    // Проверка кэша
    const cached = this.cache.get(symbol);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }

    const coinId = this.getCoinId(symbol);
    if (!coinId) {
      const emptyData: MarketData = {
        symbol,
        marketCap: null,
        volume24h: null,
        priceChange24h: null,
        priceChangePercent24h: null,
        currentPrice: null,
      };
      return emptyData;
    }

    try {
      const params: Record<string, string> = {
        ids: coinId,
        vs_currencies: "usd",
        include_market_cap: "true",
        include_24hr_vol: "true",
        include_24hr_change: "true",
      };

      if (this.apiKey) {
        params["x_cg_demo_api_key"] = this.apiKey;
      }

      const response = await axios.get(`${this.baseUrl}/simple/price`, {
        params,
        timeout: 10000,
      });

      if (response.data && response.data[coinId]) {
        const coinData = response.data[coinId];
        const marketData: MarketData = {
          symbol,
          marketCap: coinData.usd_market_cap || null,
          volume24h: coinData.usd_24h_vol || null,
          priceChange24h: coinData.usd_24h_change || null,
          priceChangePercent24h: coinData.usd_24h_change || null,
          currentPrice: coinData.usd || null,
        };

        // Обновление кэша
        this.cache.set(symbol, { data: marketData, timestamp: Date.now() });
        return marketData;
      }
    } catch (error) {
      console.error(`Ошибка при получении данных CoinGecko для ${symbol}:`, error);
    }

    // Возвращаем пустые данные при ошибке
    const emptyData: MarketData = {
      symbol,
      marketCap: null,
      volume24h: null,
      priceChange24h: null,
      priceChangePercent24h: null,
      currentPrice: null,
    };
    return emptyData;
  }

  async getMultipleMarketData(symbols: string[]): Promise<Record<string, MarketData>> {
    const tasks = symbols.map((symbol) => this.getMarketData(symbol));
    const results = await Promise.allSettled(tasks);

    const marketData: Record<string, MarketData> = {};
    symbols.forEach((symbol, index) => {
      const result = results[index];
      if (result.status === "fulfilled") {
        marketData[symbol] = result.value;
      } else {
        marketData[symbol] = {
          symbol,
          marketCap: null,
          volume24h: null,
          priceChange24h: null,
          priceChangePercent24h: null,
          currentPrice: null,
        };
      }
    });

    return marketData;
  }
}

// Глобальный экземпляр сервиса
export const marketService = new MarketService();

