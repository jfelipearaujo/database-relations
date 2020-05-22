import { MigrationInterface, QueryRunner, TableUnique } from 'typeorm';

export default class AlterOrdersProductsToAddUniqueConstraintForOrdersAndProducts1590104847272
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createUniqueConstraint(
      'orders_products',
      new TableUnique({
        name: 'uq_order_product',
        columnNames: ['order_id', 'product_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropUniqueConstraint(
      'orders_products',
      'uq_order_product',
    );
  }
}
