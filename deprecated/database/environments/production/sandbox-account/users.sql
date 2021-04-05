INSERT INTO
  "user"(
    name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Jéssica Nazário',
    'https://images-na.ssl-images-amazon.com/images/M/MV5BYTcwYjA3NGQtNDU4NS00OWVkLTlmM2MtM2Q4NzA0ZjkxYTA3XkEyXkFqcGdeQXVyMjc4NTQyNTQ@._V1_UX172_CR0,0,172,256_AL_.jpg',
    'FEMALE',
    'CEO',
    'auth0|5ff78b8208284b006bb5f41c'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE name='Jéssica Nazário'
  );

INSERT INTO
  "user"(
    name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Levi Paulos',
    'https://images-na.ssl-images-amazon.com/images/M/MV5BNTk2OGU4NzktODhhOC00Nzc2LWIyNzYtOWViMjljZGFiNTMxXkEyXkFqcGdeQXVyMTE1NTQwOTk@._V1_UY256_CR12,0,172,256_AL_.jpg',
    'MALE',
    'Diretor de Recursos Humanos',
    'auth0|5ff78c39e00a83006e8a2197'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE name='Levi Paulos'
  );

INSERT INTO
  "user"(
    name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Isis Matos',
    'https://randomuser.me/api/portraits/women/95.jpg',
    'FEMALE',
    'Gerente de Contratação',
    'auth0|5ff78d03ea3fc7007877e8d5'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE name='Isis Matos'
  );

INSERT INTO
  "user"(
    name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Davi Caetano',
    'https://randomuser.me/api/portraits/men/81.jpg',
    'MALE',
    'Analista de Contratação',
    'auth0|5ff78ed578238b007197848e'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE name='Davi Caetano'
  );

INSERT INTO
  "user"(
    name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Vivian Portela',
    'https://images.generated.photos/DQ4EKrAPT-e5slG3cXmSw20uJ2AwwhOzJeVnpI9tlMA/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zLzA5/OTk4MDcuanBn.jpg',
    'FEMALE',
    'Analista de Contratação',
    'auth0|5ff797a581637b00685d9876'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE name='Vivian Portela'
  );

INSERT INTO
  "user"(
    name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Dayra Caparica',
    'https://images-na.ssl-images-amazon.com/images/M/MV5BMjAwMzc5OTEzOF5BMl5BanBnXkFtZTgwMDc5ODU3MTE@._V1_UX172_CR0,0,172,256_AL_.jpg',
    'FEMALE',
    'Gerente de Treinamento',
    'auth0|5ff78dd7e00a83006e8a21af'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE name='Dayra Caparica'
  );

INSERT INTO
  "user"(
    name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Iago Angelim',
    'https://uifaces.co/our-content/donated/ty5Armt_.jpg',
    'MALE',
    'Analista de Treinamento',
    'auth0|5ff78f6945226800755b09c0'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE name='Iago Angelim'
  );

INSERT INTO
  "user"(
    name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Emílio Nóbrega',
    'https://images.generated.photos/KSkFZay8lawllgpfawH1UjaofmrXm1sPLZiauTWaYag/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zLzAw/MzYyNTIuanBn.jpg',
    'MALE',
    'Analista de Treinamento',
    'auth0|5ff7980145226800755b0a10'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE name='Emílio Nóbrega'
  );

INSERT INTO
  "user"(
    name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Dante Barreiros',
    'https://uifaces.co/our-content/donated/6MWH9Xi_.jpg',
    'MALE',
    'Gerente de Remuneração',
    'auth0|5ff78e4bbbc4f9006f20803a'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE name='Dante Barreiros'
  );

INSERT INTO
  "user"(
    name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Domingos Lamenha',
    'https://randomuser.me/api/portraits/men/42.jpg',
    'MALE',
    'Analista de Remuneração',
    'auth0|5ff78fdb08284b006bb5f477'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE name='Domingos Lamenha'
  );

INSERT INTO
  "user"(
    name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Maximiano Cortês',
    'https://images.generated.photos/3GlJFE4E6sIACSIfP-4k1UnswL6Akh5jDNIVCYtkqe0/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Yy/XzAzNTE5MzkuanBn.jpg',
    'MALE',
    'Analista de Remuneração',
    'auth0|5ff79857bbc4f9006f208098'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE name='Maximiano Cortês'
  );

