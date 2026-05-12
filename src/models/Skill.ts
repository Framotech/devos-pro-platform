import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  category: string;
  level: number;
  icon: string;
  order: number;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true },
    level: { type: Number, default: 3, min: 1, max: 5 },
    icon: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Skill = mongoose.models.Skill || mongoose.model<ISkill>('Skill', SkillSchema);
export default Skill;