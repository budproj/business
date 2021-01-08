INSERT INTO
  team(
    name,
    description,
    owner_id
  )
  SELECT
    'Company Inc.',
    'Responsáveis por diversas construções. Nossa empresa foca no bem-estar e entregar um produto de qualidade',
    (SELECT id FROM "user" WHERE name='Jéssica Nazário')
  WHERE NOT EXISTS (
    SELECT id FROM team WHERE name='Company Inc.'
  );

INSERT INTO
  team(
    name,
    description,
    owner_id,
    parent_team_id
  )
  SELECT
    'Recursos Humanos',
    'Esta área é responsável por toda a gestão de carreira de nossos colaboradores',
    (SELECT id FROM "user" WHERE name='Levi Paulos'),
    (SELECT id FROM team WHERE name='Company Inc.')
  WHERE NOT EXISTS (
    SELECT id FROM team WHERE name='Recursos Humanos'
  );

INSERT INTO
  team(
    name,
    description,
    owner_id,
    parent_team_id
  )
  SELECT
    'Contratação',
    'Somos responsáveis por todo o fluxo de contratação da empresa. Cuidamos de todo o processo de captação de talentos e onboarding de novos colaboradores',
    (SELECT id FROM "user" WHERE name='Isis Matos'),
    (SELECT id FROM team WHERE name='Recursos Humanos')
  WHERE NOT EXISTS (
    SELECT id FROM team WHERE name='Contratação'
  );

INSERT INTO
  team(
    name,
    description,
    owner_id,
    parent_team_id
  )
  SELECT
    'Treinamento e Desenvolvimento',
    'Nosso time foca em desenvolver nossos funcionários, aplicando o que há de mais moderno no mercado referente a treinamento de colaboradores',
    (SELECT id FROM "user" WHERE name='Dayra Caparica'),
    (SELECT id FROM team WHERE name='Recursos Humanos')
  WHERE NOT EXISTS (
    SELECT id FROM team WHERE name='Treinamento e Desenvolvimento'
  );

INSERT INTO
  team(
    name,
    description,
    owner_id,
    parent_team_id
  )
  SELECT
    'Remuneração e Benefícios',
    'A área de remuneração e benefícios busca aprimorar a qualidade de vida de nossos colaboradores',
    (SELECT id FROM "user" WHERE name='Dante Barreiros'),
    (SELECT id FROM team WHERE name='Recursos Humanos')
  WHERE NOT EXISTS (
    SELECT id FROM team WHERE name='Remuneração e Benefícios'
  );

INSERT INTO
  team(
    name,
    description,
    owner_id,
    parent_team_id
  )
  SELECT
    'Vendas',
    'Nossa equipe é responsável por captar novos clientes.',
    (SELECT id FROM "user" WHERE name='Anthony Veríssimo'),
    (SELECT id FROM team WHERE name='Company Inc.')
  WHERE NOT EXISTS (
    SELECT id FROM team WHERE name='Vendas'
  );


INSERT INTO
  team(
    name,
    description,
    owner_id,
    parent_team_id
  )
  SELECT
    'Prospecção',
    'Somos responsáveis por buscar novos clientes e trazê-los para o topo de nosso funil de vendas',
    (SELECT id FROM "user" WHERE name='Branca Maciel'),
    (SELECT id FROM team WHERE name='Vendas')
  WHERE NOT EXISTS (
    SELECT id FROM team WHERE name='Prospecção'
  );

INSERT INTO
  team(
    name,
    description,
    owner_id,
    parent_team_id
  )
  SELECT
    'Customer Success',
    'Nosso foco é atender nossos clientes e leads da forma mais qualificada e empática possível',
    (SELECT id FROM "user" WHERE name='Nara Fraga'),
    (SELECT id FROM team WHERE name='Vendas')
  WHERE NOT EXISTS (
    SELECT id FROM team WHERE name='Customer Success'
  );

INSERT INTO
  team(
    name,
    description,
    owner_id,
    parent_team_id
  )
  SELECT
    'Growth',
    'O time de growth aplica estratégias de growth hacking para ampliar nosso funil e aumentar a eficácia na conversão de leads',
    (SELECT id FROM "user" WHERE name='Júnior Camilo'),
    (SELECT id FROM team WHERE name='Vendas')
  WHERE NOT EXISTS (
    SELECT id FROM team WHERE name='Growth'
  );

INSERT INTO
  team(
    name,
    description,
    owner_id,
    parent_team_id
  )
  SELECT
    'Financeiro',
    'Nosso time busca a estabilidade financeira para nossa empresa',
    (SELECT id FROM "user" WHERE name='Arina Carneiro'),
    (SELECT id FROM team WHERE name='Company Inc.')
  WHERE NOT EXISTS (
    SELECT id FROM team WHERE name='Financeiro'
  );

INSERT INTO
  team(
    name,
    description,
    owner_id,
    parent_team_id
  )
  SELECT
    'Gestão de Compras',
    'O time de compras gerencia nossos fornecedores e todo o processo de pagamento',
    (SELECT id FROM "user" WHERE name='Matthias Cisneiros'),
    (SELECT id FROM team WHERE name='Financeiro')
  WHERE NOT EXISTS (
    SELECT id FROM team WHERE name='Gestão de Compras'
  );

INSERT INTO
  team(
    name,
    description,
    owner_id,
    parent_team_id
  )
  SELECT
    'Contabilidade',
    'Nossos contadores trabalham diariamente para garantir a qualidade de nossos relatórios e estrutura de contabilidade da empresa',
    (SELECT id FROM "user" WHERE name='Liane Xisto'),
    (SELECT id FROM team WHERE name='Financeiro')
  WHERE NOT EXISTS (
    SELECT id FROM team WHERE name='Contabilidade'
  );


INSERT INTO
  team(
    name,
    description,
    owner_id,
    parent_team_id
  )
  SELECT
    'Marketing',
    'Trabalhamos para trazer clientes e entender nosso mercado, de modo que buscamos a melhor forma de atrair novos consumidores',
    (SELECT id FROM "user" WHERE name='Márcia Tabanez'),
    (SELECT id FROM team WHERE name='Company Inc.')
  WHERE NOT EXISTS (
    SELECT id FROM team WHERE name='Marketing'
  );

INSERT INTO
  team(
    name,
    description,
    owner_id,
    parent_team_id
  )
  SELECT
    'Design',
    'Trabalhamos com toda a identidade visual, interface e demais itens visuais dentro do time de design',
    (SELECT id FROM "user" WHERE name='Shayan Carvalhoso'),
    (SELECT id FROM team WHERE name='Marketing')
  WHERE NOT EXISTS (
    SELECT id FROM team WHERE name='Design'
  );

INSERT INTO
  team(
    name,
    description,
    owner_id,
    parent_team_id
  )
  SELECT
    'Conteúdo',
    'Nosso time elabora conteúdos digitais e impressos para que nossa empresa se mantenha ativa, principalmente em inbound marketing',
    (SELECT id FROM "user" WHERE name='Luís Valadão'),
    (SELECT id FROM team WHERE name='Marketing')
  WHERE NOT EXISTS (
    SELECT id FROM team WHERE name='Conteúdo'
  );
