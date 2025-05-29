-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 29, 2025 at 04:02 PM
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
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `status` enum('available','booked') NOT NULL DEFAULT 'booked'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `user_id`, `date`, `start_time`, `end_time`, `department`, `crewing_dept`, `operator`, `accounting_task`, `employee`, `created_at`, `updated_at`, `status`) VALUES
(33, 1, '2025-07-31', '12:30:00', '17:00:00', 'crewing', 'maran tankers', 'senior fleet crew operator', NULL, 'Yagoda', '2025-05-29 07:27:26', '2025-05-29 10:56:11', 'booked'),
(37, 22, '2025-06-21', '13:00:00', '16:00:00', 'accounting', NULL, NULL, 'allotment', 'Angela Guilaran', '2025-05-29 12:44:12', '2025-05-29 12:44:12', 'booked');

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
('laravel_cache_38a3ca8cec82add39a8b166d63d5ad55', 'i:1;', 1748505158),
('laravel_cache_38a3ca8cec82add39a8b166d63d5ad55:timer', 'i:1748505158;', 1748505158),
('laravel_cache_51e331c8866e23cab0d39d2b17735cfd', 'i:5;', 1748403448),
('laravel_cache_51e331c8866e23cab0d39d2b17735cfd:timer', 'i:1748403448;', 1748403448),
('laravel_cache_86661923a619c56d32390f6520b52426', 'i:3;', 1748497000),
('laravel_cache_86661923a619c56d32390f6520b52426:timer', 'i:1748497000;', 1748497000),
('laravel_cache_a75f3f172bfb296f2e10cbfc6dfc1883', 'i:19;', 1748527275),
('laravel_cache_a75f3f172bfb296f2e10cbfc6dfc1883:timer', 'i:1748527275;', 1748527275),
('laravel_cache_e9b6cc1432541b9ceebf113eee05eeba', 'i:16;', 1748527061),
('laravel_cache_e9b6cc1432541b9ceebf113eee05eeba:timer', 'i:1748527061;', 1748527061),
('laravel_cache_eORryRsqAWETirHd', 's:7:\"forever\";', 2063626593),
('laravel_cache_f1f70ec40aaa556905d4a030501c0ba4', 'i:4;', 1748527307),
('laravel_cache_f1f70ec40aaa556905d4a030501c0ba4:timer', 'i:1748527307;', 1748527307);

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
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `certificates`
--

