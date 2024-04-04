import request from 'supertest';
import app from '../src/Server'

describe("Test Dispenser Operations", () =>{
    test("Create dispenser OK", async () => {
        const loginPayload = {"username": "admin", "password": "admin"};
        const login = await request(app)
            .post('/login')
            .send(loginPayload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        const dispenserPayload = {"flow_volume":0.065};
        const res = await request(app)
            .post('/dispenser')
            .send(dispenserPayload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Authorization',  login.body.token);

        expect(res.statusCode).toBe(201);
    });

    test("Create Dispenser invalid body", async () => {
        const loginPayload = {"username": "admin", "password": "admin"};
        const login = await request(app)
            .post('/login')
            .send(loginPayload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

            const dispenserPayload = {};
            const res = await request(app)
                .post('/dispenser')
                .send(dispenserPayload)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set('Authorization',  login.body.token);

            expect(res.statusCode).toBe(400);
    });

    test("Get dispenser OK", async () => {
        const loginPayload = {"username": "admin", "password": "admin"};
        const login = await request(app)
            .post('/login')
            .send(loginPayload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

            const dispenserPayload = {};
            const res = await request(app)
                .post('/dispenser/65355dcfc8061ef6fc994a24')
                .send(dispenserPayload)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set('Authorization',  login.body.token);

            expect(res.statusCode).toBe(200);
    });

    test("Get dispenser Not Found", async () => {
        const loginPayload = {"username": "admin", "password": "admin"};
        const login = await request(app)
            .post('/login')
            .send(loginPayload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

            const dispenserPayload = {};
            const res = await request(app)
                .post('/dispenser/1234')
                .send(dispenserPayload)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set('Authorization',  login.body.token);

            expect(res.statusCode).toBe(404);
    });

    test("Open dispenser", async () => {
        const loginPayload = {"username": "admin", "password": "admin"};
        const login = await request(app)
            .post('/login')
            .send(loginPayload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        const dispenserPayload = {"flow_volume":0.065};
        const res = await request(app)
            .post('/dispenser')
            .send(dispenserPayload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Authorization',  login.body.token);

        const statusPayload = {"status": "open"}
        const resChangeStatus = await request(app)
            .post('/dispenser/' + res.body.id + "/status")
            .send(statusPayload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Authorization',  login.body.token);
        

            expect(resChangeStatus.statusCode).toBe(201);
    });
 
    test("Close dispenser", async () => {
        const loginPayload = {"username": "admin", "password": "admin"};
        const login = await request(app)
            .post('/login')
            .send(loginPayload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        const dispenserPayload = {"flow_volume":0.065};
        const res = await request(app)
            .post('/dispenser')
            .send(dispenserPayload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Authorization',  login.body.token);

        const statusPayload = {"status": "close"}
        const resChangeStatus = await request(app)
            .post('/dispenser/' + res.body.id + "/status")
            .send(statusPayload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Authorization',  login.body.token);
        

            expect(resChangeStatus.statusCode).toBe(201);
    });
});