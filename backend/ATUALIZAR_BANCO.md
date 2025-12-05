# Como Atualizar o Schema do Banco de Dados

## Problema
Se você está recebendo o erro:
```
Data truncation: Data too long for column 'cover_image' at row 1
```

Isso significa que a coluna `cover_image` na tabela `book_lists` ainda está como VARCHAR(500) e precisa ser alterada para LONGTEXT.

## Solução

### Opção 1: Executar o Script SQL Manualmente (Recomendado)

1. **Conecte-se ao MySQL:**
   ```bash
   mysql -u root -p uniforlibsocial
   ```
   (Senha padrão: `root`)

2. **Execute o script:**
   ```sql
   source update_schema.sql
   ```
   
   OU copie e cole os comandos do arquivo `update_schema.sql` diretamente no MySQL.

3. **Verifique se funcionou:**
   ```sql
   SHOW COLUMNS FROM book_lists LIKE 'cover_image';
   ```
   
   Você deve ver `Type: longtext` na saída.

### Opção 2: Executar via Docker

Se estiver usando Docker:

```bash
# Conecte-se ao container MySQL
docker exec -it unifor-lib-social-mysql mysql -u root -proot uniforlibsocial

# Execute o script
source /docker-entrypoint-initdb.d/update_schema.sql
```

OU copie o conteúdo do arquivo `update_schema.sql` e cole no terminal do MySQL.

### Opção 3: Executar Comandos SQL Diretamente

Conecte-se ao MySQL e execute:

```sql
ALTER TABLE book_lists MODIFY cover_image LONGTEXT;
ALTER TABLE users MODIFY foto_perfil LONGTEXT;
ALTER TABLE books MODIFY thumbnail_url LONGTEXT;
ALTER TABLE books MODIFY small_thumbnail_url LONGTEXT;
ALTER TABLE books MODIFY preview_link LONGTEXT;
ALTER TABLE books MODIFY info_link LONGTEXT;
ALTER TABLE posts MODIFY image_url LONGTEXT;
```

## Após a Atualização

1. Reinicie o backend Spring Boot
2. Tente criar uma lista com capa novamente
3. O erro não deve mais aparecer

## Nota Importante

O Hibernate com `ddl-auto=update` **não altera automaticamente** o tipo de coluna existente. Por isso é necessário executar o script SQL manualmente.

