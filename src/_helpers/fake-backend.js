import {Role} from './';
 

const fakeBackend = () => {
    let users = [{
        id: 1,
        username: 'test',
        password: 'test',
        firstName: 'Test',
        lastName: 'User'
    }];

    let users1 = [{ 
        id: 1,
        title: 'Mr',
        firstName: 'Joe',
        lastName: 'Bloggs',
        email: 'joe@bloggs.com',
        role: Role.User,
        password: 'joe123'
    }];

    
    let realFetch = window.fetch;
    window.fetch = function (url, opts) { 
        return new Promise((resolve, reject) => { 
            setTimeout(handleRoute, 500); 
            function handleRoute() { 
                const { method } = opts;
                switch (true) {
                    case url.endsWith('/users/authenticate'):
                        return authenticate();
                    case url.endsWith('/users') && opts.method === 'GET':
                        return getUsers1();
                    case url.endsWith('/users') && method === 'GET':
                        return getUsers1();
                    case url.match(/\/users\/\d+$/) && method === 'GET':
                        return getUserById();
                    case url.endsWith('/users') && method === 'POST':
                        return createUser();
                    case url.match(/\/users\/\d+$/) && method === 'PUT':
                        return updateUser();
                    case url.match(/\/users\/\d+$/) && method === 'DELETE':
                        return deleteUser(); 
                    default:
                        // pass through any requests not handled above
                        return realFetch(url, opts)
                            .then(response => resolve(response))
                            .catch(error => reject(error));
                }
            }

            // route functions

            function authenticate() {
                const {
                    username,
                    password
                } = body();
                const user = users.find(x => x.username === username && x.password === password);

                if (!user) return error('Username or password is incorrect');

                return ok({
                    id: user.id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    token: 'fake-jwt-token'
                });
            }

            function getUsers() {
                if (!isAuthenticated()) return unauthorized();
                return ok(users);
            }



            function getUsers1() { 
                return ok(users1);
            }

            function getUserById() {
                let user = users1.find(x => x.id === idFromUrl());
                return ok(user);
            }

            function createUser() {
                const user = body();

                if (users1.find(x => x.email === user.email)) {
                    return error(`User with the email ${user.email} already exists`);
                }

                // assign user id and a few other properties then save
                user.id = newUserId();
                user.dateCreated = new Date().toISOString();
                delete user.confirmPassword;
                users1.push(user); 

                return ok();
            }

            function updateUser() {
                let params = body();
                let user = users1.find(x => x.id === idFromUrl());

                // only update password if included
                if (!params.password) {
                    delete params.password;
                }
                // don't save confirm password
                delete params.confirmPassword;

                // update and save user
                Object.assign(user, params); 

                return ok();
            }

            function deleteUser() {
                users1 = users1.filter(x => x.id !== idFromUrl()); 
                return ok();
            }
            // helper functions

            function ok(body) {
                resolve({
                    ok: true,
                    text: () => Promise.resolve(JSON.stringify(body))
                })
            }

            function unauthorized() {
                resolve({
                    status: 401,
                    text: () => Promise.resolve(JSON.stringify({
                        message: 'Unauthorized'
                    }))
                })
            }

            function error(message) {
                resolve({
                    status: 400,
                    text: () => Promise.resolve(JSON.stringify({
                        message
                    }))
                })
            }

            function isAuthenticated() {
                return opts.headers['Authorization'] === 'Bearer fake-jwt-token';
            }

            function body() {
                return opts.body && JSON.parse(opts.body);
            }

            function idFromUrl() {
                const urlParts = url.split('/');
                return parseInt(urlParts[urlParts.length - 1]);
            }

            function newUserId() {
                return users1.length ? Math.max(...users1.map(x => x.id)) + 1 : 1;
            }
        });
    }
}

export default fakeBackend;