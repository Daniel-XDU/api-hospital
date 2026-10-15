-- Script de criação do banco e da tabela
CREATE DATABASE IF NOT EXISTS hospital
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE hospital;

CREATE TABLE IF NOT EXISTS medico (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(120) NOT NULL,
  especialidade VARCHAR(80) NOT NULL,
  crm VARCHAR(20) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_medico_crm (crm)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dados de exemplo
INSERT INTO medico (nome, especialidade, crm) VALUES
  ('Dra. Ana Souza', 'Cardiologia', 'CRM-GO 12345'),
  ('Dr. Carlos Lima', 'Pediatria', 'CRM-GO 23456'),
  ('Dra. Marina Alves', 'Ortopedia', 'CRM-GO 34567');
