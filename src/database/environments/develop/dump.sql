INSERT INTO
  "user"(
    first_name,
    last_name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Morty',
    'Smith',
    'https://vignette.wikia.nocookie.net/theapartments/images/2/2b/Screen_Shot_2019-02-06_at_11.36.07_AM.png/revision/latest?cb=20190206163327',
    'MALE',
    'CEO',
    'auth0|5fd773cfd16a7c00694ae5ff'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE first_name='Morty' AND last_name='Smith'
  );

INSERT INTO
  "user"(
    first_name,
    last_name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Rick',
    'Sanchez',
    'https://static.wikia.nocookie.net/rickandmorty/images/a/a6/Rick_Sanchez.png',
    'MALE',
    'GOD',
    'auth0|5fedf6295696ae00712ead97'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE first_name='Rick' AND last_name='Sanchez'
  );

INSERT INTO
  "user"(
    first_name,
    last_name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Evil',
    'Morty',
    'https://cdn.images.express.co.uk/img/dynamic/20/750x445/1278894.jpg',
    'MALE',
    'GOD',
    'auth0|5fedf78a45226800755a887c'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE first_name='Evil' AND last_name='Morty'
  );

INSERT INTO
  "user"(
    first_name,
    last_name,
    picture,
    gender,
    role,
    authz_sub
  )
  SELECT
    'Jerry',
    'Smith',
    'https://i.pinimg.com/originals/72/c3/3b/72c33b5df086100cfcd1c29aa02020b6.png',
    'MALE',
    'Dumb',
    'auth0|600b2b2adf7b5a00718d8aa8'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE first_name='Jerry' AND last_name='Smith'
  );

INSERT INTO
  team(
    name,
    description,
    owner_id
  )
  SELECT
    'Rick Sanchez Inc.',
    'One of the most famous intergalatic empires, Rick Sanchez Inc. is responsible for bringing peace to the galaxy at all costs',
    (SELECT id FROM "user" WHERE first_name='Morty' AND last_name='Smith')
  WHERE NOT EXISTS (
    SELECT id FROM team WHERE name='Rick Sanchez Inc.'
  );

INSERT INTO
  team(
    name,
    description,
    owner_id
  )
  SELECT
    'Evil Morty S/A',
    'We dedicate our lives to end the TIRANY OF RICK SANCHEZ INC.!!!!',
    (SELECT id FROM "user" WHERE first_name='Evil' AND last_name='Morty')
  WHERE NOT EXISTS (
    SELECT id FROM team WHERE name='Evil Morty S/A'
  );

INSERT INTO
  team(
    name,
    description,
    parent_team_id,
    owner_id
  )
  SELECT
    'Space Force',
    'Dedicated to bring balance to the galaxy, Space Force has the best of our company members to finish long lasting conflicts and bring peace to our controlled planets',
    (SELECT id FROM team WHERE name='Rick Sanchez Inc.'),
    (SELECT id FROM "user" WHERE first_name='Morty' AND last_name='Smith')
  WHERE NOT EXISTS (
    SELECT id FROM team WHERE name='Space Force'
  );

INSERT INTO
  team(
    name,
    description,
    parent_team_id,
    owner_id
  )
  SELECT
    'The dumbest team',
    'Well, it is morty, right? So it is the dumbest team',
    (SELECT id FROM team WHERE name='Space Force'),
    (SELECT id FROM "user" WHERE first_name='Morty' AND last_name='Smith')
  WHERE NOT EXISTS (
    SELECT id FROM team WHERE name='The dumbest team'
  );

INSERT INTO
  team(
    name,
    description,
    parent_team_id,
    owner_id
  )
  SELECT
    'Earth Force',
    'Dedicated to bring balance here on our home planet, Earth Force focus finishing conflicts here on earth to maintain peace',
    (SELECT id FROM team WHERE name='Rick Sanchez Inc.'),
    (SELECT id FROM "user" WHERE first_name='Rick' AND last_name='Sanchez')
  WHERE NOT EXISTS (
    SELECT id FROM team WHERE name='Earth Force'
  );