INSERT INTO
  "user"(
    name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Anthony Veríssimo',
    'https://images-na.ssl-images-amazon.com/images/M/MV5BOTk1MzgzOTg5OV5BMl5BanBnXkFtZTcwNDQ4NjMxOA@@._V1_UY256_CR1,0,172,256_AL_.jpg',
    'MALE',
    'Diretor de Vendas',
    'auth0|5ff7911254ea200069c890eb'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE name='Anthony Veríssimo'
  );

INSERT INTO
  "user"(
    name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Branca Maciel',
    'https://images-na.ssl-images-amazon.com/images/M/MV5BYTIyMzExODgtNzllNy00OWQwLTlhM2QtMWU1ZTI2MjgwMTQxXkEyXkFqcGdeQXVyMjQwMDg0Ng@@._V1_UY256_CR5,0,172,256_AL_.jpg',
    'FEMALE',
    'Gerente de Prospecção',
    'auth0|5ff7917008284b006bb5f4ad'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE name='Branca Maciel'
  );

INSERT INTO
  "user"(
    name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Letizia Martinho',
    'https://uifaces.co/our-content/donated/93aChDW6.jpg',
    'FEMALE',
    'Analista de Prospecção',
    'auth0|5ff791bd81637b00685d97f7'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE name='Letizia Martinho'
  );

INSERT INTO
  "user"(
    name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Nuna Mainha',
    'https://i.imgur.com/2OhUYPt.jpg',
    'FEMALE',
    'Analista de Prospecção',
    'auth0|5ff798bf08284b006bb5f50a'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE name='Nuna Mainha'
  );

INSERT INTO
  "user"(
    name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Nara Fraga',
    'https://randomuser.me/api/portraits/women/62.jpg',
    'FEMALE',
    'Gerente de Customer Success',
    'auth0|5ff7921d5696ae00712f295d'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE name='Nara Fraga'
  );

INSERT INTO
  "user"(
    name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Lev Caetano',
    'https://images.unsplash.com/photo-1544098485-2a2ed6da40ba?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ',
    'MALE',
    'Analista de Customer Success',
    'auth0|5ff7927581637b00685d980b'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE name='Lev Caetano'
  );

INSERT INTO
  "user"(
    name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Suzana Marinho',
    'https://images.generated.photos/qmdENySIv23bkva-PxTHsoxVbZQdB1Wka0ZPcH5shHY/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Yy/XzAzMDE4MzAuanBn.jpg',
    'FEMALE',
    'Analista de Customer Success',
    'auth0|5ff7991f78238b007197857a'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE name='Suzana Marinho'
  );

INSERT INTO
  "user"(
    name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Júnior Camilo',
    'https://randomuser.me/api/portraits/men/59.jpg',
    'MALE',
    'Gerente de Growth',
    'auth0|5ff792d154ea200069c8910f'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE name='Júnior Camilo'
  );

INSERT INTO
  "user"(
    name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Marcelino Guedelha',
    'https://images.unsplash.com/photo-1498190718497-403407ff7eb2?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=a51c09ba28b70eace6e53adc15ae90ba',
    'MALE',
    'Analista de Growth',
    'auth0|5ff7931c78238b007197850f'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE name='Marcelino Guedelha'
  );

INSERT INTO
  "user"(
    name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Nazar Cedro',
    'https://images-na.ssl-images-amazon.com/images/M/MV5BMjA0Mzg2NzEwNF5BMl5BanBnXkFtZTcwMTI0NTgwMw@@._V1_UY256_CR32,0,172,256_AL_.jpg',
    'MALE',
    'Analista de Growth',
    'auth0|5ff79970e00a83006e8a2274'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE name='Nazar Cedro'
  );

INSERT INTO
  "user"(
    name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Arina Carneiro',
    'https://images-na.ssl-images-amazon.com/images/M/MV5BMTYyOTQ2NjkyMl5BMl5BanBnXkFtZTcwODk5NjQzOA@@._V1_UY256_CR5,0,172,256_AL_.jpg',
    'FEMALE',
    'Diretora Financeira',
    'auth0|5ff7939b78238b007197851d'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE name='Arina Carneiro'
  );

