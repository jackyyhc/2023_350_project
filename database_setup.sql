CREATE DATABASE  IF NOT EXISTS `350_group_project` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `350_group_project`;
-- MySQL dump 10.13  Distrib 8.0.34, for macos13 (arm64)
--
-- Host: 139.162.49.133    Database: 350_group_project
-- ------------------------------------------------------
-- Server version	8.0.35-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Temporary view structure for view `ClassView`
--

DROP TABLE IF EXISTS `ClassView`;
/*!50001 DROP VIEW IF EXISTS `ClassView`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `ClassView` AS SELECT 
 1 AS `teachId`,
 1 AS `courseCode`,
 1 AS `courseName`,
 1 AS `teachYear`,
 1 AS `term`,
 1 AS `studId`,
 1 AS `studfName`,
 1 AS `studlName`,
 1 AS `grade`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `Course`
--

DROP TABLE IF EXISTS `Course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Course` (
  `courseCode` varchar(10) NOT NULL,
  `courseName` varchar(50) NOT NULL,
  PRIMARY KEY (`courseCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Course`
--

LOCK TABLES `Course` WRITE;
/*!40000 ALTER TABLE `Course` DISABLE KEYS */;
INSERT INTO `Course` VALUES ('COMPS203F','comp203'),('COMPS204F','Course 204'),('COMPS208F','Intro To Computer Programming'),('COMPS209F','Data Structures, Algorithms, and Problem Solving'),('COMPS303F','Course 303'),('ITS102F','Course 102'),('ITS103F','Course 103');
/*!40000 ALTER TABLE `Course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EmgContact`
--

DROP TABLE IF EXISTS `EmgContact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EmgContact` (
  `userId` int NOT NULL,
  `emgPerson` varchar(50) DEFAULT NULL,
  `emgPhoneNo` varchar(20) DEFAULT NULL,
  `relationship` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EmgContact`
--

LOCK TABLES `EmgContact` WRITE;
/*!40000 ALTER TABLE `EmgContact` DISABLE KEYS */;
INSERT INTO `EmgContact` VALUES (12000000,'abcfghjkl','123456789','sisterfghj'),(12000001,'Mr Stark','77777','Father'),(12000002,'Lily Potter','4141414','Mother');
/*!40000 ALTER TABLE `EmgContact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Gpa`
--

DROP TABLE IF EXISTS `Gpa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Gpa` (
  `grade` varchar(2) NOT NULL,
  `gpa` double NOT NULL,
  PRIMARY KEY (`grade`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Gpa`
--

LOCK TABLES `Gpa` WRITE;
/*!40000 ALTER TABLE `Gpa` DISABLE KEYS */;
INSERT INTO `Gpa` VALUES ('A',4),('A-',3.7),('B',3),('B-',2.7),('B+',3.3),('C',2),('C+',2.3);
/*!40000 ALTER TABLE `Gpa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `StudentInfo`
--

DROP TABLE IF EXISTS `StudentInfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `StudentInfo` (
  `userId` int NOT NULL,
  `sex` varchar(1) NOT NULL,
  `phoneNo` varchar(20) DEFAULT NULL,
  `address` varchar(50) DEFAULT NULL,
  `admYear` int NOT NULL,
  `admTerm` varchar(6) NOT NULL,
  `status` varchar(1) NOT NULL,
  `standing` int NOT NULL,
  `programme` varchar(50) NOT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `StudentInfo`
--

LOCK TABLES `StudentInfo` WRITE;
/*!40000 ALTER TABLE `StudentInfo` DISABLE KEYS */;
INSERT INTO `StudentInfo` VALUES (12000000,'M',NULL,'HK Island',2021,'Autumn','U',3,'Internet Technology'),(12000001,'M','5678','Tai Wai',2022,'Autumn','U',2,'Making Iron Man'),(12000002,'M','1111','Tsuen Wan',2022,'Autumn','U',2,'Magic'),(12000003,'M','1357','Sai Wan',2022,'Autumn','Q',0,'Super Power'),(12000004,'F','2468','Cheung Chau',2022,'Autumn','U',2,'Marketing'),(12000005,'M','1010','Kai Tak',2022,'Autumn','U',2,'Marketing'),(12000006,'M','6666','Causeway Bay',2022,'Autumn','U',2,'Marketing'),(12000007,'M','9090','Sai Kung',2022,'Autumn','U',2,'Martial arts');
/*!40000 ALTER TABLE `StudentInfo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Study`
--

DROP TABLE IF EXISTS `Study`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Study` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `courseCode` varchar(10) NOT NULL,
  `studyYear` int NOT NULL,
  `term` varchar(7) DEFAULT NULL,
  `credit` int NOT NULL DEFAULT '5',
  `grade` varchar(2) DEFAULT NULL,
  `remarks` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Study`
--

LOCK TABLES `Study` WRITE;
/*!40000 ALTER TABLE `Study` DISABLE KEYS */;
INSERT INTO `Study` VALUES (1,12000000,'COMPS208F',2021,'Autumn',5,'A',NULL),(2,12000000,'COMPS209F',2022,'Spring',5,'A-',NULL),(3,12000000,'ITS102F',2021,'Autumn',5,'B',NULL),(4,12000000,'ITS103F',2022,'Spring',5,'B+',NULL),(5,12000001,'COMPS203F',2022,'Autumn',5,NULL,NULL),(6,12000002,'COMPS203F',2022,'Autumn',5,NULL,NULL),(7,12000003,'COMPS203F',2022,'Autumn',5,NULL,NULL),(8,12000004,'COMPS203F',2022,'Autumn',5,NULL,NULL),(9,12000005,'COMPS203F',2022,'Autumn',5,'D',NULL),(10,12000006,'COMPS204F',2022,'Spring',5,NULL,NULL),(11,12000007,'COMPS203F',2022,'Autumn',5,'D',NULL),(12,12000002,'ITS102F',2022,'Spring',5,NULL,NULL),(13,12000003,'ITS102F',2022,'Spring',5,NULL,NULL),(14,12000004,'ITS102F',2022,'Spring',5,NULL,NULL),(15,12000006,'ITS103F',2022,'Autumn',5,NULL,NULL);
/*!40000 ALTER TABLE `Study` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Teach`
--

DROP TABLE IF EXISTS `Teach`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Teach` (
  `teacherId` int NOT NULL,
  `courseCode` varchar(45) NOT NULL,
  `teachYear` int NOT NULL,
  `term` varchar(45) NOT NULL,
  PRIMARY KEY (`teacherId`,`courseCode`,`teachYear`,`term`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Teach`
--

LOCK TABLES `Teach` WRITE;
/*!40000 ALTER TABLE `Teach` DISABLE KEYS */;
INSERT INTO `Teach` VALUES (10100001,'COMPS204F',2022,'Spring'),(10100001,'ITS102F',2022,'Spring'),(10100001,'ITS103F',2022,'Autumn'),(10100002,'COMPS208F',2021,'Autumn'),(10100002,'COMPS209F',2022,'Spring'),(10100002,'COMPS303F',2022,'Autumn');
/*!40000 ALTER TABLE `Teach` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `userId` int NOT NULL,
  `userfName` varchar(50) DEFAULT NULL,
  `userlName` varchar(50) DEFAULT NULL,
  `role` varchar(7) DEFAULT NULL,
  `password` varchar(20) NOT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (10100001,'Anson','Kong','teacher','12345678'),(10100002,'Apple','Juice','teacher','12345678'),(11111111,'Test','Admin','admin','12345678'),(12000000,'Smith','Jill','student','12345678'),(12000001,'Stark','Tony','student','12345678'),(12000002,'Harry','Potter','student','12345678'),(12000003,'Peter','Parker','student','12345678'),(12000004,'Tinker','Bell','student','12345678'),(12000005,'Sponge','Bob','student','12345678'),(12000006,'Patrick','Star','student','12345678'),(12000007,'Bruce','Wayne','student','12345678');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `assessment`
--

DROP TABLE IF EXISTS `assessment`;
/*!50001 DROP VIEW IF EXISTS `assessment`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `assessment` AS SELECT 
 1 AS `teacherId`,
 1 AS `courseCode`,
 1 AS `courseName`,
 1 AS `teachYear`,
 1 AS `term`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `class_assessment`
--

DROP TABLE IF EXISTS `class_assessment`;
/*!50001 DROP VIEW IF EXISTS `class_assessment`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `class_assessment` AS SELECT 
 1 AS `teachId`,
 1 AS `courseCode`,
 1 AS `courseName`,
 1 AS `teachYear`,
 1 AS `term`,
 1 AS `studId`,
 1 AS `studlName`,
 1 AS `studfName`,
 1 AS `grade`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `manage_course`
--

DROP TABLE IF EXISTS `manage_course`;
/*!50001 DROP VIEW IF EXISTS `manage_course`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `manage_course` AS SELECT 
 1 AS `teacherId`,
 1 AS `teachYear`,
 1 AS `term`,
 1 AS `userfName`,
 1 AS `userlName`,
 1 AS `courseCode`,
 1 AS `CourseName`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `status_information`
--

DROP TABLE IF EXISTS `status_information`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `status_information` (
  `status` varchar(1) NOT NULL,
  `status_desc` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status_information`
--

LOCK TABLES `status_information` WRITE;
/*!40000 ALTER TABLE `status_information` DISABLE KEYS */;
INSERT INTO `status_information` VALUES ('G','Graduated'),('Q','Quit'),('S','Suspended'),('U','Undergraduate');
/*!40000 ALTER TABLE `status_information` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `stu_personal_record`
--

DROP TABLE IF EXISTS `stu_personal_record`;
/*!50001 DROP VIEW IF EXISTS `stu_personal_record`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `stu_personal_record` AS SELECT 
 1 AS `userfName`,
 1 AS `userlName`,
 1 AS `sex`,
 1 AS `phoneNo`,
 1 AS `userId`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `ClassView`
--

/*!50001 DROP VIEW IF EXISTS `ClassView`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`350_group_project_user`@`` SQL SECURITY DEFINER */
/*!50001 VIEW `ClassView` AS select `Teach`.`teacherId` AS `teachId`,`Teach`.`courseCode` AS `courseCode`,`Course`.`courseName` AS `courseName`,`Teach`.`teachYear` AS `teachYear`,`Teach`.`term` AS `term`,`Study`.`userId` AS `studId`,`User`.`userfName` AS `studfName`,`User`.`userlName` AS `studlName`,`Study`.`grade` AS `grade` from (((`Teach` join `Study` on(((`Teach`.`courseCode` = `Study`.`courseCode`) and (`Teach`.`teachYear` = `Study`.`studyYear`) and (`Teach`.`term` = `Study`.`term`)))) join `Course` on((`Teach`.`courseCode` = `Course`.`courseCode`))) join `User` on((`Study`.`userId` = `User`.`userId`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `assessment`
--

/*!50001 DROP VIEW IF EXISTS `assessment`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`350_group_project_user`@`` SQL SECURITY DEFINER */
/*!50001 VIEW `assessment` AS select `Teach`.`teacherId` AS `teacherId`,`Teach`.`courseCode` AS `courseCode`,`Course`.`courseName` AS `courseName`,`Teach`.`teachYear` AS `teachYear`,`Teach`.`term` AS `term` from (`Teach` left join `Course` on((`Teach`.`courseCode` = `Course`.`courseCode`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `class_assessment`
--

/*!50001 DROP VIEW IF EXISTS `class_assessment`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`350_group_project_user`@`` SQL SECURITY DEFINER */
/*!50001 VIEW `class_assessment` AS select `ClassView`.`teachId` AS `teachId`,`ClassView`.`courseCode` AS `courseCode`,`ClassView`.`courseName` AS `courseName`,`ClassView`.`teachYear` AS `teachYear`,`ClassView`.`term` AS `term`,`ClassView`.`studId` AS `studId`,`ClassView`.`studlName` AS `studlName`,`ClassView`.`studfName` AS `studfName`,`ClassView`.`grade` AS `grade` from `ClassView` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `manage_course`
--

/*!50001 DROP VIEW IF EXISTS `manage_course`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`350_group_project_user`@`` SQL SECURITY DEFINER */
/*!50001 VIEW `manage_course` AS select `t`.`teacherId` AS `teacherId`,`t`.`teachYear` AS `teachYear`,`t`.`term` AS `term`,`us`.`userfName` AS `userfName`,`us`.`userlName` AS `userlName`,`c`.`courseCode` AS `courseCode`,`c`.`courseName` AS `CourseName` from ((`Teach` `t` join `User` `us`) join `Course` `c`) where ((`t`.`teacherId` = `us`.`userId`) and (`c`.`courseCode` = `t`.`courseCode`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `stu_personal_record`
--

/*!50001 DROP VIEW IF EXISTS `stu_personal_record`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`350_group_project_user`@`` SQL SECURITY DEFINER */
/*!50001 VIEW `stu_personal_record` AS select `usertable`.`userfName` AS `userfName`,`usertable`.`userlName` AS `userlName`,`person_info_table`.`sex` AS `sex`,`person_info_table`.`phoneNo` AS `phoneNo`,`person_info_table`.`userId` AS `userId` from (`User` `usertable` join `StudentInfo` `person_info_table` on((`usertable`.`userId` = `person_info_table`.`userId`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-09 20:02:29
