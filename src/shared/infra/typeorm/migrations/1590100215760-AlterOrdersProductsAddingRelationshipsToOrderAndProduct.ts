import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export default class AlterOrdersProductsAddingRelationshipsToOrderAndProduct1590100215760
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'orders_products',
      new TableForeignKey({
        name: 'orders_products_order',
        columnNames: ['order_id'],
        referencedTableName: 'orders',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'orders_products',
      new TableForeignKey({
        name: 'orders_products_product',
        columnNames: ['product_id'],
        referencedTableName: 'products',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'orders_products',
      'orders_products_order',
    );

    await queryRunner.dropForeignKey(
      'orders_products',
      'orders_products_product',
    );
  }
}
