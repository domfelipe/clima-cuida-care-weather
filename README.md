# Clima Cuida

App web estático, feito com Vite, React e TypeScript, para transformar dados de clima e qualidade do ar em uma recomendação simples do dia. A primeira tela já é o produto: busca de cidade, geolocalização opcional, seletor de perfil e um "Semáforo do Dia" com recomendações práticas.

## Dor que resolve

Dados meteorológicos normalmente chegam separados: temperatura em um lugar, chuva em outro, UV em outro e qualidade do ar em outro. Para uma pessoa comum, isso dificulta decidir se vale sair, levar criança ou idoso para a rua, fazer exercício, dirigir, fechar janelas ou se proteger do sol e da chuva.

O Clima Cuida reúne esses fatores em uma leitura acionável, com score local de risco de 0 a 100 e explicação em linguagem simples.

## APIs usadas

- Open-Meteo Weather Forecast API: clima atual, próximas horas e previsão diária.
- Open-Meteo Air Quality API: AQI dos EUA, PM2.5, PM10 e UV.
- Open-Meteo Geocoding API: busca de cidades por nome.

Não há chaves privadas, backend próprio, banco de dados ou coleta de conta de usuário. A geolocalização acontece somente no navegador e é usada apenas para chamar as APIs públicas.

## Como rodar localmente

```bash
npm install
npm run dev
```

Para validar antes de publicar:

```bash
npm test
npm run build
```

## Como publicar no GitHub Pages

O projeto está configurado para o repositório `clima-cuida-care-weather` em `vite.config.ts`:

```ts
base: command === 'build' ? '/clima-cuida-care-weather/' : '/'
```

Fluxo manual:

1. Rode `npm run build`.
2. Publique a pasta `dist/` no GitHub Pages.
3. Se o repositório tiver outro nome, ajuste o `base` em `vite.config.ts`.

Fluxo automático:

1. Envie este projeto para o GitHub.
2. Em Settings -> Pages, selecione GitHub Actions.
3. Faça push na branch `main`; o workflow `.github/workflows/deploy.yml` gera o build e publica o artefato.

## Como demonstrar em aula

1. Mostre a arquitetura em `src/api`, `src/lib`, `src/components` e `src/data`.
2. Execute `npm test` para demonstrar o cálculo de risco com testes unitários.
3. Rode `npm run dev` e pesquise uma cidade real.
4. Troque perfis para mostrar como criança, idoso, rinite/asma e atividade física mudam o risco.
5. Desligue a internet ou bloqueie a API no DevTools para mostrar o fallback com dados de exemplo.
6. Rode `npm run build` para provar que o projeto é estático e compatível com GitHub Pages.

## Scripts

- `npm run dev`: servidor local Vite.
- `npm test`: testes unitários com Vitest.
- `npm run build`: typecheck e build de produção.
- `npm run preview`: prévia local do build.

## Aviso

Use como orientação geral, não como recomendação médica.