INSERT INTO
  team(
    name,
    description,
    parent_team_id,
    owner_Id
  )
  SELECT
    'Evil Morty Guerrilla',
    'This team does strategic strikes focusing on creating chaos in the galaxy',
    (SELECT id FROM team WHERE name='Evil Morty S/A'),
    (SELECT id FROM "user" WHERE first_name='Evil' AND last_name='Morty')
  WHERE NOT EXISTS (
    SELECT id FROM team WHERE name='Evil Morty Guerrilla'
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Space Force'),
    (SELECT id FROM "user" WHERE first_name='Morty' AND last_name='Smith')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Space Force') AND
      user_id=(SELECT id FROM "user" WHERE first_name='Morty' AND last_name='Smith')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Earth Force'),
    (SELECT id FROM "user" WHERE first_name='Rick' AND last_name='Sanchez')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Earth Force') AND
      user_id=(SELECT id FROM "user" WHERE first_name='Rick' AND last_name='Sanchez')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Earth Force'),
    (SELECT id FROM "user" WHERE first_name='Jerry' AND last_name='Smith')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Earth Force') AND
      user_id=(SELECT id FROM "user" WHERE first_name='Jerry' AND last_name='Smith')
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Evil Morty Guerrilla'),
    (SELECT id FROM "user" WHERE first_name='Evil' AND last_name='Morty')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Evil Morty Guerrilla') AND
      user_id=(SELECT id FROM "user" WHERE first_name='Evil' AND last_name='Morty')
  );

INSERT INTO
  cycle(
    name,
    date_start,
    date_end,
    team_id
  )
  SELECT
    'Q1 2021',
    '2021-01-01',
    '2021-03-31',
    (SELECT id FROM team WHERE name='Rick Sanchez Inc.')
  WHERE NOT EXISTS (
    SELECT id FROM cycle WHERE date_start='2021-01-01' AND date_end='2021-03-31' AND team_id=(SELECT id FROM team WHERE name='Rick Sanchez Inc.')
  );

INSERT INTO
  cycle(
    name,
    date_start,
    date_end,
    team_id
  )
  SELECT
    'Rickability',
    '2021-01-01',
    '2021-02-28',
    (SELECT id FROM team WHERE name='Earth Force')
  WHERE NOT EXISTS (
    SELECT id FROM cycle WHERE date_start='2021-01-01' AND date_end='2021-02-28' AND team_id=(SELECT id FROM team WHERE name='Earth Force')
  );

INSERT INTO
  cycle(
    name,
    date_start,
    date_end,
    team_id
  )
  SELECT
    'Q1 2021',
    '2021-01-01',
    '2021-03-31',
    (SELECT id FROM team WHERE name='Evil Morty S/A')
  WHERE NOT EXISTS (
    SELECT id FROM cycle WHERE date_start='2021-01-01' AND date_end='2021-03-31' AND team_id=(SELECT id FROM team WHERE name='Evil Morty S/A')
  );

INSERT INTO
  objective(
    title,
    cycle_id,
    owner_id
  )
  SELECT
    'Control the universe',
    (SELECT id FROM cycle WHERE date_start='2021-01-01' AND team_id=(SELECT id FROM team WHERE name='Rick Sanchez Inc.')),
    (SELECT id FROM "user" WHERE first_name='Rick' AND last_name='Sanchez')
  WHERE NOT EXISTS (
    SELECT id FROM objective WHERE title='Control the universe'
  );

INSERT INTO
  objective(
    title,
    cycle_id,
    owner_id
  )
  SELECT
    'Rule the galaxy',
    (SELECT id FROM cycle WHERE date_start='2021-01-01' AND team_id=(SELECT id FROM team WHERE name='Rick Sanchez Inc.')),
    (SELECT id FROM "user" WHERE first_name='Morty' AND last_name='Smith')
  WHERE NOT EXISTS (
    SELECT id FROM objective WHERE title='Rule the galaxy'
  );

