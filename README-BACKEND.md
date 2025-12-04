# Implementação de Persistência de Dados com Spring Boot

Este documento descreve a implementação completa de persistência de dados (SQL) no back-end e sua utilização no front-end através de uma API REST.

## Arquitetura Implementada

### Backend (Spring Boot)

#### 1. **Estrutura do Projeto**
- Projeto Maven com Spring Boot 3.2.0
- Java 17
- Spring Data JPA para persistência
- H2 Database (desenvolvimento) / PostgreSQL (produção)

#### 2. **Camadas da Aplicação**

**Model (Entidades JPA)**
- `User`: Usuários do sistema
- `Book`: Livros do Google Books API
- `UserBook`: Relação usuário-livro (prateleiras)
- `BookList`: Listas personalizadas de livros
- `Friendship`: Sistema de amizades

**Repository (Camada de Dados)**
- Interfaces JPA Repository para acesso aos dados
- Queries customizadas quando necessário

**Service (Lógica de Negócio)**
- `UserService`: Autenticação e gerenciamento de usuários
- `BookService`: Gerenciamento de livros
- `UserBookService`: Gerenciamento das prateleiras (lendo, lidos, quero ler)
- `BookListService`: Gerenciamento de listas personalizadas

**Controller (API REST)**
- `UserController`: Endpoints de autenticação e usuários
- `UserBookController`: Endpoints para prateleiras
- `BookListController`: Endpoints para listas

**DTO (Data Transfer Objects)**
- Objetos para transferência de dados entre front-end e back-end
- Separação entre modelo de domínio e API

#### 3. **Banco de Dados**

**Desenvolvimento (H2)**
- Banco em memória
- Console H2 disponível em `/h2-console`
- Dados resetados a cada reinicialização

**Produção (PostgreSQL/MySQL)**
- Configuração pronta no `application.properties`
- Basta descomentar e configurar

### Frontend (Angular)

#### 1. **Serviços Criados**

**ApiService**
- Centraliza todas as chamadas HTTP para o backend
- Métodos para cada endpoint da API

**AuthService**
- Gerenciamento de autenticação
- Armazenamento do usuário logado no localStorage
- Observable para reatividade

#### 2. **Componentes Atualizados**

**Login Component**
- Integrado com `AuthService`
- Login e cadastro via API REST
- Tratamento de erros

**MyBooks Component**
- Carrega dados da API REST
- Exibe livros por status (lendo, lidos, quero ler)
- Conversão de DTOs para modelos do Angular

## Fluxo de Dados

```
Frontend (Angular)          Backend (Spring Boot)          Database
     |                            |                            |
     |-- HTTP Request ----------->|                            |
     |                            |-- JPA Query -------------->|
     |                            |<-- Entity -----------------|
     |                            |-- Convert to DTO           |
     |<-- JSON Response ----------|                            |
     |                            |                            |
```

## Exemplos de Uso

### 1. Login
```typescript
// Frontend
this.authService.login('1234567', '12345678').subscribe(user => {
  // Usuário autenticado
});
```

```java
// Backend
POST /api/users/login
{
  "matricula": "1234567",
  "senha": "12345678"
}
```

### 2. Adicionar Livro à Estante
```typescript
// Frontend
this.apiService.addBookToUser(userId, book, 'QUERO_LER').subscribe();
```

```java
// Backend
POST /api/users/{userId}/books
{
  "id": "book123",
  "volumeInfo": {...},
  "status": "QUERO_LER"
}
```

### 3. Criar Lista de Livros
```typescript
// Frontend
this.apiService.createBookList(userId, {
  title: 'Minha Lista',
  description: 'Descrição'
}).subscribe();
```

```java
// Backend
POST /api/users/{userId}/lists
{
  "title": "Minha Lista",
  "description": "Descrição"
}
```

## Configuração

### Backend
1. Configure o banco de dados no `application.properties`
2. Execute: `mvn spring-boot:run`
3. API disponível em: `http://localhost:8080`

### Frontend
1. Configure a URL da API em `src/environments/environment.ts`
2. Execute: `ng serve`
3. Aplicação disponível em: `http://localhost:4200`

## Endpoints Disponíveis

### Usuários
- `POST /api/users/login` - Login
- `POST /api/users/register` - Cadastro
- `GET /api/users/{id}` - Obter usuário
- `PUT /api/users/{id}` - Atualizar usuário

### Prateleiras (UserBooks)
- `POST /api/users/{userId}/books` - Adicionar livro
- `GET /api/users/{userId}/books` - Listar todos
- `GET /api/users/{userId}/books/status/{status}` - Por status
- `PUT /api/users/{userId}/books/{bookId}/status` - Atualizar status
- `DELETE /api/users/{userId}/books/{bookId}` - Remover

### Listas
- `POST /api/users/{userId}/lists` - Criar lista
- `GET /api/users/{userId}/lists` - Listar listas
- `PUT /api/users/{userId}/lists/{listId}` - Atualizar lista
- `DELETE /api/users/{userId}/lists/{listId}` - Deletar lista
- `POST /api/users/{userId}/lists/{listId}/books` - Adicionar livro
- `DELETE /api/users/{userId}/lists/{listId}/books/{bookId}` - Remover livro

## Próximos Passos

1. **Autenticação JWT**: Implementar tokens para segurança
2. **Hash de Senhas**: Usar BCrypt para senhas
3. **Validações**: Adicionar mais validações nos DTOs
4. **Tratamento de Erros**: Criar exceptions customizadas
5. **Testes**: Adicionar testes unitários e de integração
6. **Documentação**: Swagger/OpenAPI para documentação da API

## Observações

- O CORS está configurado para `http://localhost:4200`
- As senhas estão em texto plano (implementar hash em produção)
- O banco H2 é em memória (dados são perdidos ao reiniciar)
- Para produção, usar PostgreSQL ou MySQL

