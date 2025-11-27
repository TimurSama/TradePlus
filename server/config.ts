/**
 * Конфигурация приложения
 * Загружает переменные окружения и предоставляет типизированный доступ к ним
 */

interface Config {
  port: number;
  nodeEnv: "development" | "production" | "test";
  databaseUrl: string;
  sessionSecret: string;
  cookieSecure: boolean;
  cookieMaxAge: number;
}

function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name];
  if (!value && !defaultValue) {
    throw new Error(`Переменная окружения ${name} не установлена`);
  }
  return value || defaultValue!;
}

function getEnvNumber(name: string, defaultValue: number): number {
  const value = process.env[name];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    console.warn(`Неверное значение для ${name}: ${value}, используется значение по умолчанию: ${defaultValue}`);
    return defaultValue;
  }
  return parsed;
}

function getEnvBoolean(name: string, defaultValue: boolean): boolean {
  const value = process.env[name];
  if (!value) return defaultValue;
  return value.toLowerCase() === "true" || value === "1";
}

export const config: Config = {
  port: getEnvNumber("PORT", 3000),
  nodeEnv: (process.env.NODE_ENV as Config["nodeEnv"]) || "development",
  databaseUrl: process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/traderplus",
  sessionSecret: getEnvVar("SESSION_SECRET", "trader-plus-secret-key-change-in-production"),
  cookieSecure: getEnvBoolean("COOKIE_SECURE", process.env.NODE_ENV === "production"),
  cookieMaxAge: getEnvNumber("COOKIE_MAX_AGE", 7 * 24 * 60 * 60 * 1000), // 7 дней по умолчанию
};

// Валидация критических переменных в продакшене
if (config.nodeEnv === "production") {
  if (config.sessionSecret === "trader-plus-secret-key-change-in-production") {
    console.warn("⚠️  ВНИМАНИЕ: Используется секретный ключ по умолчанию! Установите SESSION_SECRET в продакшене.");
  }
  if (!config.databaseUrl) {
    throw new Error("DATABASE_URL обязателен в продакшене");
  }
}

export default config;

