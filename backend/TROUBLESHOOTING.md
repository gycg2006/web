# Troubleshooting - Erros Comuns

## Erro 400 Bad Request no Registro/Login

### Possíveis Causas

1. **Validação de Dados**
   - Matrícula deve ter exatamente 7 dígitos numéricos
   - Senha deve ter exatamente 8 caracteres
   - Campos não podem estar vazios

2. **Formato do JSON**
   - O JSON deve estar correto
   - Content-Type deve ser `application/json`

3. **Erro de Validação do Spring**

### Como Debugar

#### 1. Verificar o JSON Enviado

Certifique-se de que o JSON está no formato correto:

```json
{
  "matricula": "1234567",
  "senha": "12345678"
}
```

**Erros comuns:**
- Matrícula com menos ou mais de 7 dígitos: `"123456"` ou `"12345678"`
- Senha com menos ou mais de 8 caracteres: `"1234567"` ou `"123456789"`
- Campos com espaços em branco: `" 1234567 "`
- Campos nulos ou vazios: `""` ou `null`

#### 2. Verificar os Logs do Backend

Os logs do Spring Boot mostrarão os erros de validação:

```bash
# No terminal onde o backend está rodando, procure por:
MethodArgumentNotValidException
```

#### 3. Testar com cURL

```bash
# Teste de registro
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"matricula":"1234567","senha":"12345678"}'

# Se der erro, verifique a resposta JSON
```

#### 4. Resposta de Erro Esperada

Com o `GlobalExceptionHandler` implementado, você receberá:

**Erro de Validação:**
```json
{
  "error": "Erro de validação",
  "details": {
    "matricula": "Matrícula deve ter exatamente 7 dígitos",
    "senha": "Senha deve ter exatamente 8 caracteres"
  }
}
```

**Erro de Negócio (ex: matrícula já cadastrada):**
```json
{
  "error": "Matrícula já cadastrada"
}
```

### Soluções

#### Solução 1: Verificar Dados do Frontend

No Angular, certifique-se de que os dados estão corretos:

```typescript
// Exemplo correto
const matricula = '1234567';  // 7 dígitos
const senha = '12345678';     // 8 caracteres

this.authService.register(matricula, senha).subscribe(...)
```

#### Solução 2: Verificar Validação no Frontend

O componente de login já valida antes de enviar:

```typescript
const matriculaValida = /^\d{7}$/.test(this.matricula);
const senhaValida = /^\d{8}$/.test(this.senha);
```

#### Solução 3: Verificar Headers HTTP

Certifique-se de que o header `Content-Type` está sendo enviado:

```typescript
// No ApiService, já está configurado:
headers: {
  'Content-Type': 'application/json'
}
```

### Exemplos de Requisições Válidas

```bash
# ✅ VÁLIDO
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"matricula":"1234567","senha":"12345678"}'

# ❌ INVÁLIDO - Matrícula com 6 dígitos
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"matricula":"123456","senha":"12345678"}'

# ❌ INVÁLIDO - Senha com 7 caracteres
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"matricula":"1234567","senha":"1234567"}'

# ❌ INVÁLIDO - Matrícula vazia
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"matricula":"","senha":"12345678"}'
```

### Verificar se o Backend Está Rodando

```bash
# Verificar se a aplicação está respondendo
curl http://localhost:8080/api/users/1

# Ou acesse no navegador:
# http://localhost:8080/api/users/1
```

### Verificar Logs do Spring Boot

No console onde o backend está rodando, procure por:

```
ERROR o.s.w.s.m.support.DefaultHandlerExceptionResolver - Resolved [org.springframework.web.bind.MethodArgumentNotValidException: ...]
```

Isso mostrará exatamente qual campo está com problema.

