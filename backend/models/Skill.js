import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Frontend',
      'Backend',
      'Database',
      'DevOps',
      'Mobile',
      'Other',
      'ORM Framework',
      'Backend Framework(Java)',
      'Backend Framework(Python)'
    ]
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }
});

export default mongoose.models.Skill || mongoose.model('Skill', SkillSchema);
