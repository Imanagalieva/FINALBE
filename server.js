const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

// ================= EMAIL TRANSPORTER =================
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ================= RBAC ROLES =================
const ROLES = {
  PATIENT: 'patient',
  PREMIUM_PATIENT: 'premium_patient',
  DOCTOR: 'doctor',
  MODERATOR: 'moderator',
  ADMIN: 'admin'
};

// ================= EMAIL FUNCTIONS =================
async function sendWelcomeEmail(user) {
  try {
    const mailOptions = {
      from: `"MedApp Clinic" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Welcome to MedApp!',
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to MedApp Clinic!</h2>
        <p>Dear ${user.fullName},</p>
        <p>Thank you for registering with MedApp. Your account has been successfully created!</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Account Details:</h3>
          <p><strong>Username:</strong> ${user.username}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Role:</strong> ${user.role}</p>
        </div>
        <p>You can now book appointments with our doctors.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 14px;">This is an automated message. Please do not reply to this email.</p>
      </div>`
    };
    await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent to:', user.email);
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
  }
}

async function sendAppointmentEmail(appointment, patient, doctor) {
  try {
    const mailOptions = {
      from: `"MedApp Clinic" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to: patient.email,
      subject: 'Appointment Confirmation - MedApp Clinic',
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Appointment Confirmed!</h2>
        <p>Dear ${patient.fullName},</p>
        <p>Your appointment has been successfully scheduled.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Appointment Details:</h3>
          <p><strong>Doctor:</strong> Dr. ${doctor.name}</p>
          <p><strong>Specialization:</strong> ${doctor.specialization}</p>
          <p><strong>Date & Time:</strong> ${new Date(appointment.appointmentDate).toLocaleString()}</p>
          <p><strong>Reason:</strong> ${appointment.reason}</p>
          <p><strong>Status:</strong> ${appointment.status}</p>
        </div>
        <p>Please arrive 10 minutes before your scheduled time.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 14px;">This is an automated message. Please do not reply to this email.</p>
      </div>`
    };
    await transporter.sendMail(mailOptions);
    console.log('✅ Appointment email sent to:', patient.email);
  } catch (error) {
    console.error('❌ Error sending appointment email:', error);
  }
}

// ================= EXPRESS SETUP =================
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ================= STATIC HTML ROUTES =================
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'public', 'register.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));
app.get('/doctors', (req, res) => res.sendFile(path.join(__dirname, 'public', 'doctors.html')));
app.get('/appointments', (req, res) => res.sendFile(path.join(__dirname, 'public', 'appointments.html')));
app.get('/profile', (req, res) => res.sendFile(path.join(__dirname, 'public', 'profile.html')));
app.get('/book', (req, res) => res.sendFile(path.join(__dirname, 'public', 'book.html')));

// ================= MONGODB CONNECTION =================
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medapp';
let db;

async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(MONGODB_URI);
    db = client.db();
    console.log('✅ MongoDB connected');

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Mongoose connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// ================= MONGOOSE MODELS =================
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  phone: { type: String },
  birthDate: { type: Date },
  role: { type: String, enum: ['patient','premium_patient','doctor','moderator','admin'], default: 'patient' },
  specialization: { type: String },
  isPremium: { type: Boolean, default: false },
  premiumUntil: { type: Date },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const appointmentSchema = new mongoose.Schema({
  doctorId: { type: String, required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  appointmentDate: { type: Date, required: true },
  reason: { type: String, required: true },
  symptoms: [{ type: String }],
  diagnosis: { type: String },
  prescription: { type: String },
  notes: { type: String },
  duration: { type: Number, default: 30 },
  status: { type: String, enum: ['scheduled','confirmed','completed','cancelled'], default: 'scheduled' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);

// ================= AUTH MIDDLEWARE =================
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Требуется авторизация' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: 'Пользователь не найден' });

    req.user = { userId: user._id, role: user.role, isPremium: user.isPremium };
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Неверный токен' });
  }
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Требуется аутентификация' });
    if (!allowedRoles.includes(req.user.role)) return res.status(403).json({ message: 'Нет прав' });
    next();
  };
};

// ================= EXPRESS ROUTER =================
const router = express.Router();

// Debug route
router.get('/api/debug', async (req, res) => {
  try {
    const doctorsCount = await db.collection('doctors').countDocuments();
    const appointmentsCount = await Appointment.countDocuments();
    const usersCount = await User.countDocuments();

    res.json({ status: 'ok', collections: { doctors: doctorsCount, appointments: appointmentsCount, users: usersCount }, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ================= AUTH ROUTES =================
router.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, fullName, phone, birthDate } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(400).json({ message: 'Пользователь с таким email или именем уже существует' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, fullName, phone, birthDate, role: 'patient' });
    await user.save();

    await sendWelcomeEmail(user);

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
    res.status(201).json({ message: 'Регистрация успешна', token, user: { id: user._id, username, email, fullName, role: user.role, phone, birthDate } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Ошибка при регистрации', error: error.message });
  }
});

router.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Неверный email или пароль' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Неверный email или пароль' });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
    res.json({ message: 'Вход выполнен успешно', token, user: { id: user._id, username: user.username, email, fullName: user.fullName, role: user.role, phone: user.phone, birthDate: user.birthDate } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Ошибка при входе', error: error.message });
  }
});

// ================= DOCTORS ROUTES =================
router.get('/api/doctors', async (req, res) => {
  try {
    const doctors = await db.collection('doctors').find({}).toArray();
    const formattedDoctors = doctors.map(doctor => ({
      _id: doctor._id.toString(),
      fullName: doctor.name || doctor.fullName || 'Неизвестный врач',
      specialization: doctor.specialization || 'Не указано',
      email: doctor.email || 'email@example.com',
      phone: doctor.phone || '+7 (999) 999-99-99',
      experience: doctor.experience || 0,
      education: doctor.education || 'Не указано',
      rating: doctor.rating || 0,
      photo: doctor.photo || '',
      is_available: doctor.is_available !== false,
      description: doctor.description || '',
      price: doctor.price || 0,
      languages: doctor.languages || [],
      createdAt: doctor.created_at || doctor.createdAt || new Date()
    }));
    res.json(formattedDoctors);
  } catch (error) {
    console.error('❌ Ошибка при получении врачей:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении списка врачей', error: error.message });
  }
});

// ================= ADDITIONAL ROUTES =================
// (твой код для /api/doctors/:id, /api/appointments, /api/admin/... и т.д. вставляется сюда, без лишних скобок)

// Подключаем маршруты
app.use('/', router);

// 404 обработчик
app.use((req, res) => res.status(404).sendFile(path.join(__dirname, 'public', '404.html')));

// ================= START SERVER =================
async function startServer() {
  await connectToDatabase();
  app.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`));
}

startServer();
