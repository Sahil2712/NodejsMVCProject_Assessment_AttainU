const assert = require('chai').assert;
const app = require('../app');
const request = require('supertest');

describe('Get requests',() => {
    it('app should return Welcome to the API', (done) => {
        request(app).get('/users').expect(200).end( (err,res) => {
            assert(res.body.message, "Welcome to the API");
        });
        done();
    });
});

describe('Post(signup) requests',() => {
    it('signup should be successful with no username or password and with passwordCheck', (done) => {
        request(app).post('/users/signup').send({username:"",password:{},passwordCheck:"123456"}).expect(200,done);
    });
    it('signup should be successful with username and a password and a passwordCheck', (done) => {
        request(app).post('/users/signup').send({username:"hello",password:"123456",passwordCheck:"123456"}).expect(200,done);
    });
    it('signup should be successful with a username but no password and no passwordCheck', (done) => {
        request(app).post('/users/signup').send({username:"hello",password:"",passwordCheck:""}).expect(200,done);
    });
    it('signup should be successful with no username but a password and incorrect passwordCheck', (done) => {
        request(app).post('/users/signup').send({username:"",password:"12",passwordCheck:"123456"}).expect(200,done);
    });
    it('signup should be successful with no username or password', (done) => {
        request(app).post('/users/signup').send({username:"",password:{},passwordCheck:"123456"}).expect(200,done);
    });
    it('signup should be successful with no username and a password and passwordCheck ', (done) => {
        request(app).post('/users/signup').send({username:"",password:"123456",passwordCheck:"123456"}).expect(200,done);
    });
    it('signup should be successful with a username and passwordCheck but no password', (done) => {
        request(app).post('/users/signup').send({username:"hello",password:"",passwordCheck:"123456"}).expect(200,done);
    });
    it('signup should be successful with no username but a password and incorrect passwordCheck', (done) => {
        request(app).post('/users/signup').send({username:"",password:"12",passwordCheck:"123456"}).expect(200,done);
    });
});

describe('Post(signin) requests',() => {
    it('signin should be successful with no username or password', (done) => {
        request(app).post('/users/signin').send({username:"",password:{}}).expect(200,done);
    });
    it('signin should be successful with username and a password', (done) => {
        request(app).post('/users/signin').send({username:"hello",password:"123456"}).expect(200,done);
    });
    it('signin should be successful with a username but no password', (done) => {
        request(app).post('/users/signin').send({username:"hello",password:""}).expect(200,done);
    });
    it('signin should be successful with no username but a password', (done) => {
        request(app).post('/users/signin').send({username:"",password:"123456"}).expect(200,done);
    });
});




describe('Post(jsonpatching) requests',() => {
    var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwMDZiNzc1YTkyYzA4M2EwODZiNWJlYyIsImlhdCI6MTYxMTA1OTkxM30.tl7SzSDbEhj30KP-W2x1G8V-ZbKx4MZ50I0AQuPdhlg";
    var jsonFile = { "jsonObject" :{"foo": "bar", "baz": "qux"}, "jsonPatch" :[ {"op": "replace","path": "/baz", "value": "boo"}]};
    var result = { "Patched": {"foo": "bar","baz": "boo"} };
    it('unsuccessful patch without auth', (done) => {
        request(app).post('/users/jsonpatch').send(jsonFile).expect(403,done);
    });
    it('unsuccessful patch with incorrect auth', (done) => {
        request(app).post('/users/jsonpatch').set({Authorization: token+"23"}).send(jsonFile).expect(403,done);
    });
    it('successful patch with auth', (done) => {
        request(app).post('/users/jsonpatch').set({Authorization: token}).send(jsonFile).expect(200,done);
    });
});

describe('Post(thumbnail creation) requests',() => {
  var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwMDZiNzc1YTkyYzA4M2EwODZiNWJlYyIsImlhdCI6MTYxMTA1OTkxM30.tl7SzSDbEhj30KP-W2x1G8V-ZbKx4MZ50I0AQuPdhlg";
    var jsonFile = { "url" : "https://cdn.pixabay.com/photo/2017/02/24/00/13/png-2093542_960_720.png"};
    var jsonFile2 = { "url" : "https://cdn.pixabay.com/photo/2017/02/24/00/13/png-2093542_960_720.txt"};
    it('unsuccessful thumbnail creation without auth', (done) => {
        request(app).post('/users/image').send(jsonFile).expect(403,done);
    });
    it('unsuccessful thumbnail creation with incorrect auth', (done) => {
        request(app).post('/users/image').set({Authorization: token+"23"}).send(jsonFile).expect(403,done);
    });
    it('unsuccessful thumbnail creation with incorrect file format', (done) => {
        request(app).post('/users/image').set({Authorization: token }).send(jsonFile2).expect(403,done);
    });
    it('successful thumbnail creation with auth', (done) => {
        request(app).post('/users/image').set({Authorization: token}).send(jsonFile).expect(200,done);
    });
});
