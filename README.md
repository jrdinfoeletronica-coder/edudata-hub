# EduData Hub

Crie um SISTEMA MODULAR DE GESTÃO DE DADOS DA EDUCAÇÃO.

O sistema deverá ser desenvolvido de forma escalável, modular e preparada para receber diversas planilhas e bases de dados diferentes ao longo do projeto.

A primeira planilha fornecida pelo usuário será utilizada para criar o módulo:

"PROFISSIONAIS DA EDUCAÇÃO"

PORÉM, NÃO considerar essa planilha como a estrutura definitiva de todo o sistema.

O sistema deverá possuir uma arquitetura que permita adicionar posteriormente novos módulos baseados em outras planilhas, sem precisar reconstruir o sistema.

==================================================

CONCEITO DO SISTEMA
==================================================

O sistema será uma plataforma centralizada para cadastro, gerenciamento, consulta, validação, importação, exportação e impressão de informações relacionadas à Educação.

Cada nova planilha fornecida posteriormente poderá originar:

Um novo módulo.

Uma nova entidade.

Uma nova tabela.

Uma nova relação entre dados.

Novos relatórios.

Novos modelos de impressão.

Novos modelos de importação/exportação.

Os módulos deverão compartilhar dados quando houver relacionamento entre eles.

Exemplo:

PROFISSIONAIS
↓
ESCOLAS
↓
TURMAS
↓
ALUNOS
↓
MATRÍCULAS

Não criar estruturas isoladas quando os dados puderem ser relacionados.

==================================================
2. ARQUITETURA MODULAR

Criar o sistema utilizando módulos independentes.

Estrutura inicial:

DASHBOARD

CADASTROS

├── Profissionais da Educação
├── Instituições de Ensino
└── Cadastros auxiliares

GESTÃO

├── Profissionais
├── Lotação
└── Vínculos

IMPORTAÇÃO

├── Importar planilha
└── Histórico de importações

EXPORTAÇÃO

├── Exportar dados
└── Modelos de exportação

RELATÓRIOS

IMPRESSÕES

USUÁRIOS

AUDITORIA

CONFIGURAÇÕES

Novos módulos deverão poder ser adicionados posteriormente.

==================================================
3. REGRA PARA NOVAS PLANILHAS

Sempre que o usuário fornecer uma nova planilha, o sistema deverá tratá-la como uma possível nova fonte de dados.

Antes de criar o módulo correspondente, analisar:

Nome da planilha.

Abas existentes.

Quantidade de colunas.

Nome das colunas.

Descrições.

Códigos.

Tipos de dados.

Campos obrigatórios.

Chaves.

Identificadores.

Relacionamentos.

Duplicidades.

Regras de preenchimento.

Estrutura de impressão.

Estrutura de exportação.

Não assumir que todas as planilhas terão a mesma estrutura.

==================================================
4. IDENTIFICAÇÃO DE CAMPOS

Cada campo deverá possuir internamente:

ID

Nome técnico

Nome amigável

Descrição

Tipo de dado

Obrigatório

Código

Regra de validação

Módulo

Origem

Ordem de apresentação

Quando a planilha possuir um nome técnico oficial, preservá-lo.

Nunca substituir um nome técnico oficial por outro.

==================================================
5. MODELO DE DADOS

Utilizar banco de dados relacional.

Criar entidades independentes e relacionáveis.

Não criar uma única tabela gigante contendo todos os campos de todas as futuras planilhas.

Criar tabelas específicas por entidade.

Exemplo:

professionals
schools
students
classes
enrollments
courses
employees
documents
contracts
etc.

As novas entidades deverão ser adicionadas conforme as futuras planilhas forem analisadas.

==================================================
6. RELACIONAMENTOS

O sistema deverá permitir relacionar informações.

Exemplo:

PROFISSIONAL

CPF
Matrícula
Nome
Função

pode estar relacionado a:

INSTITUIÇÃO

Código INEP
Nome
Município

Por meio de:

LOTAÇÃO

Isso permitirá consultar posteriormente:

"Quais profissionais trabalham nesta escola?"

"Em quais escolas este profissional está lotado?"

"Quantos profissionais existem por escola?"

==================================================
7. PRIMEIRO MÓDULO — PROFISSIONAIS

A primeira planilha enviada pelo usuário deverá gerar o módulo:

"PROFISSIONAIS DA EDUCAÇÃO"

Ela contém 39 campos.

Esses 39 campos devem ser preservados exatamente conforme a planilha original.

Não alterar:

Nome técnico.

Ordem.

Descrição.

Grupo.

Código.

Os campos deverão ser armazenados de forma estruturada.

==================================================
8. IMPRESSÃO

Cada módulo poderá possuir seu próprio modelo de impressão.

A impressão não deverá ser global e genérica.

Cada planilha poderá possuir um modelo diferente.

Para o módulo de Profissionais da Educação:

Criar:

"Imprimir ficha do profissional"

A ficha deverá reproduzir fielmente a estrutura da planilha correspondente.

Quando novas planilhas forem adicionadas, poderão possuir modelos de impressão diferentes.

==================================================
9. EXPORTAÇÃO

Cada módulo deverá possuir seu próprio modelo de exportação.

Exemplo:

Exportar Profissionais

Exportar Escolas

Exportar Alunos

Exportar Turmas

etc.

