// utils/transaction.util.ts
import { DataSource, EntityManager } from 'typeorm';

export async function runInTransaction<T>(
  dataSource: DataSource,
  callback: (manager: EntityManager) => Promise<T>,
  existingManager?: EntityManager
): Promise<T> {
  if (existingManager) {
    // If an EntityManager is passed, just use it
    return callback(existingManager);
  }

  const queryRunner = dataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const result = await callback(queryRunner.manager);
    await queryRunner.commitTransaction();
    return result;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}
