# 📅 Agendador de Tarefas — Front-end

Interface web do **Agendador de Tarefas**, desenvolvida em **Angular** com **TypeScript**. O front-end consome diretamente o backend (BFF) em Java e permite que o usuário se cadastre, faça login e gerencie suas tarefas, além de manter seus dados pessoais, endereço e telefone.

> Este repositório contém apenas o **front-end**. O backend (BFF) está em: [bff-agendador-tarefas_recap](https://github.com/cardosogoc/bff-agendador-tarefas_recap)

---

## ✨ Funcionalidades

- Cadastro de usuário
- Login com autenticação via **JWT**
- Edição dos dados do usuário de forma individual
- Aba de **endereço** e aba de **telefone**, ambas independentes
- Cadastro de tarefas
- Edição de tarefas
- Exclusão de tarefas (com diálogo de confirmação)
- Rotas protegidas por **guard** de autenticação

---

## 🛠️ Tecnologias

- [Angular](https://angular.dev/) (v.22)
- [TypeScript](https://www.typescriptlang.org/)
- [Angular Material](https://material.angular.io/)
- Formulários reativos (Reactive Forms)
- RxJS
- SCSS

---


## ✅ Pré-requisitos

- [Node.js](https://nodejs.org/) (v. 22.12)
- [Angular CLI](https://angular.dev/tools/cli) instalado globalmente:

```bash
npm install -g @angular/cli
```

- Backend (BFF) em execução (veja a seção abaixo)

---

## 🚀 Como rodar o projeto

```bash
# 1. Clone o repositório
git clone https://github.com/cardosogoc/agendador-tarefas-front.git

# 2. Entre na pasta do projeto
cd agendador-tarefas-front

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
ng serve
```

Depois, acesse **http://localhost:4200** no navegador.

---

## 🔌 Backend

O front-end se comunica diretamente com o backend (BFF), desenvolvido em Java.

- **Repositório:** [bff-agendador-tarefas_recap](https://github.com/cardosogoc/bff-agendador-tarefas_recap)
- **Imagem Docker:** [cardosogoc/bff-agendador](https://hub.docker.com/r/cardosogoc/bff-agendador)
- **Documentação da API (Swagger):** http://localhost:8083/swagger-ui/index.html

> Para o front-end funcionar corretamente, o backend precisa estar rodando localmente na porta **8083**.

---

## 🔐 Autenticação

1. O usuário envia e-mail e senha na tela de login.
2. O backend valida as credenciais e retorna um **token JWT**.
3. O token é salvo pelo serviço de autenticação (`AuthService`) e os dados do usuário são carregados em seguida.
4. As rotas protegidas do front são controladas pelo `auth-guard`, e o backend exige o token nos endpoints protegidos.
5. Se o usuário já estiver logado ao acessar a tela de login, ele é redirecionado automaticamente para `/tasks`.

---

## 📁 Estrutura do projeto

```text
src/
├── app/
│   ├── core/
│   │   └── router/            # Estado de rotas
│   ├── guards/
│   │   └── auth-guard.ts      # Proteção de rotas autenticadas
│   ├── pages/
│   │   ├── home/
│   │   ├── login/
│   │   ├── register/
│   │   ├── tasks/
│   │   └── user-data/         # Dados do usuário, endereço e telefone
│   ├── services/              # Serviços (usuário, autenticação, tarefas...)
│   ├── shared/
│   │   └── components/        # confirm-dialog, modal-dialog, password-field...
│   ├── app.config.ts
│   ├── app.routes.ts
│   └── app.ts
├── assets/
├── index.html
├── main.ts
└── styles.scss
```

---

## 📌 Status do projeto

🚧 **Em fase final.** A maior parte das funcionalidades está concluída; estou realizando alguns ajustes finais.

---

## 👨‍💻 Autor

**Gabriel de Oliveira Cardoso**

- GitHub: [@cardosogoc](https://github.com/cardosogoc)
- LinkedIn: [gabriel-cardoso-developer](https://www.linkedin.com/in/gabriel-cardoso-developer/)
