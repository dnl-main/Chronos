-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 21, 2025 at 05:16 AM
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
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `user_id`, `date`, `start_time`, `end_time`, `created_at`, `updated_at`) VALUES
(4, 1, '2025-05-20', '08:30:00', '20:30:00', '2025-05-17 07:35:40', '2025-05-17 07:35:40');

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
('laravel_cache_a75f3f172bfb296f2e10cbfc6dfc1883', 'i:1;', 1747649713),
('laravel_cache_a75f3f172bfb296f2e10cbfc6dfc1883:timer', 'i:1747649713;', 1747649713),
('laravel_cache_ad4954e2e38bb42a3ba5cbc5eebbbdbc', 'i:2;', 1747647450),
('laravel_cache_ad4954e2e38bb42a3ba5cbc5eebbbdbc:timer', 'i:1747647450;', 1747647450),
('laravel_cache_EMPk37nBYJIEVWgS', 's:7:\"forever\";', 2063007391),
('laravel_cache_f1f70ec40aaa556905d4a030501c0ba4', 'i:1;', 1747648133),
('laravel_cache_f1f70ec40aaa556905d4a030501c0ba4:timer', 'i:1747648133;', 1747648133);

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
(7, '2025_04_07_045241_add_role_to_users_table', 1),
(8, '2025_04_10_021203_create_certificates_table', 1),
(9, '2025_04_20_191013_add_availability_to_users_table', 1),
(10, '2025_05_02_180624_create_appointments_table', 1),
(11, '2025_05_19_131710_create_profile_pictures_table', 2),
(12, '2025_05_19_155517_update_profile_pictures_folder_structure', 3);

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

-- --------------------------------------------------------

--
-- Table structure for table `profile_pictures`
--

CREATE TABLE `profile_pictures` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `profile_pictures`
--

