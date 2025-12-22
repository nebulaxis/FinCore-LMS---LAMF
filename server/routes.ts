import type { Express } from "express";
import { createServer, type Server } from "http";

import productRoutes from "./modules/products/product.routes";
import applicationRoutes from "./modules/applications/application.routes";
import loanRoutes from "./modules/loans/loan.routes";
import collateralRoutes from "./modules/collaterals/collateral.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const apiPrefix = "/api/v1";

  app.use(`${apiPrefix}/products`, productRoutes);
  app.use(`${apiPrefix}/applications`, applicationRoutes);
  app.use(`${apiPrefix}/loans`, loanRoutes);
  app.use(`${apiPrefix}/collaterals`, collateralRoutes);
  app.use(`${apiPrefix}/dashboard`, dashboardRoutes);

  // 404 fallback
  app.use(`${apiPrefix}/*`, (req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  return httpServer;
}
