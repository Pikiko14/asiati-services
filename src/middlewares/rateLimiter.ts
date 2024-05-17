// src/middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutos
  max: 50, // Limite cada IP a 100 peticiones por ventana de 15 minutos
  message: 'Muchas peticiones. Por favor, espere 1 minuto',
  headers: true, // Añade información en los headers
});
