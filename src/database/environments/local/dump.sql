INSERT INTO
  "user"(
    name,
    picture,
    role,
    authz_sub
  )
  SELECT
    'Morty Smith',
    'https://vignette.wikia.nocookie.net/theapartments/images/2/2b/Screen_Shot_2019-02-06_at_11.36.07_AM.png/revision/latest?cb=20190206163327',
    'CEO',
    'auth0|5fd773cfd16a7c00694ae5ff'
  WHERE NOT EXISTS (
    SELECT id FROM "user" WHERE name='Morty Smith'
  );

INSERT INTO
  company(
    name,
    description,
    owner_id
  )
  SELECT
    'Rick Sanchez Inc.',
    'One of the most famous intergalatic empires, Rick Sanchez Inc. is responsible for bringing peace to the galaxy at all costs',
    (SELECT id FROM "user" WHERE name='Morty Smith')
  WHERE NOT EXISTS (
    SELECT id FROM company WHERE name='Rick Sanchez Inc.'
  );

INSERT INTO
  team(
    name,
    description,
    company_id,
    owner_Id
  )
  SELECT
    'Space Force',
    'Dedicated to bring balance to the galaxy, Space Force has the best of our company members to finish long lasting conflicts and bring peace to our controlled planets',
    (SELECT id FROM company WHERE name='Rick Sanchez Inc.'),
    (SELECT id FROM "user" WHERE name='Morty Smith')
  WHERE NOT EXISTS (
    SELECT id FROM team WHERE name='Space Force'
  );

INSERT INTO
  team_users_user(
    team_id,
    user_id
  )
  SELECT
    (SELECT id FROM team WHERE name='Space Force'),
    (SELECT id FROM "user" WHERE name='Morty Smith')
  WHERE NOT EXISTS (
    SELECT team_id, user_id FROM team_users_user WHERE
      team_id=(SELECT id FROM team WHERE name='Space Force') AND
      user_id=(SELECT id FROM "user" WHERE name='Morty Smith')
  );

INSERT INTO
  cycle(
    date_start,
    date_end,
    company_id
  )
  SELECT
    '2021-01-01',
    '2021-03-31',
    (SELECT id FROM company WHERE name='Rick Sanchez Inc.')
  WHERE NOT EXISTS (
    SELECT id FROM cycle WHERE date_start='2021-01-01' AND date_end='2021-03-31'
  );

INSERT INTO
  objective(
    title,
    cycle_id,
    owner_id
  )
  SELECT
    'Rule the galaxy',
    (SELECT id FROM cycle WHERE date_start='2021-01-01'),
    (SELECT id FROM "user" WHERE name='Morty Smith')
  WHERE NOT EXISTS (
    SELECT id FROM objective WHERE title='Rule the galaxy'
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
    (SELECT id FROM "user" WHERE name='Morty Smith')
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
    (SELECT id FROM team WHERE name='Space Force'),
    (SELECT id FROM "user" WHERE name='Morty Smith')
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
    (SELECT id FROM team WHERE name='Space Force'),
    (SELECT id FROM "user" WHERE name='Morty Smith')
  WHERE NOT EXISTS (
    SELECT id FROM key_result WHERE title='Earn money'
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
    (SELECT id FROM "user" WHERE name='Morty Smith')
  WHERE NOT EXISTS (
    SELECT id FROM key_result_view WHERE
      binding='MINE' AND
      user_id=(SELECT id FROM "user" WHERE name='Morty Smith')
  );
