import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddActiveCycleViews1706189188117 implements MigrationInterface {
  name = 'AddActiveCycleViews1706189188117'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create view key_result_latest_check_in as (
        select distinct on ("key_result_id") *
        from "key_result_check_in"
        order by "key_result_id", "created_at" desc
      );
  
      create index "cycle_active_idx" on "cycle" ("active") where ("active" = true);
  
      create index "objective_team_id_idx" on "objective" ("team_id");
  
      create view active_cycle_objective as (
          select o.*
          from "objective" o
          inner join "cycle" c on c.id = o."cycle_id"
          where c.active = true
      );
  
      create index "key_result_objective_id_idx" on "key_result" ("objective_id");
  
      create view active_cycle_key_result as (
          select kr.*
          from "key_result" kr
          inner join "active_cycle_objective" o on o.id = kr."objective_id"
      );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropView('key_result_latest_check_in')
    await queryRunner.dropView('active_cycle_objective')
    await queryRunner.dropView('active_cycle_key_result')
    await queryRunner.dropIndex('cycle', 'cycle_active_idx')
    await queryRunner.dropIndex('objective', 'objective_team_id_idx')
    await queryRunner.dropIndex('key_result', 'key_result_objective_id_idx')
  }
}
