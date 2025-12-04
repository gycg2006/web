# UniforLibSocial Backend

Backend Spring Boot para a aplicação UniforLibSocial com persistência de dados e API REST.

## Tecnologias

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **MySQL**
- **Maven**

## Estrutura do Projeto

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/unifor/libsocial/
│   │   │   ├── config/          # Configurações (CORS, etc.)
│   │   │   ├── controller/      # Controllers REST
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   ├── mapper/          # Conversores Entity <-> DTO
│   │   │   ├── model/           # Entidades JPA
│   │   │   ├── repository/      # Repositories JPA
│   │   │   └── service/         # Services com lógica de negócio
│   │   └── resources/
│   │       └── application.properties
│   └── test/
└── pom.xml
```

## Entidades do Banco de Dados

### User (Usuário)
- `id`: Long (PK)
- `matricula`: String (única, 7 dígitos)
- `senha`: String (8 caracteres)
- `nome`: String
- `bio`: String
- `fotoPerfil`: String (URL)

### Book (Livro)
- `googleBooksId`: String (PK)
- `title`: String
- `authors`: String (separados por vírgula)
- `publisher`: String
- `description`: String
- `thumbnailUrl`: String
- Outros campos do Google Books API

### UserBook (Relação Usuário-Livro)
- `id`: Long (PK)
- `user`: User (FK)
- `book`: Book (FK)
- `status`: Enum (QUERO_LER, LENDO, LIDO)
- `rating`: Integer (1-5)
- `review`: String

### BookList (Lista de Livros)
- `id`: Long (PK)
- `title`: String
- `description`: String
- `coverImage`: String (URL)
- `user`: User (FK)
- `books`: List<Book> (Many-to-Many)

### Friendship (Amizade)
- `id`: Long (PK)
- `user1`: User (FK)
- `user2`: User (FK)
- `status`: Enum (PENDING, ACCEPTED, BLOCKED)

## Endpoints da API

### Usuários
- `POST /api/users/login` - Login
- `POST /api/users/register` - Cadastro
- `GET /api/users/{id}` - Obter usuário
- `PUT /api/users/{id}` - Atualizar usuário

### Livros do Usuário
- `POST /api/users/{userId}/books` - Adicionar livro à estante
- `GET /api/users/{userId}/books` - Listar todos os livros
- `GET /api/users/{userId}/books/status/{status}` - Listar por status (QUERO_LER, LENDO, LIDO)
- `PUT /api/users/{userId}/books/{bookId}/status` - Atualizar status
- `PUT /api/users/{userId}/books/{bookId}/review` - Atualizar avaliação/resenha
- `DELETE /api/users/{userId}/books/{bookId}` - Remover livro

### Listas de Livros
- `POST /api/users/{userId}/lists` - Criar lista
- `GET /api/users/{userId}/lists` - Listar listas do usuário
- `GET /api/users/{userId}/lists/{listId}` - Obter lista
- `PUT /api/users/{userId}/lists/{listId}` - Atualizar lista
- `DELETE /api/users/{userId}/lists/{listId}` - Deletar lista
- `POST /api/users/{userId}/lists/{listId}/books` - Adicionar livro à lista
- `DELETE /api/users/{userId}/lists/{listId}/books/{bookId}` - Remover livro da lista

## Configuração

### Configuração do MySQL

#### Opção 1: Usando Docker (Recomendado) 🐳

A forma mais fácil de configurar o MySQL é usando Docker:

```bash
# Na raiz do projeto, execute:
docker-compose up -d

# Isso irá:
# - Baixar a imagem MySQL 8.0
# - Criar o container com o banco de dados
# - Configurar usuário e senha automaticamente
# - Criar o banco de dados uniforlibsocial
```

**Credenciais padrão do Docker:**
- **Host:** localhost:3306
- **Usuário:** root
- **Senha:** root
- **Banco:** uniforlibsocial

O `application.properties` já está configurado para essas credenciais!

**Comandos úteis:**
```bash
# Ver logs do container
docker-compose logs -f mysql

# Parar o container
docker-compose down

# Parar e remover volumes (apaga dados)
docker-compose down -v

# Reiniciar o container
docker-compose restart
```

#### Opção 2: Instalação Local

1. **Instale o MySQL** (se ainda não tiver instalado)
2. **Crie o banco de dados**:
   ```sql
   CREATE DATABASE IF NOT EXISTS uniforlibsocial CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. **Configure as credenciais** no `application.properties`:
   ```properties
   spring.datasource.username=seu_usuario
   spring.datasource.password=sua_senha
   ```
4. As tabelas serão criadas automaticamente pelo Hibernate na primeira execução

### Produção (PostgreSQL)

1. Descomente as linhas no `application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/uniforlibsocial
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

2. Crie o banco de dados:
```sql
CREATE DATABASE uniforlibsocial;
```

## Como Executar

### Pré-requisitos
- Java 17 ou superior
- Maven 3.6+

### Executar

```bash
cd backend
mvn spring-boot:run
```

A aplicação estará disponível em: `http://localhost:8080`

## CORS

O CORS está configurado para permitir requisições do Angular em `http://localhost:4200`.

## Exemplos de Requisições

### Login
```bash
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"matricula":"1234567","senha":"12345678"}'

# Resposta:
# {
#   "user": { "id": 1, "matricula": "1234567", ... },
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
# }
```

### Requisições Autenticadas
```bash
curl -X GET http://localhost:8080/api/users/1/books \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Adicionar Livro à Estante
```bash
curl -X POST http://localhost:8080/api/users/1/books \
  -H "Content-Type: application/json" \
  -d '{
    "id":"book123",
    "volumeInfo":{
      "title":"Título do Livro",
      "authors":["Autor 1"],
      "imageLinks":{"thumbnail":"url"}
    },
    "status":"QUERO_LER"
  }'
```

## Notas

## Segurança Implementada

✅ **MySQL** configurado como banco de dados padrão
✅ **BCrypt** para hash de senhas
✅ **JWT** para autenticação stateless

### Configuração do Banco de Dados

1. **Instale o MySQL** (se ainda não tiver)
2. **Crie o banco de dados**:
   ```sql
   CREATE DATABASE IF NOT EXISTS uniforlibsocial CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. **Configure as credenciais** no `application.properties`:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=sua_senha
   ```

### Autenticação JWT

- Tokens JWT são gerados no login e registro
- Tokens têm validade de 24 horas (configurável)
- Todas as requisições protegidas requerem o header: `Authorization: Bearer <token>`
- O frontend automaticamente inclui o token nas requisições

### Hash de Senhas

- Senhas são hasheadas com BCrypt antes de serem salvas
- BCrypt usa salt automático para maior segurança
- Senhas nunca são armazenadas em texto plano

