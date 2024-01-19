const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    
    user_id: { type: Number, required: true },

    user_name: { type: String, required: true },
    
    bank_accounts: { type: Array, required: true },
    
    id: { type: String, required: true },
    
    name: { type: String, required: true },
    
    accounts: {
      bank: { type: String, required: true },
    
      branch: { type: String, required: true },
    
      address: { type: String, required: true },
    
      city: { type: String, required: true },
    
      district: { type: String, required: true },
    
      state: { type: String, required: true },
    
      bank_code: { type: String, required: true },
    
      weather: {
    
        temp: { type: Number, required: true },
    
        humidity: { type: Number, required: true },
      },
    },
  });


const UserSchema = mongoose.model('UserSchema', userSchema);

module.exports = UserSchema;