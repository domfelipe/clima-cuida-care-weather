# QA

## Checklist manual

- [ ] Abrir a primeira tela e confirmar que já é o dashboard do produto.
- [ ] Pesquisar uma cidade com acentos, como "São Paulo".
- [ ] Pesquisar uma cidade internacional, como "Lisboa".
- [ ] Selecionar cada perfil e confirmar que o semáforo pode mudar.
- [ ] Usar o botão de geolocalização e negar permissão.
- [ ] Usar o botão de geolocalização e aceitar permissão.
- [ ] Simular API offline e confirmar dados de exemplo com aviso claro.
- [ ] Rodar `npm test`.
- [ ] Rodar `npm run build`.

## Responsividade

- [ ] 360px: sem scroll horizontal, busca e perfis acessíveis.
- [ ] 390px a 430px: semáforo legível e timeline rolável.
- [ ] 600px a 820px: métricas em grid equilibrado.
- [ ] 1024px: dashboard com leitura confortável.
- [ ] 1366px e 1440px: layout denso, sem vazios excessivos.
- [ ] 1920px: conteúdo continua contido e escaneável.

## Acessibilidade

- [ ] Campos com labels.
- [ ] Botões com texto ou `aria-label`.
- [ ] Navegação por teclado na busca, botões e perfis.
- [ ] Contraste suficiente nos estados verde, amarelo, laranja e vermelho.
- [ ] `aria-live` para mensagens da busca.
- [ ] `role="alert"` para erro de API.

## Casos extremos

- [ ] UV acima de 8.
- [ ] PM2.5 acima de 55.
- [ ] AQI acima de 150.
- [ ] Chuva acima de 65% de probabilidade.
- [ ] Sensação térmica acima de 34°C.
- [ ] Rajadas acima de 48 km/h.
- [ ] AQI ausente.
