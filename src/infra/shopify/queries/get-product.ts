export const GET_PRODUCT_QUERY = `
  query ProductQuery($id: ID!) {
    product(id: $id) {
      id
      title
      handle
    }
  }
`;
