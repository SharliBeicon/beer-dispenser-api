import request from 'supertest';
import app from '../src/Server'

describe("Test User/Authentication Operations", () =>{
    

    test("Register user already exists", async() => {
        const payload = {"username": "userTest", "password": "userTest", "isAdmin": false};

        const res = await request(app)
            .post('/register')
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

            expect(res.body).toEqual("User already exists");
    });

    test("Register user invalid body", async() => {
        const payload = {"username": "userTest"};

        const res = await request(app)
            .post('/register')
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

            expect(res.body).toEqual("Body is not formated properly");
    });

    test("Login OK", async() => {
        const payload = {"username": "userTest", "password": "userTest"};

        const res = await request(app)
            .post('/login')
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

            expect(res.body.token).toBeDefined();
    });

    test("Login user does not exist", async() => {
        const payload = {"username": "asdfafsfa", "password": "asdasfa"};

        const res = await request(app)
            .post('/login')
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

            expect(res.body).toEqual("Invalid credentials");
    });

    test("Login invalid credentials", async() => {
        const payload = {"username": "userTest", "password": "asdasfa"};

        const res = await request(app)
            .post('/login')
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

            expect(res.body).toEqual("Invalid credentials");
    });
    test("Login invalid body", async() => {
        const payload = {"username": "userTest"};

        const res = await request(app)
            .post('/login')
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

            expect(res.body).toEqual("Body is not formated properly");
    });

    test("Missing token", async() => {
        const payload = {"flow_volume": 0.067};

        const res = await request(app)
            .post('/dispenser')
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

            expect(res.body).toEqual("Unauthorized. Missing token");
    });

    test("Invalid token", async()=>{
        const payload = {"flow_volume": 0.065};

        const res = await request(app)
            .post('/dispenser') 
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Authorization', "asdfasdfasdfasdf");

        expect(res.body).toEqual("Unauthorized. Invalid token");
    });

    test("Admin operation with no admin user", async()=>{
        const payloadLogin = {"username": "userTest", "password": "userTest"};
        const payloadCreate = {"flow_volume": 0.065};

        const resLogin = await request(app)
            .post('/login')
            .send(payloadLogin)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        const resCreate = await request(app)
            .post('/dispenser')
            .send(payloadCreate)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Authorization', resLogin.body.token);

        expect(resCreate.body).toEqual("Unauthorized. User is not admin");
    });
});