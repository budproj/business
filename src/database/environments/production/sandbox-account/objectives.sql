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
