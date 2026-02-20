/**
 * Kodbank – Add transactions table
 * Run: node scripts/addTransactions.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { pool, connect } = require('../config/db');

const statements = [
  `CREATE TABLE IF NOT EXISTS transactions (
    txid        INT           NOT NULL AUTO_INCREMENT,
    uid         INT           NOT NULL,
    type        ENUM('credit','debit') NOT NULL,
    amount      DECIMAL(15,2) NOT NULL,
    description VARCHAR(255)  NOT NULL DEFAULT '',
    recipient   VARCHAR(150)           DEFAULT NULL,
    status      ENUM('completed','pending','failed') NOT NULL DEFAULT 'completed',
    created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (txid),
    KEY idx_tx_uid (uid),
    CONSTRAINT fk_tx_uid FOREIGN KEY (uid) REFERENCES kodusar(uid) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
];

(async () => {
  await connect();
  for (const sql of statements) {
    await pool.execute(sql);
    console.log('✅', sql.slice(0, 60).replace(/\n/g, ' ') + '…');
  }
  console.log('\n🎉  Transactions table ready');
  process.exit(0);
})().catch(err => {
  console.error('❌', err.message);
  process.exit(1);
});
