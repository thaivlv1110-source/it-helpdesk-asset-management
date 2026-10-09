const express = require("express");
const cors = require("cors");

const authRoutes = require(
  "./routes/authRoutes"
);

const adminRoutes = require(
  "./routes/adminRoutes"
);

const ticketRoutes = require(
  "./routes/ticketRoutes"
);

const assetRoutes = require(
  "./routes/assetRoutes"
);

const supportRoutes = require(
  "./routes/supportRoutes"
);

const dashboardRoutes = require(
  "./routes/dashboardRoutes"
);

const app = express();

app.use(
  cors({
    origin:
      "http://localhost:5173",
  })
);

app.use(
  express.json()
);

app.get(
  "/",
  (req, res) => {
    res.json({
      message:
        "IT Helpdesk API is running",
    });
  }
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/tickets",
  ticketRoutes
);

app.use(
  "/api/assets",
  assetRoutes
);

app.use(
  "/api/support",
  supportRoutes
);

app.use(
  "/api/admin/dashboard",
  dashboardRoutes
);

module.exports = app;