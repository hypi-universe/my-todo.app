import { Apollo } from 'apollo-angular';
import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';

const findRealm = gql`
  query findRealm($arcql: String) {
    findRealm(arcql: $arcql) {
      name
    }
  }
`;

// const findQuery = gql``;

@Injectable()
export class AppService {
  constructor(private apollo: Apollo) {
  }

  findTodos(todo = 'hypi') {
    return this.apollo.watchQuery({
      query: findRealm,
      pollInterval: 2000,
      variables: {
        arcql: `name = '${todo}' `
      }
    }).valueChanges.pipe(
      map(res => res)
    );
  }
}
