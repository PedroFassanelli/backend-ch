const mongoose = require('mongoose');

const connectDB = async () => {
    try {
      await mongoose.connect('mongodb+srv://pedrofassanelli:tfG0EMHpJU4G3V1Q@cluster0.tbrc5.mongodb.net/backendCH?retryWrites=true&w=majority&appName=Cluster0', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('✅ Conectado a MongoDB');
    } catch (error) {
      console.error('❌ Error al conectar a MongoDB:', error);
      process.exit(1);
    }
  };
  
  module.exports = connectDB;