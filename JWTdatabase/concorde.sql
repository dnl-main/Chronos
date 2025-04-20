-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 20, 2025 at 01:20 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `concorde`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel_cache_0490957ffe59c40ee0e1d9e597e9f8f2', 'i:2;', 1745141905),
('laravel_cache_0490957ffe59c40ee0e1d9e597e9f8f2:timer', 'i:1745141905;', 1745141905),
('laravel_cache_0992d81e7c04ca4043eba132532f404b', 'i:1;', 1744704277),
('laravel_cache_0992d81e7c04ca4043eba132532f404b:timer', 'i:1744704277;', 1744704277),
('laravel_cache_0c56ddc300bf1b54fde4ce628798bca9', 'i:3;', 1744468286),
('laravel_cache_0c56ddc300bf1b54fde4ce628798bca9:timer', 'i:1744468286;', 1744468286),
('laravel_cache_1ekrOMbFGz6o4bsu', 'a:1:{s:11:\"valid_until\";i:1744271724;}', 1745480604),
('laravel_cache_21c7ea48997eeecf541f9afb4a8bfc81', 'i:1;', 1744784925),
('laravel_cache_21c7ea48997eeecf541f9afb4a8bfc81:timer', 'i:1744784925;', 1744784925),
('laravel_cache_2349c132703f77ebad49ef92fbe804f8', 'i:4;', 1744464130),
('laravel_cache_2349c132703f77ebad49ef92fbe804f8:timer', 'i:1744464130;', 1744464130),
('laravel_cache_2d36c12b5a60f340c2ce81ac1e6f943b', 'i:2;', 1745147082),
('laravel_cache_2d36c12b5a60f340c2ce81ac1e6f943b:timer', 'i:1745147082;', 1745147082),
('laravel_cache_2hrQltx1KCryw4oz', 'a:1:{s:11:\"valid_until\";i:1744695212;}', 1745904872),
('laravel_cache_347bfa56a1bbcfbfab5a527381618142', 'i:1;', 1744337553),
('laravel_cache_347bfa56a1bbcfbfab5a527381618142:timer', 'i:1744337553;', 1744337553),
('laravel_cache_38a3ca8cec82add39a8b166d63d5ad55', 'i:2;', 1744337581),
('laravel_cache_38a3ca8cec82add39a8b166d63d5ad55:timer', 'i:1744337580;', 1744337580),
('laravel_cache_3b0a1464509f81a62acbf31ed2fa95b9', 'i:1;', 1744679120),
('laravel_cache_3b0a1464509f81a62acbf31ed2fa95b9:timer', 'i:1744679120;', 1744679120),
('laravel_cache_3nsKtvGuicoUG4Pj', 'a:1:{s:11:\"valid_until\";i:1744784123;}', 1745993783),
('laravel_cache_4928e6f0d1b118c9e4c313b66eb78797', 'i:2;', 1744806995),
('laravel_cache_4928e6f0d1b118c9e4c313b66eb78797:timer', 'i:1744806995;', 1744806995),
('laravel_cache_51e331c8866e23cab0d39d2b17735cfd', 'i:2;', 1744338260),
('laravel_cache_51e331c8866e23cab0d39d2b17735cfd:timer', 'i:1744338259;', 1744338259),
('laravel_cache_6y5JpF0QaQT0ErbM', 'a:1:{s:11:\"valid_until\";i:1744272571;}', 1745481631),
('laravel_cache_73651a8e661cbf3b5a812bc846be2b2d', 'i:1;', 1744704113),
('laravel_cache_73651a8e661cbf3b5a812bc846be2b2d:timer', 'i:1744704113;', 1744704113),
('laravel_cache_76c17abbdefe3a13bf1dec1559ea2c26', 'i:14;', 1744634875),
('laravel_cache_76c17abbdefe3a13bf1dec1559ea2c26:timer', 'i:1744634875;', 1744634875),
('laravel_cache_8dc2c704468178c2ebea07ff24b1591f', 'i:9;', 1744534317),
('laravel_cache_8dc2c704468178c2ebea07ff24b1591f:timer', 'i:1744534317;', 1744534317),
('laravel_cache_8dff94401ff134b486ab582405079dac', 'i:2;', 1744352377),
('laravel_cache_8dff94401ff134b486ab582405079dac:timer', 'i:1744352377;', 1744352377),
('laravel_cache_980b599806087df48b1a19d733ead185', 'i:1;', 1744337994),
('laravel_cache_980b599806087df48b1a19d733ead185:timer', 'i:1744337994;', 1744337994),
('laravel_cache_985TMwDk8g1rkPtF', 'a:1:{s:11:\"valid_until\";i:1744534274;}', 1745743935),
('laravel_cache_9c0cf6bf330264a57e4f7f1afda95151', 'i:2;', 1744808994),
('laravel_cache_9c0cf6bf330264a57e4f7f1afda95151:timer', 'i:1744808994;', 1744808994),
('laravel_cache_a75f3f172bfb296f2e10cbfc6dfc1883', 'i:1;', 1744782156),
('laravel_cache_a75f3f172bfb296f2e10cbfc6dfc1883:timer', 'i:1744782156;', 1744782156),
('laravel_cache_akrQXZFqr4hBx0BM', 'a:1:{s:11:\"valid_until\";i:1744338703;}', 1745548363),
('laravel_cache_AmAEMCImTvsKBzS4', 'a:1:{s:11:\"valid_until\";i:1744338851;}', 1745548451),
('laravel_cache_b7kWFAi0uVkWYlB0', 'a:1:{s:11:\"valid_until\";i:1744350219;}', 1745559879),
('laravel_cache_b82890ffd935769bcf1f4b53754b53ab', 'i:5;', 1744467707),
('laravel_cache_b82890ffd935769bcf1f4b53754b53ab:timer', 'i:1744467707;', 1744467707),
('laravel_cache_c4cd9b883e7c9ae5c5b47b99ee625f34', 'i:2;', 1744338184),
('laravel_cache_c4cd9b883e7c9ae5c5b47b99ee625f34:timer', 'i:1744338183;', 1744338184),
('laravel_cache_c62803873ba74986f5e8e1614440489f', 'i:2;', 1744791113),
('laravel_cache_c62803873ba74986f5e8e1614440489f:timer', 'i:1744791113;', 1744791113),
('laravel_cache_E1v8LW2IeP5WZMnY', 'a:1:{s:11:\"valid_until\";i:1744353223;}', 1745562823),
('laravel_cache_eTt9XSZxT0zXKgvh', 'a:1:{s:11:\"valid_until\";i:1744677814;}', 1745887474),
('laravel_cache_f71ec158c3e8f7e04b2cf9386a4b8372', 'i:1;', 1744786806),
('laravel_cache_f71ec158c3e8f7e04b2cf9386a4b8372:timer', 'i:1744786806;', 1744786806),
('laravel_cache_f7bf8617ef6233bab3da3fd031829e43', 'i:1;', 1744353283),
('laravel_cache_f7bf8617ef6233bab3da3fd031829e43:timer', 'i:1744353283;', 1744353283),
('laravel_cache_feddc525b85478ec719eae9c595d27a9', 'i:1;', 1744338911),
('laravel_cache_feddc525b85478ec719eae9c595d27a9:timer', 'i:1744338911;', 1744338911),
('laravel_cache_ffc4cdc3ec9b6e06564a42d51324e748', 'i:4;', 1744940214),
('laravel_cache_ffc4cdc3ec9b6e06564a42d51324e748:timer', 'i:1744940214;', 1744940214),
('laravel_cache_GBnzrzafVhymyraE', 'a:1:{s:11:\"valid_until\";i:1744352358;}', 1745561958),
('laravel_cache_gCPkU8rl861JxW1t', 'a:1:{s:11:\"valid_until\";i:1744703763;}', 1745913303),
('laravel_cache_HEAH9JZSJbWoVN8P', 'a:1:{s:11:\"valid_until\";i:1744346503;}', 1745555503),
('laravel_cache_hUvuISViHDb7hnMD', 'a:1:{s:11:\"valid_until\";i:1744348740;}', 1745558400),
('laravel_cache_ies8OC60A4RFySLY', 'a:1:{s:11:\"valid_until\";i:1744351905;}', 1745560965),
('laravel_cache_J8Tc7Fpe5GKbzoYX', 'a:1:{s:11:\"valid_until\";i:1744775081;}', 1745984502),
('laravel_cache_KgicOIfgJWm8XpNx', 'a:1:{s:11:\"valid_until\";i:1744338251;}', 1745547731),
('laravel_cache_LzHtAnOnUZ2jUrxO', 'a:1:{s:11:\"valid_until\";i:1744273522;}', 1745483182),
('laravel_cache_m8OZrfBDdvMhAwwG', 'a:1:{s:11:\"valid_until\";i:1744351145;}', 1745560205),
('laravel_cache_nkHA0hado93IQ9X7', 'a:1:{s:11:\"valid_until\";i:1744784865;}', 1745994525),
('laravel_cache_oFC7Kka0l8y7lVPB', 'a:1:{s:11:\"valid_until\";i:1744348651;}', 1745558311),
('laravel_cache_OPUoP2Bzw39P71dN', 'a:1:{s:11:\"valid_until\";i:1744273130;}', 1745482250),
('laravel_cache_RoQt7ll6SUtI2ubt', 'a:1:{s:11:\"valid_until\";i:1744338596;}', 1745548016),
('laravel_cache_TUi7YAKFVBQLX8p6', 'a:1:{s:11:\"valid_until\";i:1744690837;}', 1745900497),
('laravel_cache_wlMa02HwfwE1BXhQ', 'a:1:{s:11:\"valid_until\";i:1744337527;}', 1745546827),
('laravel_cache_X8jxvGWGWr4ZvhNu', 'a:1:{s:11:\"valid_until\";i:1744696256;}', 1745905796),
('laravel_cache_Y3qLKOYOzjIVxdIf', 'a:1:{s:11:\"valid_until\";i:1744704054;}', 1745913714);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `certificates`
--

