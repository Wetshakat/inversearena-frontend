import { Router } from "express";
import { asyncHandler } from "../middleware/validate";
import type { TransactionsController } from "../controllers/transactions.controller";

export function createTransactionsRouter(controller: TransactionsController): Router {
  const router = Router();

  router.get("/:id", asyncHandler(controller.getById));

  return router;
}