A exportação deverá preservar a estrutura da planilha de origem quando esse for o requisito.

==================================================
10. IMPORTAÇÃO

Criar um mecanismo de importação modular.

O administrador deverá poder:

Selecionar módulo.

Selecionar planilha.

O sistema identificar as colunas.

Comparar com o modelo esperado.

Validar os campos.

Identificar registros duplicados.

Identificar campos inválidos.

Mostrar prévia.

Informar erros.

Confirmar importação.

Registrar cada importação no histórico.

Criar:

IMPORT_HISTORY

com:

ID

Usuário

Data

Hora

Arquivo

Módulo

Quantidade de registros

Registros importados

Registros rejeitados

Status

Log de erros

==================================================
11. MODELOS DE PLANILHA

Criar conceito de:

"MODELO DE DADOS"

Cada planilha poderá possuir seu próprio modelo.

Exemplo:

Modelo 001
PROFISSIONAIS DA EDUCAÇÃO

Modelo 002
ESCOLAS

Modelo 003
ALUNOS

Modelo 004
TURMAS

etc.

Cada modelo deverá definir:

Campos.

Ordem.

Tipos.

Descrições.

Validações.

Regras.

Importação.

Exportação.

Impressão.

==================================================
12. VERSIONAMENTO

O sistema deverá ser preparado para alterações futuras nas planilhas.

Se uma nova versão da planilha for enviada:

Exemplo:

PROFISSIONAIS_V1

posteriormente:

PROFISSIONAIS_V2

não apagar a estrutura anterior automaticamente.

Criar controle de versão do modelo.

Registrar:

Versão.

Data.

Usuário responsável.

Alterações.

Campos adicionados.

Campos removidos.

Campos modificados.

Antes de aplicar uma nova versão, mostrar as diferenças.

==================================================
13. ADMINISTRADOR

O administrador deverá possuir uma área:

"GERENCIADOR DE MODELOS"

Nessa área poderá visualizar:

Módulos.

Planilhas.

Campos.

Versões.

Regras.

Importações.

Exportações.

Posteriormente, deverá ser possível cadastrar novos modelos sem reconstruir o sistema inteiro.

==================================================
14. DASHBOARD GERAL

O dashboard deverá ser preparado para receber informações de todos os módulos.

Exibir cards como:

Total de profissionais.

Total de escolas.

Total de alunos.

Total de turmas.

Total de vínculos.

Total de registros.

Últimas importações.

Últimas alterações.

Os indicadores deverão aparecer conforme os módulos forem adicionados.

==================================================
15. BUSCA GLOBAL

Criar mecanismo de pesquisa global.

O administrador poderá pesquisar:

Nome
CPF
Matrícula
Código INEP
Aluno
Escola
Profissional
Turma
etc.

O sistema deverá retornar resultados agrupados por módulo.

==================================================
16. AUDITORIA

Todas as alterações importantes deverão ser registradas.

Registrar:

Usuário.

Data.

Hora.

Módulo.

Registro.

Operação.

Valor anterior.

Novo valor.

Não permitir apagar registros de auditoria por usuários comuns.

==================================================
17. SEGURANÇA

Implementar:

Login.

Perfis.

Permissões.

Controle de acesso por módulo.

Controle de acesso por operação.

Auditoria.

Proteção de dados.

Segurança de arquivos.

Preparar o sistema para LGPD.

==================================================
18. MCP

O MCP deverá ser construído de maneira modular.

As ferramentas MCP deverão identificar o módulo ao qual pertencem.

Exemplo:

PROFISSIONAIS

consultar_profissional

listar_profissionais

buscar_profissional

criar_profissional

atualizar_profissional

ESCOLAS

consultar_escola

listar_escolas

criar_escola

ALUNOS

consultar_aluno

listar_alunos

etc.

Quando novos módulos forem adicionados, poderão receber suas próprias ferramentas MCP.

==================================================
19. REGRA FUNDAMENTAL

NÃO construir um sistema limitado à primeira planilha.

Construir uma PLATAFORMA.

A planilha de profissionais é apenas o PRIMEIRO MÓDULO.

Novas planilhas serão fornecidas posteriormente pelo usuário e deverão ser incorporadas ao sistema sem necessidade de reconstrução da aplicação.

Cada nova planilha deverá ser analisada individualmente.

Preservar:

Campos.

Códigos.

Descrições.

Ordem.

Regras.

Relacionamentos.

Estrutura de impressão.

Estrutura de exportação.

O sistema deverá evoluir de forma incremental.

==================================================
20. PRIORIDADE DE IMPLEMENTAÇÃO

FASE 1

Criar arquitetura principal.

FASE 2

Criar autenticação e usuários.

FASE 3

Criar gerenciamento de módulos/modelos.

FASE 4

Implementar módulo:

PROFISSIONAIS DA EDUCAÇÃO

utilizando a planilha fornecida como modelo oficial.

FASE 5

Criar importação e exportação.

FASE 6

Criar impressão fiel ao modelo.

FASE 7

Preparar estrutura para receber as próximas planilhas.

NÃO criar módulos futuros fictícios neste momento.

Deixar a arquitetura preparada para recebê-los.

Quando o usuário fornecer uma nova planilha, analisar sua estrutura e criar o módulo correspondente sem comprometer os módulos existentes.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ed969028-b999-4a7a-a870-fbc9fe90463f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
