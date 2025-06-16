-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 14, 2025 at 02:40 PM
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
  `department` varchar(255) DEFAULT NULL,
  `crewing_dept` varchar(255) DEFAULT NULL,
  `operator` varchar(255) DEFAULT NULL,
  `accounting_task` varchar(255) DEFAULT NULL,
  `employee` varchar(255) DEFAULT NULL,
  `purpose` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `user_id`, `date`, `start_time`, `end_time`, `department`, `crewing_dept`, `operator`, `accounting_task`, `employee`, `purpose`, `created_at`, `updated_at`, `status`) VALUES
(155, 79, '2025-06-24', '14:00:00', '17:30:00', 'crewing', 'maran gas', 'crew operator 1', NULL, 'alden', 'contract signing', '2025-06-02 07:48:58', '2025-06-03 02:07:56', 'booked'),
(179, 61, '2025-06-13', '17:30:00', '18:00:00', 'medical', NULL, NULL, NULL, 'Angela Guilaran', 'training', '2025-06-03 09:37:19', '2025-06-03 09:37:19', 'booked'),
(185, 22, '2025-06-04', '09:30:00', '10:30:00', 'crewing', 'maran dry', 'senior fleet crew operator', NULL, 'Angela Guilaran', 'contract signing', '2025-06-04 05:57:23', '2025-06-04 05:57:23', 'booked'),
(186, 24, '2025-06-04', '10:00:00', '10:30:00', 'medical', NULL, NULL, NULL, 'Jessa Mirabete', 'document submission', '2025-06-04 05:58:18', '2025-06-04 05:58:18', 'booked'),
(189, 28, '2025-06-04', '11:00:00', '15:00:00', 'medical', NULL, NULL, NULL, 'Dave Nielsen D. luz', 'document submission', '2025-06-04 06:04:11', '2025-06-04 06:04:11', 'booked'),
(190, 47, '2025-06-04', '13:00:00', '16:30:00', 'crewing', 'maran tankers', 'senior fleet crew operator', NULL, 'Mariane Jamiaca Teñoso', 'document submission', '2025-06-04 06:04:53', '2025-06-04 06:04:53', 'booked'),
(191, 51, '2025-06-04', '17:30:00', '18:00:00', 'medical', NULL, NULL, NULL, 'Ivan M. Mendoza', 'training', '2025-06-04 06:06:16', '2025-06-04 06:06:16', 'booked'),
(192, 53, '2025-06-04', '16:30:00', '17:30:00', 'medical', NULL, NULL, NULL, 'Pat Lin', 'document submission', '2025-06-04 06:07:07', '2025-06-04 06:07:07', 'booked'),
(193, 58, '2025-06-04', '16:00:00', '16:30:00', 'crewing', 'maran gas', 'crew operator 3', NULL, 'Karse Christian S. Morada', 'document submission', '2025-06-04 06:07:53', '2025-06-04 06:07:53', 'booked'),
(194, 57, '2025-06-04', '17:30:00', '18:00:00', 'medical', NULL, NULL, NULL, 'ANTONE DOMINIC B. BERMAS', 'allowance distribution', '2025-06-04 06:08:23', '2025-06-04 06:08:23', 'booked'),
(195, 59, '2025-06-04', '16:30:00', '17:30:00', 'medical', NULL, NULL, NULL, 'Danilo H. Arat', 'training', '2025-06-04 06:08:59', '2025-06-04 06:08:59', 'booked'),
(198, 99, '2025-06-05', '15:30:00', '16:30:00', 'crewing', 'maran gas', 'fleet crew manager', NULL, 'Che Aguinaldo', 'document submission', '2025-06-04 08:23:06', '2025-06-04 08:23:19', 'booked'),
(209, 98, '2025-06-19', '17:30:00', '18:00:00', 'crewing', 'maran gas', 'senior fleet crew operator', NULL, 'asdasdasdsda', 'contract signing', '2025-06-09 03:55:00', '2025-06-09 03:55:00', 'booked'),
(215, 1, '2025-06-20', '17:00:00', '18:00:00', 'medical', NULL, NULL, NULL, 'LeBron James', 'contract signing', '2025-06-09 05:12:01', '2025-06-14 11:25:08', 'pending');

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
('laravel_cache_a75f3f172bfb296f2e10cbfc6dfc1883', 'i:14;', 1749902222),
('laravel_cache_a75f3f172bfb296f2e10cbfc6dfc1883:timer', 'i:1749902222;', 1749902222),
('laravel_cache_b31f2dc02dd4f08939d07640ffc5c8eb', 'i:3;', 1749900785),
('laravel_cache_b31f2dc02dd4f08939d07640ffc5c8eb:timer', 'i:1749900785;', 1749900785),
('laravel_cache_e9b6cc1432541b9ceebf113eee05eeba', 'i:10;', 1749902217),
('laravel_cache_e9b6cc1432541b9ceebf113eee05eeba:timer', 'i:1749902217;', 1749902217),
('laravel_cache_f1f70ec40aaa556905d4a030501c0ba4', 'i:2;', 1749900587),
('laravel_cache_f1f70ec40aaa556905d4a030501c0ba4:timer', 'i:1749900587;', 1749900587);

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
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `certificate_name` varchar(255) NOT NULL,
  `certificate_type` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `expiration_date` date DEFAULT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `certificates`
--

