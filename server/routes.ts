import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { exchangeService } from "./services/exchange-service";
import { marketService } from "./services/market-service";

// Типы для API ответов
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Вспомогательная функция для успешных ответов
function sendSuccess<T>(res: Response, data: T, statusCode: number = 200) {
  const response: ApiResponse<T> = { success: true, data };
  return res.status(statusCode).json(response);
}

// Вспомогательная функция для ошибок
function sendError(res: Response, error: string, statusCode: number = 400) {
  const response: ApiResponse = { success: false, error };
  return res.status(statusCode).json(response);
}

// Обертка для обработки асинхронных ошибок
function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Схемы валидации
const marketQuerySchema = z.object({
  symbol: z.string().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

const newsQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(50).optional(),
  source: z.string().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // API routes с реальными данными с бирж
  app.get(
    "/api/exchanges",
    asyncHandler(async (req, res) => {
      const exchanges = exchangeService.getEnabledExchanges();
      return sendSuccess(res, exchanges);
    })
  );

  app.get(
    "/api/symbols/popular",
    asyncHandler(async (req, res) => {
      const symbols = exchangeService.getPopularPairs();
      return sendSuccess(res, symbols);
    })
  );

  app.get(
    "/api/prices/:symbol",
    asyncHandler(async (req, res) => {
      const { symbol } = req.params;
      const exchanges = req.query.exchanges
        ? (req.query.exchanges as string).split(",")
        : undefined;

      const data = await exchangeService.getSymbolData(symbol.toUpperCase(), exchanges);
      return sendSuccess(res, data);
    })
  );

  app.get(
    "/api/market-data/:symbol",
    asyncHandler(async (req, res) => {
      const { symbol } = req.params;
      const data = await marketService.getMarketData(symbol.toUpperCase());
      return sendSuccess(res, data);
    })
  );

  app.get(
    "/api/arbitrage/:symbol",
    asyncHandler(async (req, res) => {
      const { symbol } = req.params;
      const threshold = req.query.threshold
        ? parseFloat(req.query.threshold as string)
        : 1.0;

      const arbitrage = await exchangeService.checkArbitrage(
        symbol.toUpperCase(),
        threshold
      );
      return sendSuccess(res, arbitrage);
    })
  );

  app.get(
    "/api/markets",
    asyncHandler(async (req, res) => {
      try {
        const query = marketQuerySchema.parse(req.query);
        const limit = query.limit || 20;
        const symbols = exchangeService.getPopularPairs().slice(0, limit);

        // Получаем данные для всех символов параллельно
        const marketDataPromises = symbols.map(async (symbol) => {
          const [priceData, marketData] = await Promise.all([
            exchangeService.getSymbolData(symbol),
            marketService.getMarketData(symbol),
          ]);

          return {
            symbol,
            price: priceData.maxPrice || priceData.minPrice || null,
            change: marketData.priceChangePercent24h || null,
            volume: marketData.volume24h || null,
            difference: priceData.difference || null,
            exchanges: Object.keys(priceData.prices).filter(
              (ex) => priceData.prices[ex] !== null
            ).length,
          };
        });

        let markets = await Promise.all(marketDataPromises);

        // Фильтрация по символу, если указан
        if (query.symbol) {
          markets = markets.filter((m) =>
            m.symbol.toLowerCase().includes(query.symbol!.toLowerCase())
          );
        }

        return sendSuccess(res, markets);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return sendError(
            res,
            `Неверные параметры запроса: ${error.errors.map((e) => e.message).join(", ")}`,
            400
          );
        }
        throw error;
      }
    })
  );

  app.get(
    "/api/news",
    asyncHandler(async (req, res) => {
      try {
        // Валидация query параметров
        const query = newsQuerySchema.parse(req.query);
        const limit = query.limit || 50;

        // Sample news data с категориями
        const allNews = [
          {
            id: 1,
            title: "Обновление платформы Trader+PLUS v2.0",
            content: "Мы рады объявить о выпуске новой версии платформы с улучшенной аналитикой и новыми функциями социальной торговли.",
            author: "Trader+PLUS Team",
            category: "platform" as const,
            publishedAt: new Date(Date.now() - 3600000).toISOString(),
            likes: 124,
            comments: 23,
            tags: ["обновление", "платформа", "новые функции"],
          },
          {
            id: 2,
            title: "Bitcoin breaks $65K resistance",
            content: "BTC surges past key resistance level as institutional investors increase holdings. Market analysts predict continued bullish momentum.",
            author: "CryptoDaily",
            category: "international" as const,
            source: "CryptoDaily",
            publishedAt: new Date(Date.now() - 600000).toISOString(),
            likes: 89,
            comments: 15,
            tags: ["bitcoin", "рынок", "анализ"],
          },
          {
            id: 3,
            title: "Binance объявляет о новых листингах",
            content: "Binance добавила 5 новых торговых пар на спотовый рынок, включая несколько DeFi токенов.",
            author: "Binance News",
            category: "exchange" as const,
            source: "Binance",
            publishedAt: new Date(Date.now() - 1800000).toISOString(),
            likes: 67,
            comments: 12,
            tags: ["binance", "листинг", "DeFi"],
          },
          {
            id: 4,
            title: "Мой опыт арбитражной торговли",
            content: "Поделюсь своим опытом заработка на разнице цен между биржами. За месяц удалось получить 15% прибыли.",
            author: "CryptoTrader2024",
            category: "user" as const,
            publishedAt: new Date(Date.now() - 7200000).toISOString(),
            likes: 234,
            comments: 45,
            tags: ["арбитраж", "опыт", "стратегия"],
          },
          {
            id: 5,
            title: "Bybit запускает новую программу стейкинга",
            content: "Bybit представила улучшенную программу стейкинга с повышенными процентами для популярных токенов.",
            author: "Bybit Official",
            category: "exchange" as const,
            source: "Bybit",
            publishedAt: new Date(Date.now() - 3600000).toISOString(),
            likes: 156,
            comments: 28,
            tags: ["bybit", "стейкинг", "DeFi"],
          },
          {
            id: 6,
            title: "Fed meeting impact on markets",
            content: "Markets respond to Federal Reserve's latest interest rate decision and forward guidance. Crypto markets show mixed reactions.",
            author: "FinanceNews",
            category: "international" as const,
            source: "FinanceNews",
            publishedAt: new Date(Date.now() - 5400000).toISOString(),
            likes: 78,
            comments: 19,
            tags: ["федеральная резервная система", "регулирование", "рынок"],
          },
        ];

        let news = allNews;

        // Фильтрация по источнику, если указан
        if (query.source) {
          news = allNews.filter((n) =>
            n.source?.toLowerCase().includes(query.source!.toLowerCase())
          );
        }

        // Ограничение количества результатов
        news = news.slice(0, limit);

        return sendSuccess(res, news);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return sendError(res, `Неверные параметры запроса: ${error.errors.map(e => e.message).join(", ")}`, 400);
        }
        throw error;
      }
    })
  );

  // Teachers, Streams, Lessons endpoints
  app.get(
    "/api/teachers",
    asyncHandler(async (req, res) => {
      const teachers = [
        {
          id: 1,
          name: "Alexandra Chen",
          role: "Профессиональный трейдер",
          rating: 4.9,
          students: 1250,
          courses: 8,
          specialties: ["Технический анализ", "Арбитраж", "Риск-менеджмент"],
          bio: "15+ лет опыта в трейдинге. Бывший менеджер хедж-фонда.",
          isOnline: true,
          subscriptionRequired: false,
        },
        {
          id: 2,
          name: "Michael Rodriguez",
          role: "Разработчик платформы",
          rating: 5.0,
          students: 890,
          courses: 5,
          specialties: ["API интеграция", "Алгоритмическая торговля", "Блокчейн"],
          bio: "CTO Trader+PLUS. Эксперт в машинном обучении для финансов.",
          isOnline: true,
          subscriptionRequired: true,
        },
        {
          id: 3,
          name: "Sarah Williams",
          role: "Основатель платформы",
          rating: 4.8,
          students: 2100,
          courses: 12,
          specialties: ["Образование", "Стратегии", "Психология трейдинга"],
          bio: "CEO и основатель. Финансовый педагог с наградами.",
          isOnline: false,
          subscriptionRequired: true,
        },
        {
          id: 4,
          name: "David Patel",
          role: "Руководитель сообщества",
          rating: 4.7,
          students: 650,
          courses: 4,
          specialties: ["Социальная торговля", "Сообщества", "Менторство"],
          bio: "Эксперт по построению торговых сообществ.",
          isOnline: true,
          subscriptionRequired: false,
        },
      ];
      return sendSuccess(res, teachers);
    })
  );

  app.get(
    "/api/streams",
    asyncHandler(async (req, res) => {
      const streams = [
        {
          id: 1,
          teacherId: 1,
          title: "Анализ рынка в реальном времени",
          description: "Разбор текущей ситуации на рынке и торговые возможности",
          scheduledTime: new Date(Date.now() + 3600000).toISOString(),
          duration: 60,
          status: "upcoming" as const,
        },
        {
          id: 2,
          teacherId: 2,
          title: "API интеграция для автоматической торговли",
          description: "Как настроить автоматическую торговлю через API",
          scheduledTime: new Date().toISOString(),
          duration: 90,
          status: "live" as const,
          viewers: 234,
        },
        {
          id: 3,
          teacherId: 3,
          title: "Q&A с основателем платформы",
          description: "Ответы на вопросы о платформе и будущих обновлениях",
          scheduledTime: new Date(Date.now() + 86400000).toISOString(),
          duration: 45,
          status: "upcoming" as const,
        },
      ];
      return sendSuccess(res, streams);
    })
  );

  app.get(
    "/api/lessons",
    asyncHandler(async (req, res) => {
      const lessons = [
        {
          id: 1,
          teacherId: 1,
          title: "Основы технического анализа",
          description: "Изучите базовые паттерны и индикаторы",
          duration: "45 мин",
          level: "Начинающий",
          category: "Технический анализ",
        },
        {
          id: 2,
          teacherId: 2,
          title: "Настройка API для торговли",
          description: "Практическое руководство по интеграции API бирж",
          duration: "60 мин",
          level: "Продвинутый",
          category: "Разработка",
        },
        {
          id: 3,
          teacherId: 3,
          title: "Психология успешного трейдинга",
          description: "Как контролировать эмоции и принимать правильные решения",
          duration: "30 мин",
          level: "Средний",
          category: "Психология",
        },
      ];
      return sendSuccess(res, lessons);
    })
  );

  // News endpoints with categories
  app.post(
    "/api/news/:id/like",
    asyncHandler(async (req, res) => {
      if (!req.isAuthenticated()) {
        return sendError(res, "Требуется авторизация", 401);
      }
      // В реальном приложении здесь была бы логика лайка в БД
      return sendSuccess(res, { liked: true });
    })
  );

  app.post(
    "/api/news/:id/bookmark",
    asyncHandler(async (req, res) => {
      if (!req.isAuthenticated()) {
        return sendError(res, "Требуется авторизация", 401);
      }
      // В реальном приложении здесь была бы логика закладки в БД
      return sendSuccess(res, { bookmarked: true });
    })
  );

  // User profile update
  app.put(
    "/api/user",
    asyncHandler(async (req, res) => {
      if (!req.isAuthenticated()) {
        return sendError(res, "Требуется авторизация", 401);
      }
      try {
        const updateSchema = z.object({
          email: z.string().email().optional().or(z.literal("")),
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          phone: z.string().optional(),
        });
        
        const validatedData = updateSchema.parse(req.body);
        
        // В реальном приложении здесь была бы логика обновления профиля в БД
        // await db.update(users).set(validatedData).where(eq(users.id, req.user.id));
        
        const { password, ...userWithoutPassword } = req.user;
        return sendSuccess(res, { ...userWithoutPassword, ...validatedData });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return sendError(
            res,
            `Ошибка валидации: ${error.errors.map((e) => e.message).join(", ")}`,
            400
          );
        }
        throw error;
      }
    })
  );

  // Subscription endpoints
  app.get(
    "/api/subscription/status",
    asyncHandler(async (req, res) => {
      if (!req.isAuthenticated()) {
        return sendError(res, "Требуется авторизация", 401);
      }
      // В реальном приложении здесь была бы проверка подписки из БД
      return sendSuccess(res, {
        level: "free",
        expiresAt: null,
        isActive: false,
      });
    })
  );

  app.post(
    "/api/subscription/upgrade",
    asyncHandler(async (req, res) => {
      if (!req.isAuthenticated()) {
        return sendError(res, "Требуется авторизация", 401);
      }
      // В реальном приложении здесь была бы логика обновления подписки
      return sendError(res, "Платежная система не настроена", 501);
    })
  );

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    return sendSuccess(res, {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
