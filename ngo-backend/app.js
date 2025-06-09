const express = require('express');
const cors = require('cors');
const path = require('path');

const certificatesRoutes = require('./routes/certificates');
const galleryRoutes = require('./routes/gallery');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/certificates', certificatesRoutes);
app.use('/api/gallery', galleryRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 