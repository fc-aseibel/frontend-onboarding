const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('poi-data.json');
const middlewares = jsonServer.defaults();

// Standard Middleware
server.use(middlewares);

// Custom Endpoint für alle amenities
server.get('/categories', (req, res) => {
  const pois = router.db.get('pois').value();
  const amenities = [...new Set(
    pois
      .map(poi => poi.amenity)
      .filter(Boolean)
  )];
  res.jsonp(amenities);
});


// Dein Custom Radius-Filter, wenn gewünscht
server.get('/pois', (req, res) => {
  const amenity = req.query.category;
  const lat = parseFloat(req.query.center_latitude);
  const lon = parseFloat(req.query.center_longitude);
  const radius = parseFloat(req.query.radius); // km

  const pois = router.db.get('pois')
    .filter(poi => !amenity || poi.amenity === amenity)
    .filter(poi => {
      const R = 6371; // Earth radius km
      const dLat = (poi.lat - lat) * Math.PI / 180;
      const dLon = (poi.lon - lon) * Math.PI / 180;
      const a = Math.sin(dLat/2)**2 + Math.cos(lat * Math.PI/180) * Math.cos(poi.lat * Math.PI/180) * Math.sin(dLon/2)**2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c;
      return d <= radius;
    })
    .value();

  res.json(pois);
});


// Standard-API
server.use(router);

server.listen(3000, () => {
  console.log('✅ Mock-Server läuft auf http://localhost:3000');
});
