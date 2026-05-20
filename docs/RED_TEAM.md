# Red Team

## Riscos e mitigação

| Risco | Impacto | Mitigação |
| --- | --- | --- |
| Interpretação como recomendação médica | Usuário pode tomar decisão de saúde inadequada | Aviso visível: "Use como orientação geral, não como recomendação médica." |
| Falha ou lentidão da API | Tela vazia ou sensação de app quebrado | Fallback com dados de exemplo e banner claro |
| Geolocalização sensível | Preocupação de privacidade | Permissão opcional, sem envio para servidor próprio e sem persistir coordenadas fora do navegador |
| Dados de qualidade do ar com resolução regional | Leitura local pode não capturar microclimas | Texto explica fatores como orientação geral |
| Score simplificado demais | Pode ocultar nuances técnicas | Bloco "Por que essa recomendação?" mostra os fatores e valores usados |
| Uso para direção em clima severo | Decisão crítica exige fontes oficiais locais | Mensagens evitam prometer segurança absoluta |
| Abuso por coleta futura de dados | Perda de confiança | Não há backend, login, analytics ou banco de dados no MVP |

## Falhas de API esperadas

- Sem resultados na busca de cidade.
- Erro HTTP da API.
- Campo opcional ausente, como AQI.
- Navegador sem geolocalização.
- Usuário nega permissão de localização.

## Mitigações implementadas

- Tratamento de erro em `SearchBar`.
- Fallback em `App.tsx`.
- Normalização defensiva em `openMeteo.ts`.
- Testes unitários para cenários extremos do score.
