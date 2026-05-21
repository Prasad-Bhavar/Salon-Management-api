import { Request, Response, NextFunction } from "express";
import { AnySchema, ValidationError } from "yup";

export const validate =
  (schema: AnySchema, property: "body" | "query" | "params" = "body") =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const validated = await schema.validate(req[property], {
          abortEarly: false,
          stripUnknown: true,
        });

        Object.assign(req[property], validated);

        next();
      } catch (err) {
        if (err instanceof ValidationError) {
          return res.status(400).json({
            message: "Validation failed",
            errors: err.errors,
          });
        }
        next(err);
      }
    };