# Planejamento

## Problema

As pessoas precisam tomar decisões rápidas sobre sair, trabalhar na rua, levar crianças ou idosos, fazer exercício e se proteger. A informação existe, mas fica fragmentada entre previsão do tempo, índice UV e qualidade do ar.

## Público-alvo

- Pessoas comuns que querem uma leitura objetiva antes de sair.
- Professores e alunos em aula de coding com APIs reais.
- Famílias com crianças, idosos ou pessoas com rinite/asma.
- Pessoas que praticam atividade física ao ar livre.

## Proposta de valor

O Clima Cuida resume clima e ar em um semáforo de risco, explica os fatores que pesaram e entrega ações práticas: levar guarda-chuva, beber água, evitar exercício intenso, usar protetor solar, fechar janelas ou ter atenção com grupos sensíveis.

## Escopo MVP

- Busca de cidade com Open-Meteo Geocoding.
- Geolocalização opcional do navegador.
- Dados atuais, próximas 12 horas e próximos 7 dias.
- Perfis de uso com impacto no score.
- Score de risco local de 0 a 100.
- Fallback com dados de exemplo quando a API falha.
- Preferências persistidas no `localStorage`.
- UI estática compatível com GitHub Pages.

## Critérios de sucesso

- `npm test` passa.
- `npm run build` passa.
- A primeira tela é o produto, não uma landing page.
- O app continua útil sem API.
- A decisão do dia fica clara em menos de 10 segundos.
- A geolocalização é opcional e não é armazenada fora do navegador.
