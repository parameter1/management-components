import gql from 'graphql-tag';
import fragment from '../fragments/user-registration';

export default gql`

mutation contentUserRegistration($input: ContentUserRegistrationMutationInput!) {
  contentUserRegistration(input: $input) {
    ...UserRegistration
  }
}

${fragment}

`;
