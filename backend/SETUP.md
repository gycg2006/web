# Guia de Configuração - MySQL, BCrypt e JWT

Este guia explica como configurar o projeto com MySQL, hash de senhas (BCrypt) e autenticação JWT.

## Pré-requisitos

1. **Java 17** ou superior
2. **Maven 3.6+**
3. **Docker** e Docker Compose (recomendado) **OU** MySQL 8.0+ instalado localmente

## Passo 1: Configurar MySQL

### Opção 1: Usando Docker (Recomendado) 🐳

Esta é a forma mais fácil e recomendada para desenvolvimento:

#### 1.1 Verificar Docker

Certifique-se de que Docker está instalado:

```bash
docker --version
docker-compose --version
```

Se não tiver instalado, baixe em: https://www.docker.com/get-started

#### 1.2 Subir o MySQL com Docker

Na raiz do projeto, execute:

```bash
docker-compose up -d
```

Isso irá:
- Baixar a imagem MySQL 8.0
- Criar o container com o banco de dados
- Configurar usuário e senha automaticamente
- Criar o banco de dados `uniforlibsocial`

#### 1.3 Verificar se está Rodando

```bash
docker-compose ps
```

Você deve ver o container `unifor-lib-social-mysql` com status `Up (healthy)`.

#### 1.4 Credenciais Padrão do Docker

O `docker-compose.yml` está configurado com:
- **Host:** `localhost:3306`
- **Usuário root:** `root`
- **Senha root:** `root`
- **Banco de dados:** `uniforlibsocial`

O `application.properties` já está configurado para essas credenciais! ✅

**Comandos úteis:**
```bash
# Ver logs
docker-compose logs -f mysql

# Parar o container
docker-compose down

# Parar e remover dados (reset completo)
docker-compose down -v

# Reiniciar
docker-compose restart
```

Para mais informações sobre Docker, consulte [DOCKER.md](../../DOCKER.md).

---

### Opção 2: Instalação Local do MySQL

Se preferir instalar MySQL localmente:

#### 2.1 Instalar MySQL

**Windows:**
- Baixe o MySQL Installer: https://dev.mysql.com/downloads/installer/
- Execute o instalador e siga as instruções
- Anote a senha do usuário `root` que você configurou

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

**macOS:**
```bash
brew install mysql
brew services start mysql
```

#### 2.2 Criar o Banco de Dados

Abra o MySQL CLI ou um cliente MySQL (como MySQL Workbench) e execute:

```sql
CREATE DATABASE IF NOT EXISTS uniforlibsocial CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 2.3 Verificar Credenciais

Anote:
- **Usuário**: geralmente `root`
- **Senha**: a senha que você configurou
- **Porta**: geralmente `3306`

#### 2.4 Configurar application.properties

Edite o arquivo `backend/src/main/resources/application.properties`:

```properties
# Configuração do Banco de Dados MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/uniforlibsocial?useSSL=false&serverTimezone=UTC&createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=SUA_SENHA_AQUI
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

**Substitua `SUA_SENHA_AQUI` pela senha do seu MySQL.**

## Passo 2: Compilar e Executar

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

A aplicação estará disponível em: `http://localhost:8080`

## Passo 3: Testar a API

### 3.1 Registrar um Usuário

```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"matricula":"1234567","senha":"12345678"}'
```

**Resposta esperada:**
```json
{
  "user": {
    "id": 1,
    "matricula": "1234567",
    "nome": "Usuário 1234567"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3.2 Fazer Login

```bash
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"matricula":"1234567","senha":"12345678"}'
```

### 3.3 Usar o Token em Requisições Protegidas

```bash
curl -X GET http://localhost:8080/api/users/1/books \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## Como Funciona

### Hash de Senhas (BCrypt)

- Quando um usuário se registra, a senha é hasheada com BCrypt antes de ser salva
- BCrypt usa salt automático, garantindo que senhas idênticas tenham hashes diferentes
- No login, a senha fornecida é comparada com o hash armazenado usando `passwordEncoder.matches()`

