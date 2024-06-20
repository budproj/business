import { MigrationInterface, QueryRunner } from 'typeorm'

export class teamQuarterlyActiveCycle1711225643248 implements MigrationInterface {
  name = 'teamQuarterlyActiveCycle1711225643248'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE OR REPLACE VIEW team_company
    AS WITH RECURSIVE team_tree(id, name, depth, is_root, parent_id, root_id) AS (
             SELECT team.id,
                team.name,
                0 AS "?column?",
                true AS bool,
                team.parent_id,
                team.id
               FROM team
              WHERE team.parent_id = team.id OR team.parent_id IS NULL
            UNION ALL
             SELECT tn.id,
                tn.name,
                tt.depth + 1,
                false AS bool,
                tt.id,
                tt.root_id
               FROM team tn
                 JOIN team_tree tt ON tn.parent_id = tt.id AND tn.id <> tt.id
            )
     SELECT DISTINCT ON (team_tree.id) team_tree.id AS team_id,
        team_tree.root_id AS company_id,
        team_tree.depth
       FROM team_tree
      ORDER BY team_tree.id, team_tree.depth DESC;`)
    await queryRunner.query(`CREATE OR REPLACE VIEW user_company
  AS SELECT DISTINCT tuu.user_id,
      tc.company_id
     FROM team_users_user tuu
       JOIN team_company tc ON tuu.team_id = tc.team_id;`)
    await queryRunner.query(`CREATE VIEW team_current_quarterly_active_cycle as (
            WITH quarterly_cycles AS (
                SELECT 
                    * 
                FROM 
                    cycle c 
                WHERE 
                    c.cadence = 'QUARTERLY' 
                    and c.date_start < current_date 
                    and c.active is true
            )
            SELECT 
                tc.team_id AS t_id,
                c.*
            FROM 
                team_company tc 
                JOIN 
                (
                    SELECT 
                        c.*,
                        ROW_NUMBER() 
                        over (PARTITION BY team_id ORDER BY created_at desc) AS rn
                  FROM quarterly_cycles c
                 ) c ON tc.company_id  = c.team_id 
                 WHERE rn = 1
            )`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW team_company`)
    await queryRunner.query(`DROP VIEW user_company`)
    await queryRunner.query(`DROP VIEW team_current_quarterly_active_cycle`)
  }
}
