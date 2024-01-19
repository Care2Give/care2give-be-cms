import express from "express";
import { NextFunction, Request, Response } from "express";

const customJSONBodyParser = () =>
  (req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/v1/payment/webhook' && req.method === 'POST') {
        return next();
    } else {
       return express.json()(req, res, next);
    }
  };

export default customJSONBodyParser;
