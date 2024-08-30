export const FETCH_PRODUCT_QUERY = `
  query FetchProductsQuery() {
    shop {
      name
      products(first: 10) {
        nodes {
          id
          title
          tags
        }
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
      }
    }
  }
`;