INSERT INTO
  "user"(
    name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Matthias Cisneiros',
    'https://uifaces.co/our-content/donated/bEA9wZcY.jpg',
    'MALE',
    'Gerente de Compras',
    'auth0|5ff793f2bbc4f9006f20807b'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE name='Matthias Cisneiros'
  );

INSERT INTO
  "user"(
    name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Eliézer Mieiro',
    'https://uifaces.co/our-content/donated/UM81l6XC.jpg',
    'MALE',
    'Analista de Compras',
    'auth0|5ff7943878238b0071978534'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE name='Eliézer Mieiro'
  );

INSERT INTO
  "user"(
    name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Giovani Prado',
    'https://i.imgur.com/sgeHfTT.jpg',
    'MALE',
    'Analista de Compras',
    'auth0|5ff799bd5696ae00712f2a08'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE name='Giovani Prado'
  );

INSERT INTO
  "user"(
    name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Liane Xisto',
    'https://images.unsplash.com/photo-1498529381350-89c2e7ccc430?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=f6143f1f2142185de1e1e3d955f729ec',
    'FEMALE',
    'Gerente de Contabilidade',
    'auth0|5ff7948608284b006bb5f4d4'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE name='Liane Xisto'
  );

INSERT INTO
  "user"(
    name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Gisela Quina',
    'https://images.unsplash.com/photo-1508091073125-ced32109d0ee?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ',
    'FEMALE',
    'Analista de Contabilidade',
    'auth0|5ff794d854ea200069c8911b'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE name='Gisela Quina'
  );

INSERT INTO
  "user"(
    name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Gustavo Manso',
    'https://images.unsplash.com/photo-1542393881816-df51684879df?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ',
    'MALE',
    'Analista de Contabilidade',
    'auth0|5ff79a1a08284b006bb5f52c'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE name='Gustavo Manso'
  );

INSERT INTO
  "user"(
    name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Márcia Tabanez',
    'https://images-na.ssl-images-amazon.com/images/M/MV5BMTM3OTUwMDYwNl5BMl5BanBnXkFtZTcwNTUyNzc3Nw@@._V1_UY256_CR19,0,172,256_AL_.jpg',
    'FEMALE',
    'Diretora de Marketing',
    'auth0|5ff7952fea3fc7007877e945'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE name='Márcia Tabanez'
  );

INSERT INTO
  "user"(
    name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Shayan Carvalhoso',
    'https://images-na.ssl-images-amazon.com/images/M/MV5BMjQxNzA0NjYxMF5BMl5BanBnXkFtZTgwOTQyNDU5NDE@._V1_UX172_CR0,0,172,256_AL_.jpg',
    'MALE',
    'Gerente de Design',
    'auth0|5ff7958c45226800755b09ea'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE name='Shayan Carvalhoso'
  );

INSERT INTO
  "user"(
    name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Lui Porto',
    'https://uifaces.co/our-content/donated/arlN0A9o.png',
    'MALE',
    'Designer',
    'auth0|5ff795da45226800755b09ef'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE name='Lui Porto'
  );

INSERT INTO
  "user"(
    name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Núria Castanho',
    'https://i.imgur.com/7zouSDh.jpg',
    'FEMALE',
    'Designer',
    'auth0|5ff79a6254ea200069c8916e'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE name='Núria Castanho'
  );

INSERT INTO
  "user"(
    name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Luís Valadão',
    'https://images-na.ssl-images-amazon.com/images/M/MV5BZjY0MjRhNjEtNGVlYi00YzZhLWFhNDEtMjlhNjBiNzM3Y2RkXkEyXkFqcGdeQXVyMjQxMDQzMjA@._V1_UY256_CR84,0,172,256_AL_.jpg',
    'MALE',
    'Gerente de Conteúdo',
    'auth0|5ff79ab981637b00685d98b0'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE name='Luís Valadão'
  );

INSERT INTO
  "user"(
    name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Rania Travassos',
    'https://uifaces.co/our-content/donated/D7h2tl-Z.jpg',
    'FEMALE',
    'Analista de Conteúdo',
    'auth0|5ff79b0281637b00685d98c4'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE name='Rania Travassos'
  );

INSERT INTO
  "user"(
    name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Raúl Frade',
    'https://randomuser.me/api/portraits/men/2.jpg',
    'MALE',
    'Analista de Conteúdo',
    'auth0|5ff79b44bbc4f9006f2080c7'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE name='Raúl Frade'
  );