INSERT INTO `certificates` (`id`, `user_id`, `certificate_name`, `certificate_type`, `file_path`, `expiration_date`, `status`, `created_at`, `updated_at`) VALUES
(43, 31, 'DAAT', 'Medical', '31-chapell-roan-user/certificates/DAAT.pdf', '2030-08-09', 'pending', '2025-05-31 04:05:14', '2025-05-31 04:05:14'),
(44, 31, 'Mental Health', 'Training', '31-chapell-roan-user/certificates/Mental_Health.pdf', '2040-10-07', 'pending', '2025-05-31 04:06:01', '2025-05-31 04:06:01'),
(53, 31, '0999', 'Employee ID', '31-chapell-roan-user/certificates/0999.pdf', '2040-12-12', 'pending', '2025-05-31 04:20:09', '2025-05-31 04:20:09'),
(56, 34, 'comp', 'Training', '34-dave_nielsen-luz-user/certificates/comp.pdf', '2025-06-23', 'pending', '2025-06-01 07:23:42', '2025-06-01 07:23:42'),
(83, 40, 'i', 'Training', '40-shiela_mae-paluga-user/certificates/i.pdf', '2029-01-01', 'pending', '2025-06-01 07:27:11', '2025-06-01 07:27:11'),
(84, 40, 'l', 'Contract', '40-shiela_mae-paluga-user/certificates/l.pdf', '2029-01-01', 'pending', '2025-06-01 07:27:48', '2025-06-01 07:27:48'),
(85, 40, 'k', 'Employee ID', '40-shiela_mae-paluga-user/certificates/k.pdf', '2029-01-01', 'pending', '2025-06-01 07:28:41', '2025-06-01 07:28:41'),
(88, 43, 'GGGG', 'Employee ID', '43-dave_nielsen-luz-user/certificates/GGGG.pdf', '2025-06-18', 'pending', '2025-06-01 07:59:09', '2025-06-01 07:59:09'),
(94, 47, 'ticket', 'Contract', '47-kaiser-michael-user/certificates/ticket.pdf', '2025-06-19', 'pending', '2025-06-01 23:38:11', '2025-06-01 23:38:11'),
(105, 99, 'Terms & Con', 'Contract', '99-che-aguinaldo-user/certificates/Terms_&_Con.pdf', '2025-07-04', 'pending', '2025-06-04 08:38:58', '2025-06-04 08:38:58'),
(114, 1, 'acfsassda', 'SOLAS-Cargo Ship Safety Construction Certificate', '1-ian_kenneth-sianghio-user/certificates/solas-cargo_ship_safety_construction_certificate-acfsassda.pdf', '2025-06-26', 'approved', '2025-06-14 11:27:33', '2025-06-14 11:28:00');

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

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`id`, `queue`, `payload`, `attempts`, `reserved_at`, `available_at`, `created_at`) VALUES
(1, 'default', '{\"uuid\":\"dffd65f0-794b-4ed1-80a7-d74a0109d88e\",\"displayName\":\"App\\\\Notifications\\\\SendCertificateNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:1;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:45:\\\"App\\\\Notifications\\\\SendCertificateNotification\\\":2:{s:18:\\\"\\u0000*\\u0000certificateType\\\";s:7:\\\"Medical\\\";s:2:\\\"id\\\";s:36:\\\"8b9ccfaf-ce28-4ff1-8018-f1051d93263e\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:8:\\\"database\\\";}}\"}}', 0, NULL, 1748323882, 1748323882),
(2, 'default', '{\"uuid\":\"0a6f8827-8423-4b16-bc7b-09cccf77d2f0\",\"displayName\":\"App\\\\Notifications\\\\SendCertificateNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:1;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:45:\\\"App\\\\Notifications\\\\SendCertificateNotification\\\":2:{s:18:\\\"\\u0000*\\u0000certificateType\\\";s:7:\\\"Medical\\\";s:2:\\\"id\\\";s:36:\\\"29dff9f1-a12a-47bf-8a49-d01b7a20dab6\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:8:\\\"database\\\";}}\"}}', 0, NULL, 1748323883, 1748323883),
(3, 'default', '{\"uuid\":\"f5121074-c6a6-4df3-805f-9f2880bacc54\",\"displayName\":\"App\\\\Notifications\\\\SendCertificateNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:1;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:45:\\\"App\\\\Notifications\\\\SendCertificateNotification\\\":2:{s:18:\\\"\\u0000*\\u0000certificateType\\\";s:7:\\\"Medical\\\";s:2:\\\"id\\\";s:36:\\\"2f82fbb6-60ed-4218-9bcc-b9309fdae3e1\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:8:\\\"database\\\";}}\"}}', 0, NULL, 1748323884, 1748323884),
(4, 'default', '{\"uuid\":\"bb4784c4-0626-4384-8a76-723ab16a785b\",\"displayName\":\"App\\\\Notifications\\\\SendCertificateNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:1;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:45:\\\"App\\\\Notifications\\\\SendCertificateNotification\\\":2:{s:18:\\\"\\u0000*\\u0000certificateType\\\";s:7:\\\"Medical\\\";s:2:\\\"id\\\";s:36:\\\"960e63b1-b9a1-49e1-8b2b-10009128629d\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:8:\\\"database\\\";}}\"}}', 0, NULL, 1748323884, 1748323884),
(5, 'default', '{\"uuid\":\"8d7fc526-471d-422b-ac17-706f68db75cd\",\"displayName\":\"App\\\\Notifications\\\\SendCertificateNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:1;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:45:\\\"App\\\\Notifications\\\\SendCertificateNotification\\\":2:{s:18:\\\"\\u0000*\\u0000certificateType\\\";s:7:\\\"Medical\\\";s:2:\\\"id\\\";s:36:\\\"a6eeb0b8-2054-485d-a6d3-95b71d81aa56\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:8:\\\"database\\\";}}\"}}', 0, NULL, 1748323884, 1748323884),
(6, 'default', '{\"uuid\":\"c5378c19-985e-4c78-9149-16782ba3d312\",\"displayName\":\"App\\\\Notifications\\\\SendCertificateNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:1;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:45:\\\"App\\\\Notifications\\\\SendCertificateNotification\\\":2:{s:18:\\\"\\u0000*\\u0000certificateType\\\";s:7:\\\"Medical\\\";s:2:\\\"id\\\";s:36:\\\"370edc16-9418-4f2e-b01d-54c8862586cd\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:8:\\\"database\\\";}}\"}}', 0, NULL, 1748323885, 1748323885),
(7, 'default', '{\"uuid\":\"7d45776b-fa4d-420d-8840-121121f586d0\",\"displayName\":\"App\\\\Notifications\\\\SendCertificateNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:1;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:45:\\\"App\\\\Notifications\\\\SendCertificateNotification\\\":2:{s:18:\\\"\\u0000*\\u0000certificateType\\\";s:7:\\\"Medical\\\";s:2:\\\"id\\\";s:36:\\\"fa8224a6-6646-439b-8b08-bd44aaa56e52\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:8:\\\"database\\\";}}\"}}', 0, NULL, 1748323901, 1748323901),
(8, 'default', '{\"uuid\":\"266bd5da-586d-439d-9828-1695bd8307d2\",\"displayName\":\"App\\\\Notifications\\\\SendCertificateNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:1;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:45:\\\"App\\\\Notifications\\\\SendCertificateNotification\\\":2:{s:18:\\\"\\u0000*\\u0000certificateType\\\";s:7:\\\"Medical\\\";s:2:\\\"id\\\";s:36:\\\"4b140ac8-dbb1-4184-ad36-0d47a2e10a08\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:8:\\\"database\\\";}}\"}}', 0, NULL, 1748323938, 1748323938),
(9, 'default', '{\"uuid\":\"ed235198-e0af-4c05-90c2-2a17d9307661\",\"displayName\":\"App\\\\Notifications\\\\SendCertificateNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:1;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:45:\\\"App\\\\Notifications\\\\SendCertificateNotification\\\":2:{s:18:\\\"\\u0000*\\u0000certificateType\\\";s:7:\\\"Medical\\\";s:2:\\\"id\\\";s:36:\\\"5cb3afdf-b33f-495e-968e-f882b3761d9d\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:8:\\\"database\\\";}}\"}}', 0, NULL, 1748324440, 1748324440),
(10, 'default', '{\"uuid\":\"c54d98ab-4992-4004-beca-afbb56a7170d\",\"displayName\":\"App\\\\Notifications\\\\SendCertificateNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:1;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:45:\\\"App\\\\Notifications\\\\SendCertificateNotification\\\":2:{s:18:\\\"\\u0000*\\u0000certificateType\\\";s:7:\\\"Medical\\\";s:2:\\\"id\\\";s:36:\\\"0da4c150-4043-4970-aa99-51686f559cc3\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:8:\\\"database\\\";}}\"}}', 0, NULL, 1748324443, 1748324443),
(11, 'default', '{\"uuid\":\"f803c7be-ea13-4434-b386-872df7a58617\",\"displayName\":\"App\\\\Notifications\\\\SendCertificateNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:1;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:45:\\\"App\\\\Notifications\\\\SendCertificateNotification\\\":2:{s:18:\\\"\\u0000*\\u0000certificateType\\\";s:8:\\\"Training\\\";s:2:\\\"id\\\";s:36:\\\"f9709649-cb20-4de5-8268-ade98ef8cb2c\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:8:\\\"database\\\";}}\"}}', 0, NULL, 1748324448, 1748324448),
(12, 'default', '{\"uuid\":\"5aa6ca1d-7b50-4537-a805-e75f996008f4\",\"displayName\":\"App\\\\Notifications\\\\SendRescheduleNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:1;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:44:\\\"App\\\\Notifications\\\\SendRescheduleNotification\\\":2:{s:14:\\\"\\u0000*\\u0000appointment\\\";a:4:{s:2:\\\"id\\\";i:18;s:4:\\\"date\\\";s:10:\\\"2025-06-07\\\";s:10:\\\"start_time\\\";s:5:\\\"07:00\\\";s:8:\\\"end_time\\\";s:5:\\\"18:00\\\";}s:2:\\\"id\\\";s:36:\\\"49c1e6e6-5adb-41fd-a1c9-dc99ebada8d4\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:8:\\\"database\\\";}}\"}}', 0, NULL, 1748454625, 1748454625),
(13, 'default', '{\"uuid\":\"7754c32a-6182-403e-940d-6fb3daa6e68f\",\"displayName\":\"App\\\\Notifications\\\\SendRescheduleNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:1;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:44:\\\"App\\\\Notifications\\\\SendRescheduleNotification\\\":3:{s:14:\\\"\\u0000*\\u0000appointment\\\";a:4:{s:2:\\\"id\\\";i:18;s:4:\\\"date\\\";s:10:\\\"2025-06-08\\\";s:10:\\\"start_time\\\";s:5:\\\"07:00\\\";s:8:\\\"end_time\\\";s:5:\\\"18:00\\\";}s:10:\\\"\\u0000*\\u0000adminId\\\";i:2;s:2:\\\"id\\\";s:36:\\\"82a68872-112f-4e6f-b711-afefbcc02352\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:8:\\\"database\\\";}}\"}}', 0, NULL, 1748455044, 1748455044);

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
(12, '2025_05_19_155517_update_profile_pictures_folder_structure', 3),
(13, '2025_05_24_162622_add_expiration_date_to_certificates', 4),
(14, '2025_05_24_162929_drop_certificates_table', 4),
(15, '2025_05_24_163019_create_certificates_table', 5),
(16, '2025_05_26_173250_create_notifications_table', 6),
(17, '2025_05_26_175316_modify_notifications_table_to_match_required_schema', 7),
(18, '2025_05_27_131728_create_notifications_table', 8),
(19, '2025_05_28_120816_add_department_and_officer_to_appointments_table', 9),
(20, '2025_05_28_120037_add_person_to_appointments_table', 10),
(21, '2025_05_28_222426_update_appointments_table', 10),
(22, '2025_05_29_132646_add_status_to_appointments_table', 11),
(23, '2025_05_30_212805_add_purpose_to_appointments_table', 12),
(24, '2025_05_31_110403_rename_secondary_position_to_department_in_users_table_20250531', 13),
(25, '2025_06_12_200007_add_status_to_certificates_table', 14);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` char(36) NOT NULL,
  `type` varchar(255) NOT NULL,
  `notifiable_type` varchar(255) NOT NULL,
  `notifiable_id` bigint(20) UNSIGNED NOT NULL,
  `data` text NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `type`, `notifiable_type`, `notifiable_id`, `data`, `read_at`, `created_at`, `updated_at`) VALUES
('0c22e4b7-de7a-4bb2-ab0e-83a25cce8b55', 'App\\Notifications\\SendCancelNotification', 'App\\Models\\User', 24, '{\"user_id\":24,\"appointment_id\":9,\"date\":\"2025-05-28\",\"start_time\":\"17:37:00\",\"end_time\":\"19:45:00\",\"message\":\"Your appointment has been cancelled.\",\"created_at\":\"2025-05-28T03:34:06.414943Z\"}', NULL, '2025-05-28 03:34:06', '2025-05-28 03:34:06'),
('170ff54e-d540-4a94-a47d-c7bcae95a194', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Training\",\"message\":\"Please upload your Training Certificate\",\"created_at\":\"2025-06-04T07:27:09.983569Z\"}', NULL, '2025-06-04 07:27:09', '2025-06-04 07:27:09'),
('1ac5e24c-6a6f-44ea-97c7-a8f3b23773f5', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Medical\",\"message\":\"Please upload your Medical Certificate\",\"created_at\":\"2025-05-30T04:35:27.924070Z\"}', NULL, '2025-05-30 04:35:27', '2025-05-30 04:35:27'),
('1ee7aa7f-08fb-4e59-b2cd-52ba8c640773', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 31, '{\"user_id\":31,\"certificate_type\":\"Contract\",\"message\":\"Please upload your Contract Certificate\",\"created_at\":\"2025-06-02T08:29:03.926775Z\"}', NULL, '2025-06-02 08:29:03', '2025-06-02 08:29:03'),
('211a09f2-d5fb-483c-b9c3-622b5e2a0c4c', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 35, '{\"user_id\":35,\"certificate_type\":\"Employee ID\",\"message\":\"Please upload your Employee ID Certificate\",\"created_at\":\"2025-06-01T07:29:41.041664Z\"}', NULL, '2025-06-01 07:29:41', '2025-06-01 07:29:41'),
('2bd0f5fa-dae3-4a49-815c-788a65b19ffa', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 99, '{\"user_id\":99,\"certificate_type\":\"Training\",\"message\":\"Please upload your Training Certificate\",\"created_at\":\"2025-06-04T08:41:08.698465Z\"}', NULL, '2025-06-04 08:41:08', '2025-06-04 08:41:08'),
('37b76b8d-0c2d-4cbe-bc2e-411610808202', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Training\",\"message\":\"Please upload your Training Certificate\",\"created_at\":\"2025-06-04T07:27:09.603494Z\"}', NULL, '2025-06-04 07:27:09', '2025-06-04 07:27:09'),
('3d2f8a4d-1979-45d4-8581-c7d0b2d5cd58', 'App\\Notifications\\SendAppointmentNotification', 'App\\Models\\User', 24, '{\"user_id\":24,\"appointment_id\":8,\"date\":\"2025-05-28\",\"start_time\":\"19:00\",\"end_time\":\"21:00\",\"message\":\"You have a new appointment scheduled.\",\"created_at\":\"2025-05-28T03:23:20.578054Z\"}', NULL, '2025-05-28 03:23:20', '2025-05-28 03:23:20'),
('3eca1483-12bf-4abf-b94f-3f0975046787', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Medical\",\"message\":\"Please upload your Medical Certificate\",\"created_at\":\"2025-06-01T08:06:27.416561Z\"}', NULL, '2025-06-01 08:06:27', '2025-06-01 08:06:27'),
('45533c0b-936f-42ee-bab0-f1b045b14d10', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Medical\",\"message\":\"Please upload your Medical Certificate\",\"created_at\":\"2025-05-31T04:08:40.900002Z\"}', NULL, '2025-05-31 04:08:40', '2025-05-31 04:08:40'),
('45ad695f-0490-499c-8b5a-ec3e43a44b5a', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 22, '{\"user_id\":22,\"certificate_type\":\"Medical\",\"message\":\"Please upload your Medical Certificate\",\"created_at\":\"2025-06-01T08:58:08.841521Z\"}', NULL, '2025-06-01 08:58:08', '2025-06-01 08:58:08'),
('49ba78ce-1207-48f6-b942-8598d6e853c9', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Training\",\"message\":\"Please upload your Training Certificate\",\"created_at\":\"2025-06-01T15:26:06.137388Z\"}', NULL, '2025-06-01 15:26:06', '2025-06-01 15:26:06'),
('4ce17c11-dfe1-4fbd-bbd7-78b25ded7a42', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 24, '{\"user_id\":24,\"certificate_type\":\"Medical\",\"message\":\"Please upload your Medical Certificate\",\"created_at\":\"2025-05-28T03:37:05.162169Z\"}', NULL, '2025-05-28 03:37:05', '2025-05-28 03:37:05'),
('500b413a-c599-468f-bfd3-db791bd88e3c', 'App\\Notifications\\SendRescheduleNotification', 'App\\Models\\User', 1, '{\"appointment_id\":18,\"date\":\"2025-06-03\",\"start_time\":\"16:00\",\"end_time\":\"18:00\",\"message\":\"Your appointment has been rescheduled.\",\"created_at\":\"2025-05-29 01:13:57\",\"user\":{\"first_name\":\"Ian Kenneth\",\"middle_name\":\"Ramirez\",\"last_name\":\"Sianghio\",\"position\":\"CEO\"}}', NULL, '2025-05-28 17:13:57', '2025-05-28 17:13:57'),
('592781b8-bf2d-436c-b57e-983af68cdefc', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 31, '{\"user_id\":31,\"certificate_type\":\"Contract\",\"message\":\"Please upload your Contract Certificate\",\"created_at\":\"2025-06-02T09:26:36.831365Z\"}', NULL, '2025-06-02 09:26:36', '2025-06-02 09:26:36'),
('5b806955-d88b-4314-9612-8cc8cabbefe0', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Employee ID\",\"message\":\"Please upload your Employee ID Certificate\",\"created_at\":\"2025-06-04T01:00:49.976771Z\"}', NULL, '2025-06-04 01:00:49', '2025-06-04 01:00:49'),
('67253a41-4915-488f-bc5d-ce6d449958f4', 'App\\Notifications\\SendAppointmentNotification', 'App\\Models\\User', 24, '{\"user_id\":24,\"appointment_id\":9,\"date\":\"2025-05-28\",\"start_time\":\"17:37\",\"end_time\":\"19:45\",\"message\":\"You have a new appointment scheduled.\",\"created_at\":\"2025-05-28T03:32:09.592210Z\"}', NULL, '2025-05-28 03:32:09', '2025-05-28 03:32:09'),
('6cf739dd-5322-42c2-819f-09edb50a0c78', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Training\",\"message\":\"Please upload your Training Certificate\",\"created_at\":\"2025-06-02T07:40:45.070554Z\"}', NULL, '2025-06-02 07:40:45', '2025-06-02 07:40:45'),
('6f743b5a-f837-4bbd-9df3-f39530802463', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Medical\",\"message\":\"Please upload your Medical Certificate\",\"created_at\":\"2025-05-31T04:15:34.881699Z\"}', NULL, '2025-05-31 04:15:34', '2025-05-31 04:15:34'),
('75718502-aa7d-4482-a534-16fefe4fb568', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Medical\",\"message\":\"Please upload your Medical Certificate\",\"created_at\":\"2025-05-31T04:10:09.698499Z\"}', NULL, '2025-05-31 04:10:09', '2025-05-31 04:10:09'),
('77105373-d977-4d62-8ad8-de65f2e158bd', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 31, '{\"user_id\":31,\"certificate_type\":\"Employee ID\",\"message\":\"Please upload your Employee ID Certificate\",\"created_at\":\"2025-05-31T04:17:25.529869Z\"}', NULL, '2025-05-31 04:17:25', '2025-05-31 04:17:25'),
('776dacd0-26ee-4d98-b279-17faea7c06eb', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Training\",\"message\":\"Please upload your Training Certificate\",\"created_at\":\"2025-06-02T07:40:44.810588Z\"}', NULL, '2025-06-02 07:40:44', '2025-06-02 07:40:44'),
('7989d0f3-f28b-4d04-89f3-f77d93167e90', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Medical\",\"message\":\"Please upload your Medical Certificate\",\"created_at\":\"2025-05-27T05:44:56.340789Z\"}', NULL, '2025-05-27 05:44:56', '2025-05-27 05:44:56'),
('7c560561-37b5-4af7-bde9-375f4a60b8e6', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 79, '{\"user_id\":79,\"certificate_type\":\"Medical\",\"message\":\"Please upload your Medical Certificate\",\"created_at\":\"2025-06-02T07:49:53.553260Z\"}', NULL, '2025-06-02 07:49:53', '2025-06-02 07:49:53'),
('82fb5276-1958-449d-86d0-2a4dcda90e9b', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Training\",\"message\":\"Please upload your Training Certificate\",\"created_at\":\"2025-05-28T05:42:28.406728Z\"}', NULL, '2025-05-28 05:42:28', '2025-05-28 05:42:28'),
('831e31f3-aea7-4b16-b76d-a348abb80ec2', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Contract\",\"message\":\"Please upload your Contract Certificate\",\"created_at\":\"2025-06-04T00:53:59.058173Z\"}', NULL, '2025-06-04 00:53:59', '2025-06-04 00:53:59'),
('895fbeb7-cdf1-4dec-a519-b4b257385fa3', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Training\",\"message\":\"Please upload your Training Certificate\",\"created_at\":\"2025-06-02T08:20:27.408876Z\"}', NULL, '2025-06-02 08:20:27', '2025-06-02 08:20:27'),
('8c750f09-a4a5-4408-8446-5f184ffd013c', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 46, '{\"user_id\":46,\"certificate_type\":\"Medical\",\"message\":\"Please upload your Medical Certificate\",\"created_at\":\"2025-06-01T15:30:59.935967Z\"}', NULL, '2025-06-01 15:30:59', '2025-06-01 15:30:59'),
('8dadfcee-92d5-4f07-ad40-e2ea0f705de5', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 34, '{\"user_id\":34,\"certificate_type\":\"Medical\",\"message\":\"Please upload your Medical Certificate\",\"created_at\":\"2025-06-01T07:29:37.685478Z\"}', NULL, '2025-06-01 07:29:37', '2025-06-01 07:29:37'),
('9315f1c4-f099-4f53-afe7-1f30577db1cc', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Training\",\"message\":\"Please upload your Training Certificate\",\"created_at\":\"2025-05-27T05:46:31.503605Z\"}', NULL, '2025-05-27 05:46:31', '2025-05-27 05:46:31'),
('93647ab0-da93-4470-80b0-662cd3fec42d', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 31, '{\"user_id\":31,\"certificate_type\":\"Contract\",\"message\":\"Please upload your Contract Certificate\",\"created_at\":\"2025-06-02T08:49:10.573373Z\"}', NULL, '2025-06-02 08:49:10', '2025-06-02 08:49:10'),
('9f52d7b2-6143-4ffd-83ae-c352558cbf3e', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 40, '{\"user_id\":40,\"certificate_type\":\"Medical\",\"message\":\"Please upload your Medical Certificate\",\"created_at\":\"2025-06-01T07:54:23.207392Z\"}', NULL, '2025-06-01 07:54:23', '2025-06-01 07:54:23'),
('a1de183d-4804-4556-bb06-85d44178668a', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Medical\",\"message\":\"Please upload your Medical Certificate\",\"created_at\":\"2025-05-28T04:25:20.042457Z\"}', NULL, '2025-05-28 04:25:20', '2025-05-28 04:25:20'),
('a4dbd1b1-8b2d-4a59-82ea-d1dc660ed8fe', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Medical\",\"message\":\"Please upload your Medical Certificate\",\"created_at\":\"2025-06-01T08:58:12.059731Z\"}', NULL, '2025-06-01 08:58:12', '2025-06-01 08:58:12'),
('a5d44ecd-fe64-443e-953c-c25022e9b279', 'App\\Notifications\\SendAppointmentNotification', 'App\\Models\\User', 24, '{\"user_id\":24,\"appointment_id\":10,\"date\":\"2025-05-28\",\"start_time\":\"14:22\",\"end_time\":\"15:33\",\"message\":\"You have a new appointment scheduled.\",\"created_at\":\"2025-05-28T03:36:51.909889Z\"}', NULL, '2025-05-28 03:36:51', '2025-05-28 03:36:51'),
('a6aa5366-4e73-4f32-adc5-4ad709bddf89', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Medical\",\"message\":\"Please upload your Medical Certificate\",\"created_at\":\"2025-06-01T07:29:28.089163Z\"}', NULL, '2025-06-01 07:29:28', '2025-06-01 07:29:28'),
('a9e231f7-b10b-4c08-8954-1839b1c10c3b', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 29, '{\"user_id\":29,\"certificate_type\":\"Medical\",\"message\":\"Please upload your Medical Certificate\",\"created_at\":\"2025-06-02T15:00:40.425132Z\"}', NULL, '2025-06-02 15:00:40', '2025-06-02 15:00:40'),
('ad540413-2df8-45a0-aaf9-49c4c4cd3679', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Training\",\"message\":\"Please upload your Training Certificate\",\"created_at\":\"2025-06-02T07:40:43.659315Z\"}', NULL, '2025-06-02 07:40:43', '2025-06-02 07:40:43'),
('ae4b356b-c9a9-475f-bda9-f9526743e22e', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Training\",\"message\":\"Please upload your Training Certificate\",\"created_at\":\"2025-06-04T07:27:07.393845Z\"}', NULL, '2025-06-04 07:27:07', '2025-06-04 07:27:07'),
('b99aab02-f991-4c23-aa9e-58d93acd2dd6', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 82, '{\"user_id\":82,\"certificate_type\":\"Medical\",\"message\":\"Please upload your Medical Certificate\",\"created_at\":\"2025-06-02T08:24:19.317117Z\"}', NULL, '2025-06-02 08:24:19', '2025-06-02 08:24:19'),
('ba59a789-6e65-4e85-a06d-b9bb1810a549', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 31, '{\"user_id\":31,\"certificate_type\":\"Contract\",\"message\":\"Please upload your Contract Certificate\",\"created_at\":\"2025-06-02T08:55:15.185474Z\"}', NULL, '2025-06-02 08:55:15', '2025-06-02 08:55:15'),
('bb2c5a91-b0d1-422c-a897-f1c9f4afdc90', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 34, '{\"user_id\":34,\"certificate_type\":\"Medical\",\"message\":\"Please upload your Medical Certificate\",\"created_at\":\"2025-06-02T08:19:33.508525Z\"}', NULL, '2025-06-02 08:19:33', '2025-06-02 08:19:33'),
('c73e98be-97e4-4350-8b57-39c3ff42f1d3', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Training\",\"message\":\"Please upload your Training Certificate\",\"created_at\":\"2025-06-02T10:30:57.772689Z\"}', NULL, '2025-06-02 10:30:57', '2025-06-02 10:30:57'),
('c9c601e7-481d-4c15-ae6f-374bdcc5b635', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Training\",\"message\":\"Please upload your Training Certificate\",\"created_at\":\"2025-05-31T04:16:45.315702Z\"}', NULL, '2025-05-31 04:16:45', '2025-05-31 04:16:45'),
('cb46e401-8587-40df-b3fe-e54b08f5e233', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 99, '{\"user_id\":99,\"certificate_type\":\"Medical\",\"message\":\"Please upload your Medical Certificate\",\"created_at\":\"2025-06-04T08:41:05.256417Z\"}', NULL, '2025-06-04 08:41:05', '2025-06-04 08:41:05'),
('d0f27050-f830-4b4f-a313-558f389f585d', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Medical\",\"message\":\"Please upload your Medical Certificate\",\"created_at\":\"2025-05-28T05:18:02.481774Z\"}', NULL, '2025-05-28 05:18:02', '2025-05-28 05:18:02'),
('d202235f-25e7-4b49-a98c-ee7c4acf5dfb', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Training\",\"message\":\"Please upload your Training Certificate\",\"created_at\":\"2025-05-28T05:42:35.178700Z\"}', NULL, '2025-05-28 05:42:35', '2025-05-28 05:42:35'),
('d22cd2af-80d0-40d1-bbda-1cd8f98a2fb8', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Medical\",\"message\":\"Please upload your Medical Certificate\",\"created_at\":\"2025-05-30T04:35:28.491136Z\"}', NULL, '2025-05-30 04:35:28', '2025-05-30 04:35:28'),
('d3251964-3912-46c0-a7af-7748756604fe', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 99, '{\"user_id\":99,\"certificate_type\":\"Employee ID\",\"message\":\"Please upload your Employee ID Certificate\",\"created_at\":\"2025-06-04T08:41:12.487118Z\"}', NULL, '2025-06-04 08:41:12', '2025-06-04 08:41:12'),
('d593c3d2-98d1-47c9-bf5e-fdca34ff2dc5', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Training\",\"message\":\"Please upload your Training Certificate\",\"created_at\":\"2025-05-28T05:40:58.732438Z\"}', NULL, '2025-05-28 05:40:58', '2025-05-28 05:40:58'),
('d7e4610e-ca55-49c5-a53d-6a3c7d13e4ba', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Training\",\"message\":\"Please upload your Training Certificate\",\"created_at\":\"2025-06-02T08:02:43.132388Z\"}', NULL, '2025-06-02 08:02:43', '2025-06-02 08:02:43'),
('dbc6f8e2-8baa-477d-89fd-6bdce164ca0d', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Employee ID\",\"message\":\"Please upload your Employee ID Certificate\",\"created_at\":\"2025-06-01T15:26:06.695394Z\"}', NULL, '2025-06-01 15:26:06', '2025-06-01 15:26:06'),
('e4d53201-bf22-4590-aa58-6a7f9dc12c10', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 82, '{\"user_id\":82,\"certificate_type\":\"Medical\",\"message\":\"Please upload your Medical Certificate\",\"created_at\":\"2025-06-02T08:20:05.153057Z\"}', NULL, '2025-06-02 08:20:05', '2025-06-02 08:20:05'),
('e8bc94b7-2c26-4eeb-945c-ac66a05981d9', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 35, '{\"user_id\":35,\"certificate_type\":\"Employee ID\",\"message\":\"Please upload your Employee ID Certificate\",\"created_at\":\"2025-05-31T04:21:36.525397Z\"}', NULL, '2025-05-31 04:21:36', '2025-05-31 04:21:36'),
('ec9b8f14-e6b0-490e-89d0-bb07b0e69af3', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 31, '{\"user_id\":31,\"certificate_type\":\"Contract\",\"message\":\"Please upload your Contract Certificate\",\"created_at\":\"2025-06-02T07:55:51.306552Z\"}', NULL, '2025-06-02 07:55:51', '2025-06-02 07:55:51'),
('ed222bb2-ab5c-497e-a8e0-b2c67be625b1', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Employee ID\",\"message\":\"Please upload your Employee ID Certificate\",\"created_at\":\"2025-06-04T00:50:10.129113Z\"}', NULL, '2025-06-04 00:50:10', '2025-06-04 00:50:10'),
('f1c2a207-e4e2-4fa7-8a91-534459334020', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Training\",\"message\":\"Please upload your Training Certificate\",\"created_at\":\"2025-06-02T07:40:44.498695Z\"}', NULL, '2025-06-02 07:40:44', '2025-06-02 07:40:44'),
('f5c2c776-817f-4408-b98b-c028c697f7bb', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 30, '{\"user_id\":30,\"certificate_type\":\"Medical\",\"message\":\"Please upload your Medical Certificate\",\"created_at\":\"2025-05-31T03:35:06.878849Z\"}', NULL, '2025-05-31 03:35:06', '2025-05-31 03:35:06');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `password_reset_tokens`
--

INSERT INTO `password_reset_tokens` (`email`, `token`, `created_at`) VALUES
('dnluz01@gmail.com', '$2y$12$7HwqHlqsUcnFq.5Vn42k1ekO1tKmK2786KNpYnd2Vnh7N2z4nUZ5C', '2025-06-01 07:32:33'),
('irish.rosendo28@gmail.com', '$2y$12$wz69ZZ12U4TSjczRd1FKZ.F9nr97uhZpfPSJTz93.lMBEFrAdSZ.C', '2025-06-02 09:18:50'),
('kennethsianghio756@gmail.com', '$2y$12$AliI5L9JxvdO5LR.VsBI8uwXBrYuwZspSBxg6qkcjriBRE18OFOLe', '2025-06-01 07:50:48'),
('ralphfriendmaritime@gmail.com', '$2y$12$NBXl5.0AegK4gD5khTvY/.0HhpbhlrU1tDZ8WOyGlOox9Nw16clR.', '2025-06-02 08:54:02');

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
(3, 1, '1-ian_kenneth-sianghio-user/1748911368.png', '2025-05-19 06:02:34', '2025-06-03 00:42:48'),
(4, 2, '2-ian-sianghio-admin/1748911220.jpg', '2025-05-19 07:15:09', '2025-06-03 00:40:20'),
(7, 24, '24-matthias-czernin-user/1748345314.jpg', '2025-05-27 11:28:34', '2025-05-27 11:28:34'),
(9, 27, '27-lebron-james-admin/1748665148.png', '2025-05-30 07:38:55', '2025-05-31 04:19:08'),
(10, 33, '33-ryuaiken-tubera-admin/1748664671.jpg', '2025-05-31 04:10:54', '2025-05-31 04:11:11'),
(11, 31, '31-chapell-roan-user/1748664703.jpg', '2025-05-31 04:11:43', '2025-05-31 04:11:43'),
(14, 29, '29-mikha-lim-user/1748764049.jfif', '2025-05-31 05:04:02', '2025-06-01 07:47:29'),
(15, 40, '40-shiela_mae-paluga-user/1748762961.jpg', '2025-06-01 07:29:21', '2025-06-01 07:29:21'),
(17, 44, '44-ryuaiken-tubera-admin/1748764441.jpg', '2025-06-01 07:54:01', '2025-06-01 07:54:01'),
(20, 93, '93-charisse-cho-admin/1749015522.jfif', '2025-06-02 14:58:12', '2025-06-04 05:38:42'),
(21, 99, '99-che-aguinaldo-user/1749025945.jfif', '2025-06-04 08:32:25', '2025-06-04 08:32:25');

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
('0xm2uCR5MM5Q7w7vWJx7KtA3nmXBguINlPGT7Npw', NULL, '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNjhYakd6RzVpeTNsNnBtajZOdHFCRTBhUkowMzNoY1BVdXpKMFRIVSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1748585914),
('3EFs4miS2AmjslCVuzOJhNIcrb0FVXinHO4dA8LO', NULL, '127.0.0.1', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibG0wTGNxT2hJTG1RSHplMUhkTnBrOUhFZlhXekVGeTVtYlJCUDFZOCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1748584758),
('3VKOFWMRh5P1K0S9qTydOoeZTDJpUkreTxoPT78G', NULL, '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUDc4UkFjenJrZzJTU3p3SHpHVUZwMU9GUnFQTGNFVTVYSmVVN0FocSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747647296),
('4MAGpzd8lQTx986ycLHXJoijueHfEO4iHNd3ycVK', NULL, '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMU0wdnRaa3duOXZUa3p0T3pPMU5VS1NvdWFseW04emFOdzlCdXdPMiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1748764651),
('5SmeE0J4w3kiFAwFBHsgSzxWiTBOngrFPKDC5gyF', NULL, '127.0.0.1', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidHBRbjlteldKZDV6eUx6ckl5eDFsc2hxN2Z1YkVZTmhaSUFteU9RVyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747465566),
('7mK5KZAkpHaxMTdJO4i3zaVyVqSKSfzTrcTNGvHH', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYnBYd0wwb3pJRFdWa1F1dGkxM1o2eDZ6MVJRaWpYaXBMbTQzSUV6dSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1748584821),
('BrO5AT7ViBj9bqiEDYZTeMTsFl7TkHCnFP0HckKc', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRldEcG1xdFVSUjZXVUlya2NISHZwcjRyN3FWQzdlOEg1cVJxQTlOcyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747798033),
('dAHGUhMGBhTu8wrxzle9JrtJQUaEXVduXN8HhE0s', NULL, '127.0.0.1', 'WhatsApp/3.0.0.0 A', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoialluRE9TV2NmMDNEZjRWY1BjS0lLbUpLYXdDdG5FaHF2SE5zbHV3UiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1748763372),
('Dle6uRtyp3e3yNEqFFxQy9djAdzZ2iHAB8m1fbkm', NULL, '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWmo1OURWakFCaXpVT1o2SDN3WW95djJXaVdRM1ZVTzFHZnhZYWpmaiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747800500),
('FvBCNwRq5rOMhp717He1akaCfRZVMwZhLIXSqrEg', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoienJaMHZDUjM5QnBBejFFTEVITTlxSWN1ZVdCQ3JTcUZPYWZWVEF3ZiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1748584347),
('gYQtZuwTfhzM5MghQYQS8tcTgpQbasmphS4nT2sK', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoieFBqMmhKSG00elNKWU5ZYmIwMk10SUxDdURPRjZ6WHg4RmtBTkVaSCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1748860795),
('Hb9FPxGQBdI6uZ35XmuIWS8ERclYrJwnuXQlL3wd', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUElrM2g3YVloZVpEMUN6dnJhbENYYVZLU3diREhlMkJMVzdxVkZvZiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747465798),
('HiT5nCAHoKSuZMbed2ysuxUwIjqyb9gwcLH85qhk', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVkJOS3lQZW8xbjdjbW1PUWNIc0I0a055enRCMG9xVkZPZUxVQTdTbCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747802015),
('I8RyQ3VSmNqBbAQGSKfmZxxM8W8qQufxp24R7dvg', NULL, '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidmRtSXFYVUgxYUlrZTExY1hIeHU5M3pxQlV4UTQ3S3hZZ3NNT05DUiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1748586039),
('j4hpEYj86zTeo3aWFSgtvYmLbRJtCeQ6TUVWzYqt', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZkJ3eWpLczRnc3lyekNidkh3MXhGTU8ybDJ3em9HWjR4MDFHQW5SdCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747800692),
('jdzo9PzXmn2LMER1QIOdU9zadur47VToLK3Ttyv9', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVTE0U0o4UXZGZk81RWFCYXFQU1dwYTFqMjVkc0pWOXZuMzNIN0lORyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1748580547),
('k38dZsC7HhH5V9isXmBkjl0sxIIYGJBPNDjE1Siu', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibVBuZmxOcFZnanNnMHNUQjBWcm52N1lhMU5IcHZiZGVsNWtGM283ZyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1748586907),
('mAJjWI5EQsQppPALx4NisFCKfE9lBb3Wx7zPGRMU', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 15; REA-NX9 Build/HONORREA-N39; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/136.0.7103.60 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/491.0.0.46.109;]', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieWF1c3g5dW0yWjFRTDVtYUY2NkRoVnhuVFlBaDRYTVpzelNubXZiNCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1748584819),
('mQNXNnz1aGQcXHr0LNioBnpxCdTJerAn5YAmc9Jo', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 14; Infinix X6871 Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/136.0.7103.125 Mobile Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUmVhNmE4dEFWektRTHI3OE5Tb0dtT2lIOERTQVRkTUVDclFIcG1XRCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1748586047),
('MzmN8SOAlSiftozD91jrF6tKZXYzvilPwqYk47D9', NULL, '127.0.0.1', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaHB4OGVNdEhQTHhpUndTNWtPMWdjRVJiME84QzBLaTJZSmRGWUpReiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747646499),
('P4UhWgT0e4p3JOKnGLnJMVTLLmxFH58x3es3BmUb', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQXFGVUNPaTZVUGNORDdZQk1MYmZ3bGVoa0FLaXZLZDR0b0dKVWczZiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1748583855),
('pZaSH1373A9Rwv6Rw770JmpsofOe2HRjBqIQtxA2', NULL, '127.0.0.1', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibVl3enVmeUQyOFZENkJnblNVQzlDa3dVZ3A3T1pXckhibFlyZDZVZCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1748578366),
('r9WeqSPmSpgnQoaKycF3GmxMtHbCJnwCr7c3EIzJ', NULL, '127.0.0.1', 'Mozilla/5.0 (iPad; CPU OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoianZjeUpNenNvQTRKM0JWOW9qQXQ2U2dncXZ6NjlCb2RFcTlWODQ5WCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747800295),
('RiO8t3RzRbuxaCBTmWQepgiWdjrShkruyhtKjsnV', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiajVYTW1Fa0NONDIwZE5aMjI1aGtzZExpek5GV2dPZzNaVkFyb2t5SiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747469816),
('rsGVtzZYHfmw9vcd7exk3FoSjzikbFicZUuGdgq6', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidDJxU0pPRVE4dDRuUnFBMzNuaU5CUm5LNWp3SXVaQ0E1VG93Y0N3VCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjAxOiJodHRwOi8vaGVyb2ljLXNlbnNpYmxlLWJ1enphcmQubmdyb2stZnJlZS5hcHAvP2ZiY2xpZD1Jd1kyeGphd0tYMkQ1bGVIUnVBMkZsYlFJeE1BQmljbWxrRVRGdk9IZFdlbkJaTWxVd1NsbERURk5TQVI1b3pGUXFUdnAwTWN4Q29wdU1ZRlZsc1RmZDJaMnBHRWtoY0tjWF9VR0VycHFnUG1pY3JsZk1DeWZBQ0FfYWVtX0M0MVN0NlhRdFN4Rk1xcnA3MUVFN2ciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1747646708),
('ULRrFvB4lCVoBlVYbLfM5zwjiFmgMBwnsaRQTVf0', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoic0pWT3d1N0dJQ05MRHlxZXBVMVJPU3lMenZJamVIN0E4OE16WmNVRyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747646433),
('vfU0UYB2T0ZeWgRq8WRoCmwR0WoCGxq2VKhjdspD', NULL, '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYVAyQjRzcnRMQ0llampycTlQQjhnTW9SQWtjR0pHT2VPczBkV1A2TCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747471132),
('VgvAaxlbV43EIN9CV1aFLWN1chE4GdevgYpaSvdo', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaGxrbFNMMzM2WU9JWThwSXRWNmZVeE5GcWRaMEtobzB4c1N6S1RqdCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1749901689),
('VYO7sgaxXfW3EG5ZFB0l739JrWa35OPfTUoCjR59', NULL, '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_8_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBAV/507.0.0.50.107;FBBV/734202868;FBDV/iPhone9,4;FBMD/iPhone;FBSN/iOS;FBSV/15.8.4;FBSS/3;FBCR/;FBID/phone;FBLC/en_US;FBOP/80]', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSmN6RGlEREM4YmpMWDNnQmdQZXRMN2hHR05JVFlCcGUyZWNMQ3JmbiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MTYxOiJodHRwOi8vaGVyb2ljLXNlbnNpYmxlLWJ1enphcmQubmdyb2stZnJlZS5hcHAvP2ZiY2xpZD1Jd1pYaDBiZ05oWlcwQ01URUFBUjZGMy1wUlhoVHB5blZ1Q3lYdkZZb1BKRWdwVEwwUmFfcGpKZ1Q4Y0ZDblViREhFSm5jRzdyWno2U3VXQV9hZW1fZGxTSzhuTWwwOUVsaVFpYzNIUTZnQSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747466268),
('xMdJdNKSCxDeuU6dRyHFsD3BPi1jMrumYNW6SBfw', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT3E3bnVyWlMyY1BiWDh1U3pwUjVaTGtSQ1ZqeFN2dXR0aE5USm5qVyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747645297),
('y0Gvf2WrxePunlIezPuTiaVxtfuiwOhbV1cXDllt', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMU9pZ29scW45emZidjBpVWVFb21EU1lRaXNlUGpkVHhvd3gyemFQZCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747474977),
('y5n7S4ywLKy6GvZayrSzzfa4NPShWsA6xgdUF6wU', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVnVkSlhJYXJGd3RmVTJsdko2RU5IQ29Ed3lsSGlQSGFJYzBFMDU0eSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1748591671),
('y95lUFSS0QRSDnlMcKiV0M1rk3rYc5CsgvqgRhMe', NULL, '127.0.0.1', 'python-requests/2.32.3', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiR0diVm83WlhTTkpKSUFmUUR4RDVFTEZQeFRSbWdxbWhUdmhKaWc5NiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747466278),
('Yl97bFc7bUqA7Jtaek1thgVFEyyRdbwtTtQmF8d8', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoieTAzM0VaUHNDRW1rSlExbFB5czM0ZktFZE9sMndUZkw4UlBmTElEbCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1748763364),
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
  `availability` varchar(255) DEFAULT NULL,
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
  `department` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `civil_status` varchar(255) DEFAULT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `middle_name`, `last_name`, `email`, `password`, `mobile`, `remember_token`, `availability`, `created_at`, `updated_at`, `region`, `province`, `city`, `barangay`, `street`, `zip_code`, `building_number`, `birthday`, `position`, `department`, `gender`, `civil_status`, `role`) VALUES
(1, 'Ian Kenneth', 'Ramirez', 'Sianghio', 'kennethsianghio756@gmail.com', '$2y$12$TJYuhRgnedwhqmEK6abqGO.fIIkE9.4BNMUo391aDkIafPtE8wvHW', '09761465526', 'BAYNvNDbF3CkwRt9Ss5yYgkwUUbaPVv4sWaLzBnaBibzTEiv6FuzJuUULFzn', 'Available', '2025-05-08 03:39:44', '2025-06-04 06:50:06', 'National Capital Region', 'Metro Manila', 'City of Malabon', 'Santulan', 'Mh Del Pilar St', '1473', '128', '2003-12-09', '2nd Mate', NULL, 'Male', 'Single', 'user'),
(2, 'Ian', NULL, 'Sianghio', 'ian@friendmar.com.ph', '$2y$12$OesYh7hMpvOIbAu1E.zpsOX/GWTphHHUKAIFNtZphSk/zaGWG6pA6', '9060790646', NULL, NULL, '2025-05-13 03:12:10', '2025-06-04 05:43:21', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Senior Programmer', 'Accounting', NULL, NULL, 'admin'),
(22, 'Angela', 'Fajardo', 'Guilaran', 'meaboo@gmail.com', '$2y$12$Fpe0FQA7wJdMG3JXMS4ST.V2J0VJYs5fewANm/H1oLzlC/zf0vvqy', '09761465527', NULL, 'Available', '2025-05-25 10:25:00', '2025-06-03 09:45:28', 'National Capital Region', 'Metro Manila', 'City of Malabon', 'Santolan', 'sfsdfasasd', '1476', '213', '2003-10-24', 'Galley Boy', 'Galley Boy', 'Female', 'Single', 'user'),
(24, 'Jessa Mae', NULL, 'Mirabete', 'jessamaemirabete644@gmail.com', '$2y$12$fWvpEmIDJZPXseT13gmotuTZJXPOoSeoA1vNyiNv7YArp/bwn4s2m', '96458999', NULL, 'Available', '2025-05-27 11:04:48', '2025-06-04 05:44:56', 'Cagayan Valley', 'Isabela', 'Alicia', 'Aurora', 'asdasdasd', 'afdsd', 'adasdasd', '2005-11-25', 'Cook', 'Bosun', 'Male', 'Single', 'user'),
(27, 'LeBron', 'Raymone', 'James', 'lebron@friendmar.com.ph', '$2y$12$J.TEEPN6Y1ScYPQaRKKN5.De3mARHfu23ztN7jUcygVbb3oiS2Toi', '09060495646', NULL, NULL, '2025-05-30 04:56:33', '2025-06-09 00:33:09', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1985-12-30', 'Crew Doctor', 'Medical', 'Male', 'Single', 'admin'),
(28, 'Dave Nielsen', 'De Ocampo', 'luz', 'dnluz01@gmail.com', '$2y$12$0WYxh2hckp0m5tiWWTg7eeSWeYmMTJ67aQHWjkC3v/Ui/Rn9VnVPS', '09216847777', NULL, 'Available', '2025-05-30 05:39:31', '2025-06-03 08:52:13', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-04', 'Jr 4th Engineer', NULL, 'Male', 'Single', 'user'),
(29, 'Mikha', 'J.', 'Lim', 'binimiks@gmail.com', '$2y$12$pCEvY5QXGpXgqJcuJpOU1uMhHKnuR1Au3sCFnEZJ/5yrpPzVEMnjy', '09876543210', NULL, 'Vacation', '2025-05-30 10:20:23', '2025-06-02 01:28:10', 'CALABARZON', 'Rizal', 'Angono', 'Mahabang Parang', 'Block 9 Lot 22', '1930', 'Block 9 Lot 22 Zen Residences', '2002-11-30', 'Trainee', 'Crew', 'Female', 'Single', 'user'),
(31, 'Chapell', NULL, 'Roan', 'chapellroan@gmail.hottogo.com', '$2y$12$hYiy5Vc67eoY3miAUAVqgui40AKD1jOKcdMEh0BqWAAFZpWUuXIAy', '09959832121', NULL, 'Vacation', '2025-05-31 03:55:33', '2025-06-02 09:28:53', 'National Capital Region', 'Metro Manila', 'City of Parañaque', 'San Dionisio', 'ANDRES BONIFACIO STREET', '1700', 'SKYLAND', '2003-08-06', '2nd Engineer', NULL, 'Male', 'Widowed', 'user'),
(32, 'RYUAIKEN', 'Manzano', 'TUBERA', 'tryuaiken@gmail.com', '$2y$12$B40wSpdzK5cX0uOUy6nVsuDk5X0yflvnLqiM5qzjhSpPLPKor4q.a', '09959830797', NULL, NULL, '2025-05-31 03:59:41', '2025-05-31 03:59:41', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Unregistered', NULL, NULL, NULL, 'user'),
(33, 'Ryuaiken', 'Manzano', 'Tubera', 'tryuaiken@friendmar.com.ph', '$2y$12$6m4cUL0AVYxqQdAPrKhWpuzG3LyQfZky8Y4B0e9uMjvaT4iUFNa0a', '09959830790', NULL, NULL, '2025-05-31 04:01:04', '2025-05-31 04:13:17', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Crewing Operator', '', NULL, NULL, 'admin'),
(34, 'Dave Nielsen', 'De Ocampo', 'Luz', 'dnluz@gmail.com', '$2y$12$kmisSIqJ9gEfsBF8ljnr0u1rI5H1dDFPc.zgbnX4b2Ur.MX0wIkrm', '0921684777', NULL, 'Vacation', '2025-05-31 04:03:58', '2025-06-02 03:01:42', 'Central Luzon', 'Bulacan', 'City of Meycauayan', 'Malhacan', 'Bulak', '3020', '11', '2004-04-18', 'Deck Cadet', 'Crew', 'Male', 'Single', 'user'),
(38, 'superadmin', NULL, 'superadmin', 'superadmin@fms.com', '$2y$12$VYITUkt.q2GmQBeYC7BL/ulSk9izTm6W9DpuYKq8apwmcpzh5jvEe', '120903', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'superadmin'),
(39, 'Ian Kenneth', 'Ramirez', 'Sianghio(Superadmin)', 'kennethsuperadmin@gmail.com', '$2y$12$kfLBdVOLqKEeY.N61r3q5Oz2djRCiFdG2He/2P/GMBshfFcc7bJTm', '45678910', NULL, NULL, '2025-05-31 12:11:57', '2025-05-31 12:11:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Crew', NULL, NULL, 'superadmin'),
(40, 'Shiela Mae', 'Endico', 'Paluga', 'ellamaeendico@gmail.com', '$2y$12$VsmfgDUxdF7v6vYKmfcpF.zE4mmO7MMPk8xnxzRE9/arBw1vkIGPi', '09123456999', 'dXXmgl9DcUw9wmjUTJvIRd3CpDcBLccx3PJJnBRryFwaCt4fmGOdaY2ByqcH', 'Vacation', '2025-06-01 07:15:18', '2025-06-03 09:43:14', 'CALABARZON', 'Rizal', 'Cainta', 'San Juan', 'Snt. Magdalene Street', '1900', '3233', '2003-12-03', 'Trainee', 'Crew', 'Female', 'Single', 'user'),
(43, 'Dave Nielsen', 'De Ocampo', 'Luz', 'dnlcolonel@gmail.com', '$2y$12$XPKI/n4ok.Y2TG7IVQzGU.II0JdF.isPYe/9tKuq4uOJGW7SzMd5O', '09216847001', 'nVZymsvrgwnfbeW4j3gl2Jvgs8RerZVJbd75WGnMTTEYGnoYyZCcNjISto5g', 'On Board', '2025-06-01 07:53:11', '2025-06-01 07:56:05', 'Central Luzon', 'Bulacan', 'San Ildefonso', 'Matimbubong', 'Bulak', '3020', '11', '2025-06-01', 'Pumpman', 'Crew', 'Male', 'Widowed', 'user'),
(44, 'RYUAIKEN', 'MANZANO', 'TUBERA', 'ryuaiken@friendmar.com.ph', '$2y$12$vAwThH/GbbW/UEegcrgtpeCtF1lsObbTJhVroq8/N2Q6ULV.3RVca', '09959830000', NULL, NULL, '2025-06-01 07:53:36', '2025-06-01 07:54:23', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Crew Operator  1', 'Crewing', NULL, NULL, 'admin'),
(47, 'Mariane Jamiaca', '', 'Teñoso ', 'michael@gmail.com', '$2y$12$Juu/NIvu6CIXUvm2U6dJ0eLsB6Ve5Qlm4h7AsZbKEeEowHzFsMzP6', '0385254628', NULL, 'Available', '2025-06-01 23:28:09', '2025-06-01 23:33:05', 'National Capital Region', 'Metro Manila', 'City of Mandaluyong', 'Barangka Ilaya', 'Mh deeaplasdasd', '45', '52', '2025-06-13', 'Fitter', 'Crew', 'Male', 'Married', 'user'),
(48, 'Yukimiya', 'Pogi', 'Wife', 'yukimiya@fms.com', '$2y$12$Aknqx5UY6B4cvZOvAm7O5uDGxQim36Uk3HwVED12XhIXyF6khL42a', '11111111', NULL, 'Available', '2025-06-02 00:23:18', '2025-06-02 00:23:18', '140000000', '042100000', '012816000', '012802019', 'Mh deeaplasdasd', '45', '52', '2000-07-12', 'sec', 'Accounting', 'Female', NULL, 'superadmin'),
(49, 'Wanindu', '', 'Hasaranga', 'aaa@gmail.com', '$2y$12$AL6hq1VP2r5oHgUFd6YvpeGkGwGnLNvzA7KfKTjiDHC8fz10QiI9O', '09216847002', NULL, NULL, '2025-06-02 00:40:04', '2025-06-02 00:40:04', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Unregistered', NULL, NULL, NULL, 'user'),
(51, 'Ivan', 'Manimtim', 'Mendoza', 'mendozaivan0320@gmail.com', '$2y$12$lvF3RMZWl74uDUuu6wulVeCJWwBjoDvPjsIL1bCOcCru1tpIHCjiK', '09062867362', NULL, 'Available', '2025-06-02 02:53:36', '2025-06-02 02:56:37', 'Western Visayas', 'Aklan', 'Kalibo', 'Buswang New', 'St. 1234', '3009', '31', '1999-06-02', 'Electrician Trainee', 'Crew', 'Male', 'Single', 'user'),
(52, 'Charisse', 'Aguinaldo', 'Cho', 'che113002@gmail.com', '$2y$12$OlBKoyqtTShBoiIE0JmiJubJxF4i5KsozLhvuJvdsu5POQULfMsy2', '09876567890', NULL, NULL, '2025-06-02 02:53:37', '2025-06-02 02:53:37', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Unregistered', NULL, NULL, NULL, 'user'),
(53, 'Pat', NULL, 'Lin', 'linsanganfms@gmail.com', '$2y$12$fdGeg2jF2Pti4OY7ReJTV.UL8dqyr9CL6d68YtFMz1gQmQ5g5H7Am', '09171304421', NULL, 'Available', '2025-06-02 02:53:40', '2025-06-02 02:55:27', 'Ilocos Region', 'Ilocos Norte', 'Bacarra', 'Cabulalaan', '123', '1224', '1234', '2025-06-02', 'Bosun', 'Crew', 'Other', 'Married', 'user'),
(54, 'Marshall', '', 'Holman', '12345678@gmail.com', '$2y$12$K7jAep3vxgwAAOZTAJyYTuE508Sr8LHo6muWKKYkCadh4K625VgEG', '0123456789', NULL, 'Available', '2025-06-02 02:53:41', '2025-06-02 03:07:01', 'MIMAROPA Region', 'Occidental Mindoro', 'Rizal', 'Rumbang', 'Ss', '12345', '123456789', '2025-06-03', 'Electrician Trainee', 'Crew', 'Male', 'Married', 'user'),
(55, 'Jeremy', 'Aberte', 'Egana', 'engr.eganajeremy@gmail.com', '$2y$12$5KRPyQaZgjzwvaZa6h8Rc.DzDTUxe94k2MEHQVIsAECv3MYkH7kUK', '09121231234', NULL, NULL, '2025-06-02 02:53:57', '2025-06-02 02:53:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Unregistered', NULL, NULL, NULL, 'user'),
(56, 'Vit Mcdowell', 'Palangan', 'Sarigumba', 'vitmcdowell@gmail.com', '$2y$12$KEs7TJ1l5yxQxhVWXm2o1.cS3ZjcPmP/ELpg35zQ1pXjBNOgjh74a', '09123456788', NULL, NULL, '2025-06-02 02:54:29', '2025-06-02 02:54:29', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Unregistered', NULL, NULL, NULL, 'user'),
(57, 'ANTONE DOMINIC', 'BERCASIO', 'BERMAS', 'antonebermas123@gmail.com', '$2y$12$Fh.RFde2Ek5iXqLLsqAyrukcLswkGJ/fBZvxcFo0mTb3ywDLYXLoy', '09952160695', NULL, 'Available', '2025-06-02 02:54:40', '2025-06-02 02:58:58', 'Bicol Region', 'Albay', 'City of Tabaco', 'Baranghawon', 'Purok 4', '4511', '.', '1990-12-12', 'Electrician Trainee', 'Crew', 'Male', 'Single', 'user'),
(58, 'Karse Christian', 'Santillan', 'Morada', 'k.christianmorada@gmail.com', '$2y$12$rhagA2Nmz2sKP3JyIxliVunuaLf7TkbAuXgy49sVfqSDe8FeY3IBe', '09666348281', NULL, 'Available', '2025-06-02 02:54:43', '2025-06-02 02:58:22', 'National Capital Region', 'Metro Manila', 'City of Caloocan', 'Barangay 64', '11', '1400', '7', '1996-12-13', 'Electrician Trainee', 'Crew', 'Male', 'Single', 'user'),
(59, 'Danilo', 'Hapitana', 'Arat', 'daniloaratjr353@gmail.com', '$2y$12$jqLswSY6hX1kscbIlX491.QG9DY4bN9RBitrN.vs5xM.tDBEu5bZa', '09552566969', NULL, 'Available', '2025-06-02 02:54:52', '2025-06-02 02:58:58', 'Davao Region', 'Davao Del Norte', 'Kapalong', 'Florida', 'Purok 3', '8113', '01', '1950-06-02', 'Chief Cook', 'Crew', 'Male', 'Widowed', 'user'),
(60, 'Julian Paul', 'Villaruel', 'Querubin', 'julianpaulquerubin@gmail.com', '$2y$12$S/uaxbE504zuHUbNS53CsObIEkzWei68.v/GdGOdKAmc9.ejZ0ifG', '09157516375', NULL, NULL, '2025-06-02 02:57:40', '2025-06-02 02:57:40', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Unregistered', NULL, NULL, NULL, 'user'),
(61, 'Marielle Sam', 'Ortiz', 'Redoblado', 'marielle31@gmail.com', '$2y$12$KK09zoTyhtUgGC1kInHg0eLUWz705S/ySMS844Kl9u3Wd5hmICP1m', '09060790646', NULL, 'Available', '2025-06-02 03:04:33', '2025-06-03 08:21:27', 'National Capital Region', 'Metro Manila', 'City of Malabon', 'Panghulo', 'Mulawin', '8444564', '465', '2003-12-31', 'Bosun', 'Crew', 'Female', 'Single', 'user'),
(63, 'Bill', NULL, 'O\'Neal', 'johnsmith@friendmar.com.ph', '$2y$12$hCKtbu17FQX5GS.QXEzNtekGOry3UVRzg797z7a8t2bfGLCeslrDG', '09060790647', NULL, NULL, '2025-06-02 07:06:19', '2025-06-03 09:53:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Crew', NULL, NULL, 'admin'),
(64, 'Carmen', NULL, 'Salvino', 'petersmith@friendmar.com.ph', '$2y$12$xKMjHw20U2bOndpyzgalSeU3hF1S5ZXs7vlSX6CwLkI80l.RUzy5C', '09060790648', NULL, NULL, '2025-06-02 07:06:51', '2025-06-02 07:06:51', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Crew', NULL, NULL, 'admin'),
(65, 'Jason', NULL, 'Couch', 'ld@friendmar.com.ph', '$2y$12$9F85Xrx3lyh0m.X5tVJrKuJBmlLDD6lykXrm6DodYeFv79C8HoZBC', '09060790650', NULL, NULL, '2025-06-02 07:08:11', '2025-06-02 07:10:52', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'admin'),
(66, 'E.J', '', 'Tackett', 'lj@friendmar.com.ph', '$2y$12$duGxLKfF1tYxBO/OhNUqtec26IXSA3lARZLRZz4svYshsLdz4CW7y', '09060790645', NULL, NULL, '2025-06-02 07:09:42', '2025-06-02 08:40:07', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Operator', 'Crewing', NULL, NULL, 'admin'),
(67, 'DeeRonn', NULL, 'Booker', 'ar@friendmar.com.ph', '$2y$12$uPcKKmFxiWtUlWSnVX3eVOsUWddptF2ixQ3fp8QizYjDKo3Uu4Kua', '09060790644', NULL, NULL, '2025-06-02 07:10:11', '2025-06-02 07:10:11', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Crew', NULL, NULL, 'admin'),
(68, 'Josh ', '', 'Hazlewood', 'sga@gmail.com', '$2y$12$qtv3O0ErLvg1o77VqJco7OxK3Y.5QOEBREo3zCrU86iM4MmDJfdFy', '09060790643', NULL, 'Available', '2025-06-02 07:11:39', '2025-06-02 08:46:43', 'Ilocos Region', 'Ilocos Norte', 'Adams', 'Adams (Pob.)', 'UNIT SF-201, SKYLAND PLAZA CONDOMINIUM, 2302 Sen. Gil J. Puyat Ave, Makati, 1203 Metro Manila', '1203', '21321', '2000-05-11', 'Chief Cook', 'Crew', 'Male', 'Single', 'user'),
(70, 'ARLENE', 'HILA', 'CASULLA', 'liaison@friendmar.com.ph', '$2y$12$RdBnMpYR2TWpIX4J8UqT/ecIN7s40qZxunTNwdfhWgwNSQf/Mei7S', '09178989841', NULL, NULL, '2025-06-02 07:12:55', '2025-06-02 07:13:58', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'LIAISON OFFICER', 'Crewing', NULL, NULL, 'admin'),
(71, 'CRISTINA', 'TUMAOB', 'NETARIO', 'mnetario@friendmar.com.ph', '$2y$12$Eghbn0vYaH4ePKM1gk0i1.gL9cy0CPHajId71/Tv/7BdpB42p8TCi', '09171105216', NULL, NULL, '2025-06-02 07:15:31', '2025-06-02 07:20:31', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'LIAISON', 'Crewing', NULL, NULL, 'admin'),
(72, 'Joel', 'Lasay', 'Orencia', 'jorencia@friendmar.com.ph', '$2y$12$uUsXM27tckPcYm6jz7kLp.7/aVFH38SSXknBv6SYW63z1a/ezu99u', '09171463426', NULL, NULL, '2025-06-02 07:18:37', '2025-06-02 07:24:14', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Senior Recruitment Officer', 'Crewing', NULL, NULL, 'admin'),
(73, 'DEN', 'DEN', 'BALA', 'kdbala@friendmar.com.ph', '$2y$12$sHhxnm6m80QEXb8dyeEbUefqh94JZD0bMBI6VUsJccykv0G5vuHDW', '09175689800', NULL, NULL, '2025-06-02 07:29:39', '2025-06-02 07:31:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'OPERATIONS MANAGER', 'Crewing', NULL, NULL, 'admin'),
(74, 'Beth', 'LINCONES', 'HAMBING', 'bhambing@friendmar.com.ph', '$2y$12$n2mgQcbtJynnsbN3vp6twOh0aGnwBUPo7G9uKvoRP4e2qwtFcb0LO', '09361700652', NULL, NULL, '2025-06-02 07:36:43', '2025-06-02 07:37:59', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Crew Operator-visa', 'Crewing', NULL, NULL, 'admin'),
(75, 'JAN LLOYD', 'REA', 'LORENZO', 'jlorenzo@friendmar.com.ph', '$2y$12$G3bwtYwhicQTXTtSnTd4xekFq2xMblz9zMzDFY1rsw60o4DZash1W', '09614942301', NULL, NULL, '2025-06-02 07:38:56', '2025-06-02 07:39:33', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Crew Operator', 'Crewing', NULL, NULL, 'admin'),
(76, 'LYMERC', 'BIEN', 'CAPISTRANO', 'lcapistrano@friendmar.com.ph', '$2y$12$BNP2nB72880Ed4mr1/GtC.A1/848lOOa0HQzwRG4MK1kNf7URS0eu', '09762864102', NULL, NULL, '2025-06-02 07:39:12', '2025-06-02 07:39:59', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Crew Operator', 'Crewing', NULL, NULL, 'admin'),
(77, 'MARIEFE', 'BERNABE', 'VILLALUNA', 'mariefevillaluna@gmail.com', '$2y$12$yctv8roxpiTOdrYu3vgEEuyb2w6JkB0wKz/kC/0nWlHqeWJdoEq4G', '09565107575', NULL, NULL, '2025-06-02 07:41:34', '2025-06-02 07:41:34', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Unregistered', NULL, NULL, NULL, 'user'),
(78, 'MARIEFE', 'BERNABE', 'VILLALUNA', 'visa@friendmar.com.ph', '$2y$12$RgLVbtzpztqGa2xeMsVYBOjmG1Il6dZAkP2ES/Qhnx6VMZGDY7tF.', '09177152018', NULL, NULL, '2025-06-02 07:44:39', '2025-06-02 07:46:02', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Crew Operator-Visa', 'Crewing', NULL, NULL, 'admin'),
(79, 'JAN LLOYD', 'REA', 'LORENZO', 'jlorenzo@gmail.com', '$2y$12$RBdHofMAsd3TiNjT1DY5YOjG3sAUjTdRuWbDcMyiyhZTxageGwXCC', '09614942302', NULL, 'Vacation', '2025-06-02 07:46:07', '2025-06-02 07:51:50', 'National Capital Region', 'Metro Manila', 'City of Makati', 'Pio Del Pilar', '123', '1230', '123', '2025-06-02', 'Able Seaman', 'Crew', 'Male', 'Single', 'user'),
(80, 'KHALIA', 'FRAN', 'CHEZKA', 'nganaden@friendmar.com.ph', '$2y$12$n2c.cFHvxE2R08Aax0OVjOFVBu5HnXmwO4TM2xrJp2uoT4l6Nbe82', '09271203231', NULL, NULL, '2025-06-02 07:55:39', '2025-06-02 07:56:28', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'CO', 'Crewing', NULL, NULL, 'admin'),
(83, 'JVEE', 'BORJA', 'BAEL', 'jbael@friendmar.com.ph', '$2y$12$6gHzkELIesPnYLaeISPP6Oz5C8YuBeLHdj6ku6MTHSlUiF66tWd7C', '09445445566', NULL, NULL, '2025-06-02 08:17:39', '2025-06-02 08:18:18', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Accounts Payable Officer', 'Accounting', NULL, NULL, 'admin'),
(84, 'HAYAH', NULL, 'CULATA', 'hc@friendmar.com.ph', '$2y$12$4ABwPOyLmbVOl42CFJtr2erU172Ixcj/ROsQ2DCQai4UtRu6X/aZS', '09691214429', NULL, NULL, '2025-06-02 08:18:58', '2025-06-02 08:19:36', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ALLOTMENT OFFICER', 'Accounting', NULL, NULL, 'admin'),
(85, 'bryan', 'TENORIO', 'arenas', 'barenas@friendmar.com.ph', '$2y$12$uMkArLhv8B/b4wv9vDQ95.Qh/bymp6tpBvUy3I.l7EQjO/N31SNj6', '09084333516', NULL, NULL, '2025-06-02 08:31:44', '2025-06-02 08:32:13', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'GENERAL ACCOUNTING', 'Accounting', NULL, NULL, 'admin'),
(86, 'HELEN', 'COTONER', 'BUNDALIAN', 'helen.bundalian@friendmar.com.ph', '$2y$12$dj9o1HtTk7f2/fuJhJ159O8xCKM2Ibu78nzt9tuR7V.TZ5eWlSStq', '09171177510', NULL, NULL, '2025-06-02 08:31:53', '2025-06-02 08:32:48', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Chief Accounting Officer', 'Accounting', NULL, NULL, 'admin'),
(87, 'JHOANNA', 'DE ASIS', 'ROBLES', 'jdr@friendmar.com.ph', '$2y$12$hLc/mhfoBOIbWg0m8B.DD.86y0t2M/xaNNr0xFDjp4SMlxgUqC8be', '09603142087', NULL, NULL, '2025-06-02 08:40:51', '2025-06-02 08:41:37', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'crew operator', 'Crewing', NULL, NULL, 'admin'),
(89, 'Ralph', 'Friend', 'Maritime', 'ralphfriendmaritime@gmail.com', '$2y$12$wnjXo3YNummm7tum2JgWYOs/lfWXZyTliRmYo89YcsXEek.C01ROK', '09177153133', NULL, NULL, '2025-06-02 08:52:36', '2025-06-02 08:52:36', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Unregistered', NULL, NULL, NULL, 'user'),
(90, 'IRISH', 'CALDERON', 'ROSENDO', 'irish.rosendo28@gmail.com', '$2y$12$JQpv3w.dE3B/2yIR3BHBkeoGV8gHatO6wDuKo1IH0NubYdhA1WDIe', '09770181893', NULL, NULL, '2025-06-02 09:17:56', '2025-06-02 09:17:56', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Unregistered', NULL, NULL, NULL, 'user'),
(91, 'RIKKA', 'ARANAS', 'GABIANE', 'rgabiane@friendmar.com.ph', '$2y$12$cn/9K5FrPn8nC5iu1I.7du6ByACs7c1u7jTRF8RaFBdC92NxI1KZq', '09171220525', NULL, NULL, '2025-06-02 09:19:17', '2025-06-02 09:20:01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'SENIOR CREW OPERATOR', 'Crewing', NULL, NULL, 'admin'),
(92, 'irish', 'calderon', 'rosendo', 'irish.rosendo@gmail.com', '$2y$12$RXoNElE0KeHiqIUB5T7zRO/kfPYQwxU.Ui3iKm0UYMlgzVNVP1lxe', '09123456783', NULL, NULL, '2025-06-02 09:20:58', '2025-06-02 09:20:58', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Unregistered', NULL, NULL, NULL, 'user'),
(93, 'Charisse', 'Aguinaldo', 'Cho', 'chea@friendmar.com.ph', '$2y$12$npjHQTkTdkfouJL89zY0oeKF6I80Xp/Wh6qKCHNWoqM2ZV1/rIuY.', '09366991180', NULL, NULL, '2025-06-02 14:57:25', '2025-06-04 05:39:06', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Fleet Crew Operator', 'Crewing', NULL, NULL, 'admin'),
(96, 'Jerricho', 'Natividad', 'Briones', 'jbriones@friendmar.com.ph', '$2y$12$Oa7dedOl40MOLI5vUiyhPO.5EjMIbWcs2HkGowBUB4kUQ7cDteLZm', '09171626736', NULL, NULL, '2025-06-03 01:58:28', '2025-06-03 02:00:05', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'General Manager', 'Crewing', NULL, NULL, 'admin'),
(98, 'LeBron', 'Raymone', 'James', 'lbj@gmail.com', '$2y$12$3PKA.rmEhV2jbwlRBQjQ5.p.mSNvNHdjhc4QkARbD6Ma0hlcqoU9y', '0984688267', NULL, 'Available', '2025-06-04 04:02:39', '2025-06-04 05:14:12', 'National Capital Region', 'Metro Manila', 'City of Valenzuela', 'Malinta', 'asdasdsad', '1473', '123', '2006-12-30', 'Trainee Gas Engineer', 'Crew', 'Male', 'Single', 'user'),
(99, 'Che', NULL, 'Aguinaldo', 'charisseacho@gmail.com', '$2y$12$sNb2LP7F1RGbB2a9q2ASmO3Addaq/m8z0HhddDvCnuK/ZXciIjtrS', '09543218910', NULL, 'Available', '2025-06-04 08:10:37', '2025-06-04 08:32:53', 'National Capital Region', 'Metro Manila', 'City of Manila', 'Barangay 370', 'Consuelo', '1930', 'Avida Towers Tower 4 15-B', '2002-03-11', 'Chief Cook', 'Crew', 'Female', 'Single', 'user'),
(100, 'Lebron', 'Raymone', 'James', 'lebronjames#23@gmail.com', '$2y$12$nnNWs30GRHX5xL4nwW8Ke.z8aPRSOAeO2ptSlKkXFc5nXETk.DTdK', '099974658AAA', NULL, 'Available', '2025-06-05 04:33:54', '2025-06-05 04:33:54', 'National Capital Region', 'Metro Manila', 'City of Manila', 'Barangay 170', 'Lebron Street', '1473', '123', '2007-06-04', 'Ordinary Seaman', 'Accounting', 'Male', 'Married', 'user'),
(101, 'JUAN', 'D', 'DELA CRUZ', 'johnmichaelvlegaspi@gmail.com', '$2y$12$vgOkMAW7eGESjH0V9U7uluo6ABbN3meYw7R7D895sPDdbqqvr/8MW', '12346789101', NULL, NULL, '2025-06-05 04:39:57', '2025-06-05 04:39:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Unregistered', NULL, NULL, NULL, 'user');

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
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`,`notifiable_id`);

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=216;

--
-- AUTO_INCREMENT for table `certificates`
--
ALTER TABLE `certificates`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=115;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `profile_pictures`
--
ALTER TABLE `profile_pictures`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;

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