### Autenticação JWT

1. **Login/Registro**: O servidor gera um token JWT contendo:
   - Matrícula do usuário (subject)
   - ID do usuário (claim)
   - Data de expiração (24 horas por padrão)

2. **Requisições Protegidas**: O cliente envia o token no header:
   ```
   Authorization: Bearer <token>
   ```

3. **Validação**: O servidor valida o token em cada requisição:
   - Verifica a assinatura
   - Verifica a expiração
   - Extrai informações do usuário

### Frontend

O frontend automaticamente:
- Armazena o token no localStorage após login/registro
- Inclui o token no header `Authorization` de todas as requisições
- Remove o token ao fazer logout

## Configurações Avançadas

### Alterar Tempo de Expiração do Token

No `application.properties`:
```properties
jwt.expiration=86400000  # 24 horas em milissegundos
```

### Alterar Secret do JWT

**IMPORTANTE**: Em produção, use uma chave secreta forte e segura!

No `application.properties`:
```properties
jwt.secret=SuaChaveSecretaMuitoSeguraAqui
```

## Troubleshooting

### Erro: "Access denied for user"

**Se estiver usando Docker:**
- Verifique se o container está rodando: `docker-compose ps`
- Verifique os logs: `docker-compose logs mysql`
- As credenciais padrão são `root/root` (já configuradas no `application.properties`)

**Se estiver usando MySQL local:**
- Verifique se o usuário e senha estão corretos no `application.properties`
- Verifique se o MySQL está rodando: `mysql -u root -p`

### Erro: "Unknown database"

**Se estiver usando Docker:**
- O banco é criado automaticamente pelo `docker-compose.yml`
- Se necessário, recrie o container: `docker-compose down -v && docker-compose up -d`

**Se estiver usando MySQL local:**
- Execute o comando SQL para criar o banco (Passo 2.2)
- Ou adicione `&createDatabaseIfNotExist=true` na URL (já está incluído)

### Erro: "Port 3306 is already in use"

Se você já tem MySQL rodando localmente na porta 3306:

**Opção 1:** Pare o MySQL local e use Docker
```bash
# Parar MySQL local (Windows)
net stop MySQL80

# Parar MySQL local (Linux)
sudo systemctl stop mysql

# Parar MySQL local (macOS)
brew services stop mysql
```

**Opção 2:** Altere a porta do Docker no `docker-compose.yml`:
```yaml
ports:
  - "3307:3306"  # Use porta 3307 no host
```

E atualize o `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3307/uniforlibsocial...
```

### Erro: "Token inválido"

- Verifique se está enviando o token no formato correto: `Bearer <token>`
- Verifique se o token não expirou (padrão: 24 horas)
- Faça login novamente para obter um novo token

## Vantagens de Usar Docker

✅ **Fácil setup:** Não precisa instalar MySQL localmente  
✅ **Isolamento:** Não interfere com outras instalações MySQL  
✅ **Consistência:** Mesmo ambiente para todos os desenvolvedores  
✅ **Limpeza fácil:** `docker-compose down -v` remove tudo  
✅ **Portabilidade:** Funciona em qualquer sistema operacional  
✅ **Zero configuração:** Credenciais já configuradas no `application.properties`

## Segurança em Produção

⚠️ **IMPORTANTE**: Para produção, considere:

1. **Chave JWT Segura**: Use uma chave secreta forte e única
2. **HTTPS**: Sempre use HTTPS em produção
3. **Refresh Tokens**: Implemente refresh tokens para melhor segurança
4. **Rate Limiting**: Limite tentativas de login
5. **Validação de Entrada**: Valide todos os inputs do usuário
6. **Logs de Segurança**: Monitore tentativas de acesso suspeitas
7. **Credenciais do Banco**: Use variáveis de ambiente para senhas
8. **Docker em Produção**: Configure adequadamente volumes e rede

