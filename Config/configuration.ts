import applicationConfig from './application/application.config';
import databaseConfig from './database/database.config';
import s3Config from './s3/bucket.config';
import filesConfig from './files/files.config';

export default () => ({
  app: applicationConfig(),
  database: databaseConfig(),
  s3: s3Config(),
  files: filesConfig(),
}); 