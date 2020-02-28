import { Auth } from './types'
import { User } from './user'
import { Repository } from './repository'
import * as secret from '../secret.json'

let auth : Auth = secret;
let user = new User(auth, 'plaguera');
let repository = new Repository(auth, 'plaguera', 'tfm-testing');

repository.create_issue('Issue #3', 'Description #3')
repository.issues().then(i => console.log(i));
user.json('').then(i => console.log(i));