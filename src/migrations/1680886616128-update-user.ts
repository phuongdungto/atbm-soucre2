import { MigrationInterface, QueryRunner } from "typeorm";

export class updateUser1680886616128 implements MigrationInterface {
    name = 'updateUser1680886616128'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`users\`
            ADD \`image\` varchar(255) NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`users\` DROP COLUMN \`image\`
        `);
    }

}
