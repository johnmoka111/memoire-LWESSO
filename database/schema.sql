-- ============================================================
-- KivuMobilier — Schéma MySQL 8.0
-- Version enrichie (4 rôles + notifications + blockchain)
-- ============================================================

CREATE DATABASE IF NOT EXISTS kivumarket
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE kivumarket;

-- ─── USERS ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom            VARCHAR(100)  NOT NULL,
    prenom         VARCHAR(100)  NOT NULL,
    email          VARCHAR(191)  NOT NULL UNIQUE,
    password       VARCHAR(255)  NOT NULL,
    role           ENUM('proprietaire','acheteur','agent','admin') NOT NULL DEFAULT 'acheteur',
    wallet_address VARCHAR(42)   NULL COMMENT 'Adresse Ethereum 0x...',
    telephone      VARCHAR(20)   NULL,
    avatar_url     VARCHAR(500)  NULL,
    reset_token    VARCHAR(64)   NULL,
    reset_expires  DATETIME      NULL,
    email_verified TINYINT(1)    NOT NULL DEFAULT 0,
    is_active      TINYINT(1)    NOT NULL DEFAULT 1,
    created_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role  (role),
    INDEX idx_wallet(wallet_address)
) ENGINE=InnoDB;

-- ─── PROPERTIES ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS properties (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    owner_id      INT UNSIGNED NOT NULL,
    agent_id      INT UNSIGNED NULL COMMENT 'Agent assigné pour validation',
    titre         VARCHAR(255) NOT NULL,
    description   TEXT         NULL,
    prix          DECIMAL(18,8) NOT NULL COMMENT 'Prix en ETH',
    prix_usd      DECIMAL(18,2) NULL     COMMENT 'Équivalent USD (oracle)',
    commune       VARCHAR(100) NOT NULL,
    quartier      VARCHAR(100) NULL,
    latitude      DECIMAL(10,8) NULL,
    longitude     DECIMAL(11,8) NULL,
    superficie    DECIMAL(10,2) NULL COMMENT 'En m²',
    type_bien     ENUM('terrain','maison','appartement','commercial') NOT NULL DEFAULT 'terrain',
    statut        ENUM('en_attente','assigne','valide','rejete','vendu') NOT NULL DEFAULT 'en_attente',
    panorama_url  VARCHAR(500)  NULL COMMENT 'URL GCS panorama 360°',
    motif_rejet   TEXT          NULL,
    created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (agent_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_statut   (statut),
    INDEX idx_commune  (commune),
    INDEX idx_owner    (owner_id),
    INDEX idx_agent    (agent_id)
) ENGINE=InnoDB;

-- ─── DOCUMENTS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS documents (
    id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    property_id      INT UNSIGNED NOT NULL,
    uploaded_by      INT UNSIGNED NOT NULL,
    type             ENUM('titre_foncier','photo','panorama','autre') NOT NULL,
    nom_fichier      VARCHAR(255) NOT NULL,
    file_url         VARCHAR(500) NOT NULL COMMENT 'URL signée Google Cloud Storage',
    mime_type        VARCHAR(100) NOT NULL,
    taille_bytes     INT UNSIGNED NOT NULL,
    sha256_hash      CHAR(64)     NOT NULL COMMENT 'Empreinte SHA-256 du fichier',
    hash_blockchain  VARCHAR(66)  NULL      COMMENT 'bytes32 ancré sur Ethereum',
    tx_hash          VARCHAR(66)  NULL      COMMENT 'Hash de la transaction d\'ancrage',
    anchored_at      DATETIME     NULL,
    created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id),
    INDEX idx_property (property_id),
    INDEX idx_hash     (sha256_hash)
) ENGINE=InnoDB;

-- ─── TRANSACTIONS (ESCROW) ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transactions (
    id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    property_id      INT UNSIGNED NOT NULL,
    acheteur_id      INT UNSIGNED NOT NULL,
    agent_id         INT UNSIGNED NULL,
    admin_id         INT UNSIGNED NULL COMMENT 'Admin ayant résolu un litige',
    escrow_id        BIGINT UNSIGNED NULL COMMENT 'uint256 ID dans le smart contract',
    contract_address VARCHAR(42)  NOT NULL,
    montant_eth      DECIMAL(18,8) NOT NULL,
    montant_usd      DECIMAL(18,2) NULL,
    tx_creation      VARCHAR(66)  NULL COMMENT 'Hash tx createEscrow',
    tx_validation    VARCHAR(66)  NULL COMMENT 'Hash tx validateByAgent',
    tx_liberation    VARCHAR(66)  NULL COMMENT 'Hash tx releaseFunds',
    tx_remboursement VARCHAR(66)  NULL COMMENT 'Hash tx refund',
    tx_arbitrage     VARCHAR(66)  NULL COMMENT 'Hash tx adminResolve',
    etat             ENUM('cree','valide','libere','rembourse','arbitre') NOT NULL DEFAULT 'cree',
    note_arbitrage   TEXT         NULL COMMENT 'Motif décision admin',
    created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id)  REFERENCES properties(id),
    FOREIGN KEY (acheteur_id)  REFERENCES users(id),
    FOREIGN KEY (agent_id)     REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (admin_id)     REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_property  (property_id),
    INDEX idx_acheteur  (acheteur_id),
    INDEX idx_etat      (etat),
    INDEX idx_escrow_id (escrow_id)
) ENGINE=InnoDB;

-- ─── NOTIFICATIONS / EMAIL QUEUE ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     INT UNSIGNED NULL,
    to_email    VARCHAR(191) NOT NULL,
    sujet       VARCHAR(255) NOT NULL,
    corps       TEXT         NOT NULL,
    type        VARCHAR(50)  NOT NULL COMMENT 'registration, assignment, validation, escrow, dispute',
    statut      ENUM('en_attente','envoye','erreur') NOT NULL DEFAULT 'en_attente',
    tentatives  TINYINT UNSIGNED NOT NULL DEFAULT 0,
    erreur_msg  TEXT NULL,
    sent_at     DATETIME NULL,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_statut (statut),
    INDEX idx_type   (type)
) ENGINE=InnoDB;

-- ─── PROPERTY PHOTOS (photos classiques du propriétaire) ─────────────────────
CREATE TABLE IF NOT EXISTS property_photos (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    property_id INT UNSIGNED NOT NULL,
    url         VARCHAR(500) NOT NULL,
    ordre       TINYINT UNSIGNED NOT NULL DEFAULT 0,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    INDEX idx_property (property_id)
) ENGINE=InnoDB;

-- ─── ADMIN : données initiales ────────────────────────────────────────────────
-- Mot de passe : Admin@Kivu2026! (à changer en production)
INSERT INTO users (nom, prenom, email, password, role, is_active, email_verified)
VALUES (
    'Admin', 'KivuMarket',
    'admin@kivumarket.cd',
    '$2y$12$eImiTXuWVxfM37uY4JANjOe5XIfA21uH6eis/Sj/odYbhiEpezSi2',
    'admin', 1, 1
);
