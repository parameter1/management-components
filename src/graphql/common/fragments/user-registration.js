import gql from 'graphql-tag';

export default gql`

fragment ContentUserRegistrationFragment on Content {
  id
  touched
  userRegistration {
    isRequired
    startDate
    endDate
    siteIds
  }
}

`;
