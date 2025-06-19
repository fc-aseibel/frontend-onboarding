const request = require('supertest');
const server = require('./server'); 

let app; // Variable für den laufenden Server

beforeAll(() => {
  app = server.listen(3000); // Starte den Server
});

afterAll(() => {
  app.close(); // Stoppe den Server
});


describe('POI Service Mock API', () => {
  it('should return all categories', async () => {
    const response = await request(server).get('/categories');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should return POIs in radius with amenity', async () => {
    const response = await request(server)
      .get('/pois')
      .query({
        category: 'cafe',
        center_latitude: 53.5,
        center_longitude: 10.0,
        radius: 5,
      });
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach((poi) => {
      expect(poi.amenity).toBe('cafe');
    });
  });

  it('should return POIs in radius without amenity', async () => {
    const response = await request(server)
      .get('/pois')
      .query({
        center_latitude: 53.5,
        center_longitude: 10.0,
        radius: 5,
      });
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});