INSERT INTO
  objective(
    title,
    cycle_id,
    owner_id
  )
  SELECT
    'Bring balance to earth',
    (SELECT id FROM cycle WHERE date_start='2021-01-01' AND team_id=(SELECT id FROM team WHERE name='Earth Force')),
    (SELECT id FROM "user" WHERE first_name='Rick' AND last_name='Sanchez')
  WHERE NOT EXISTS (
    SELECT id FROM objective WHERE title='Bring balance to earth'
  );

INSERT INTO
  objective(
    title,
    cycle_id,
    owner_id
  )
  SELECT
    'Bring chaos to the galaxy',
    (SELECT id FROM cycle WHERE date_start='2021-01-01' AND team_id=(SELECT id FROM team WHERE name='Evil Morty S/A')),
    (SELECT id FROM "user" WHERE first_name='Evil' AND last_name='Morty')
  WHERE NOT EXISTS (
    SELECT id FROM objective WHERE title='Bring chaos to the galaxy'
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
    'REPLICATE!!!',
    4000,
    0,
    'Lets be honest. To control the galaxy I need to replicate. I should talk to unity...',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Control the universe'),
    (SELECT id FROM team WHERE name='Rick Sanchez Inc.'),
    (SELECT id FROM "user" WHERE first_name='Rick' AND last_name='Sanchez')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='REPLICATE!!!'
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
    'Explore Earth solar system',
    100,
    0,
    'In this key result, we are aiming to explore the entire earth solar system',
    'PERCENTAGE',
    (SELECT id FROM objective WHERE title='Rule the galaxy'),
    (SELECT id FROM team WHERE name='Space Force'),
    (SELECT id FROM "user" WHERE first_name='Morty' AND last_name='Smith')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Explore Earth solar system'
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
    'Build autobots',
    100000,
    5000,
    'Since we need to explore and rule the galaxy, we must build as much autobots as we can',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Rule the galaxy'),
    (SELECT id FROM team WHERE name='The dumbest team'),
    (SELECT id FROM "user" WHERE first_name='Morty' AND last_name='Smith')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Build autobots'
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
    'Earn money',
    100000,
    75999,
    'We need money to buy stuff',
    'COIN_BRL',
    (SELECT id FROM objective WHERE title='Rule the galaxy'),
    (SELECT id FROM team WHERE name='The dumbest team'),
    (SELECT id FROM "user" WHERE first_name='Morty' AND last_name='Smith')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Earn money'
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
    'Kill stupid humans',
    100000,
    139,
    'In this key result we will focus on killing stupid humans, like Jerry Smith',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Bring balance to earth'),
    (SELECT id FROM team WHERE name='Earth Force'),
    (SELECT id FROM "user" WHERE first_name='Rick' AND last_name='Sanchez')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Kill stupid humans'
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
    'Kill Rick Sanchez',
    1,
    0,
    'DIE BITCH, DIE!!!',
    'NUMBER',
    (SELECT id FROM objective WHERE title='Bring chaos to the galaxy'),
    (SELECT id FROM team WHERE name='Evil Morty Guerrilla'),
    (SELECT id FROM "user" WHERE first_name='Evil' AND last_name='Morty')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Kill Rick Sanchez'
  );


INSERT INTO
  key_result_view(
    binding,
    rank,
    user_id
  )
  SELECT
    'MINE',
    ARRAY[
      (SELECT id FROM key_result WHERE title='Build autobots'),
      (SELECT id FROM key_result WHERE title='Explore Earth solar system')
    ],
    (SELECT id FROM "user" WHERE first_name='Morty' AND last_name='Smith')
  WHERE NOT EXISTS (
    SELECT id FROM key_result_view WHERE
      binding='MINE' AND
      user_id=(SELECT id FROM "user" WHERE first_name='Morty' AND last_name='Smith')
  );
