-- Script SQL para criar o banco de dados MySQL
-- Este script é executado automaticamente quando o container MySQL é criado pela primeira vez
-- O banco de dados já é criado automaticamente pelo docker-compose.yml via MYSQL_DATABASE
-- Este arquivo é mantido para referência e pode ser usado para scripts adicionais

-- As tabelas serão criadas automaticamente pelo Hibernate na primeira execução do Spring Boot

-- Alterar o tipo da coluna foto_perfil para LONGTEXT para suportar imagens em base64
ALTER TABLE users MODIFY foto_perfil LONGTEXT;
ALTER TABLE books MODIFY thumbnail_url LONGTEXT;
ALTER TABLE books MODIFY small_thumbnail_url LONGTEXT;
ALTER TABLE books MODIFY preview_link LONGTEXT;
ALTER TABLE books MODIFY info_link LONGTEXT;
ALTER TABLE book_lists MODIFY cover_image LONGTEXT;
ALTER TABLE posts MODIFY image_url LONGTEXT;

-- Adicionar coluna curso na tabela users
-- Se der erro "Duplicate column name", significa que a coluna já existe e pode ignorar
ALTER TABLE users ADD COLUMN curso VARCHAR(100);
