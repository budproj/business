import { MigrationInterface, QueryRunner } from 'typeorm'

export class ViewsToOptimizeCommands1707336625018 implements MigrationInterface {
  name = 'ViewsToOptimizeCommands1707336625018'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`create view latest_check_in_week_before AS
        (SELECT DISTINCT ON (krci.key_result_id) *
            FROM "key_result_check_in" krci
            WHERE krci.created_at < current_date - interval '6' day
            ORDER BY krci.key_result_id,
                krci.created_at DESC)
        `)
    await queryRunner.query(`create view key_result_status AS
        (SELECT kr.id,
                CASE
                    WHEN lci.created_at < CURRENT_DATE - interval '6' DAY THEN TRUE
                    ELSE FALSE
                END AS is_outdated,
                CASE
                    WHEN lci.id IS NOT NULL THEN TRUE
                    ELSE FALSE
                END AS is_active,
                c.active,
                CASE
                    WHEN lci.value = kr.goal THEN 100
                    WHEN kr.goal = kr.initial_value THEN 0
                    ELSE greatest(least((100 * (coalesce(lci.value, 0) - kr.initial_value) / (kr.goal - kr.initial_value)), 100), 0)
                END AS progress,
                CASE
                    WHEN lcipw.value = kr.goal THEN 100
                    WHEN kr.goal = kr.initial_value THEN 0
                    ELSE greatest(least((100 * (coalesce(lcipw.value, 0) - kr.initial_value) / (kr.goal - kr.initial_value)), 100), 0)
                END AS previous_progress,
                CASE
                    WHEN lci.confidence IS NULL THEN 100
                    ELSE lci.confidence
                END AS confidence,
                CASE
                    WHEN lcipw.confidence IS NULL THEN 100
                    ELSE lcipw.confidence
                END AS previous_confidence,
                kr.objective_id,
                kr.team_id,
                c.id as cycle_id
        FROM "key_result" kr
        LEFT JOIN "key_result_latest_check_in" lci ON kr.id = lci.key_result_id
        LEFT JOIN "latest_check_in_week_before" lcipw ON kr.id = lcipw.key_result_id
        JOIN "objective" o ON kr.objective_id = o.id
        JOIN "cycle" c ON o.cycle_id = c.id
        WHERE o.mode = 'PUBLISHED'
    AND c.active IS TRUE)`)
    await queryRunner.query(`create view 
          objective_status AS
        (SELECT krs.objective_id,
                krs.team_id,
                bool_and(is_outdated) AS is_outdated,
                bool_or(is_active) AS is_active,
                avg(progress) AS progress,
                min(confidence) AS confidence,
                avg(previous_progress) AS previous_progress,
                min(previous_confidence) AS previous_confidence,
                krs.cycle_id,
                cy.team_id as company_id
        FROM "key_result_status" krs
        JOIN "objective" o ON krs.objective_id = o.id
        JOIN "cycle" cy ON o.cycle_id = cy.id
        GROUP BY krs.objective_id,
                  krs.team_id, krs.cycle_id, cy.team_id)`)
    await queryRunner.query(`create view team_status AS
          (SELECT os.team_id,
                  bool_and(is_outdated) AS is_outdated,
                  bool_or(is_active) AS is_active,
                  avg(progress) AS progress,
                  min(confidence) AS confidence,
                  avg(previous_progress) AS previous_progress,
                  min(previous_confidence) AS previous_confidence
          FROM "objective_status" os
          GROUP BY os.team_id)`)
    await queryRunner.query(`create  view cycle_status AS
          (SELECT o.cycle_id,
                  o.company_id,
                  bool_and(is_outdated) AS is_outdated,
                  bool_or(is_active) AS is_active,
                  least(greatest(avg(progress), 0), 100) AS progress,
                  min(confidence) AS confidence,
                  least(greatest(avg(previous_progress), 0), 100) AS previous_progress,
                  min(previous_confidence) AS previous_confidence
          FROM "objective_status" o
          WHERE o.team_id IS NOT NULL
          GROUP BY o.cycle_id,
                    o.company_id)`)
    await queryRunner.query(`create view key_result_current_status as 
          (SELECT kr.id,
                  CASE
                      WHEN (lci.created_at < (CURRENT_DATE - '6 days'::interval day)) THEN true
                      ELSE false
                  END AS is_outdated,
                  CASE
                      WHEN (lci.id IS NOT NULL) THEN true
                      ELSE false
                  END AS is_active,
              c.active,
                  CASE
                      WHEN (lci.value = (kr.goal)::double precision) THEN (100)::double precision
                      WHEN (kr.goal = kr.initial_value) THEN (0)::double precision
                      ELSE GREATEST(LEAST((((100)::double precision * (COALESCE(lci.value, (0)::real) - (kr.initial_value)::double precision)) / ((kr.goal - kr.initial_value))::double precision), (100)::double precision), (0)::double precision)
                  END AS progress,
                  CASE
                      WHEN (lci.confidence IS NULL) THEN 100
                      ELSE lci.confidence
                  END AS confidence,
              kr.objective_id,
              kr.team_id,
              c.id AS cycle_id
             FROM (((key_result kr
               LEFT JOIN "key_result_latest_check_in" lci ON ((kr.id = lci.key_result_id)))
               JOIN "objective" o ON ((kr.objective_id = o.id)))
               JOIN "cycle" c ON ((o.cycle_id = c.id)))
            WHERE ((o.mode = 'PUBLISHED'::objective_mode_enum) AND (c.active IS TRUE))
          )`)
    await queryRunner.query(`CREATE VIEW objective_current_status AS (
            SELECT krs.objective_id,
           krs.team_id,
           bool_and(krs.is_outdated) AS is_outdated,
           bool_or(krs.is_active) AS is_active,
           avg(krs.progress) AS progress,
           min(krs.confidence) AS confidence,
           krs.cycle_id,
           cy.team_id AS company_id
          FROM (("key_result_current_status" krs
            JOIN "objective" o ON ((krs.objective_id = o.id)))
            JOIN "cycle" cy ON ((o.cycle_id = cy.id)))
         GROUP BY krs.objective_id, krs.team_id, krs.cycle_id, cy.team_id
       )`)
    await queryRunner.query(`CREATE VIEW team_current_status as (
            SELECT team_id,
           bool_and(is_outdated) AS is_outdated,
           bool_or(is_active) AS is_active,
           avg(progress) AS progress,
           min(confidence) AS confidence
          FROM "objective_current_status" os
         GROUP BY team_id
       )`)
    await queryRunner.query(`create view cycle_current_status as (
            SELECT cycle_id,
           company_id,
           bool_and(is_outdated) AS is_outdated,
           bool_or(is_active) AS is_active,
           LEAST(GREATEST(avg(progress), (0)::double precision), (100)::double precision) AS progress,
           min(confidence) AS confidence
          FROM "objective_current_status" o
         WHERE (team_id IS NOT NULL)
         GROUP BY cycle_id, company_id
       )`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW cycle_status`)
    await queryRunner.query(`DROP VIEW cycle_current_status`)
    await queryRunner.query(`DROP VIEW team_status`)
    await queryRunner.query(`DROP VIEW team_current_status`)
    await queryRunner.query(`DROP VIEW objective_status`)
    await queryRunner.query(`DROP VIEW objective_current_status`)
    await queryRunner.query(`DROP VIEW key_result_status`)
    await queryRunner.query(`DROP VIEW key_result_current_status`)
    await queryRunner.query(`DROP VIEW latest_check_in_week_before`)
  }
}
