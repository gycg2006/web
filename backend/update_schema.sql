-- Script SQL para atualizar o schema do banco de dados
-- Execute este script manualmente no MySQL para atualizar as colunas para LONGTEXT
-- 
-- Como executar:
-- 1. Conecte-se ao MySQL: mysql -u root -p uniforlibsocial
-- 2. Execute este arquivo: source update_schema.sql
-- OU copie e cole os comandos abaixo no MySQL

-- Alterar o tipo da coluna foto_perfil para LONGTEXT para suportar imagens em base64
ALTER TABLE users MODIFY foto_perfil LONGTEXT;

-- Alterar campos da tabela books
ALTER TABLE books MODIFY thumbnail_url LONGTEXT;
ALTER TABLE books MODIFY small_thumbnail_url LONGTEXT;
ALTER TABLE books MODIFY preview_link LONGTEXT;
ALTER TABLE books MODIFY info_link LONGTEXT;

-- Alterar campo da tabela book_lists (IMPORTANTE: corrige o erro de capa)
ALTER TABLE book_lists MODIFY cover_image LONGTEXT;

-- Alterar campo da tabela posts
ALTER TABLE posts MODIFY image_url LONGTEXT;

-- Adicionar coluna curso na tabela users (execute apenas se a coluna não existir)
-- Se der erro "Duplicate column name", significa que a coluna já existe e pode ignorar
ALTER TABLE users ADD COLUMN curso VARCHAR(100);

-- Verificar se as alterações foram aplicadas
SHOW COLUMNS FROM book_lists LIKE 'cover_image';
SHOW COLUMNS FROM users LIKE 'foto_perfil';
SHOW COLUMNS FROM users LIKE 'curso';

