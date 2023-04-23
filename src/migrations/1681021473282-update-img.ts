import { MigrationInterface, QueryRunner } from "typeorm";

export class updateImg1681021473282 implements MigrationInterface {
    name = 'updateImg1681021473282'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`image\` \`image\` varchar(255) NOT NULL DEFAULT 'default-avatar.jpg'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`image\` \`image\` varchar(255) NOT NULL
        `);
    }

}
