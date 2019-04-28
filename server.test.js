const expect = require('expect');
const server = require('./server.js');

beforeAll((done) => {
    server.events.on('start', () => {
        done();
    });
});

afterAll((done) => {
    server.events.on('stop', () => {
        done();
    });
    server.stop();
});

test('should success with server connection', async function (done) {
    expect.assertions(1);
    const options = {
        method: 'GET',
        url: '/'
    };
    const data = await server.inject(options);
    expect(data.statusCode).toBe(200);
    done();
});

test('should fail in adding user due to no payload', async function (done) {
    expect.assertions(2);
    const options = {
        method: 'POST',
        url: '/user',
    };
    const data = await server.inject(options);
    expect(data.statusCode).toBe(422);
    expect(data.result).toBe('Invalid user');
    done();
});

test('should fail in adding user, where user already exists', async function (done) {
    expect.assertions(2);
    const options = {
        method: 'POST',
        url: '/user',
        payload: JSON.stringify({ name: 'Siva' })
    };
    const data = await server.inject(options);
    expect(data.statusCode).toBe(422);
    expect(data.result).toBe('User already exists');
    done();
});

test('should add user successfully', async function (done) {
    expect.assertions(2);
    const options = {
        method: 'POST',
        url: '/user',
        payload: JSON.stringify({ name: 'Test' })
    };
    const data = await server.inject(options);
    expect(data.statusCode).toBe(200);
    expect(data.result).toBe('User added successfully');
    done();
});

test('should get user successfully', async function (done) {
    expect.assertions(3);
    const data = await server.inject('/user/3');
    expect(data.statusCode).toBe(200);
    expect(data.result.id).toBe(3);
    expect(data.result.name).toBe('Niralar');
    done();
});

test('should fail in getting user', async function (done) {
    expect.assertions(2);
    const data = await server.inject('/user/5');
    expect(data.statusCode).toBe(422);
    expect(data.result).toBe('User not exists');
    done();
});

test('should list user successfully', async function (done) {
    expect.assertions(2);
    const data = await server.inject('/user/list');
    expect(data.statusCode).toBe(200);
    expect(data.result.length).toBe(3);
    done();
});