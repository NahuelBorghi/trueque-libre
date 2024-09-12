-- MySQL Script generated by MySQL Workbench
-- Tue Aug 20 19:08:40 2024
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema trueque-libre
-- -----------------------------------------------------
-- Base de datos de la pagina web trueque-libre

-- -----------------------------------------------------
-- Schema trueque-libre
--
-- Base de datos de la pagina web trueque-libre
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `trueque-libre` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin ;
USE `trueque-libre` ;

-- -----------------------------------------------------
-- Table `trueque-libre`.`Users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `trueque-libre`.`Users` (
  `id` VARCHAR(50) NOT NULL COMMENT 'GUID generado automaticamente por el backend',
  `userName` VARCHAR(50) NOT NULL,
  `password` VARCHAR(128) NOT NULL,
  `salt` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `state` TINYINT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  UNIQUE INDEX `userName_UNIQUE` (`userName` ASC),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `trueque-libre`.`Publications`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `trueque-libre`.`Publications` (
  `id` VARCHAR(50) NOT NULL,
  `idUser` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` VARCHAR(1000) NULL,
  `status` VARCHAR(45) NOT NULL,
  `creationDate` DATETIME NOT NULL,
  PRIMARY KEY (`id`, `idUser`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `fk_Publications_Users_idx` (`idUser` ASC),
  CONSTRAINT `fk_Publications_Users`
    FOREIGN KEY (`idUser`)
    REFERENCES `trueque-libre`.`Users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `trueque-libre`.`Image`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `trueque-libre`.`Image` (
  `id` VARCHAR(50) NOT NULL,
  `image` VARCHAR(255) NOT NULL,
  `mimetype` VARCHAR(45) NOT NULL,
  `creationDate` DATETIME NOT NULL,
  `creationUser` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`, `creationUser`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `fk_Image_Users1_idx` (`creationUser` ASC),
  CONSTRAINT `fk_Image_Users1`
    FOREIGN KEY (`creationUser`)
    REFERENCES `trueque-libre`.`Users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `trueque-libre`.`ImagePublication`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `trueque-libre`.`ImagePublication` (
  `id` VARCHAR(50) NOT NULL,
  `idPublication` VARCHAR(50) NOT NULL,
  `idUser` VARCHAR(50) NOT NULL,
  `idImage` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`, `idPublication`, `idUser`, `idImage`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `fk_ImagePublication_Publications1_idx` (`idPublication` ASC, `idUser` ASC),
  INDEX `fk_ImagePublication_Image1_idx` (`idImage` ASC),
  CONSTRAINT `fk_ImagePublication_Publications1`
    FOREIGN KEY (`idPublication` , `idUser`)
    REFERENCES `trueque-libre`.`Publications` (`id` , `idUser`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ImagePublication_Image1`
    FOREIGN KEY (`idImage`)
    REFERENCES `trueque-libre`.`Image` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `trueque-libre`.`Chat`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `trueque-libre`.`Chat` (
  `id` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NULL,
  `creationDate` DATETIME NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `trueque-libre`.`Offers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `trueque-libre`.`Offers` (
  `id` VARCHAR(50) NOT NULL,
  `idPublication` VARCHAR(50) NOT NULL,
  `idPublicationUser` VARCHAR(50) NOT NULL,
  `idUser` VARCHAR(50) NOT NULL,
  `Chat_id` VARCHAR(50) NOT NULL,
  `Image_id` VARCHAR(50) NOT NULL,
  `description` VARCHAR(50) NULL,
  `status` VARCHAR(45) NULL,
  PRIMARY KEY (`id`, `idPublication`, `idPublicationUser`, `idUser`, `Chat_id`, `Image_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `fk_Offers_Publications1_idx` (`idPublication` ASC, `idPublicationUser` ASC),
  INDEX `fk_Offers_Users1_idx` (`idUser` ASC),
  INDEX `fk_Offers_Chat1_idx` (`Chat_id` ASC),
  INDEX `fk_Offers_Image1_idx` (`Image_id` ASC),
  CONSTRAINT `fk_Offers_Publications1`
    FOREIGN KEY (`idPublication` , `idPublicationUser`)
    REFERENCES `trueque-libre`.`Publications` (`id` , `idUser`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Offers_Users1`
    FOREIGN KEY (`idUser`)
    REFERENCES `trueque-libre`.`Users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Offers_Chat1`
    FOREIGN KEY (`Chat_id`)
    REFERENCES `trueque-libre`.`Chat` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Offers_Image1`
    FOREIGN KEY (`Image_id`)
    REFERENCES `trueque-libre`.`Image` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
