let userId
let token
let diaryId

describe('Backend API Tests', () => {
  it('create new user', () => {
    cy.request('POST', 'http://localhost:3001/api/users',{username:"Boyz005", password:"12345678", fullname:"John Doe"}) // Replace with your API endpoint
      .then((response) => {
        userId = response.body['id']


        expect(response.status).to.equal(201);
        expect(response.body).to.be.an('object');
      });
  });

  it('Login process', () => {
    cy.request('POST', 'http://localhost:3001/api/login', {username:"Boyz005", password:"12345678"}) // Replace with your API endpoint
      .then((response) => {
        token = response.body['token']
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('id');
      });
  });

  it('adding diary process', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3001/api/diary',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
        
      },
      body: {
        "title": 'judul 1',
        "content": 'isi 1',
      },
    }) 
      .then((response) => {
        diaryId = response.body['id']
        expect(response.status).to.equal(201);
        expect(response.body).to.be.an('object');
      });
  });

  it('delete diary process', () => {
    cy.request({
      method: 'DELETE',
      url: `http://localhost:3001/api/diary/${diaryId}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        
      },
    }) 
      .then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('object');
      });
  });

  it('Delete User', () => {
    cy.request('DELETE', `http://localhost:3001/api/users/${userId}`)
      .then((response) => {
        expect(response.status).to.equal(200);
      });
  });
})