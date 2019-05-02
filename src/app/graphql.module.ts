import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, concat } from 'apollo-link';
import { RetryLink } from 'apollo-link-retry';

const HttpGraphqlURI = 'https://play.hypi.io/graphql'; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink) {
  const token = 'eyJhbGciOiJSUzI1NiIsInppcCI6IkRFRiJ9.eNqszE0OgyAQhuG7zFoaLX_qWdgMMEYTtEYgaWO8eyleodtnvnlPmD_78tizDUuc6YARTgMHYVgNjKZeDTQGNlypSkyvgyodFAjjrQETxVT5fhm3HMIFzd1ftphwc_T_PGZfomQ910oh863WTEhumZ0mYs471_NOiUn5Ml4wwdhJKWTftlI2QO-9gn7KXvwgZltyAqmMOs6GoZREP0hmNSIjr_AptNbd1ML1BQAA__8.P6OLUzh-8rn1K0aieYF34RS2zT-rgC-p9A5ebhzCK0n3LU8yRd-5BrkWwsRg_SLqwgIDfHSRbzjWY-o0PoMu5A6f1bgW84tdiQOfNl8pascgbwf5ZCT1jccp1WvWKPKFwMuAaFYbSU2ZCCo4DCs-RtUw74QMN328sx8g5ONOmTvTlyPwALYfyCLZUWgyT5rDSvsUGOp5eDbzaAqIVp19OcSrTYkWs7GZxrVMR6XtuJjyR3ieCHvTJ6ibxaaUYtK8CitUgsRBeGy-XRaTpfGbgw3KlbnR5wsNTOYlgwMqk2Hhlx30Y6mJYbrrhvBLLgW2NmlN4hxaXMQ9TPv952b6Jg';

  const _retryLink = new RetryLink({
    delay: {
      initial: 1000,
      max: Infinity,
      jitter: true
    },
    attempts: {
      max: 10,
      retryIf: (error, _operation) => !!error
    }
  });

  const _httpLink =  httpLink.create({
    uri: HttpGraphqlURI,
    withCredentials: true,
  });


  const authMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext({ // add the authorization to the headers
      headers: {
        'hypi-domain': 'latest.todo.hypi.hypi.app',
        'Authorization': token,
      }
    });
    return forward(operation);
  });

  const link = ApolloLink.from([
    _retryLink,
    _httpLink,
  ]);

  return {
    link: concat(authMiddleware, link),
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
