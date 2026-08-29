-- =========================================================
-- KrushiMitra - Smart Agriculture & Crop Intelligence Platform
-- MySQL Database Schema Script
-- =========================================================

CREATE DATABASE IF NOT EXISTS `krushimitra` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `krushimitra`;

-- ---------------------------------------------------------
-- 1. USERS TABLE (Farmers, Agronomists, Super-Admins)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(30) DEFAULT '+91 98000 00000',
    `role` VARCHAR(50) NOT NULL DEFAULT 'Farmer',
    `state` VARCHAR(100) DEFAULT 'Maharashtra',
    `district` VARCHAR(100) DEFAULT 'Pune',
    `farm_size` VARCHAR(50) DEFAULT '5.0',
    `farm_unit` VARCHAR(20) DEFAULT 'Acres',
    `soil_type` VARCHAR(150) DEFAULT 'Black Clayey Soil (Regur)',
    `irrigation_type` VARCHAR(150) DEFAULT 'Drip & Canal Irrigation',
    `primary_crops` VARCHAR(255) DEFAULT 'Soybean, Cotton, Wheat',
    `kisan_id` VARCHAR(100) DEFAULT 'PMK-MH-2026-8941',
    `farm_details` TEXT,
    `status` VARCHAR(30) DEFAULT 'Active',
    `member_since` VARCHAR(50) DEFAULT 'January 2026',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- 2. PREDICTION HISTORY TABLE (Crop Yield Regressor Outputs)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `prediction_history` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_email` VARCHAR(150),
    `crop` VARCHAR(100) NOT NULL,
    `district` VARCHAR(100) NOT NULL,
    `season` VARCHAR(50),
    `area` DECIMAL(10, 2),
    `rainfall` DECIMAL(10, 2),
    `temperature` DECIMAL(10, 2),
    `crop_year` INT,
    `productivity` DECIMAL(10, 2) NOT NULL,
    `production` DECIMAL(10, 2),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_pred_user_email` (`user_email`),
    INDEX `idx_pred_crop` (`crop`),
    INDEX `idx_pred_district` (`district`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- 3. RECOMMENDATION HISTORY TABLE (Soil & Climate Advisories)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `recommendation_history` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_email` VARCHAR(150),
    `crop` VARCHAR(100) NOT NULL,
    `confidence` DECIMAL(5, 2) DEFAULT 95.00,
    `n_val` DECIMAL(10, 2),
    `p_val` DECIMAL(10, 2),
    `k_val` DECIMAL(10, 2),
    `temperature` DECIMAL(10, 2),
    `humidity` DECIMAL(10, 2),
    `ph` DECIMAL(5, 2),
    `rainfall` DECIMAL(10, 2),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_rec_user_email` (`user_email`),
    INDEX `idx_rec_crop` (`crop`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- 4. SUPPORT TICKETS TABLE (Farmer Helpdesk & Inquiries)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `support_tickets` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `ticket_id` VARCHAR(50) UNIQUE,
    `user_email` VARCHAR(150),
    `name` VARCHAR(150),
    `category` VARCHAR(100),
    `subject` VARCHAR(255),
    `message` TEXT,
    `status` VARCHAR(50) DEFAULT 'Submitted',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_tickets_user_email` (`user_email`),
    INDEX `idx_tickets_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- SEED INITIAL DEMO DATA (Admin & Registered Farmers)
-- ---------------------------------------------------------
INSERT INTO `users` (`name`, `email`, `password_hash`, `phone`, `role`, `state`, `district`, `farm_size`, `farm_unit`, `soil_type`, `irrigation_type`, `primary_crops`, `kisan_id`, `farm_details`, `status`, `member_since`)
VALUES
('KrushiMitra Administrator', 'admin@krushimitra.in', 'scrypt:32768:8:1$K3Jz9Y8x9l2m...$67c824c9657fbcfc9be95aefabed40375a0248ad85d9c222ff2e4313f88f00db721ba17042a98e1f57b165449ad1ec19e76da6cba8d6c7ffdae494a37651a243', '+91 98000 00001', 'Admin', 'Maharashtra', 'Pune', '10.0', 'Acres', 'Black Clayey Soil (Regur)', 'Drip & Canal Irrigation', 'Sugarcane, Wheat, Cotton', 'ADM-MH-2026-0001', 'KrushiMitra Master Agronomy & Operations Desk', 'Active', 'January 2026'),
('Ramesh Patil', 'ramesh.patil@krushimitra.in', 'scrypt:32768:8:1$K3Jz9Y8x9l2m...$67c824c9657fbcfc9be95aefabed40375a0248ad85d9c222ff2e4313f88f00db721ba17042a98e1f57b165449ad1ec19e76da6cba8d6c7ffdae494a37651a243', '+91 98230 45678', 'Farmer', 'Maharashtra', 'Pune', '5.0', 'Acres', 'Black Clayey Soil (Regur)', 'Drip & Micro-Irrigation', 'Soybean, Cotton, Wheat', 'PMK-MH-2026-8941', 'Organic farming practice with focus on soil regenerative techniques.', 'Active', 'February 2026'),
('Suresh Deshmukh', 'suresh.deshmukh@krushimitra.in', 'scrypt:32768:8:1$K3Jz9Y8x9l2m...$67c824c9657fbcfc9be95aefabed40375a0248ad85d9c222ff2e4313f88f00db721ba17042a98e1f57b165449ad1ec19e76da6cba8d6c7ffdae494a37651a243', '+91 94221 88901', 'Farmer', 'Maharashtra', 'Nagpur', '12.5', 'Acres', 'Alluvial River Basin Soil', 'Canal & Well Irrigation', 'Orange, Cotton, Gram', 'PMK-MH-2026-3312', 'Commercial citrus orchards and high-density cotton crop.', 'Active', 'March 2026')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);
