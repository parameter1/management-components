import gql from 'graphql-tag';

export default gql`

fragment UserRegistration on Content {
  userRegistration {
    isRequired
    startDate
    endDate
    siteIds
  }
}

`;
