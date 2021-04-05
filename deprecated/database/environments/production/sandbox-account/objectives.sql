INSERT INTO
  objective(
    title,
    cycle_id,
    owner_id
  )
  SELECT
    'Criar infraestrutura híbrida de trabalho',
    (SELECT id FROM cycle WHERE name='Q1 2021' AND team_id=(SELECT id FROM team WHERE name='Company Inc.')),
    (SELECT id FROM "user" WHERE name='Jéssica Nazário')
  WHERE NOT EXISTS (
    SELECT id FROM objective WHERE title='Criar infraestrutura híbrida de trabalho'
  );

INSERT INTO
  objective(
    title,
    cycle_id,
    owner_id
  )
  SELECT
    'Desenhar a nova área de projetos',
    (SELECT id FROM cycle WHERE name='Q1 2021' AND team_id=(SELECT id FROM team WHERE name='Company Inc.')),
    (SELECT id FROM "user" WHERE name='Jéssica Nazário')
  WHERE NOT EXISTS (
    SELECT id FROM objective WHERE title='Desenhar a nova área de projetos'
  );

INSERT INTO
  objective(
    title,
    cycle_id,
    owner_id
  )
  SELECT
    'Melhorar a experiência dos colaboradores',
    (SELECT id FROM cycle WHERE name='Q1 2021' AND team_id=(SELECT id FROM team WHERE name='Company Inc.')),
    (SELECT id FROM "user" WHERE name='Levi Paulos')
  WHERE NOT EXISTS (
    SELECT id FROM objective WHERE title='Melhorar a experiência dos colaboradores'
  );

INSERT INTO
  objective(
    title,
    cycle_id,
    owner_id
  )
  SELECT
    'Qualificar equipe interna',
    (SELECT id FROM cycle WHERE name='Q1 2021' AND team_id=(SELECT id FROM team WHERE name='Company Inc.')),
    (SELECT id FROM "user" WHERE name='Levi Paulos')
  WHERE NOT EXISTS (
    SELECT id FROM objective WHERE title='Qualificar equipe interna'
  );

INSERT INTO
  objective(
    title,
    cycle_id,
    owner_id
  )
  SELECT
    'Remodelar o processo de contratação',
    (SELECT id FROM cycle WHERE name='Q1 2021' AND team_id=(SELECT id FROM team WHERE name='Company Inc.')),
    (SELECT id FROM "user" WHERE name='Levi Paulos')
  WHERE NOT EXISTS (
    SELECT id FROM objective WHERE title='Remodelar o processo de contratação'
  );

INSERT INTO
  objective(
    title,
    cycle_id,
    owner_id
  )
  SELECT
    'Expandir os times com novos talentos',
    (SELECT id FROM cycle WHERE name='Q1 2021' AND team_id=(SELECT id FROM team WHERE name='Company Inc.')),
    (SELECT id FROM "user" WHERE name='Isis Matos')
  WHERE NOT EXISTS (
    SELECT id FROM objective WHERE title='Expandir os times com novos talentos'
  );

INSERT INTO
  objective(
    title,
    cycle_id,
    owner_id
  )
  SELECT
    'Melhorar a eficiência do processo de contratação',
    (SELECT id FROM cycle WHERE name='Q1 2021' AND team_id=(SELECT id FROM team WHERE name='Company Inc.')),
    (SELECT id FROM "user" WHERE name='Isis Matos')
  WHERE NOT EXISTS (
    SELECT id FROM objective WHERE title='Melhorar a eficiência do processo de contratação'
  );

INSERT INTO
  objective(
    title,
    cycle_id,
    owner_id
  )
  SELECT
    'Validar o processo de mentoria interna',
    (SELECT id FROM cycle WHERE name='Q1 2021' AND team_id=(SELECT id FROM team WHERE name='Company Inc.')),
    (SELECT id FROM "user" WHERE name='Dayra Caparica')
  WHERE NOT EXISTS (
    SELECT id FROM objective WHERE title='Validar o processo de mentoria interna'
  );

INSERT INTO
  objective(
    title,
    cycle_id,
    owner_id
  )
  SELECT
    'Implementar os novos valores da empresa',
    (SELECT id FROM cycle WHERE name='Q1 2021' AND team_id=(SELECT id FROM team WHERE name='Company Inc.')),
    (SELECT id FROM "user" WHERE name='Dayra Caparica')
  WHERE NOT EXISTS (
    SELECT id FROM objective WHERE title='Implementar os novos valores da empresa'
  );

INSERT INTO
  objective(
    title,
    cycle_id,
    owner_id
  )
  SELECT
    'Atualizar cargos e salários',
    (SELECT id FROM cycle WHERE name='Q1 2021' AND team_id=(SELECT id FROM team WHERE name='Company Inc.')),
    (SELECT id FROM "user" WHERE name='Dante Barreiros')
  WHERE NOT EXISTS (
    SELECT id FROM objective WHERE title='Atualizar cargos e salários'
  );

