# UniforLibSocial

Aplicação social de leitura desenvolvida com Angular e Spring Boot.

## 🚀 Início Rápido

### Pré-requisitos

- **Node.js** 18+ e npm
- **Java** 17+
- **Maven** 3.6+
- **Docker** e Docker Compose (para MySQL)

### 1. Subir o MySQL com Docker

```bash
docker-compose up -d
```

Isso irá criar e iniciar o container MySQL automaticamente.

### 2. Iniciar o Backend

```bash
cd backend
mvn spring-boot:run
```

O backend estará disponível em: `http://localhost:8080`

### 3. Iniciar o Frontend

```bash
npm install
ng serve
```

O frontend estará disponível em: `http://localhost:4200`

## 📚 Documentação

- **[DOCKER.md](DOCKER.md)** - Guia completo sobre Docker e MySQL
- **[backend/README.md](backend/README.md)** - Documentação do backend
- **[backend/SETUP.md](backend/SETUP.md)** - Guia de configuração detalhado

## 🛠️ Tecnologias

### Frontend
- Angular 21
- TypeScript
- RxJS

### Backend
- Spring Boot 3.2.0
- Spring Security
- JWT Authentication
- MySQL 8.0
- BCrypt para hash de senhas

## 🔐 Segurança

- ✅ Hash de senhas com BCrypt
- ✅ Autenticação JWT
- ✅ CORS configurado
- ✅ Validação de dados

## 📝 Estrutura do Projeto

```
unifor-lib-social/
├── backend/              # Backend Spring Boot
│   ├── src/
│   └── pom.xml
├── src/                 # Frontend Angular
│   ├── app/
│   └── environments/
├── docker-compose.yml   # Configuração Docker MySQL
└── README.md
```

## 🐳 Docker

O MySQL pode ser executado via Docker usando:

```bash
docker-compose up -d
```

Para mais informações, consulte [DOCKER.md](DOCKER.md).

## 📖 Funcionalidades

- ✅ Login e Cadastro
- ✅ Autenticação JWT
- ✅ Gerenciamento de livros
- ✅ Prateleiras (Lendo, Lidos, Quero Ler)
- ✅ Listas personalizadas
- ✅ Sistema de amizades (em desenvolvimento)

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é parte de um trabalho acadêmico.