INSERT INTO `certificates` (`id`, `user_id`, `certificate_name`, `certificate_type`, `file_path`, `expiration_date`, `created_at`, `updated_at`) VALUES
(35, 1, 'Medical', 'Medical', '1-ian_kenneth-sianghio-user/certificates/Medical.pdf', '2025-05-31', '2025-05-28 14:13:05', '2025-05-28 14:13:05'),
(36, 1, 'fAWSFASFDAS', 'Training', '1-ian_kenneth-sianghio-user/certificates/fAWSFASFDAS.pdf', '2025-05-31', '2025-05-29 00:11:53', '2025-05-29 00:11:53'),
(37, 1, 'ASDASDASD(1)', 'Contract', '1-ian_kenneth-sianghio-user/certificates/ASDASDASD(1).pdf', '2025-05-31', '2025-05-29 00:12:30', '2025-05-29 00:12:30'),
(38, 1, 'ASDASDASDASD', 'Employee ID', '1-ian_kenneth-sianghio-user/certificates/ASDASDASDASD.pdf', '2025-05-31', '2025-05-29 00:12:51', '2025-05-29 00:12:51');

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
(22, '2025_05_29_132646_add_status_to_appointments_table', 11);

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
('3d2f8a4d-1979-45d4-8581-c7d0b2d5cd58', 'App\\Notifications\\SendAppointmentNotification', 'App\\Models\\User', 24, '{\"user_id\":24,\"appointment_id\":8,\"date\":\"2025-05-28\",\"start_time\":\"19:00\",\"end_time\":\"21:00\",\"message\":\"You have a new appointment scheduled.\",\"created_at\":\"2025-05-28T03:23:20.578054Z\"}', NULL, '2025-05-28 03:23:20', '2025-05-28 03:23:20'),
('4ce17c11-dfe1-4fbd-bbd7-78b25ded7a42', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 24, '{\"user_id\":24,\"certificate_type\":\"Medical\",\"message\":\"Please upload your Medical Certificate\",\"created_at\":\"2025-05-28T03:37:05.162169Z\"}', NULL, '2025-05-28 03:37:05', '2025-05-28 03:37:05'),
('500b413a-c599-468f-bfd3-db791bd88e3c', 'App\\Notifications\\SendRescheduleNotification', 'App\\Models\\User', 1, '{\"appointment_id\":18,\"date\":\"2025-06-03\",\"start_time\":\"16:00\",\"end_time\":\"18:00\",\"message\":\"Your appointment has been rescheduled.\",\"created_at\":\"2025-05-29 01:13:57\",\"user\":{\"first_name\":\"Ian Kenneth\",\"middle_name\":\"Ramirez\",\"last_name\":\"Sianghio\",\"position\":\"CEO\"}}', NULL, '2025-05-28 17:13:57', '2025-05-28 17:13:57'),
('67253a41-4915-488f-bc5d-ce6d449958f4', 'App\\Notifications\\SendAppointmentNotification', 'App\\Models\\User', 24, '{\"user_id\":24,\"appointment_id\":9,\"date\":\"2025-05-28\",\"start_time\":\"17:37\",\"end_time\":\"19:45\",\"message\":\"You have a new appointment scheduled.\",\"created_at\":\"2025-05-28T03:32:09.592210Z\"}', NULL, '2025-05-28 03:32:09', '2025-05-28 03:32:09'),
('7989d0f3-f28b-4d04-89f3-f77d93167e90', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Medical\",\"message\":\"Please upload your Medical Certificate\",\"created_at\":\"2025-05-27T05:44:56.340789Z\"}', NULL, '2025-05-27 05:44:56', '2025-05-27 05:44:56'),
('82fb5276-1958-449d-86d0-2a4dcda90e9b', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Training\",\"message\":\"Please upload your Training Certificate\",\"created_at\":\"2025-05-28T05:42:28.406728Z\"}', NULL, '2025-05-28 05:42:28', '2025-05-28 05:42:28'),
('9315f1c4-f099-4f53-afe7-1f30577db1cc', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Training\",\"message\":\"Please upload your Training Certificate\",\"created_at\":\"2025-05-27T05:46:31.503605Z\"}', NULL, '2025-05-27 05:46:31', '2025-05-27 05:46:31'),
('a1de183d-4804-4556-bb06-85d44178668a', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Medical\",\"message\":\"Please upload your Medical Certificate\",\"created_at\":\"2025-05-28T04:25:20.042457Z\"}', NULL, '2025-05-28 04:25:20', '2025-05-28 04:25:20'),
('a5d44ecd-fe64-443e-953c-c25022e9b279', 'App\\Notifications\\SendAppointmentNotification', 'App\\Models\\User', 24, '{\"user_id\":24,\"appointment_id\":10,\"date\":\"2025-05-28\",\"start_time\":\"14:22\",\"end_time\":\"15:33\",\"message\":\"You have a new appointment scheduled.\",\"created_at\":\"2025-05-28T03:36:51.909889Z\"}', NULL, '2025-05-28 03:36:51', '2025-05-28 03:36:51'),
('d0f27050-f830-4b4f-a313-558f389f585d', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Medical\",\"message\":\"Please upload your Medical Certificate\",\"created_at\":\"2025-05-28T05:18:02.481774Z\"}', NULL, '2025-05-28 05:18:02', '2025-05-28 05:18:02'),
('d202235f-25e7-4b49-a98c-ee7c4acf5dfb', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Training\",\"message\":\"Please upload your Training Certificate\",\"created_at\":\"2025-05-28T05:42:35.178700Z\"}', NULL, '2025-05-28 05:42:35', '2025-05-28 05:42:35'),
('d593c3d2-98d1-47c9-bf5e-fdca34ff2dc5', 'App\\Notifications\\SendCertificateNotification', 'App\\Models\\User', 1, '{\"user_id\":1,\"certificate_type\":\"Training\",\"message\":\"Please upload your Training Certificate\",\"created_at\":\"2025-05-28T05:40:58.732438Z\"}', NULL, '2025-05-28 05:40:58', '2025-05-28 05:40:58');

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
('kennethsianghio756@gmail.com', '$2y$12$CzwkcgACMHEKEO5olpAlseRJOnWxYz9PXO9o4tbKckI8oXMT.vhby', '2025-05-26 13:37:44');

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
(3, 1, '1-ian_kenneth-sianghio-user/1748321322.jpg', '2025-05-19 06:02:34', '2025-05-27 04:48:42'),
(4, 2, '2-11-1-admin/1748526994.png', '2025-05-19 07:15:09', '2025-05-29 13:56:34'),
(7, 24, '24-matthias-czernin-user/1748345314.jpg', '2025-05-27 11:28:34', '2025-05-27 11:28:34');

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
('BrO5AT7ViBj9bqiEDYZTeMTsFl7TkHCnFP0HckKc', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRldEcG1xdFVSUjZXVUlya2NISHZwcjRyN3FWQzdlOEg1cVJxQTlOcyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747798033),
('Dle6uRtyp3e3yNEqFFxQy9djAdzZ2iHAB8m1fbkm', NULL, '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWmo1OURWakFCaXpVT1o2SDN3WW95djJXaVdRM1ZVTzFHZnhZYWpmaiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747800500),
('Hb9FPxGQBdI6uZ35XmuIWS8ERclYrJwnuXQlL3wd', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUElrM2g3YVloZVpEMUN6dnJhbENYYVZLU3diREhlMkJMVzdxVkZvZiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747465798),
('HiT5nCAHoKSuZMbed2ysuxUwIjqyb9gwcLH85qhk', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVkJOS3lQZW8xbjdjbW1PUWNIc0I0a055enRCMG9xVkZPZUxVQTdTbCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747802015),
('j4hpEYj86zTeo3aWFSgtvYmLbRJtCeQ6TUVWzYqt', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZkJ3eWpLczRnc3lyekNidkh3MXhGTU8ybDJ3em9HWjR4MDFHQW5SdCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747800692),
('MzmN8SOAlSiftozD91jrF6tKZXYzvilPwqYk47D9', NULL, '127.0.0.1', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaHB4OGVNdEhQTHhpUndTNWtPMWdjRVJiME84QzBLaTJZSmRGWUpReiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747646499),
('r9WeqSPmSpgnQoaKycF3GmxMtHbCJnwCr7c3EIzJ', NULL, '127.0.0.1', 'Mozilla/5.0 (iPad; CPU OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoianZjeUpNenNvQTRKM0JWOW9qQXQ2U2dncXZ6NjlCb2RFcTlWODQ5WCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly9oZXJvaWMtc2Vuc2libGUtYnV6emFyZC5uZ3Jvay1mcmVlLmFwcCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747800295),
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
  `position` varchar(255) DEFAULT 'Unregistered',
  `secondary_position` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `civil_status` varchar(255) DEFAULT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `middle_name`, `last_name`, `email`, `password`, `mobile`, `remember_token`, `availability`, `created_at`, `updated_at`, `region`, `province`, `city`, `barangay`, `street`, `zip_code`, `building_number`, `birthday`, `position`, `secondary_position`, `gender`, `civil_status`, `role`) VALUES
(1, 'Ian Kenneth', 'Ramirez', 'Sianghio', 'kennethsianghio756@gmail.com', '$2y$12$/egBUHbJdA5vWQlbG9qt5uh2OCEZk6OmxCjhWDT/bi1HMBYXYQBrW', '09761465526', 'w5166khbfSAE8oB1zelTHziBfplN1HJE8SqBW1zA7lM9HpwtKUGYsWJQpFqq', 'Available', '2025-05-08 03:39:44', '2025-05-29 14:00:41', 'National Capital Region', 'Metro Manila', 'City of Malabon', 'Santulan', 'Mh Del Pilar St', '1473', '128', '2003-12-09', 'Lebron', 'James', 'Male', 'Married', 'user'),
(2, '11', '1', '1', 'ian@friendmar.com.ph', '$2y$12$OesYh7hMpvOIbAu1E.zpsOX/GWTphHHUKAIFNtZphSk/zaGWG6pA6', '45as4d5455454', NULL, NULL, '2025-05-13 03:12:10', '2025-05-29 13:56:20', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Plant Manager', NULL, NULL, NULL, 'admin'),
(21, 'Yagoda', 'Camba', 'Maratas', 'yags@gmail.com', '$2y$12$3o55PTRb/DizQlIOMo.EjeT30BxxnnWDUUXzzTFbzbQCap.ZRf16a', '1234567543', NULL, 'Available', '2025-05-25 10:01:09', '2025-05-25 10:06:27', 'CALABARZON', 'Batangas', 'City of Lipa', 'Tanguay', '1232312', '123123213', '12323', '2006-12-12', 'Trainee', 'COO', 'Male', 'Single', 'user'),
(22, 'Angela', 'Fajardo', 'Guilaran', 'meaboo@gmail.com', '$2y$12$Fpe0FQA7wJdMG3JXMS4ST.V2J0VJYs5fewANm/H1oLzlC/zf0vvqy', '09761465527', NULL, 'Available', '2025-05-25 10:25:00', '2025-05-25 10:26:42', 'National Capital Region', 'Metro Manila', 'City of Malabon', 'Santolan', 'sfsdfasasd', '1476', '213', '2003-10-24', '𝓯𝓻𝓮𝓪𝓴𝔂', '𝓯𝓻𝓮𝓪𝓴𝔂', 'Female', 'Single', 'user'),
(24, 'Matthias', 'Idv', 'Czernin', 'matthias@gmail.com', '$2y$12$fWvpEmIDJZPXseT13gmotuTZJXPOoSeoA1vNyiNv7YArp/bwn4s2m', '1234563244', NULL, 'Vacation', '2025-05-27 11:04:48', '2025-05-28 03:36:55', 'Cagayan Valley', 'Isabela', 'Alicia', 'Aurora', 'asdasdasd', 'afdsd', 'adasdasd', '2005-11-25', 'Galley Boy', 'Bosun', 'Male', 'Married', 'user'),
(25, 'Angelique', 'Dumadag', 'Tenoso', 'a@gmail.com', '$2y$12$T1wY13K1qZt9.rZ.xJsojuDDO79YFzVVeCEjjWwpFZFBloFTHYDly', '1111', NULL, NULL, '2025-05-29 13:03:34', '2025-05-29 13:03:34', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Unregistered', NULL, NULL, NULL, 'user');

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `certificates`
--
ALTER TABLE `certificates`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `profile_pictures`
--
ALTER TABLE `profile_pictures`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

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