INSERT INTO
  objective(
    title,
    cycle_id,
    owner_id
  )
  SELECT
    'Iniciar um novo programa de parceria',
    (SELECT id FROM cycle WHERE name='Q1 2021' AND team_id=(SELECT id FROM team WHERE name='Company Inc.')),
    (SELECT id FROM "user" WHERE name='Dante Barreiros')
  WHERE NOT EXISTS (
    SELECT id FROM objective WHERE title='Iniciar um novo programa de parceria'
  );

INSERT INTO
  objective(
    title,
    cycle_id,
    owner_id
  )
  SELECT
    'Melhorar a satisfação do cliente',
    (SELECT id FROM cycle WHERE name='Q1 2021' AND team_id=(SELECT id FROM team WHERE name='Company Inc.')),
    (SELECT id FROM "user" WHERE name='Anthony Veríssimo')
  WHERE NOT EXISTS (
    SELECT id FROM objective WHERE title='Melhorar a satisfação do cliente'
  );

INSERT INTO
  objective(
    title,
    cycle_id,
    owner_id
  )
  SELECT
    'Crescer a receita da empresa',
    (SELECT id FROM cycle WHERE name='Q1 2021' AND team_id=(SELECT id FROM team WHERE name='Company Inc.')),
    (SELECT id FROM "user" WHERE name='Anthony Veríssimo')
  WHERE NOT EXISTS (
    SELECT id FROM objective WHERE title='Crescer a receita da empresa'
  );

INSERT INTO
  objective(
    title,
    cycle_id,
    owner_id
  )
  SELECT
    'Internacionalizar clientes',
    (SELECT id FROM cycle WHERE name='Q1 2021' AND team_id=(SELECT id FROM team WHERE name='Company Inc.')),
    (SELECT id FROM "user" WHERE name='Branca Maciel')
  WHERE NOT EXISTS (
    SELECT id FROM objective WHERE title='Internacionalizar clientes'
  );


INSERT INTO
  objective(
    title,
    cycle_id,
    owner_id
  )
  SELECT
    'Aumentar a taxa de conversão pelo LinkedIn',
    (SELECT id FROM cycle WHERE name='Q1 2021' AND team_id=(SELECT id FROM team WHERE name='Company Inc.')),
    (SELECT id FROM "user" WHERE name='Branca Maciel')
  WHERE NOT EXISTS (
    SELECT id FROM objective WHERE title='Aumentar a taxa de conversão pelo LinkedIn'
  );


INSERT INTO
  objective(
    title,
    cycle_id,
    owner_id
  )
  SELECT
    'Aumentar a recorrência de clientes',
    (SELECT id FROM cycle WHERE name='Q1 2021' AND team_id=(SELECT id FROM team WHERE name='Company Inc.')),
    (SELECT id FROM "user" WHERE name='Nara Fraga')
  WHERE NOT EXISTS (
    SELECT id FROM objective WHERE title='Aumentar a recorrência de clientes'
  );

INSERT INTO
  objective(
    title,
    cycle_id,
    owner_id
  )
  SELECT
    'Escalar processos internos',
    (SELECT id FROM cycle WHERE name='Q1 2021' AND team_id=(SELECT id FROM team WHERE name='Company Inc.')),
    (SELECT id FROM "user" WHERE name='Júnior Camilo')
  WHERE NOT EXISTS (
    SELECT id FROM objective WHERE title='Escalar processos internos'
  );

INSERT INTO
  objective(
    title,
    cycle_id,
    owner_id
  )
  SELECT
    'Fortalecer a imagem com novos clientes',
    (SELECT id FROM cycle WHERE name='Q1 2021' AND team_id=(SELECT id FROM team WHERE name='Company Inc.')),
    (SELECT id FROM "user" WHERE name='Júnior Camilo')
  WHERE NOT EXISTS (
    SELECT id FROM objective WHERE title='Fortalecer a imagem com novos clientes'
  );

INSERT INTO
  objective(
    title,
    cycle_id,
    owner_id
  )
  SELECT
    'Melhorar os processos internos do time',
    (SELECT id FROM cycle WHERE name='Q1 2021' AND team_id=(SELECT id FROM team WHERE name='Company Inc.')),
    (SELECT id FROM "user" WHERE name='Arina Carneiro')
  WHERE NOT EXISTS (
    SELECT id FROM objective WHERE title='Melhorar os processos internos do time'
  );

