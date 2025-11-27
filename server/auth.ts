import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import { z } from "zod";
import type { ApiResponse } from "./routes";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

// Схемы валидации
const registerSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, "Имя пользователя может содержать только буквы, цифры и подчеркивания"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
});

const loginSchema = z.object({
  username: z.string().min(1, "Имя пользователя обязательно"),
  password: z.string().min(1, "Пароль обязателен"),
});

// Вспомогательные функции для ответов
function sendSuccess<T>(res: Response, data: T, statusCode: number = 200) {
  const response: ApiResponse<T> = { success: true, data };
  return res.status(statusCode).json(response);
}

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

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

import config from "./config";

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: config.cookieMaxAge,
      secure: config.cookieSecure,
      httpOnly: true,
      sameSite: "lax",
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (err) {
        return done(err);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  app.post(
    "/api/register",
    asyncHandler(async (req, res, next) => {
      try {
        // Валидация входных данных
        const validatedData = registerSchema.parse(req.body);

        // Проверка существования пользователя
        const existingUser = await storage.getUserByUsername(validatedData.username);
        if (existingUser) {
          return sendError(res, "Пользователь с таким именем уже существует", 400);
        }

        // Создание нового пользователя
        const user = await storage.createUser({
          username: validatedData.username,
          password: await hashPassword(validatedData.password),
        });

        // Автоматический вход после регистрации
        req.login(user, (err) => {
          if (err) return next(err);
          // Не возвращаем пароль в ответе
          const { password, ...userWithoutPassword } = user;
          return sendSuccess(res, userWithoutPassword, 201);
        });
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

  app.post(
    "/api/login",
    asyncHandler(async (req, res, next) => {
      try {
        // Валидация входных данных
        const validatedData = loginSchema.parse(req.body);

        passport.authenticate("local", (err, user, info) => {
          if (err) return next(err);
          if (!user) {
            return sendError(res, "Неверное имя пользователя или пароль", 401);
          }

          req.login(user, (err) => {
            if (err) return next(err);
            // Не возвращаем пароль в ответе
            const { password, ...userWithoutPassword } = user;
            return sendSuccess(res, userWithoutPassword);
          });
        })(req, res, next);
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

  app.post(
    "/api/logout",
    asyncHandler(async (req, res, next) => {
      if (!req.isAuthenticated()) {
        return sendError(res, "Пользователь не авторизован", 401);
      }

      req.logout((err) => {
        if (err) return next(err);
        return sendSuccess(res, { message: "Выход выполнен успешно" });
      });
    })
  );

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return sendError(res, "Пользователь не авторизован", 401);
    }
    // Не возвращаем пароль в ответе
    const { password, ...userWithoutPassword } = req.user;
    return sendSuccess(res, userWithoutPassword);
  });
}
