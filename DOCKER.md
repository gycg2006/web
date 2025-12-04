# Guia Docker - MySQL Container

Este guia explica como usar Docker para subir o MySQL em um container, facilitando o desenvolvimento.

## Pré-requisitos

- **Docker** instalado
- **Docker Compose** instalado (geralmente vem com Docker Desktop)

Verifique se está instalado:
```bash
docker --version
docker-compose --version
```

## Iniciando o MySQL com Docker

### 1. Subir o Container

Na raiz do projeto, execute:

```bash
docker-compose up -d
```

O `-d` roda o container em background (detached mode).

### 2. Verificar se está Rodando

```bash
docker-compose ps
```

Você deve ver algo como:
```
NAME                        STATUS          PORTS
unifor-lib-social-mysql     Up (healthy)    0.0.0.0:3306->3306/tcp
```

### 3. Ver Logs

```bash
docker-compose logs -f mysql
```

## Configuração

### Credenciais Padrão

O `docker-compose.yml` está configurado com:

- **Host:** `localhost:3306`
- **Usuário root:** `root`
- **Senha root:** `root`
- **Usuário app:** `unifor`
- **Senha app:** `unifor123`
- **Banco de dados:** `uniforlibsocial`

### application.properties

O arquivo `backend/src/main/resources/application.properties` já está configurado para usar essas credenciais:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/uniforlibsocial?useSSL=false&serverTimezone=UTC&createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=root
```

## Comandos Úteis

### Parar o Container

```bash
docker-compose down
```

### Parar e Remover Volumes (apaga todos os dados)

```bash
docker-compose down -v
```

⚠️ **Atenção:** Isso apaga todos os dados do banco!

### Reiniciar o Container

```bash
docker-compose restart
```

### Ver Status

```bash
docker-compose ps
```

### Acessar o MySQL via CLI

```bash
docker-compose exec mysql mysql -uroot -proot uniforlibsocial
```

Ou usando o usuário da aplicação:

```bash
docker-compose exec mysql mysql -uunifor -punifor123 uniforlibsocial
```

## Persistência de Dados

Os dados são salvos em um volume Docker chamado `mysql_data`. Isso significa que mesmo se você parar o container, os dados permanecem.

Para remover completamente os dados:

```bash
docker-compose down -v
```

## Troubleshooting

### Porta 3306 já está em uso

Se você já tem MySQL rodando localmente na porta 3306, você pode:

1. **Parar o MySQL local** (recomendado para desenvolvimento)
2. **Ou alterar a porta no docker-compose.yml:**

```yaml
ports:
  - "3307:3306"  # Mude 3306 para 3307 (ou outra porta)
```

E atualize o `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3307/uniforlibsocial...
```

### Container não inicia

Verifique os logs:
```bash
docker-compose logs mysql
```

### Resetar o banco de dados

```bash
# Parar e remover volumes
docker-compose down -v

# Subir novamente
docker-compose up -d
```

## Estrutura do docker-compose.yml

```yaml
services:
  mysql:
    image: mysql:8.0              # Imagem MySQL 8.0
    container_name: unifor-lib-social-mysql
    restart: unless-stopped        # Reinicia automaticamente
    environment:                   # Variáveis de ambiente
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: uniforlibsocial
      MYSQL_USER: unifor
      MYSQL_PASSWORD: unifor123
    ports:
      - "3306:3306"                # Porta host:container
    volumes:
      - mysql_data:/var/lib/mysql  # Persistência de dados
      - ./backend/src/main/resources/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    command: --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
    healthcheck:                   # Verifica se está saudável
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
```

## Vantagens de Usar Docker

✅ **Fácil setup:** Não precisa instalar MySQL localmente  
✅ **Isolamento:** Não interfere com outras instalações MySQL  
✅ **Consistência:** Mesmo ambiente para todos os desenvolvedores  
✅ **Limpeza fácil:** `docker-compose down -v` remove tudo  
✅ **Portabilidade:** Funciona em qualquer sistema operacional  

## Próximos Passos

1. Suba o MySQL: `docker-compose up -d`
2. Inicie o backend: `cd backend && mvn spring-boot:run`
3. Inicie o frontend: `ng serve`
4. Acesse: `http://localhost:4200`

Pronto! 🚀

