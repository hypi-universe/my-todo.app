import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, concat } from 'apollo-link';

const uri = 'https://api2.hypi.io/graphql'; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink) {

  const authMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext({ // add the authorization to the headers
      headers: {
        'hypi-domain': 'latest.store.hypi.hypi.app',
        // 'Authorization': auth_token ? `${auth_token}` : auth_token,
      }
    });
    return forward(operation);
  });


  return {
    link: concat(authMiddleware, httpLink.create({uri})),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ ApolloModule, HttpLinkModule ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [ HttpLink ],
    },
  ],
})
export class GraphQLModule {
}
