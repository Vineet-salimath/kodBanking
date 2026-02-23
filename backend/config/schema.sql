-- ============================================================
-- Kodbank – Table Creation Scripts
-- Run on Aiven MySQL (defaultdb)
-- ============================================================

-- Drop order (FK safe)
DROP TABLE IF EXISTS UserToken;
DROP TABLE IF EXISTS kodusar;

-- ─────────────────────────────────────────────────────────────
-- 1. Users table
-- ─────────────────────────────────────────────────────────────
CREATE TABLE kodusar (
  uid        INT            NOT NULL AUTO_INCREMENT,
  username   VARCHAR(80)    NOT NULL,
  email      VARCHAR(150)   NOT NULL,
  password   VARCHAR(255)   NOT NULL,            -- bcrypt hash
  balance    DECIMAL(15,2)  NOT NULL DEFAULT 100000.00,
  phone      VARCHAR(25)    NOT NULL,
  role       ENUM('customer','manager','admin')
             NOT NULL DEFAULT 'customer',
  created_at DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (uid),
  UNIQUE KEY uq_username (username),
  UNIQUE KEY uq_email    (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
-- 2. Token store (one-token-per-session; supports revocation)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE UserToken (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
