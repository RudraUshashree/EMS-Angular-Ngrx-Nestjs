import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      // Get the token from the Authorization header
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Token missing');
      }

      // Extract the token
      const token = authHeader.split(' ')[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      // Attach the decoded user data to the request
      req['userId'] = decoded;

      // Pass the request to the next handler
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}