INSERT INTO
  objective(
    title,
    cycle_id,
    owner_id
  )
  SELECT
    'Esclarecer processos de precificação',
    (SELECT id FROM cycle WHERE name='Q1 2021' AND team_id=(SELECT id FROM team WHERE name='Company Inc.')),
    (SELECT id FROM "user" WHERE name='Arina Carneiro')
  WHERE NOT EXISTS (
    SELECT id FROM objective WHERE title='Esclarecer processos de precificação'
  );

INSERT INTO
  objective(
    title,
    cycle_id,
    owner_id
  )
  SELECT
    'Estruturar plano para internacionalização',
    (SELECT id FROM cycle WHERE name='Q1 2021' AND team_id=(SELECT id FROM team WHERE name='Company Inc.')),
    (SELECT id FROM "user" WHERE name='Matthias Cisneiros')
  WHERE NOT EXISTS (
    SELECT id FROM objective WHERE title='Estruturar plano para internacionalização'
  );

INSERT INTO
  objective(
    title,
    cycle_id,
    owner_id
  )
  SELECT
    'Otimizar os processos internos',
    (SELECT id FROM cycle WHERE name='Q1 2021' AND team_id=(SELECT id FROM team WHERE name='Company Inc.')),
    (SELECT id FROM "user" WHERE name='Liane Xisto')
  WHERE NOT EXISTS (
    SELECT id FROM objective WHERE title='Otimizar os processos internos'
  );

INSERT INTO
  objective(
    title,
    cycle_id,
    owner_id
  )
  SELECT
    'Encontrar novas fontes de renda',
    (SELECT id FROM cycle WHERE name='Q1 2021' AND team_id=(SELECT id FROM team WHERE name='Company Inc.')),
    (SELECT id FROM "user" WHERE name='Liane Xisto')
  WHERE NOT EXISTS (
    SELECT id FROM objective WHERE title='Encontrar novas fontes de renda'
  );

INSERT INTO
  objective(
    title,
    cycle_id,
    owner_id
  )
  SELECT
    'Engajar mais pessoas em nossas redes sociais',
    (SELECT id FROM cycle WHERE name='Q1 2021' AND team_id=(SELECT id FROM team WHERE name='Company Inc.')),
    (SELECT id FROM "user" WHERE name='Márcia Tabanez')
  WHERE NOT EXISTS (
    SELECT id FROM objective WHERE title='Engajar mais pessoas em nossas redes sociais'
  );

INSERT INTO
  objective(
    title,
    cycle_id,
    owner_id
  )
  SELECT
    'Fortalecer equipe de Design',
    (SELECT id FROM cycle WHERE name='Q1 2021' AND team_id=(SELECT id FROM team WHERE name='Company Inc.')),
    (SELECT id FROM "user" WHERE name='Márcia Tabanez')
  WHERE NOT EXISTS (
    SELECT id FROM objective WHERE title='Fortalecer equipe de Design'
  );

INSERT INTO
  objective(
    title,
    cycle_id,
    owner_id
  )
  SELECT
    'Iniciar processo de especialização',
    (SELECT id FROM cycle WHERE name='Q1 2021' AND team_id=(SELECT id FROM team WHERE name='Company Inc.')),
    (SELECT id FROM "user" WHERE name='Shayan Carvalhoso')
  WHERE NOT EXISTS (
    SELECT id FROM objective WHERE title='Iniciar processo de especialização'
  );

INSERT INTO
  objective(
    title,
    cycle_id,
    owner_id
  )
  SELECT
    'Impulsionar time na comunidade',
    (SELECT id FROM cycle WHERE name='Q1 2021' AND team_id=(SELECT id FROM team WHERE name='Company Inc.')),
    (SELECT id FROM "user" WHERE name='Shayan Carvalhoso')
  WHERE NOT EXISTS (
    SELECT id FROM objective WHERE title='Impulsionar time na comunidade'
  );

INSERT INTO
  objective(
    title,
    cycle_id,
    owner_id
  )
  SELECT
    'Se tornar próximo do público',
    (SELECT id FROM cycle WHERE name='Q1 2021' AND team_id=(SELECT id FROM team WHERE name='Company Inc.')),
    (SELECT id FROM "user" WHERE name='Luís Valadão')
  WHERE NOT EXISTS (
    SELECT id FROM objective WHERE title='Se tornar próximo do público'
  );

INSERT INTO
  objective(
    title,
    cycle_id,
    owner_id
  )
  SELECT
    'Unificar o tom de voz',
    (SELECT id FROM cycle WHERE name='Q1 2021' AND team_id=(SELECT id FROM team WHERE name='Company Inc.')),
    (SELECT id FROM "user" WHERE name='Luís Valadão')
  WHERE NOT EXISTS (
    SELECT id FROM objective WHERE title='Unificar o tom de voz'
  );
