# Activity Generator

Aplicação web que cria atividades escolares com questões geradas por IA. O site é HTML, CSS e JavaScript; a função em `api/` chama o OpenRouter no servidor para manter a chave secreta fora do navegador.

## Como as partes conversam

```text
Navegador (HTML/CSS/JS) → /api/generate (Vercel) → OpenRouter → modelo de IA
```

Na primeira abertura, o site pede nome, e-mail e uma senha de pelo menos 8 caracteres. Por enquanto, nome e e-mail são guardados no `localStorage` do navegador para não repetir a tela nesse navegador. A senha é validada no formulário, mas não é salva nem autenticada. Isso é apenas um perfil local, não uma conta segura; para oferecer login real entre dispositivos, conecte um serviço de autenticação como Supabase Auth.

O Supabase ainda não é necessário para gerar atividades. O perfil e as últimas cinco atividades ficam no armazenamento local do navegador; não sincronizam entre dispositivos e podem ser apagados ao limpar os dados do navegador. Para contas reais e dados compartilhados entre dispositivos, conecte autenticação e armazenamento no servidor com regras de acesso.

## Rodar no seu computador

1. Instale uma versão LTS do Node.js.
2. Abra um terminal nesta pasta e rode `npm install`.
3. Copie `.env.example` para `.env.local`.
4. Peça a um adulto responsável para colocar a chave do OpenRouter em `OPENROUTER_API_KEY` dentro de `.env.local`. Não envie essa chave para ninguém e não a coloque em `js/app.js`.
5. Rode `npm run dev` e abra o endereço local mostrado no terminal, normalmente `http://localhost:3000`.

Sem a chave, a página abre, mas a geração com IA não funciona. Não publique `.env.local` nem tire a regra de `.env.*` do `.gitignore`.

## Publicar com GitHub e Vercel

1. Um adulto cria um repositório no GitHub e envia este projeto para ele.
2. Na Vercel, escolha **Add New → Project**, conecte o repositório e importe o projeto. Não é preciso escolher um framework.
3. Nas configurações do projeto Vercel, adicione `OPENROUTER_API_KEY` e `OPENROUTER_MODEL` como variáveis de ambiente. Use a chave guardada pelo adulto; não escreva o valor em arquivos do projeto.
4. Publique e teste o endereço fornecido pela Vercel. Cada novo envio ao GitHub pode gerar uma nova publicação.

## Configuração da IA

- `OPENROUTER_API_KEY`: segredo criado na conta OpenRouter do seu pai.
- `OPENROUTER_MODEL`: identificador do modelo no OpenRouter. O padrão é `openai/gpt-6-luna`; pode ser trocado pela variável de ambiente.
- A função valida os campos, limita o assunto a 500 caracteres, pede uma resposta estruturada e confere o formato antes de devolver as questões.
- A solicitação não pede nome, endereço ou outros dados pessoais. Mesmo assim, não digite informações pessoais no assunto.
- Questões criadas por IA podem conter erros. Uma pessoa deve revisar o gabarito antes de usar ou distribuir a atividade.

## Próximos passos para crescer

1. Adicionar limite de uso por pessoa e proteção contra robôs antes de divulgar o endereço publicamente; uma API aberta pode ser usada por outras pessoas e consumir os créditos da conta. Peça a um adulto para acompanhar o saldo e os gastos no OpenRouter.
2. Se quiser salvar atividades, criar login com Supabase Auth e uma tabela no Supabase com regras RLS. A função do servidor deve verificar a identidade antes de salvar ou ler dados. Nunca coloque uma chave `service_role` no navegador.
3. Antes de abrir para uso de crianças, peça a um adulto para revisar as orientações atuais da OpenAI para serviços usados por menores e adicionar aviso adequado à idade, filtros de conteúdo e um jeito de reportar problemas.
4. Melhorar a revisão de conteúdo e oferecer uma forma de reportar perguntas incorretas.

## Arquivos

- `index.html`: conteúdo da página.
- `css/styles.css`: aparência e impressão.
- `js/app.js`: formulário, chamada da API, cópia e interface.
- `api/generate.js`: validação e chamada segura ao OpenRouter.
- `.env.example`: nomes das configurações necessárias, sem segredos.
