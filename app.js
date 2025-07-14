const express = require('express');
const path = require('path');

const app = express();

app.get('/api/parts/:id', (req, res) => {
  res.status(200).json({ id: req.params.id });
});

app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server running on ${port}`));
}
