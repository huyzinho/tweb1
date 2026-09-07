const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const FILE_PATH = path.join(DATA_DIR, "submitted_ips.json");

class IpTracker {
  constructor() {
    this.ips = new Map(); // ip => { ip, time, lastSeen, count }
    this.init();
  }

  init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(FILE_PATH)) {
        const raw = fs.readFileSync(FILE_PATH, "utf-8");
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          list.forEach((item) => {
            if (typeof item === "string") {
              this.ips.set(item, { ip: item, time: "N/A", lastSeen: "N/A", count: 1 });
            } else if (item && item.ip) {
              this.ips.set(item.ip, item);
            }
          });
        }
      }
    } catch (err) {
      console.error("Error initializing IpTracker in tweb:", err);
    }
  }

  save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const list = Array.from(this.ips.values());
      fs.writeFileSync(FILE_PATH, JSON.stringify(list, null, 2), "utf-8");
    } catch (err) {
      console.error("Error saving IpTracker data in tweb:", err);
    }
  }

  addIp(ip) {
    if (!ip || typeof ip !== "string") return false;
    const cleanIp = ip.trim();
    if (!cleanIp) return false;

    const timeNow = new Date().toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    });

    if (this.ips.has(cleanIp)) {
      const existing = this.ips.get(cleanIp);
      existing.count = (existing.count || 1) + 1;
      existing.lastSeen = timeNow;
    } else {
      this.ips.set(cleanIp, {
        ip: cleanIp,
        time: timeNow,
        lastSeen: timeNow,
        count: 1,
      });
    }
    this.save();
    return true;
  }

  removeIp(ip) {
    if (!ip) return false;
    const cleanIp = ip.trim();
    const res = this.ips.delete(cleanIp);
    if (res) this.save();
    return res;
  }

  clearAll() {
    this.ips.clear();
    this.save();
    return true;
  }

  isIpSubmitted(ip) {
    if (!ip) return false;
    return this.ips.has(ip.trim());
  }

  getAllIps() {
    return Array.from(this.ips.values());
  }
}

const ipTracker = new IpTracker();
module.exports = ipTracker;
