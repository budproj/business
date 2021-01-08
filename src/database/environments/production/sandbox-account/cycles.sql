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
    (SELECT id FROM team WHERE name='Company Inc.')
  WHERE NOT EXISTS (
    SELECT id FROM cycle WHERE date_start='2021-01-01' AND date_end='2021-03-31' AND team_id=(SELECT id FROM team WHERE name='Company Inc.')
  );
