INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Investigar 10 ferramentas para otimizar a comunicação remota',
    10,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Criar infraestrutura híbrida de trabalho'),
    (SELECT id FROM team WHERE name='Company Inc.'),
    (SELECT id FROM "user" WHERE name='Jéssica Nazário')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Investigar 10 ferramentas para otimizar a comunicação remota'
  );


INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Investigar espaços de coworking',
    42,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Criar infraestrutura híbrida de trabalho'),
    (SELECT id FROM team WHERE name='Company Inc.'),
    (SELECT id FROM "user" WHERE name='Jéssica Nazário')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Investigar espaços de coworking'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Pesquisar protocolos de segurança',
    100,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Criar infraestrutura híbrida de trabalho'),
    (SELECT id FROM team WHERE name='Company Inc.'),
    (SELECT id FROM "user" WHERE name='Levi Paulos')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title=''
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Criar estrutura interna',
    100,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Desenhar a nova área de projetos'),
    (SELECT id FROM team WHERE name='Company Inc.'),
    (SELECT id FROM "user" WHERE name='Jéssica Nazário')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Criar estrutura interna'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Desenhar novos cargos e funções',
    100,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Desenhar a nova área de projetos'),
    (SELECT id FROM team WHERE name='Company Inc.'),
    (SELECT id FROM "user" WHERE name='Levi Paulos')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Desenhar novos cargos e funções'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Implementar MVP até dia 16/3',
    100,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Desenhar a nova área de projetos'),
    (SELECT id FROM team WHERE name='Company Inc.'),
    (SELECT id FROM "user" WHERE name='Márcia Tabanez')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Implementar MVP até dia 16/3'
  );


INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Oferecer 1 novo benefício',
    1,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Melhorar a experiência dos colaboradores'),
    (SELECT id FROM team WHERE name='Recursos Humanos'),
    (SELECT id FROM "user" WHERE name='Dante Barreiros')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Oferecer 1 novo benefício'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Aumentar o eNPS em 20%',
    20,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Melhorar a experiência dos colaboradores'),
    (SELECT id FROM team WHERE name='Recursos Humanos'),
    (SELECT id FROM "user" WHERE name='Levi Paulos')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Aumentar o eNPS em 20%'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Investigar causas de turnover a partir de 10 entrevistas',
    10,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Melhorar a experiência dos colaboradores'),
    (SELECT id FROM team WHERE name='Recursos Humanos'),
    (SELECT id FROM "user" WHERE name='Levi Paulos')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Investigar causas de turnover a partir de 10 entrevistas'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Implementar 4 palestras mensais',
    4,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Qualificar equipe interna'),
    (SELECT id FROM team WHERE name='Recursos Humanos'),
    (SELECT id FROM "user" WHERE name='Dayra Caparica')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Implementar 4 palestras mensais'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Validar benefício de desconto em cursos',
    100,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Qualificar equipe interna'),
    (SELECT id FROM team WHERE name='Recursos Humanos'),
    (SELECT id FROM "user" WHERE name='Dante Barreiros')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Validar benefício de desconto em cursos'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Criar um banco de conhecimento colaborativo',
    100,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Qualificar equipe interna'),
    (SELECT id FROM team WHERE name='Recursos Humanos'),
    (SELECT id FROM "user" WHERE name='Emílio Nóbrega')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Criar um banco de conhecimento colaborativo'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Executar benchmarking com 10 empresas',
    10,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Remodelar o processo de contratação'),
    (SELECT id FROM team WHERE name='Recursos Humanos'),
    (SELECT id FROM "user" WHERE name='Isis Matos')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Executar benchmarking com 10 empresas'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Entrevistar 5 líderes',
    5,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Remodelar o processo de contratação'),
    (SELECT id FROM team WHERE name='Recursos Humanos'),
    (SELECT id FROM "user" WHERE name='Isis Matos')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Entrevistar 5 líderes'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Construir um documento de cargos e funções',
    100,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Remodelar o processo de contratação'),
    (SELECT id FROM team WHERE name='Recursos Humanos'),
    (SELECT id FROM "user" WHERE name='Isis Matos')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Construir um documento de cargos e funções'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Investigar 100% dos times com novos talentos',
    100,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Expandir os times com novos talentos'),
    (SELECT id FROM team WHERE name='Contratação'),
    (SELECT id FROM "user" WHERE name='Davi Caetano')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Investigar 100% dos times com novos talentos'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Mapear a jornada atual e encontrar oportunidades',
    100,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Melhorar a eficiência do processo de contratação'),
    (SELECT id FROM team WHERE name='Contratação'),
    (SELECT id FROM "user" WHERE name='Davi Caetano')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Mapear a jornada atual e encontrar oportunidades'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Investir em um novo treinamento para os recrutadores',
    100,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Melhorar a eficiência do processo de contratação'),
    (SELECT id FROM team WHERE name='Contratação'),
    (SELECT id FROM "user" WHERE name='Davi Caetano')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Investir em um novo treinamento para os recrutadores'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Alinhar 100% do time com as boas práticas do LinkedIn',
    100,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Melhorar a eficiência do processo de contratação'),
    (SELECT id FROM team WHERE name='Contratação'),
    (SELECT id FROM "user" WHERE name='Vivian Portela')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Alinhar 100% do time com as boas práticas do LinkedIn'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Aumentar o banco de currículos em 40%',
    40,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Expandir os times com novos talentos'),
    (SELECT id FROM team WHERE name='Contratação'),
    (SELECT id FROM "user" WHERE name='Vivian Portela')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Aumentar o banco de currículos em 40%'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Cadastrar 10 colaboradores com interesse em prestar mentoria',
    10,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Validar o processo de mentoria interna'),
    (SELECT id FROM team WHERE name='Treinamento e Desenvolvimento'),
    (SELECT id FROM "user" WHERE name='Emílio Nóbrega')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Cadastrar 10 colaboradores com interesse em prestar mentoria'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Criar blueprint da jornada',
    100,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Validar o processo de mentoria interna'),
    (SELECT id FROM team WHERE name='Treinamento e Desenvolvimento'),
    (SELECT id FROM "user" WHERE name='Emílio Nóbrega')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Criar blueprint da jornada'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Aumentar a clareza com relação aos valores em 20%',
    20,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Implementar os novos valores da empresa'),
    (SELECT id FROM team WHERE name='Treinamento e Desenvolvimento'),
    (SELECT id FROM "user" WHERE name='Emílio Nóbrega')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Aumentar a clareza com relação aos valores em 20%'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Realizar evento para apresentação',
    1,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Implementar os novos valores da empresa'),
    (SELECT id FROM team WHERE name='Treinamento e Desenvolvimento'),
    (SELECT id FROM "user" WHERE name='Iago Angelim')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Realizar evento para apresentação'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Atualizar todos os materiais internos com os valores',
    100,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Implementar os novos valores da empresa'),
    (SELECT id FROM team WHERE name='Treinamento e Desenvolvimento'),
    (SELECT id FROM "user" WHERE name='Iago Angelim')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Atualizar todos os materiais internos com os valores'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Testar o processo com 1 funcionário júnior',
    1,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Validar o processo de mentoria interna'),
    (SELECT id FROM team WHERE name='Treinamento e Desenvolvimento'),
    (SELECT id FROM "user" WHERE name='Iago Angelim')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Testar o processo com 1 funcionário júnior'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Benchmark de salários para os cargos atuais em 10 empresas',
    10,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Atualizar cargos e salários'),
    (SELECT id FROM team WHERE name='Remuneração e Benefícios'),
    (SELECT id FROM "user" WHERE name='Domingos Lamenha')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Benchmark de salários para os cargos atuais em 10 empresas'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Estabelecer remuneração dos 10 futuros cargos',
    10,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Atualizar cargos e salários'),
    (SELECT id FROM team WHERE name='Remuneração e Benefícios'),
    (SELECT id FROM "user" WHERE name='Domingos Lamenha')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Estabelecer remuneração dos 10 futuros cargos'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Investigar 20 novas possibilidades de parceiros para descontos',
    20,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Iniciar um novo programa de parceria'),
    (SELECT id FROM team WHERE name='Remuneração e Benefícios'),
    (SELECT id FROM "user" WHERE name='Maximiano Cortês')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Investigar 20 novas possibilidades de parceiros para descontos'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Realizar pesquisa interna com todos os líderes para avaliar o fit dos selecionados',
    100,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Iniciar um novo programa de parceria'),
    (SELECT id FROM team WHERE name='Remuneração e Benefícios'),
    (SELECT id FROM "user" WHERE name='Maximiano Cortês')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Realizar pesquisa interna com todos os líderes para avaliar o fit dos selecionados'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Exporar 3 indicadores de sucesso',
    3,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Melhorar a satisfação do cliente'),
    (SELECT id FROM team WHERE name='Vendas'),
    (SELECT id FROM "user" WHERE name='Anthony Veríssimo')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Exporar 3 indicadores de sucesso'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Evoluir NPS de 60 para 80',
    80,
    60,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Melhorar a satisfação do cliente'),
    (SELECT id FROM team WHERE name='Vendas'),
    (SELECT id FROM "user" WHERE name='Nara Fraga')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Evoluir NPS de 60 para 80'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Implementar treinamento de atendimento em 100% do time',
    100,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Melhorar a satisfação do cliente'),
    (SELECT id FROM team WHERE name='Vendas'),
    (SELECT id FROM "user" WHERE name='Branca Maciel')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Implementar treinamento de atendimento em 100% do time'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Aumentar portfólio de produtos em 20%',
    20,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Crescer a receita da empresa'),
    (SELECT id FROM team WHERE name='Vendas'),
    (SELECT id FROM "user" WHERE name='Júnior Camilo')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Aumentar portfólio de produtos em 20%'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Contratar 2 novos vendedores para complementar o time',
    2,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Crescer a receita da empresa'),
    (SELECT id FROM team WHERE name='Vendas'),
    (SELECT id FROM "user" WHERE name='Branca Maciel')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Contratar 2 novos vendedores para complementar o time'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Aumentar as vendas em 40% do nosso melhor produto',
    40,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Crescer a receita da empresa'),
    (SELECT id FROM team WHERE name='Vendas'),
    (SELECT id FROM "user" WHERE name='Júnior Camilo')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Aumentar as vendas em 40% do nosso melhor produto'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Encontrar 10 novos clientes internacionais',
    10,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Internacionalizar clientes'),
    (SELECT id FROM team WHERE name='Prospecção'),
    (SELECT id FROM "user" WHERE name='Letizia Martinho')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Encontrar 10 novos clientes internacionais'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Criar plnao de prospecção ativa internacional',
    100,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Internacionalizar clientes'),
    (SELECT id FROM team WHERE name='Prospecção'),
    (SELECT id FROM "user" WHERE name='Letizia Martinho')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Criar plnao de prospecção ativa internacional'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Criar 3 novas abordagens para teste',
    3,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Aumentar a taxa de conversão pelo LinkedIn'),
    (SELECT id FROM team WHERE name='Prospecção'),
    (SELECT id FROM "user" WHERE name='Letizia Martinho')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Criar 3 novas abordagens para teste'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Instigar 20 boas práticas para o time',
    20,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Aumentar a taxa de conversão pelo LinkedIn'),
    (SELECT id FROM team WHERE name='Prospecção'),
    (SELECT id FROM "user" WHERE name='Nuna Mainha')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Instigar 20 boas práticas para o time'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Realizar um treinamento de vendas para a equope',
    1,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Aumentar a taxa de conversão pelo LinkedIn'),
    (SELECT id FROM team WHERE name='Prospecção'),
    (SELECT id FROM "user" WHERE name='Nuna Mainha')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Realizar um treinamento de vendas para a equope'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Mapear 10 parceiros internacionais para aumentar o networking',
    10,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Internacionalizar clientes'),
    (SELECT id FROM team WHERE name='Prospecção'),
    (SELECT id FROM "user" WHERE name='Nuna Mainha')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Mapear 10 parceiros internacionais para aumentar o networking'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Estudar 3 fatores decisivos de recompra',
    3,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Aumentar a recorrência de clientes'),
    (SELECT id FROM team WHERE name='Customer Success'),
    (SELECT id FROM "user" WHERE name='Lev Caetano')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Estudar 3 fatores decisivos de recompra'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Estruturar um modelo de proposta para recompra',
    100,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Aumentar a recorrência de clientes'),
    (SELECT id FROM team WHERE name='Customer Success'),
    (SELECT id FROM "user" WHERE name='Lev Caetano')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Estruturar um modelo de proposta para recompra'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Fechar 6 novos contratos com clientes atuais',
    6,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Aumentar a recorrência de clientes'),
    (SELECT id FROM team WHERE name='Customer Success'),
    (SELECT id FROM "user" WHERE name='Suzana Marinho')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Fechar 6 novos contratos com clientes atuais'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Criar 3 manuais do time para futuros onboardings e consulta',
    3,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Escalar processos internos'),
    (SELECT id FROM team WHERE name='Growth'),
    (SELECT id FROM "user" WHERE name='Marcelino Guedelha')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Criar 3 manuais do time para futuros onboardings e consulta'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Padronizar 100% dos pitches',
    100,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Escalar processos internos'),
    (SELECT id FROM team WHERE name='Growth'),
    (SELECT id FROM "user" WHERE name='Marcelino Guedelha')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Padronizar 100% dos pitches'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Fechar 5 projetos com prospecção ativa',
    5,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Fortalecer a imagem com novos clientes'),
    (SELECT id FROM team WHERE name='Growth'),
    (SELECT id FROM "user" WHERE name='Marcelino Guedelha')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Fechar 5 projetos com prospecção ativa'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Gerar 100 novos MQLs',
    100,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Fortalecer a imagem com novos clientes'),
    (SELECT id FROM team WHERE name='Growth'),
    (SELECT id FROM "user" WHERE name='Nazar Cedro')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Gerar 100 novos MQLs'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Definir 2 novas ferramentas para acompanhamento de leads',
    100,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Escalar processos internos'),
    (SELECT id FROM team WHERE name='Growth'),
    (SELECT id FROM "user" WHERE name='Nazar Cedro')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Definir 2 novas ferramentas para acompanhamento de leads'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Investigar 3 fatores que causam retrabalho',
    3,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Melhorar os processos internos do time'),
    (SELECT id FROM team WHERE name='Financeiro'),
    (SELECT id FROM "user" WHERE name='Arina Carneiro')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Investigar 3 fatores que causam retrabalho'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Buscar 10 novas ferramentas para otimizar o dia-a-dia',
    10,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Melhorar os processos internos do time'),
    (SELECT id FROM team WHERE name='Financeiro'),
    (SELECT id FROM "user" WHERE name='Arina Carneiro')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Buscar 10 novas ferramentas para otimizar o dia-a-dia'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Documentar 100% dos processos internos no Drive',
    100,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Melhorar os processos internos do time'),
    (SELECT id FROM team WHERE name='Financeiro'),
    (SELECT id FROM "user" WHERE name='Matthias Cisneiros')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Documentar 100% dos processos internos no Drive'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Estruturar relatórios de precificação',
    100,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Esclarecer processos de precificação'),
    (SELECT id FROM team WHERE name='Financeiro'),
    (SELECT id FROM "user" WHERE name='Arina Carneiro')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Estruturar relatórios de precificação'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Encontrar 20 novos fornecedores',
    20,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Esclarecer processos de precificação'),
    (SELECT id FROM team WHERE name='Financeiro'),
    (SELECT id FROM "user" WHERE name='Matthias Cisneiros')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Encontrar 20 novos fornecedores'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Implementar ferramenta com 100% do time',
    100,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Esclarecer processos de precificação'),
    (SELECT id FROM team WHERE name='Financeiro'),
    (SELECT id FROM "user" WHERE name='Liane Xisto')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Implementar ferramenta com 100% do time'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Desenhar um dashboard de acompanhamento para o time',
    100,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Estruturar plano para internacionalização'),
    (SELECT id FROM team WHERE name='Gestão de Compras'),
    (SELECT id FROM "user" WHERE name='Eliézer Mieiro')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Desenhar um dashboard de acompanhamento para o time'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Disponibilizar proposta de budget para líderes',
    100,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Estruturar plano para internacionalização'),
    (SELECT id FROM team WHERE name='Gestão de Compras'),
    (SELECT id FROM "user" WHERE name='Giovani Prado')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Disponibilizar proposta de budget para líderes'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Inserir 2 novas ferramentas que substituam os processos manuais',
    2,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Otimizar os processos internos'),
    (SELECT id FROM team WHERE name='Contabilidade'),
    (SELECT id FROM "user" WHERE name='Gisela Quina')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Inserir 2 novas ferramentas que substituam os processos manuais'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Disponibilizar 2h/dia para planejamento e organização de processos',
    100,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Otimizar os processos internos'),
    (SELECT id FROM team WHERE name='Contabilidade'),
    (SELECT id FROM "user" WHERE name='Gisela Quina')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Disponibilizar 2h/dia para planejamento e organização de processos'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Estudar 2 novas fontes de recursos mais baratas que atuais',
    2,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Encontrar novas fontes de renda'),
    (SELECT id FROM team WHERE name='Contabilidade'),
    (SELECT id FROM "user" WHERE name='Gustavo Manso')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Estudar 2 novas fontes de recursos mais baratas que atuais'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Prospectar 3 novos parceiros para descontos',
    3,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Encontrar novas fontes de renda'),
    (SELECT id FROM team WHERE name='Contabilidade'),
    (SELECT id FROM "user" WHERE name='Gustavo Manso')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Prospectar 3 novos parceiros para descontos'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Aumentar nossos seguidores em 50%',
    50,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Engajar mais pessoas em nossas redes sociais'),
    (SELECT id FROM team WHERE name='Marketing'),
    (SELECT id FROM "user" WHERE name='Luís Valadão')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Aumentar nossos seguidores em 50%'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Participar de 5 eventos expressivos',
    5,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Engajar mais pessoas em nossas redes sociais'),
    (SELECT id FROM team WHERE name='Marketing'),
    (SELECT id FROM "user" WHERE name='Luís Valadão')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Participar de 5 eventos expressivos'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Mapear 10 influenciadores para parcerias',
    10,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Engajar mais pessoas em nossas redes sociais'),
    (SELECT id FROM team WHERE name='Marketing'),
    (SELECT id FROM "user" WHERE name='Márcia Tabanez')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Mapear 10 influenciadores para parcerias'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Aquisição de 10 novos equipamentos',
    10,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Fortalecer equipe de Design'),
    (SELECT id FROM team WHERE name='Marketing'),
    (SELECT id FROM "user" WHERE name='Márcia Tabanez')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Aquisição de 10 novos equipamentos'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Contratação de 2 profissionais sêniors',
    2,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Fortalecer equipe de Design'),
    (SELECT id FROM team WHERE name='Marketing'),
    (SELECT id FROM "user" WHERE name='Shayan Carvalhoso')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Contratação de 2 profissionais sêniors'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Implementar mentorias com todo time',
    100,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Fortalecer equipe de Design'),
    (SELECT id FROM team WHERE name='Marketing'),
    (SELECT id FROM "user" WHERE name='Shayan Carvalhoso')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Implementar mentorias com todo time'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Mapear 5 possibilidades de especialização para o time',
    5,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Iniciar processo de especialização'),
    (SELECT id FROM team WHERE name='Design'),
    (SELECT id FROM "user" WHERE name='Lui Porto')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Mapear 5 possibilidades de especialização para o time'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Realizar um planejamento de carreira por especialização',
    100,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Iniciar processo de especialização'),
    (SELECT id FROM team WHERE name='Design'),
    (SELECT id FROM "user" WHERE name='Lui Porto')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Realizar um planejamento de carreira por especialização'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Palestrar em 5 eventos de design',
    5,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Impulsionar time na comunidade'),
    (SELECT id FROM team WHERE name='Design'),
    (SELECT id FROM "user" WHERE name='Núria Castanho')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Palestrar em 5 eventos de design'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Lançar ebook de design',
    100,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Impulsionar time na comunidade'),
    (SELECT id FROM team WHERE name='Design'),
    (SELECT id FROM "user" WHERE name='Núria Castanho')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Lançar ebook de design'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Realizar 2 webinars',
    2,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Impulsionar time na comunidade'),
    (SELECT id FROM team WHERE name='Design'),
    (SELECT id FROM "user" WHERE name='Núria Castanho')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Realizar 2 webinars'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Lançar ebook de design',
    100,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Impulsionar time na comunidade'),
    (SELECT id FROM team WHERE name='Design'),
    (SELECT id FROM "user" WHERE name='Núria Castanho')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Lançar ebook de design'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Realizar 10 entrevistas com o público',
    10,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Se tornar próximo do público'),
    (SELECT id FROM team WHERE name='Conteúdo'),
    (SELECT id FROM "user" WHERE name='Rania Travassos')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Realizar 10 entrevistas com o público'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Realizar 20 testes A/B de conteúdos',
    20,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Se tornar próximo do público'),
    (SELECT id FROM team WHERE name='Conteúdo'),
    (SELECT id FROM "user" WHERE name='Rania Travassos')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Realizar 20 testes A/B de conteúdos'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Criar repositório colaborativo de temas',
    100,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Se tornar próximo do público'),
    (SELECT id FROM team WHERE name='Conteúdo'),
    (SELECT id FROM "user" WHERE name='Rania Travassos')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Criar repositório colaborativo de temas'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Estudar e mapear o branding atual',
    100,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Unificar o tom de voz'),
    (SELECT id FROM team WHERE name='Conteúdo'),
    (SELECT id FROM "user" WHERE name='Raúl Frade')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Estudar e mapear o branding atual'
  );

INSERT INTO
  key_result(
    title,
    goal,
    initial_value,
    description,
    format,
    objective_id,
    team_id,
    owner_id
  )
  SELECT
    'Criar um manual prático de tom de voz da marca',
    100,
    0,
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel quam a urna porta euismod sed vitae velit. Nulla eget molestie diam. Nam augue purus, dapibus ac accumsan id, commodo non neque. Sed consectetur ante in est viverra, vitae sollicitudin nulla faucibus. Mauris egestas bibendum neque non consectetur. Praesent id purus nunc. Integer interdum ante in lacus viverra accumsan. ',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Unificar o tom de voz'),
    (SELECT id FROM team WHERE name='Conteúdo'),
    (SELECT id FROM "user" WHERE name='Raúl Frade')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Criar um manual prático de tom de voz da marca'
  );
