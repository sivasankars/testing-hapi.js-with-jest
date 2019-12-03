const server = require('./server.js'); // Import Server/Application

// Start application before running the test case
beforeAll((done) => {
    server.events.on('start', () => {
        done();
    });
});

// Stop application after running the test case
afterAll((done) => {
    server.events.on('stop', () => {
        done();
    });
    server.stop();
});

test('should success with server connection', async function () {
    const options = {
        method: 'GET',
        url: '/'
    };
    const data = await server.inject(options);
    expect(data.statusCode).toBe(200);
});

test('should fail in adding user due to no payload', async function () {
    const options = {
        method: 'POST',
        url: '/user',
    };
    const data = await server.inject(options);
    expect(data.statusCode).toBe(422);
    expect(data.result).toBe('Invalid user');
});

test('should fail in adding user, where user already exists', async function () {
    const options = {
        method: 'POST',
        url: '/user',
        payload: JSON.stringify({ name: 'Siva' })
    };
    const data = await server.inject(options);
    expect(data.statusCode).toBe(422);
    expect(data.result).toBe('User already exists');
});

test('should add user successfully', async function () {
    const options = {
        method: 'POST',
        url: '/user',
        payload: JSON.stringify({ name: 'Test' })
    };
    const data = await server.inject(options);
    expect(data.statusCode).toBe(200);
    expect(data.result).toBe('User added successfully');
});

test('should get user successfully', async function () {
    const data = await server.inject('/user/3');
    expect(data.statusCode).toBe(200);
    expect(data.result.id).toBe(3);
    expect(data.result.name).toBe('Niralar');
});

test('should fail in getting user', async function () {
    const data = await server.inject('/user/5');
    expect(data.statusCode).toBe(422);
    expect(data.result).toBe('User not exists');
});

test('should list user successfully', async function () {
    const data = await server.inject('/user/list');
    expect(data.statusCode).toBe(200);
    expect(data.result.length).toBe(3);
});