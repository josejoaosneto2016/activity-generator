# Activity Generator

Aplicação web que cria atividades escolares com questões geradas por IA. O site é HTML, CSS e JavaScript; a função em `api/` chama a OpenAI no servidor para manter a chave secreta fora do navegador.

## Como as partes conversam

```text
Navegador (HTML/CSS/JS) → /api/generate (Vercel) → OpenAI Responses API
```

O Supabase ainda não é necessário para gerar atividades. Ele pode ser adicionado depois para guardar atividades de cada pessoa, junto com autenticação e regras de acesso. O histórico atual fica apenas na memória da página e some quando ela é fechada.

## Rodar no seu computador

1. Instale uma versão LTS do Node.js.
2. Abra um terminal nesta pasta e rode `npm install`.
3. Copie `.env.example` para `.env.local`.
4. Peça a um adulto responsável para colocar a chave da OpenAI em `OPENAI_API_KEY` dentro de `.env.local`. Não envie essa chave para ninguém e não a coloque em `js/app.js`.
5. Rode `npm run dev` e abra o endereço local mostrado no terminal, normalmente `http://localhost:3000`.

Sem a chave, a página abre, mas a geração com IA não funciona. Não publique `.env.local` nem tire a regra de `.env.*` do `.gitignore`.

## Publicar com GitHub e Vercel

1. Um adulto cria um repositório no GitHub e envia este projeto para ele.
2. Na Vercel, escolha **Add New → Project**, conecte o repositório e importe o projeto. Não é preciso escolher um framework.
3. Nas configurações do projeto Vercel, adicione `OPENAI_API_KEY` e `OPENAI_MODEL` como variáveis de ambiente. Use a chave guardada pelo adulto; não escreva o valor em arquivos do projeto.
4. Publique e teste o endereço fornecido pela Vercel. Cada novo envio ao GitHub pode gerar uma nova publicação.

## Configuração da IA

- `OPENAI_API_KEY`: segredo criado na plataforma de API da OpenAI.
- `OPENAI_MODEL`: modelo habilitado na conta. O padrão deste projeto é `gpt-6-luna`; pode ser trocado pela variável de ambiente.
- A função valida os campos, limita o assunto a 500 caracteres, pede uma resposta estruturada e confere o formato antes de devolver as questões.
- A solicitação usa `store: false` e não pede nome, endereço ou outros dados pessoais. Mesmo assim, não digite informações pessoais no assunto.
- Questões criadas por IA podem conter erros. Uma pessoa deve revisar o gabarito antes de usar ou distribuir a atividade.

## Próximos passos para crescer

1. Adicionar limite de uso por pessoa e proteção contra robôs antes de divulgar o endereço publicamente; uma API aberta pode ser usada por outras pessoas e consumir os créditos da conta. Configure também alertas e um limite de gastos no projeto da OpenAI, e peça a um adulto para acompanhar o uso.
2. Se quiser salvar atividades, criar login com Supabase Auth e uma tabela no Supabase com regras RLS. A função do servidor deve verificar a identidade antes de salvar ou ler dados. Nunca coloque uma chave `service_role` no navegador.
3. Antes de abrir para uso de crianças, peça a um adulto para revisar as orientações atuais da OpenAI para serviços usados por menores e adicionar aviso adequado à idade, filtros de conteúdo e um jeito de reportar problemas.
4. Melhorar a revisão de conteúdo e oferecer uma forma de reportar perguntas incorretas.

## Arquivos

- `index.html`: conteúdo da página.
- `css/styles.css`: aparência e impressão.
- `js/app.js`: formulário, chamada da API, cópia e interface.
- `api/generate.js`: validação e chamada segura à OpenAI.
- `.env.example`: nomes das configurações necessárias, sem segredos.