CREATE TABLE `certificates` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `filename` varchar(255) NOT NULL,
  `certificate_type` varchar(255) NOT NULL,
  `upload_date` date NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_03_27_055125_create_personal_access_tokens_table', 1),
(5, '2025_03_28_020430_add_details_to_users_table', 1),
(6, '2025_04_02_005901_modify_name_columns_in_users_table', 1),
(7, '2025_04_07_045241_add_role_to_users_table', 2),
(9, '2025_04_10_021203_create_certificates_table', 3),
(10, '2025_04_20_191013_add_availability_to_users_table', 4);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(52, 'App\\Models\\User', 9, 'login_token', '4052fc3948ee2ae5e8aefe2dc2f44098e5809cbe36443eb7b00aa4ec14557b3e', '[\"*\"]', NULL, NULL, '2025-04-02 22:33:52', '2025-04-02 22:33:52'),
(53, 'App\\Models\\User', 10, 'auth_token', 'cb0f412a264d7b86bffa01a8dfbdad4568e6d92374bcb019633fc34293700d9e', '[\"*\"]', NULL, '2025-04-02 23:17:13', '2025-04-02 22:57:13', '2025-04-02 22:57:13'),
(54, 'App\\Models\\User', 10, 'auth_token', '60a61bb1a9e7afbeb8ed4594a7aa5b547d8317a2789b97d041469647d69b37ec', '[\"*\"]', NULL, '2025-04-02 23:23:33', '2025-04-02 23:03:33', '2025-04-02 23:03:33'),
(55, 'App\\Models\\User', 10, 'auth_token', '4217d791989bd51718525d29e0ee7eb1de1f7958dce42c1b0a50271ffa62a14b', '[\"*\"]', NULL, '2025-04-02 23:43:45', '2025-04-02 23:23:45', '2025-04-02 23:23:45'),
(56, 'App\\Models\\User', 10, 'auth_token', '0d5eba29fdf12cfb82063d0b8eb4d2731279d55f347ac291f33ff447012bc531', '[\"*\"]', NULL, '2025-04-03 00:12:19', '2025-04-02 23:52:19', '2025-04-02 23:52:19'),
(57, 'App\\Models\\User', 10, 'auth_token', '8f937413378c4c93b50b3e16227c007d2dbe2defb1cc65828c696011a97abf91', '[\"*\"]', NULL, '2025-04-06 16:31:18', '2025-04-06 16:11:18', '2025-04-06 16:11:18'),
(58, 'App\\Models\\User', 10, 'auth_token', 'e9fd3ccd69c799f186fb4d73ce50623556f83c96b9b33d6eaa40194678edd713', '[\"*\"]', NULL, '2025-04-06 16:32:42', '2025-04-06 16:12:42', '2025-04-06 16:12:42'),
(59, 'App\\Models\\User', 10, 'auth_token', 'ad530bf8f8accffd8c77ff0a4b3987c074b77320198d3c8d09fff2d7c664e4f8', '[\"*\"]', NULL, '2025-04-06 17:01:03', '2025-04-06 16:41:03', '2025-04-06 16:41:03'),
(60, 'App\\Models\\User', 10, 'auth_token', '0475425640b4388eb587741f51086fbf49daa0bbfb1f8bc97fc64db35579a43c', '[\"*\"]', NULL, '2025-04-06 17:05:02', '2025-04-06 16:45:02', '2025-04-06 16:45:02'),
(61, 'App\\Models\\User', 10, 'auth_token', 'ff9b4a62aea8dcf6cdccab88fa89b6f348106fcd7805d0c3e54056483a55d38c', '[\"*\"]', NULL, '2025-04-06 17:09:03', '2025-04-06 16:49:03', '2025-04-06 16:49:03'),
(62, 'App\\Models\\User', 10, 'login_token', '32928cebd1f17738136e279b6d4e193401724a2ccbfdc48ce1c185e75317dd01', '[\"*\"]', NULL, NULL, '2025-04-06 18:07:41', '2025-04-06 18:07:41'),
(63, 'App\\Models\\User', 10, 'login_token', 'ed7d8245879af7404a028b97ed1d020cad312580ff73cd7a39947a014114545f', '[\"*\"]', NULL, NULL, '2025-04-06 18:15:27', '2025-04-06 18:15:27');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('B8Xm9HxRZRyr9Dt6JqcWYu1J2xRpkWjZxTJ9xNEv', NULL, '65.49.1.21', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/122.0.6261.94 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRUFmY0s0cWZPMDdtallmaFJuQW9EZTZ6TUpxTGxFMXlGWXVIem02NiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly9hcGkuaXBpZnkub3JnLz9mb3JtYXQ9anNvbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744944147),
('jPdCivqPHHBW1Pn2m2FbYaQ8wj6qmOuc2HtoucFn', NULL, '65.49.1.10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.46', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRW1jUGxBZTlWRzZyRFBwVkE1QnQzTlNpb1MxZ2tMMHVheUVQSEdDRiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8xMTIuMjAzLjE1NS4xODE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744944131),
('Kk0CrbiAVxqlrP5gWsDLOHbdCrtHkfyypriSLMIV', NULL, '165.154.11.37', 'curl/7.29.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieE9kdjBSbUgzYXduRW9PSVEwa3JERWU5b3VxdHZad2RLSGJtWnN6VyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHA6Ly8xMTIuMjAzLjE1NS4xODEiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744940485),
('m6LaM4KD2EnU7ZOo0RvvRuVz2hf7gGsC7Q9lw9dl', NULL, '184.105.247.251', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 OPR/108.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZ2dua2NNZTA4V2w3ZnEyVHJzalR2QlY2NXdxTjB2M29sNmJUOXdLcyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8xMTIuMjAzLjE1NS4xODE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744808659),
('o3OFWi2v7KNYSha897BwJIozdDqOAxRpiFbeGGsW', NULL, '198.235.24.237', 'curl/7.68.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYkZpS3AzSGRXMFFpZVE2b09WeHdiZEZha2lhNGZvanhia0pjdGp4ZyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8xMTIuMjAzLjE1NS4xODE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744944083),
('OVaxkhcqGQdDYYbDV5oUThsJZfHaw4YwRadwzCIb', NULL, '205.210.31.80', 'Expanse, a Palo Alto Networks company, searches across the global IPv4 space multiple times per day to identify customers&#39; presences on the Internet. If you would like to be excluded from our scans, please send IP addresses/domains to: scaninfo@paloaltonetworks.com', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoia0Y0d2Y2bnc0U2hkRnNoNHhJajZKYTMwZVFjMWQ4SmdlYlBZOWJwRyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8xMTIuMjAzLjE1NS4xODE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744783685),
('q24U1exGQpqfewI66H7AOJyeB2TDpayJqk46KzZ0', NULL, '184.105.247.254', 'Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/115.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiY0hKUzh1ZDBCSnNDMVV0YllsVjkyNkdCclBKNDlieENxdkxzdlczQiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly9hcGkuaXBpZnkub3JnLz9mb3JtYXQ9anNvbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744808738),
('YAopwm9ZBR4aMbJFJVQAhuXdhc5iOL3Q9Y0Lpa7H', NULL, '123.58.215.102', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 9_0_1) AppleWebKit/545.36 (KHTML, like Gecko) Chrome/91.0.2330 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWWdZYWdCVGNmVzV4ZHBRQ1BOM290OGI4cTNQaVZzTnJYaE1nb09ZciI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8xMTIuMjAzLjE1NS4xODE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744940567);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `mobile` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL,
  `province` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `barangay` varchar(255) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `zip_code` varchar(255) DEFAULT NULL,
  `building_number` varchar(255) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `secondary_position` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `civil_status` varchar(255) DEFAULT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user',
  `availability` varchar(255) NOT NULL DEFAULT 'Available'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `middle_name`, `last_name`, `email`, `password`, `mobile`, `created_at`, `updated_at`, `region`, `province`, `city`, `barangay`, `street`, `zip_code`, `building_number`, `birthday`, `position`, `secondary_position`, `gender`, `civil_status`, `role`, `availability`) VALUES
(10, 'Ian Kenneth', 'Ramirez', 'Sianghio', 'kennethsianghio756@gmail.com', '$2y$12$DZnguFK8myUqKY1hbu.QUeROlvtjERHe54HA6eKILBGuaqe3g9FDK', '09761465526', '2025-04-02 22:57:01', '2025-04-10 00:00:18', '130000000', NULL, '137502000', 'Santolan', 'M.H Del Pilar St', '1473', '128', NULL, NULL, NULL, 'Male', 'Single', 'user', 'Available'),
(34, 'Zalzal', 'The Great', 'Aku', 'zalzalaku@friendmar.com.ph', '$2y$12$pHrR0qvyaJ2gNZFsGoT9IewvGQaQY6k0Theuf/FymhaQBBQGVHjJe', '1234', '2025-04-16 05:23:50', '2025-04-16 05:23:50', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'admin', 'Available'),
(35, 'kingina', 'mo', 'talaga', 'kingina@gmail.utot', '$2y$12$O4IjtN8BXFwdnsW0Aena4.AWLnMshlUGTRq87jhHPskWp2uNrSrf2', '0999', '2025-04-20 09:20:12', '2025-04-20 09:20:12', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 'Available'),
(36, 'bb', 'bb', 'bb', 'tangina@friendmar.com.ph', '$2y$12$JT/xguwzuzjEc90fjrPkiuT/kii8n6NTKhm9pfKkSu.9JFZG/Ilxu', '00', '2025-04-20 09:25:45', '2025-04-20 09:25:45', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'admin', 'Available'),
(37, 'Angela', 'Fajardo', 'Guilaran', 'ian@friendmar.com.ph', '$2y$12$rSHTNEj8wXjrl7b3holuDOk6TLYqca8IaGQCHx76hK/xMOuFhnx9.', '09761465527', '2025-04-20 09:28:32', '2025-04-20 09:28:32', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'admin', 'Available'),
(38, 'nnn', 'nn', 'nn', 'kingina@friendmar.com.ph', '$2y$12$7SJWnqoUtODW7gUjFSqVZOPEKcWX82BW/DgKmHYmBh7KtKpHkhaoq', '54', '2025-04-20 09:28:42', '2025-04-20 09:28:42', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'admin', 'Available'),
(39, 'Angela', 'Fajardo', 'Guilaran', 'angela@friendmar.com.ph', '$2y$12$2zLbhKy55WTemXxJMKMRm.9l8Pb87rHyrHNJkhJ7j8Gd4I6m6zHsG', '12345', '2025-04-20 09:29:35', '2025-04-20 09:29:35', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'admin', 'Available'),
(40, 'Tyler', 'Creator', 'Batungbakal', '1@friendmar.com.ph', '$2y$12$nMkYPPgc6PncANVtLZXyq.FeBI4v7Dosl8.h0JdUxTL4tO4DdUsqS', '42069', '2025-04-20 10:01:20', '2025-04-20 10:01:20', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'admin', 'Available');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `certificates`
--
ALTER TABLE `certificates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `certificates_user_id_foreign` (`user_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_mobile_unique` (`mobile`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `certificates`
--
ALTER TABLE `certificates`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `certificates`
--
ALTER TABLE `certificates`
  ADD CONSTRAINT `certificates_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
