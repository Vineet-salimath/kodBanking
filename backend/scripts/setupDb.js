/**
 * Kodbank – Database setup script
 * Run: node scripts/setupDb.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { pool, connect } = require('../config/db');

const statements = [
  'DROP TABLE IF EXISTS UserToken',
  'DROP TABLE IF EXISTS kodusar',
  `CREATE TABLE kodusar (
    uid        INT            NOT NULL AUTO_INCREMENT,
    username   VARCHAR(80)    NOT NULL,
    email      VARCHAR(150)   NOT NULL,
    password   VARCHAR(255)   NOT NULL,
    balance    DECIMAL(15,2)  NOT NULL DEFAULT 10000.00,
    phone      VARCHAR(25)    NOT NULL,
    role       ENUM('customer','manager','admin') NOT NULL DEFAULT 'customer',
    created_at DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (uid),
    UNIQUE KEY uq_username (username),
    UNIQUE KEY uq_email    (email)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE UserToken (
    tid        INT          NOT NULL AUTO_INCREMENT,
    uid        INT          NOT NULL,
    token      TEXT         NOT NULL,
    expiry     DATETIME     NOT NULL,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tid),
    KEY idx_uid    (uid),
    KEY idx_expiry (expiry),
    CONSTRAINT fk_ut_uid FOREIGN KEY (uid)
      REFERENCES kodusar(uid)
      ON DELETE CASCADE
      ON UPDATE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
];

(async () => {
  await connect();
  for (const sql of statements) {
    await pool.execute(sql);
    console.log('✅', sql.trim().slice(0, 55).replace(/\n/g, ' ') + '…');
  }
  console.log('\n🎉  Schema applied successfully on Aiven MySQL');
  process.exit(0);
})().catch(err => {
  console.error('❌  Schema error:', err.message);
  process.exit(1);
});
