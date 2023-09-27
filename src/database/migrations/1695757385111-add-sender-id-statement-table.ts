import {Column, MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class addSenderIdStatementTable1695757385111 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.addColumn(
        "statements",
        new TableColumn({
          name: "sender_id",
          type: "uuid",
          isNullable: true,
        })
      )

      const foreignKey = new TableForeignKey({
        columnNames: ["sender_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
        onUpdate: 'CASCADE'
    });
    await queryRunner.createForeignKey("statements", foreignKey);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropColumn(
        "statements",
        "sender_id"
      )
    }

}
