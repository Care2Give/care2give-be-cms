import { NextFunction, Request, Response } from "express";

export default function clerkValidateOrigin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { public_metadata } = req.auth.claims as any;
  const { role } = public_metadata;
  if (
    role === "superuser" ||
    role === "donation-manager" ||
    role === "campaign-manager"
  ) {
    next();
  } else {
    res.status(403).send("Forbidden");
  }
}
