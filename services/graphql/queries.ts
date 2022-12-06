import { gql } from "@apollo/client";

export const recipeQueries = {
  GET_ALL_RECIPES: gql`
    query ExampleQuery {
      recipes {
        id
        name
        description
        ingredients
        instructions
        verified
      }
    }
  `,
};
