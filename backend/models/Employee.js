const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'] 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
  },
  department: { 
    type: String, 
    required: [true, 'Department is required'] 
  },
  skills: { 
    type: [String],
    default: []
  },
  performanceScore: { 
    type: Number, 
    required: [true, 'Performance score is required'],
    min: [0, 'Score cannot be less than 0'],
    max: [100, 'Score cannot be more than 100']
  },
  experience: { 
    type: Number, 
    required: [true, 'Experience is required'],
    min: [0, 'Experience cannot be negative']
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Employee', EmployeeSchema);
