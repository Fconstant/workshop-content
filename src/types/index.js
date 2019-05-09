import { importSchema } from 'graphql-import';
import path from 'path';

const TYPE_DEFS = importSchema(path.resolve(__dirname, 'schema.graphql'))

export default TYPE_DEFS