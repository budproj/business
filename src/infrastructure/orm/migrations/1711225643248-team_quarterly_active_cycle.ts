import { MigrationInterface, QueryRunner } from 'typeorm'

export class teamQuarterlyActiveCycle1711225643248 implements MigrationInterface {
  name = 'teamQuarterlyActiveCycle1711225643248'

  public async up(queryRunner: QueryRunner): Promise<void> {
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
    await queryRunner.query(`DROP VIEW team_current_quarterly_active_cycle`)
  }
}
