import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddCommentCounterToKeyResultTable1684946887066 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "key_result" ADD COLUMN "comment_count" jsonb NOT NULL DEFAULT '{"issue": 0, "comment": 0, "praisal": 0, "question": 0, "alignment": 0, "suggestion": 0, "improvement": 0}'`,
    )
    await queryRunner.query(`
    CREATE OR REPLACE FUNCTION update_comment_count()
      RETURNS TRIGGER AS $$
      BEGIN
        IF TG_OP = 'INSERT' THEN
          UPDATE "key_result"
          SET comment_count = jsonb_set(
            comment_count,
            ARRAY[NEW.type::text],
            (COALESCE(comment_count->>NEW.type::text, '0')::int + 1)::text::jsonb
        )
          WHERE id = NEW.key_result_id;
        ELSIF TG_OP = 'DELETE' THEN
        UPDATE "key_result"
        SET comment_count = jsonb_set(
          comment_count,
          ARRAY[OLD.type::text],
          (COALESCE(comment_count->>OLD.type::text, '0')::int - 1)::text::jsonb
        )
        WHERE id = OLD.key_result_id;
        END IF;
          RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;


      CREATE TRIGGER increment_comment_count
      AFTER INSERT ON "key_result_comment"
      FOR EACH ROW
      EXECUTE FUNCTION update_comment_count();
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "key_resultt" DROP COLUMN "comment_count"`)
    await queryRunner.query(
      'DROP TRIGGER IF EXISTS increment_comment_count ON "key_result_comment"',
    )
  }
}
