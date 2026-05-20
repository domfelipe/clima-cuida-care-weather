# Finalização

## Antes do commit

- [ ] `npm install` executado e `package-lock.json` versionado.
- [ ] `npm test` passando.
- [ ] `npm run build` passando.
- [ ] `README.md` revisado.
- [ ] Docs em `docs/` revisados.
- [ ] Nenhum arquivo de build em `dist/` no commit.
- [ ] Nenhum segredo, token ou chave privada no repositório.

## Antes do deploy

- [ ] Confirmar nome do repositório GitHub: `clima-cuida-care-weather`.
- [ ] Confirmar `base: '/clima-cuida-care-weather/'` em `vite.config.ts`.
- [ ] Ativar GitHub Pages por GitHub Actions.
- [ ] Fazer push na branch `main`.
- [ ] Abrir a URL pública e testar busca, perfis e fallback.

## Roteiro de apresentação

1. Abrir o app e explicar a dor em uma frase.
2. Pesquisar uma cidade real.
3. Mostrar o semáforo e a frase principal.
4. Trocar para perfil criança, idoso, rinite/asma e atividade física.
5. Abrir "Por que essa recomendação?" e explicar o score.
6. Mostrar `src/lib/riskScore.ts` e `src/lib/riskScore.test.ts`.
7. Rodar `npm test` e `npm run build`.
8. Mostrar o deploy no GitHub Pages.
