INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Company Inc.'),
    (SELECT id FROM "user" WHERE name='Jéssica Nazário')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Company Inc.') AND
      user_id=(SELECT id FROM "user" WHERE name='Jéssica Nazário')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Recursos Humanos'),
    (SELECT id FROM "user" WHERE name='Levi Paulos')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Recursos Humanos') AND
      user_id=(SELECT id FROM "user" WHERE name='Levi Paulos')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Contratação'),
    (SELECT id FROM "user" WHERE name='Isis Matos')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Contratação') AND
      user_id=(SELECT id FROM "user" WHERE name='Isis Matos')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Contratação'),
    (SELECT id FROM "user" WHERE name='Davi Caetano')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Contratação') AND
      user_id=(SELECT id FROM "user" WHERE name='Davi Caetano')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Contratação'),
    (SELECT id FROM "user" WHERE name='Vivian Portela')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Contratação') AND
      user_id=(SELECT id FROM "user" WHERE name='Vivian Portela')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Treinamento e Desenvolvimento'),
    (SELECT id FROM "user" WHERE name='Dayra Caparica')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Treinamento e Desenvolvimento') AND
      user_id=(SELECT id FROM "user" WHERE name='Dayra Caparica')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Treinamento e Desenvolvimento'),
    (SELECT id FROM "user" WHERE name='Iago Angelim')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Treinamento e Desenvolvimento') AND
      user_id=(SELECT id FROM "user" WHERE name='Iago Angelim')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Treinamento e Desenvolvimento'),
    (SELECT id FROM "user" WHERE name='Emílio Nóbrega')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Treinamento e Desenvolvimento') AND
      user_id=(SELECT id FROM "user" WHERE name='Emílio Nóbrega')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Remuneração e Benefícios'),
    (SELECT id FROM "user" WHERE name='Dante Barreiros')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Remuneração e Benefícios') AND
      user_id=(SELECT id FROM "user" WHERE name='Dante Barreiros')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Remuneração e Benefícios'),
    (SELECT id FROM "user" WHERE name='Domingos Lamenha')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Remuneração e Benefícios') AND
      user_id=(SELECT id FROM "user" WHERE name='Domingos Lamenha')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Remuneração e Benefícios'),
    (SELECT id FROM "user" WHERE name='Maximiano Cortês')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Remuneração e Benefícios') AND
      user_id=(SELECT id FROM "user" WHERE name='Maximiano Cortês')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Vendas'),
    (SELECT id FROM "user" WHERE name='Anthony Veríssimo')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Vendas') AND
      user_id=(SELECT id FROM "user" WHERE name='Anthony Veríssimo')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Prospecção'),
    (SELECT id FROM "user" WHERE name='Branca Maciel')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Prospecção') AND
      user_id=(SELECT id FROM "user" WHERE name='Branca Maciel')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Prospecção'),
    (SELECT id FROM "user" WHERE name='Letizia Martinho')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Prospecção') AND
      user_id=(SELECT id FROM "user" WHERE name='Letizia Martinho')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Prospecção'),
    (SELECT id FROM "user" WHERE name='Nuna Mainha')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Prospecção') AND
      user_id=(SELECT id FROM "user" WHERE name='Nuna Mainha')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Customer Success'),
    (SELECT id FROM "user" WHERE name='Nara Fraga')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Customer Success') AND
      user_id=(SELECT id FROM "user" WHERE name='Nara Fraga')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Customer Success'),
    (SELECT id FROM "user" WHERE name='Lev Caetano')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Customer Success') AND
      user_id=(SELECT id FROM "user" WHERE name='Lev Caetano')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Customer Success'),
    (SELECT id FROM "user" WHERE name='Suzana Marinho')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Customer Success') AND
      user_id=(SELECT id FROM "user" WHERE name='Suzana Marinho')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Growth'),
    (SELECT id FROM "user" WHERE name='Júnior Camilo')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Growth') AND
      user_id=(SELECT id FROM "user" WHERE name='Júnior Camilo')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Growth'),
    (SELECT id FROM "user" WHERE name='Marcelino Gadelha')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Growth') AND
      user_id=(SELECT id FROM "user" WHERE name='Marcelino Gadelha')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Growth'),
    (SELECT id FROM "user" WHERE name='Nazar Cedro')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Growth') AND
      user_id=(SELECT id FROM "user" WHERE name='Nazar Cedro')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Financeiro'),
    (SELECT id FROM "user" WHERE name='Arina Carneiro')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Financeiro') AND
      user_id=(SELECT id FROM "user" WHERE name='Arina Carneiro')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Gestão de Compras'),
    (SELECT id FROM "user" WHERE name='Matthias Cisneiros')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Gestão de Compras') AND
      user_id=(SELECT id FROM "user" WHERE name='Matthias Cisneiros')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Gestão de Compras'),
    (SELECT id FROM "user" WHERE name='Eliézer Mieiro')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Gestão de Compras') AND
      user_id=(SELECT id FROM "user" WHERE name='Eliézer Mieiro')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Gestão de Compras'),
    (SELECT id FROM "user" WHERE name='Giovani Prado')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Gestão de Compras') AND
      user_id=(SELECT id FROM "user" WHERE name='Giovani Prado')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Contabilidade'),
    (SELECT id FROM "user" WHERE name='Liane Xisto')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Contabilidade') AND
      user_id=(SELECT id FROM "user" WHERE name='Liane Xisto')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Contabilidade'),
    (SELECT id FROM "user" WHERE name='Gisela Quina')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Contabilidade') AND
      user_id=(SELECT id FROM "user" WHERE name='Gisela Quina')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Contabilidade'),
    (SELECT id FROM "user" WHERE name='Gustavo Manso')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Contabilidade') AND
      user_id=(SELECT id FROM "user" WHERE name='Gustavo Manso')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Marketing'),
    (SELECT id FROM "user" WHERE name='Márcia Tabanez')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Marketing') AND
      user_id=(SELECT id FROM "user" WHERE name='Márcia Tabanez')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Design'),
    (SELECT id FROM "user" WHERE name='Shayan Carvalhoso')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Design') AND
      user_id=(SELECT id FROM "user" WHERE name='Shayan Carvalhoso')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Design'),
    (SELECT id FROM "user" WHERE name='Lui Porto')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Design') AND
      user_id=(SELECT id FROM "user" WHERE name='Lui Porto')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Design'),
    (SELECT id FROM "user" WHERE name='Núria Castanho')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Design') AND
      user_id=(SELECT id FROM "user" WHERE name='Núria Castanho')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Conteúdo'),
    (SELECT id FROM "user" WHERE name='Luís Valadão')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Conteúdo') AND
      user_id=(SELECT id FROM "user" WHERE name='Luís Valadão')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Conteúdo'),
    (SELECT id FROM "user" WHERE name='Rania Travassos')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Conteúdo') AND
      user_id=(SELECT id FROM "user" WHERE name='Rania Travassos')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Conteúdo'),
    (SELECT id FROM "user" WHERE name='Raúl Frade')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Conteúdo') AND
      user_id=(SELECT id FROM "user" WHERE name='Raúl Frade')
  );
