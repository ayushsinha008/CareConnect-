
import React from 'react';
import { 
  Stethoscope, 
  Brain, 
  Baby, 
  Heart, 
  Activity, 
  Eye, 
  Bone, 
  Microscope,
  Droplets,
  Zap,
  Smile,
  Syringe,
  AlertCircle
} from 'lucide-react';

export const SPECIALITIES = [
  { id: '1', key: 'gen', icon: <Stethoscope className="w-7 h-7" />, color: 'bg-blue-100 text-blue-600' },
  { id: '2', key: 'psych', icon: <Brain className="w-7 h-7" />, color: 'bg-purple-100 text-purple-600' },
  { id: '3', key: 'gyn', icon: <Droplets className="w-7 h-7" />, color: 'bg-pink-100 text-pink-600' },
  { id: '4', key: 'gastro', icon: <Activity className="w-7 h-7" />, color: 'bg-green-100 text-green-600' },
  { id: '5', key: 'pedia', icon: <Baby className="w-7 h-7" />, color: 'bg-yellow-100 text-yellow-600' },
  { id: '6', key: 'endo', icon: <Syringe className="w-7 h-7" />, color: 'bg-orange-100 text-orange-600' },
  { id: '7', key: 'derm', icon: <Zap className="w-7 h-7" />, color: 'bg-red-100 text-red-600' },
  { id: '8', key: 'uro', icon: <AlertCircle className="w-7 h-7" />, color: 'bg-indigo-100 text-indigo-600' },
  { id: '9', key: 'neuro', icon: <Brain className="w-7 h-7" />, color: 'bg-slate-100 text-slate-600' },
  { id: '10', key: 'ortho', icon: <Bone className="w-7 h-7" />, color: 'bg-amber-100 text-amber-600' },
  { id: '11', key: 'oph', icon: <Eye className="w-7 h-7" />, color: 'bg-cyan-100 text-cyan-600' },
  { id: '12', key: 'dentist', icon: <Smile className="w-7 h-7" />, color: 'bg-blue-50 text-blue-400' },
];

export const MOCK_DOCTORS = [
  {
    id: 'doc1',
    name: 'Dr. Sarah Wilson',
    speciality: 'General Physician',
    experience: 8,
    rating: 4.8,
    fee: 500,
    avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200&h=200',
    availability: ['Morning', 'Afternoon'],
    gender: 'female',
    status: 'AVAILABLE'
  },
  {
    id: 'doc2',
    name: 'Dr. James Miller',
    speciality: 'Cardiologist',
    experience: 12,
    rating: 4.9,
    fee: 800,
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200&h=200',
    availability: ['Afternoon'],
    gender: 'male',
    status: 'BUSY'
  },
  {
    id: 'doc3',
    name: 'Dr. Emily Chen',
    speciality: 'Psychologist',
    experience: 6,
    rating: 4.7,
    fee: 600,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200&h=200',
    availability: ['Morning', 'Evening'],
    gender: 'female',
    status: 'AVAILABLE'
  },
  {
    id: 'doc4',
    name: 'Dr. Michael Roberts',
    speciality: 'Pediatrician',
    experience: 15,
    rating: 5.0,
    fee: 900,
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200&h=200',
    availability: ['Morning'],
    gender: 'male',
    status: 'OFFLINE'
  }
];
