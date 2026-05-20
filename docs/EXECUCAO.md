# Execução

## Arquitetura

```text
src/
  api/openMeteo.ts       chamadas e normalização das APIs públicas
  components/           peças de interface do dashboard
  data/mock.ts          dados de fallback e perfis de uso
  lib/formatters.ts     datas, unidades e textos curtos
  lib/riskScore.ts      score local e recomendações
  lib/riskScore.test.ts testes unitários do score
  App.tsx               estado, preferências e composição da tela
```

## Fluxo de dados

1. O usuário busca uma cidade ou autoriza geolocalização.
2. `openMeteo.ts` chama Weather Forecast e Air Quality em paralelo.
3. Os dados são normalizados para `WeatherBundle`.
4. `riskScore.ts` calcula fatores de UV, chuva, sensação térmica, vento e poluição.
5. A UI mostra semáforo, métricas, recomendações, timeline e previsão.
6. Perfil e local escolhido ficam no `localStorage`.

## Decisões técnicas

- Vite + React + TypeScript para manter o projeto pequeno e didático.
- CSS próprio para evitar dependências de UI e facilitar explicação em aula.
- `lucide-react` apenas para ícones funcionais.
- `Vitest` para testes unitários do cálculo de risco.
- Sem backend, banco de dados, autenticação ou chaves privadas.
- Fallback local explícito quando a API não responde.

## Cálculo de risco

O score combina:

- UV alto.
- Chance e intensidade de chuva.
- Sensação térmica extrema.
- Vento e rajadas.
- PM2.5, PM10 e AQI dos EUA.
- Ajuste por perfil de uso.

O maior fator individual também pesa no resultado final para impedir que uma média esconda um risco grave, como poluição alta para quem tem rinite/asma.
