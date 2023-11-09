CREATE SCHEMA `users_db` ;

CREATE TABLE `users_db`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE);

CREATE TABLE `users_db`.`tasks` (
  `task_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `task_name` VARCHAR(45) NOT NULL,
  `start_time` DATETIME NOT NULL,
  `end_time` DATETIME NOT NULL,
  `remark` VARCHAR(255) NOT NULL,
  `is_done` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`task_id`),
  UNIQUE INDEX `task_id_UNIQUE` (`task_id` ASC) VISIBLE,
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC) VISIBLE,
  CONSTRAINT `user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `users_db`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
