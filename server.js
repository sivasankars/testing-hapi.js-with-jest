const Hapi = require('@hapi/hapi');
const users = [
    { id: 1, name: 'Siva' },
    { id: 2, name: 'Sivasankar' },
    { id: 3, name: 'Niralar' }
]

// Create server listening on port 3000
const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
        return 'Hello World!';
    }
});

server.route({
    method: 'POST',
    path: '/user',
    handler: (request, h) => {
        if (request.payload && request.payload.name) {
            let checkUser = users.find(user => user.name === request.payload.name);
            if (checkUser) {
                return h.response('User already exists').code(422);
            }
            return h.response('User added successfully').code(200);
        } else {
            return h.response('Invalid user').code(422);
        }
    }
});

server.route({
    method: 'GET',
    path: '/user/{id}',
    handler: (request, h) => {
        let user = users.find(user => user.id === parseInt(request.params.id));
        if (!user) {
            return h.response('User not exists').code(422);
        }
        return user;
    }
});

server.route({
    method: 'GET',
    path: '/user/list',
    handler: (request, h) => {
        return users;
    }
});

// Initiate the server
const init = async () => {
    await server.start();
    console.log('Server running on %ss', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();

module.exports = server;