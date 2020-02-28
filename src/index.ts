import { Auth } from './types';
import { User } from './user'
import { Repository } from './repository'

let auth : Auth = { token: '6ed125f6941d18de564195160615f99890e08f87', username: '', password:'' };
let user = new User(auth, 'plaguera');
let repository = new Repository(auth, 'plaguera', 'tfm-testing');

repository.json('issues').then(i => console.log(i));
user.json('').then(i => console.log(i));