const app = require('./app');
const db = require('../models');
const sequelize = require('./config/database'); 

const PORT = process.env.PORT || 3000;

// sequelize.sync({ alter: true })  // or { force: true } to drop and recreate tables
//   .then(() => {
//     console.log('Database synced');
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.error('Error syncing database:', error);
//   });

// Sync database & start server
db.sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Unable to connect to the database:', err);
  });

  