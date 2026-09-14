const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const ipTracker = require("../utils/ipTracker");

// ============================================================
// Helper to update root .env file and process.env
// ============================================================
function updateEnvFile(updates) {
  const envPath = path.join(__dirname, "..", ".env");
  let envContent = "";
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf-8");
  }
  let lines = envContent.split(/\r?\n/).map(line => line.trim());

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

  while (lines.length > 0 && lines[lines.length - 1] === "") {
    lines.pop();
  }

  fs.writeFileSync(envPath, lines.join("\n") + "\n", "utf-8");
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

function requireApiAuth(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  return res.status(401).json({ success: false, error: "Phiên làm việc hết hạn. Vui lòng đăng nhập lại!" });
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

// API: Update domains & redirect delay
// ============================================================
router.post("/api/domains", requireApiAuth, (req, res) => {
  const { redirectDomain, loginDomain, regDomain, cskhLink, copyrightLink, copyrightText, redirectDelay } = req.body;
  const domainConfig = req.app.locals.domainConfig;
  const updates = {};

  const cleanDomain = (val) => {
    if (!val || val.trim() === "") return "";
    const trimmed = val.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  if (redirectDomain !== undefined) {
    const formatted = cleanDomain(redirectDomain);
    domainConfig.redirectDomain = formatted;
    updates.REDIRECT_DOMAIN = formatted;
  }
  if (loginDomain !== undefined) {
    const formatted = cleanDomain(loginDomain);
    domainConfig.loginDomain = formatted;
    updates.LOGIN_DOMAIN = formatted;
  }
  if (regDomain !== undefined) {
    const formatted = cleanDomain(regDomain);
    domainConfig.regDomain = formatted;
    updates.REG_DOMAIN = formatted;
  }
  if (cskhLink !== undefined) {
    const formatted = cleanDomain(cskhLink);
    domainConfig.cskhLink = formatted;
    updates.CSKH_LINK = formatted;
  }
  if (copyrightLink !== undefined) {
    const formatted = cleanDomain(copyrightLink);
    domainConfig.copyrightLink = formatted;
    updates.COPYRIGHT_LINK = formatted;
  }
  if (copyrightText !== undefined) {
    const trimmedText = copyrightText.trim();
    domainConfig.copyrightText = trimmedText;
    updates.COPYRIGHT_TEXT = trimmedText;
  }
  if (redirectDelay !== undefined) {
    const delayNum = parseInt(redirectDelay, 10);
    const validDelay = isNaN(delayNum) || delayNum < 0 ? 0 : delayNum;
    domainConfig.redirectDelay = validDelay.toString();
    updates.REDIRECT_DELAY_SECONDS = validDelay.toString();
  }

  try {
    updateEnvFile(updates);
    return res.json({ success: true, domainConfig });
  } catch (error) {
    console.error("Error writing domain config:", error);
    return res.status(500).json({ success: false, error: "Failed to save domains." });
  }
});

// ============================================================
// API: Update system configuration (.env)
// ============================================================
router.post("/api/config", requireApiAuth, (req, res) => {
  const { ADMIN_PASSWORD, TELEGRAM_TOKEN, CHAT_ID, GOOGLE_SHEET_URL } = req.body;
  
  const updates = {};
  if (ADMIN_PASSWORD !== undefined) updates.ADMIN_PASSWORD = ADMIN_PASSWORD.trim();
  if (TELEGRAM_TOKEN !== undefined) updates.TELEGRAM_TOKEN = TELEGRAM_TOKEN.trim();
  if (CHAT_ID !== undefined) updates.CHAT_ID = CHAT_ID.trim();
  if (GOOGLE_SHEET_URL !== undefined) updates.GOOGLE_SHEET_URL = GOOGLE_SHEET_URL.trim();

  try {
    updateEnvFile(updates);
    return res.json({ success: true, message: "System settings updated successfully." });
  } catch (error) {
    console.error("Error writing config:", error);
    return res.status(500).json({ success: false, error: "Failed to save settings." });
  }
});

// ============================================================
// API: Get current status & IP list
// ============================================================
router.get("/api/status", requireApiAuth, (req, res) => {
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
    ips: ipTracker.getAllIps(),
    env: safeEnv,
    uptime: process.uptime() 
  });
});

// ============================================================
// API: Add IP to redirect list
// ============================================================
router.post("/api/ips/add", requireApiAuth, (req, res) => {
  const { ip } = req.body;
  if (!ip || typeof ip !== "string" || ip.trim() === "") {
    return res.status(400).json({ success: false, error: "Vui lòng nhập địa chỉ IP hợp lệ" });
  }
  const cleanIp = ip.trim();
  ipTracker.addIp(cleanIp);
  return res.json({ success: true, message: `Đã thêm IP ${cleanIp}`, ips: ipTracker.getAllIps() });
});

// ============================================================
// API: Delete IP from redirect list
// ============================================================
router.post("/api/ips/delete", requireApiAuth, (req, res) => {
  const { ip, clearAll } = req.body;
  if (clearAll) {
    ipTracker.clearAll();
    return res.json({ success: true, message: "Đã xóa toàn bộ danh sách IP", ips: ipTracker.getAllIps() });
  }
  if (ip) {
    ipTracker.removeIp(ip);
    return res.json({ success: true, message: `Đã xóa IP ${ip}`, ips: ipTracker.getAllIps() });
  }
  return res.status(400).json({ success: false, error: "Không tìm thấy IP để xóa" });
});

// ============================================================
// API: Delete logs
// ============================================================
router.post("/api/logs/delete", requireApiAuth, (req, res) => {
  const { id, index, clearAll } = req.body;
  
  if (clearAll) {
    req.app.locals.recentLogs = [];
    return res.json({ success: true, message: "Đã xóa toàn bộ nhật ký" });
  }

  let logs = req.app.locals.recentLogs || [];

  if (id !== undefined && id !== null) {
    const initialLen = logs.length;
    logs = logs.filter(log => log.id !== id);
    req.app.locals.recentLogs = logs;
    if (logs.length < initialLen) {
      return res.json({ success: true, message: "Đã xóa nhật ký" });
    }
  }

  if (index !== undefined && index !== null && index >= 0 && index < logs.length) {
    logs.splice(index, 1);
    req.app.locals.recentLogs = logs;
    return res.json({ success: true, message: "Đã xóa nhật ký" });
  }

  return res.status(400).json({ success: false, error: "Không tìm thấy nhật ký để xóa" });
});

module.exports = router;
