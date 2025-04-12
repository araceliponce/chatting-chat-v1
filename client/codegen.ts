//esto supuestamente era para generar tipos automaticamente? olvidado

import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:3001/graphql', //GraphQL endpoint or local schema path
  documents: ['src/**/*.tsx', 'src/**/*.ts'], // all your GraphQL queries/mutations in your React app
  generates: {
    'src/__generated__/gql-types.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo'
      ],
      config: {
        withHooks: true, // enables `useQuery`, `useMutation`, etc.
        withHOC: false,
        withComponent: false
      }
    }
  },
  hooks: {
    afterAllFileWrite: ['prettier --write']
  }
};

export default config;