INSERT INTO `profile_pictures` (`id`, `user_id`, `path`, `created_at`, `updated_at`) VALUES
(3, 1, '1-ian_kenneth-sianghio-user/1747636556.png', '2025-05-19 06:02:34', '2025-05-19 07:55:52'),
(4, 2, '2-11-1-admin/1747641963.jpeg', '2025-05-19 07:15:09', '2025-05-19 08:06:03'),
(5, 10, '10-angelique-tenoso-admin/1747641704.jpg', '2025-05-19 07:57:28', '2025-05-19 08:01:44'),
(6, 11, '11-sursha-sursha-user/1747646741.png', '2025-05-19 09:25:42', '2025-05-19 09:25:42');

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
('09kdtSpszTI6l4XOJY2PzyMf8RFxsam6luiKxcW7', NULL, '127.0.0.1', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMmZXOXBaN0x0ZmRDQ1Y4bUVteTZvY05aTEVmcHZxSmFkMDVrcTR4SCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747465529),
('3VKOFWMRh5P1K0S9qTydOoeZTDJpUkreTxoPT78G', NULL, '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUDc4UkFjenJrZzJTU3p3SHpHVUZwMU9GUnFQTGNFVTVYSmVVN0FocSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747647296),
('5SmeE0J4w3kiFAwFBHsgSzxWiTBOngrFPKDC5gyF', NULL, '127.0.0.1', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidHBRbjlteldKZDV6eUx6ckl5eDFsc2hxN2Z1YkVZTmhaSUFteU9RVyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747465566),
('Hb9FPxGQBdI6uZ35XmuIWS8ERclYrJwnuXQlL3wd', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUElrM2g3YVloZVpEMUN6dnJhbENYYVZLU3diREhlMkJMVzdxVkZvZiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747465798),
('MzmN8SOAlSiftozD91jrF6tKZXYzvilPwqYk47D9', NULL, '127.0.0.1', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaHB4OGVNdEhQTHhpUndTNWtPMWdjRVJiME84QzBLaTJZSmRGWUpReiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747646499),
('RiO8t3RzRbuxaCBTmWQepgiWdjrShkruyhtKjsnV', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiajVYTW1Fa0NONDIwZE5aMjI1aGtzZExpek5GV2dPZzNaVkFyb2t5SiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747469816),
('rsGVtzZYHfmw9vcd7exk3FoSjzikbFicZUuGdgq6', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidDJxU0pPRVE4dDRuUnFBMzNuaU5CUm5LNWp3SXVaQ0E1VG93Y0N3VCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjAxOiJodHRwOi8vaGVyb2ljLXNlbnNpYmxlLWJ1enphcmQubmdyb2stZnJlZS5hcHAvP2ZiY2xpZD1Jd1kyeGphd0tYMkQ1bGVIUnVBMkZsYlFJeE1BQmljbWxrRVRGdk9IZFdlbkJaTWxVd1NsbERURk5TQVI1b3pGUXFUdnAwTWN4Q29wdU1ZRlZsc1RmZDJaMnBHRWtoY0tjWF9VR0VycHFnUG1pY3JsZk1DeWZBQ0FfYWVtX0M0MVN0NlhRdFN4Rk1xcnA3MUVFN2ciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1747646708),
('ULRrFvB4lCVoBlVYbLfM5zwjiFmgMBwnsaRQTVf0', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoic0pWT3d1N0dJQ05MRHlxZXBVMVJPU3lMenZJamVIN0E4OE16WmNVRyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747646433),
('vfU0UYB2T0ZeWgRq8WRoCmwR0WoCGxq2VKhjdspD', NULL, '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYVAyQjRzcnRMQ0llampycTlQQjhnTW9SQWtjR0pHT2VPczBkV1A2TCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747471132),
('VYO7sgaxXfW3EG5ZFB0l739JrWa35OPfTUoCjR59', NULL, '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_8_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBAV/507.0.0.50.107;FBBV/734202868;FBDV/iPhone9,4;FBMD/iPhone;FBSN/iOS;FBSV/15.8.4;FBSS/3;FBCR/;FBID/phone;FBLC/en_US;FBOP/80]', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSmN6RGlEREM4YmpMWDNnQmdQZXRMN2hHR05JVFlCcGUyZWNMQ3JmbiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MTYxOiJodHRwOi8vaGVyb2ljLXNlbnNpYmxlLWJ1enphcmQubmdyb2stZnJlZS5hcHAvP2ZiY2xpZD1Jd1pYaDBiZ05oWlcwQ01URUFBUjZGMy1wUlhoVHB5blZ1Q3lYdkZZb1BKRWdwVEwwUmFfcGpKZ1Q4Y0ZDblViREhFSm5jRzdyWno2U3VXQV9hZW1fZGxTSzhuTWwwOUVsaVFpYzNIUTZnQSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747466268),
('xMdJdNKSCxDeuU6dRyHFsD3BPi1jMrumYNW6SBfw', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT3E3bnVyWlMyY1BiWDh1U3pwUjVaTGtSQ1ZqeFN2dXR0aE5USm5qVyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747645297),
('y0Gvf2WrxePunlIezPuTiaVxtfuiwOhbV1cXDllt', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMU9pZ29scW45emZidjBpVWVFb21EU1lRaXNlUGpkVHhvd3gyemFQZCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747474977),
('y95lUFSS0QRSDnlMcKiV0M1rk3rYc5CsgvqgRhMe', NULL, '127.0.0.1', 'python-requests/2.32.3', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiR0diVm83WlhTTkpKSUFmUUR4RDVFTEZQeFRSbWdxbWhUdmhKaWc5NiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747466278),
('yq0wT6djdyulxtrOjsfsgcnKCBYDEbDkDtIB4DWS', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoid1FsaUsxSHZuSk1DZ3h1NDg4QzVpc0ZYalpGUlBFNXo4UGdkcjZHciI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjAxOiJodHRwOi8vaGVyb2ljLXNlbnNpYmxlLWJ1enphcmQubmdyb2stZnJlZS5hcHAvP2ZiY2xpZD1Jd1kyeGphd0tWSWhObGVIUnVBMkZsYlFJeE1BQmljbWxrRVRFMFYzZHdWRzVWVlV4MFJsQm5VblEwQVI1aW9CcU9YRXRYcmx2R1NVbkh4bWd6MkVfeWVpdGttMzJQZEkzOVZIS21hVENoMVZlUUM3cDRWa1BCb0FfYWVtX3VudVY1eXpPUkN1TUo1LU1zYk8tTXciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1747468995);

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
  `remember_token` varchar(100) DEFAULT NULL,
  `availability` varchar(255) DEFAULT 'Available',
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
  `role` varchar(255) NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `middle_name`, `last_name`, `email`, `password`, `mobile`, `remember_token`, `availability`, `created_at`, `updated_at`, `region`, `province`, `city`, `barangay`, `street`, `zip_code`, `building_number`, `birthday`, `position`, `secondary_position`, `gender`, `civil_status`, `role`) VALUES
(1, 'Ian Kenneth', 'Ramirez', 'Sianghio', 'kennethsianghio756@gmail.com', '$2y$12$sz6zCJrQeXznRh8WDPFCQ.XUt7iUf.3ZbzOGwjXX7buUiSyZSEvha', '09761465526', NULL, 'On Board', '2025-05-08 03:39:44', '2025-05-19 05:36:51', 'National Capital Region', 'Metro Manila', 'City of Malabon', 'Santulan', 'Mh Del Pilar St', '1473', '128', '2003-12-09', 'CEO', 'COO', 'Male', 'Single', 'user'),
(2, '11', '1', '1', 'ian@friendmar.com.ph', '$2y$12$OesYh7hMpvOIbAu1E.zpsOX/GWTphHHUKAIFNtZphSk/zaGWG6pA6', '45as4d5455454', NULL, NULL, '2025-05-13 03:12:10', '2025-05-17 06:37:08', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'admin'),
(3, 'Angela', 'Fajardo', 'Guilaran', 'meaboo@gmail.com', '$2y$12$CnqjR3VpRLhLoczNDYSVH.EcUxd2H.CaJLqUF2xgJmG4Ov0rxEKFe', '123456', NULL, 'On Board', '2025-05-13 03:24:50', '2025-05-13 03:37:02', 'National Capital Region', 'Metro Manila', 'City of Malabon', 'Santolan', 'asdasdsad', '1476', 'sadasd', '2003-10-24', 'ceo', 'ceo', 'Female', 'Single', 'user'),
(5, 'A', NULL, 'Guilaran', 'a@gmail.com', '$2y$12$gEBKYzdUxm4y3tdEtnGUcuFskrmV9CJ8uhNZRmlmQAqFk2Mkl6RWG', '1234567', NULL, 'Available', '2025-05-17 06:19:08', '2025-05-17 06:24:51', 'Central Luzon', 'Tarlac', 'Camiling', 'San Isidro', 'Nigga', '6969', '15151', '2005-11-11', 'Racist', 'COO', 'Male', 'Nigga', 'user'),
(6, 'Drew Djorn', 'G.', 'Calagos', 'ddgc@gmail.com', '$2y$12$yYZYinSbk5cJAhtwgeNld.UT5aRmhLRd6D8w65rejKZGMPS.MSUrS', '09123456789', NULL, 'Available', '2025-05-17 07:41:38', '2025-05-17 07:41:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user'),
(7, 'Angelique', 'Dumadag', 'Tenoso', 'ang@gmail.com', '$2y$12$2I8nKn72mUJKx5baJy/0W.jKraSfPjCcafDLgK2k1Mbpq3Fb3e.w6', '12345678', NULL, 'Available', '2025-05-17 07:57:42', '2025-05-17 07:57:42', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user'),
(8, 'a', 'b', 'c', 'abc@gmail.com', '$2y$12$iCEIzbnxxVm.4pbcaWQ0leQrdA6Cry/RYG/RIVDIvd4LLDPvySNi2', '09123', NULL, 'Available', '2025-05-17 08:39:51', '2025-05-17 08:39:51', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user'),
(9, 'Xia', 'Claire', 'Batungbakal', 'namimisshahawalabastaewan@gmail.com', '$2y$12$tUQ7ZJcV6wS2FXoPnGGKY.A1J5eBinh5C5Bqzzcs9c6RcuA64m/2K', '9288950136', NULL, 'Available', '2025-05-17 09:01:32', '2025-05-17 09:01:32', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user'),
(10, 'Angelique', 'Dumadag', 'Tenoso', 'a@friendmar.com.ph', '$2y$12$902DE0E24ewnPSx8gKIK8ObzfIA/fG2THk5BnTGqQ0E7WMNCs5HQu', '456789', NULL, NULL, '2025-05-19 07:53:05', '2025-05-19 07:53:05', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'admin'),
(11, 'sursha', 'sursha', 'sursha', 'sursha@gmail.com', '$2y$12$V.eNPGBL8rPerWGTSn.JVOU9BciJq77AvvZZUJr/.Ctk8dWD7GHT6', '095507430833', NULL, 'Vacation', '2025-05-19 08:42:51', '2025-05-19 09:36:31', 'National Capital Region', 'Metro Manila', 'City of Mandaluyong', 'Barangka Itaas', 'Corner street', '112', '11199191', '2025-05-19', 'janitor', 'sixty nine', 'tao', '50-50', 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `appointments_user_id_foreign` (`user_id`);

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
-- Indexes for table `profile_pictures`
--
ALTER TABLE `profile_pictures`
  ADD PRIMARY KEY (`id`),
  ADD KEY `profile_pictures_user_id_foreign` (`user_id`);

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
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `profile_pictures`
--
ALTER TABLE `profile_pictures`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `certificates`
--
ALTER TABLE `certificates`
  ADD CONSTRAINT `certificates_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `profile_pictures`
--
ALTER TABLE `profile_pictures`
  ADD CONSTRAINT `profile_pictures_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
