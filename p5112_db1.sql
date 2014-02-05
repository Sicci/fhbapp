-- phpMyAdmin SQL Dump
-- version 3.5.2.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Erstellungszeit: 05. Feb 2014 um 20:28
-- Server Version: 5.5.31-0+wheezy1
-- PHP-Version: 5.4.4-14+deb7u5

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Datenbank: `p5112_db1`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `contact2contactgroup`
--

CREATE TABLE IF NOT EXISTS `contact2contactgroup` (
  `uid` int(11) NOT NULL,
  `cgid` int(11) NOT NULL,
  PRIMARY KEY (`uid`,`cgid`),
  KEY `cgid` (`cgid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `contact2contactgroup`
--

INSERT INTO `contact2contactgroup` (`uid`, `cgid`) VALUES
(1, 1),
(1, 18),
(11, 18),
(11, 19),
(12, 19),
(4, 20),
(5, 20),
(2, 21),
(3, 21),
(7, 21),
(11, 21),
(1, 26),
(8, 26),
(11, 26),
(1, 33),
(5, 33),
(7, 33),
(8, 33),
(10, 33),
(6, 48),
(10, 48),
(1, 52),
(5, 52),
(9, 52);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `contactgroup`
--

CREATE TABLE IF NOT EXISTS `contactgroup` (
  `cgid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `cgname` varchar(50) NOT NULL,
  `cgcreationdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`cgid`,`uid`),
  KEY `UID` (`uid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=53 ;

--
-- Daten für Tabelle `contactgroup`
--

INSERT INTO `contactgroup` (`cgid`, `uid`, `cgname`, `cgcreationdate`) VALUES
(1, 4, 'IT', '2013-11-14 11:19:28'),
(1, 11, 'IT', '2013-11-14 10:19:28'),
(18, 4, 'Freunde', '2013-11-14 11:19:28'),
(18, 11, 'Freunde', '2013-11-14 10:19:28'),
(19, 2, 'Freunde', '2013-11-14 11:19:28'),
(19, 11, 'Freunde', '2013-11-14 10:19:28'),
(20, 9, 'Bahn-Fahrer', '2013-11-14 11:19:28'),
(20, 11, 'Bahn-Fahrer', '2013-11-14 10:19:28'),
(21, 8, 'MIS', '2013-11-14 11:19:28'),
(21, 11, 'MIS', '2013-11-14 10:19:28'),
(24, 7, 'WAuS', '2013-11-26 14:29:05'),
(24, 11, 'WAuS', '2013-11-26 13:29:05'),
(26, 12, 'Freunde', '2013-12-25 14:10:22'),
(33, 12, 'MiS', '2013-12-25 20:00:22'),
(48, 12, 'Test', '2014-01-12 14:51:57'),
(52, 12, 'Die Elite', '2014-02-05 13:20:57');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `event`
--

CREATE TABLE IF NOT EXISTS `event` (
  `eid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `ename` varchar(50) NOT NULL,
  `edescription` varchar(300) NOT NULL DEFAULT 'Keine Beschreibung vorhanden',
  `ecreationdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `edate` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `eqrcontent` varchar(100) NOT NULL,
  PRIMARY KEY (`eid`,`uid`),
  KEY `UID` (`uid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=18 ;

--
-- Daten für Tabelle `event`
--

INSERT INTO `event` (`eid`, `uid`, `ename`, `edescription`, `ecreationdate`, `edate`, `eqrcontent`) VALUES
(2, 12, 'Mathe 4', 'Mathematik im Mastersemester', '2014-02-05 16:36:58', '2013-12-30 23:38:00', '52c0a4374a324'),
(16, 12, 'MIS Prüfung', '', '2014-02-05 13:34:09', '2014-02-06 11:00:00', '52f23dd10d587'),
(17, 12, 'Prüfungsvorbereitung', 'Letzte Vorbereitungen für die Prüfung MIS', '2014-02-05 18:37:44', '2014-02-05 19:00:00', '52f284f816f83');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `group`
--

CREATE TABLE IF NOT EXISTS `group` (
  `gid` int(11) NOT NULL AUTO_INCREMENT,
  `gname` varchar(50) NOT NULL,
  PRIMARY KEY (`gid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Daten für Tabelle `group`
--

INSERT INTO `group` (`gid`, `gname`) VALUES
(1, 'Fachbereich Informatik'),
(2, 'Fachbereich Technik'),
(3, 'Fachbereich Wirtschaft');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `login`
--

CREATE TABLE IF NOT EXISTS `login` (
  `uid` int(11) NOT NULL,
  `uname` varchar(20) NOT NULL,
  `upassword` varchar(100) NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `login`
--

INSERT INTO `login` (`uid`, `uname`, `upassword`) VALUES
(1, 'mosters', '0809a3baaf81ce72ada3d1de182abfc3'),
(2, 'moegelin', '4f2ba7ec7e075274ed64dc338deb1f35'),
(3, 'seetge', '6707bcf195caa07e6b39f983d57a91b8'),
(11, 'student', 'cd73502828457d15655bbd7a63fb0bc8'),
(12, 'dozent', 'caa66a072554b442f4e8e43c665924cb');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `room`
--

CREATE TABLE IF NOT EXISTS `room` (
  `rid` int(11) NOT NULL AUTO_INCREMENT,
  `rname` varchar(30) NOT NULL,
  `geolat` varchar(9) NOT NULL,
  `geolng` varchar(9) NOT NULL,
  `building` varchar(50) NOT NULL,
  `floor` int(11) NOT NULL,
  `rqrcontent` varchar(150) NOT NULL,
  PRIMARY KEY (`rid`),
  UNIQUE KEY `RaumName` (`rname`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Daten für Tabelle `room`
--

INSERT INTO `room` (`rid`, `rname`, `geolat`, `geolng`, `building`, `floor`, `rqrcontent`) VALUES
(1, 'Raum 0.27', '52.410996', '12.538446', 'Informatikgebäude', 0, 'dk39dmwi28d'),
(2, 'Raum 2.23', '52.410996', '12.538446', 'Informatikgebäude', 2, '39bmsih78s0'),
(4, 'Raum 1.24', '52.410649', '12.53784', 'Technikgebäude', 1, '3kfwnbg93da'),
(5, 'Raum 0.35', '52.411762', '12.536907', 'Wirtschaftsgebäude', 0, '9dfk19vks10v');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `status`
--

CREATE TABLE IF NOT EXISTS `status` (
  `sid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `eid` int(11) DEFAULT NULL,
  `rid` int(11) DEFAULT NULL,
  `sdescription` varchar(300) NOT NULL DEFAULT 'aktueller Status unbekannt',
  `screationdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`sid`,`uid`),
  KEY `EID` (`eid`),
  KEY `RID` (`rid`),
  KEY `UID` (`uid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=31 ;

--
-- Daten für Tabelle `status`
--

INSERT INTO `status` (`sid`, `uid`, `eid`, `rid`, `sdescription`, `screationdate`) VALUES
(14, 11, NULL, 2, 'Im Raum 2.23', '2014-02-05 13:38:54'),
(15, 12, NULL, 5, 'Im Raum 0.35', '2014-02-05 13:44:14'),
(16, 11, NULL, 5, 'Im Raum 0.35', '2014-02-05 13:45:02'),
(17, 11, NULL, 2, 'Im Raum 2.23', '2014-02-05 13:47:55'),
(18, 11, 16, NULL, 'Bei MIS Prüfung', '2014-02-05 15:20:03'),
(19, 12, NULL, 2, 'Im Raum 2.23', '2014-02-05 15:25:18'),
(20, 11, NULL, 4, 'Im Raum 1.24', '2014-02-05 15:30:47'),
(21, 3, NULL, 5, 'Im Raum 0.35', '2014-02-05 16:49:27'),
(22, 11, NULL, 4, 'Im Raum 1.24', '2014-02-05 16:53:09'),
(23, 3, NULL, 5, 'Im Raum 0.35', '2014-02-05 18:32:39'),
(24, 2, NULL, 4, 'Im Raum 1.24', '2014-02-05 18:32:45'),
(28, 2, 17, NULL, 'Bei Prüfungsvorbereitung', '2014-02-05 18:47:36'),
(29, 3, 17, NULL, 'Bei Prüfungsvorbereitung', '2014-02-05 18:48:14'),
(30, 2, 17, NULL, 'Bei Prüfungsvorbereitung', '2014-02-05 18:50:46');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `matnr` int(11) DEFAULT NULL,
  `lastname` varchar(50) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `title` varchar(50) DEFAULT NULL,
  `birthday` date NOT NULL,
  `city` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `istutor` tinyint(1) NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=13 ;

--
-- Daten für Tabelle `user`
--

INSERT INTO `user` (`uid`, `matnr`, `lastname`, `firstname`, `title`, `birthday`, `city`, `email`, `istutor`) VALUES
(1, 20090034, 'Mosters', 'Curtis', 'B. Sc.', '1989-06-29', 'Brandenburg', 'mosters@fh-brandenburg.de', 0),
(2, 20090035, 'Mögelin', 'Josef', 'B. Sc.', '1990-01-29', 'Potsdam', 'moegelin@fh-brandenburg.de', 0),
(3, 20090035, 'Seetge', 'Mathias', 'B. Sc.', '1982-01-02', 'Brandenburg', 'seetge@fh-brandenburg.de', 0),
(4, 20090036, 'Boersch', 'Ingo', 'Dipl. Inf.', '1973-02-04', 'Brandenburg', 'boersch@fh-brandenburg.de', 1),
(5, 20090037, 'Hoffmann', 'Benjamin', 'B. Sc.', '1991-02-05', 'Brandenburg', 'bhoffman@fh-brandenburg.de', 0),
(6, 20090038, 'Klay', 'Andy', 'B. Sc.', '1989-04-06', 'Brandenburg', 'klay@fh-brandenburg.de', 0),
(7, 20090039, 'Reuschel', 'Tino', 'B. Sc.', '1990-03-21', 'Schwedt', 'reuschel@fh-brandenburg.de', 0),
(8, 20090040, 'Stecklina', 'Oliver', 'Dipl. Inf.', '1978-03-25', 'Frankfurt (O.)', 'oliver@stecklina-net.de', 1),
(9, 20090041, 'Koppen', 'Michael', 'B. Sc.', '1987-06-15', 'Brandenburg', 'koppen@fh-brandenburg.de', 0),
(10, 20090042, 'Arndt', 'Benjamin', 'B. Sc.', '1986-03-12', 'Brandenburg', 'arndt@fh-brandenburg.de', 0),
(11, 12312312, 'Student', 'Student', 'M. Sc.', '2000-12-01', 'Berlin', 'student@fh-brandenburg.de', 0),
(12, 12312313, 'Dozent', 'Dozent', 'Dr. Prof.', '1900-04-04', 'Augsburg', 'dozent@fh-brandenburg.de', 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user2event`
--

CREATE TABLE IF NOT EXISTS `user2event` (
  `etid` int(11) NOT NULL AUTO_INCREMENT,
  `eid` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `hasverified` tinyint(1) NOT NULL,
  PRIMARY KEY (`etid`),
  UNIQUE KEY `EID` (`eid`,`uid`),
  KEY `UID` (`uid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=46 ;

--
-- Daten für Tabelle `user2event`
--

INSERT INTO `user2event` (`etid`, `eid`, `uid`, `hasverified`) VALUES
(3, 2, 11, 1),
(8, 2, 4, 0),
(9, 2, 6, 0),
(16, 2, 12, 0),
(38, 16, 12, 1),
(39, 16, 1, 1),
(40, 16, 2, 1),
(41, 16, 3, 1),
(42, 16, 11, 1),
(43, 17, 2, 1),
(44, 17, 3, 1),
(45, 17, 1, 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user2group`
--

CREATE TABLE IF NOT EXISTS `user2group` (
  `uid` int(11) NOT NULL,
  `gid` int(11) NOT NULL,
  PRIMARY KEY (`uid`,`gid`),
  KEY `GID` (`gid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `user2group`
--

INSERT INTO `user2group` (`uid`, `gid`) VALUES
(1, 1),
(2, 1),
(3, 1),
(7, 1),
(8, 1),
(3, 2),
(5, 2),
(10, 2),
(12, 2),
(4, 3),
(6, 3),
(9, 3),
(11, 3);

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `contact2contactgroup`
--
ALTER TABLE `contact2contactgroup`
  ADD CONSTRAINT `contact2contactgroup_ibfk_2` FOREIGN KEY (`cgid`) REFERENCES `contactgroup` (`cgid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `contact2contactgroup_ibfk_3` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `contactgroup`
--
ALTER TABLE `contactgroup`
  ADD CONSTRAINT `contactgroup_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `event`
--
ALTER TABLE `event`
  ADD CONSTRAINT `event_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `login`
--
ALTER TABLE `login`
  ADD CONSTRAINT `login_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `status`
--
ALTER TABLE `status`
  ADD CONSTRAINT `status_ibfk_2` FOREIGN KEY (`eid`) REFERENCES `event` (`eid`) ON DELETE SET NULL ON UPDATE SET NULL,
  ADD CONSTRAINT `status_ibfk_3` FOREIGN KEY (`rid`) REFERENCES `room` (`rid`) ON DELETE SET NULL ON UPDATE SET NULL,
  ADD CONSTRAINT `status_ibfk_4` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `user2event`
--
ALTER TABLE `user2event`
  ADD CONSTRAINT `user2event_ibfk_1` FOREIGN KEY (`eid`) REFERENCES `event` (`eid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user2event_ibfk_2` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `user2group`
--
ALTER TABLE `user2group`
  ADD CONSTRAINT `user2group_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user2group_ibfk_2` FOREIGN KEY (`gid`) REFERENCES `group` (`gid`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
