const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const dbPath = path.join(process.cwd(), "server", "db_store.json");

const PRESET_USERS = [
  { id: "u-1", name: "Hasan Abdukarimov", email: "hasan@itpark.uz", role: "ADMIN", department: "Executive Board", password: "admin123" },
  { id: "u-3", name: "Sarvar Mukhammadiev", email: "sarvar@itpark.uz", role: "MANAGER", department: "Incubation & Acceleration", password: "manager123" },
  { id: "u-4", name: "Feruza Qodirova", email: "feruza@itpark.uz", role: "AGENT", department: "Infrastructure & Real Estate", password: "agent123" },
  { id: "u-6", name: "Olim Shokirov (UzPay)", email: "olim@uzpay.uz", role: "RESIDENT", department: "UzPay Technologies", password: "resident123" },
  { id: "u-7", name: "Jamshid Rustamov", email: "jamshid@digital.uz", role: "VIEWER", department: "Ministry of Digital Technologies", password: "guest123" },
];

(async () => {
  const raw = fs.readFileSync(dbPath, "utf-8");
  const db = JSON.parse(raw);
  db.users = db.users || [];

  for (const preset of PRESET_USERS) {
    const existingIdx = db.users.findIndex((u) => u.email.toLowerCase() === preset.email.toLowerCase());
    const hashed = await bcrypt.hash(preset.password, 10);
    const record = {
      id: preset.id,
      email: preset.email,
      password: hashed,
      name: preset.name,
      role: preset.role,
      department: preset.department,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (existingIdx >= 0) {
      db.users[existingIdx] = record;
    } else {
      db.users.push(record);
    }
    console.log(`Seeded ${preset.email} (${preset.role})`);
  }

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf-8");
  console.log("Done. Total users:", db.users.length);
})();
