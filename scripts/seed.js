require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../app/models/user.model');
const Record = require('../app/models/record.model');
const Service = require('../app/models/service.model');

async function seedDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connected');
    
    // Clear existing data
    await User.deleteMany({});
    await Record.deleteMany({});
    await Service.deleteMany({});
    
    console.log('🗑️ Cleared existing data');
    
    // Test duplicate prevention
    console.log('\n🧪 Testing duplicate prevention...');
    
    try {
      // Create first admin
      const adminPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        email: 'admin@medapp.com',
        password: adminPassword,
        fullName: 'Admin User',
        phone: '+1234567890',
        birthDate: new Date('1980-01-01'),
        role: 'admin',
        isVerified: true
      });
      
      console.log('✅ Created admin user');
      
      // Try to create duplicate username (should fail)
      try {
        await User.create({
          username: 'admin',  // SAME USERNAME!
          email: 'admin2@medapp.com',
          password: adminPassword,
          fullName: 'Admin 2',
          phone: '+1234567891',
          birthDate: new Date('1980-01-01'),
          role: 'admin',
          isVerified: true
        });
        console.log('❌ TEST FAILED: Duplicate username was created!');
      } catch (dupError) {
        console.log('✅ TEST PASSED: Duplicate username prevented');
      }
      
      // Try to create duplicate email (should fail)
      try {
        await User.create({
          username: 'admin3',
          email: 'admin@medapp.com',  // SAME EMAIL!
          password: adminPassword,
          fullName: 'Admin 3',
          phone: '+1234567892',
          birthDate: new Date('1980-01-01'),
          role: 'admin',
          isVerified: true
        });
        console.log('❌ TEST FAILED: Duplicate email was created!');
      } catch (dupError) {
        console.log('✅ TEST PASSED: Duplicate email prevented');
      }
    } catch (error) {
      console.log('❌ Error in duplicate test:', error.message);
    }
    
    // Create doctors
    console.log('\n👨‍⚕️ Creating doctors...');
    
    const doctor1Password = await bcrypt.hash('doctor123', 10);
    const doctor1 = await User.create({
      username: 'drsmith',
      email: 'dr.smith@medapp.com',
      password: doctor1Password,
      fullName: 'Dr. John Smith',
      phone: '+1234567891',
      birthDate: new Date('1975-05-15'),
      role: 'doctor',
      specialization: 'Cardiology',
      isVerified: true
    });
    
    const doctor2Password = await bcrypt.hash('doctor456', 10);
    const doctor2 = await User.create({
      username: 'drjones',
      email: 'dr.jones@medapp.com',
      password: doctor2Password,
      fullName: 'Dr. Sarah Jones',
      phone: '+1234567892',
      birthDate: new Date('1985-08-20'),
      role: 'doctor',
      specialization: 'Pediatrics',
      isVerified: true
    });
    
    const doctor3Password = await bcrypt.hash('doctor789', 10);
    const doctor3 = await User.create({
      username: 'drwilliams',
      email: 'dr.williams@medapp.com',
      password: doctor3Password,
      fullName: 'Dr. Michael Williams',
      phone: '+1234567893',
      birthDate: new Date('1978-11-30'),
      role: 'doctor',
      specialization: 'Dermatology',
      isVerified: true
    });

    const doctor4Password = await bcrypt.hash('doctor321', 10);
    const doctor4 = await User.create({
      username: 'drbrown',
      email: 'dr.brown@medapp.com',
      password: doctor4Password,
      fullName: 'Dr. Emily Brown',
      phone: '+1234567894',
      birthDate: new Date('1982-06-12'),
      role: 'doctor',
      specialization: 'Neurology',
      isVerified: true
    });

    const doctor5Password = await bcrypt.hash('doctor654', 10);
    const doctor5 = await User.create({
      username: 'drmiller',
      email: 'dr.miller@medapp.com',
      password: doctor5Password,
      fullName: 'Dr. James Miller',
      phone: '+1234567895',
      birthDate: new Date('1980-09-08'),
      role: 'doctor',
      specialization: 'Therapy',
      isVerified: true
    });
    
    console.log(`✅ Created ${[doctor1, doctor2, doctor3, doctor4, doctor5].length} doctors`);
    
    // Create patients
    console.log('\n👤 Creating patients...');
    
    const patient1Password = await bcrypt.hash('patient123', 10);
    const patient1 = await User.create({
      username: 'johndoe',
      email: 'john.doe@example.com',
      password: patient1Password,
      fullName: 'John Doe',
      phone: '+1234567894',
      birthDate: new Date('1990-03-10'),
      role: 'patient',
      isVerified: true
    });
    
    const patient2Password = await bcrypt.hash('patient456', 10);
    const patient2 = await User.create({
      username: 'janedoe',
      email: 'jane.doe@example.com',
      password: patient2Password,
      fullName: 'Jane Doe',
      phone: '+1234567895',
      birthDate: new Date('1992-07-25'),
      role: 'patient',
      isVerified: true
    });
    
    const patient3Password = await bcrypt.hash('patient789', 10);
    const patient3 = await User.create({
      username: 'bobsmith',
      email: 'bob.smith@example.com',
      password: patient3Password,
      fullName: 'Bob Smith',
      phone: '+1234567896',
      birthDate: new Date('1985-12-15'),
      role: 'patient',
      isVerified: true
    });
    
    console.log(`✅ Created ${[patient1, patient2, patient3].length} patients`);
    
    // Create services
    console.log('\n🩺 Creating services...');
    
    await Service.create([
      {
        name: 'General Consultation',
        description: 'Routine check-up and consultation',
        price: 50,
        duration: 30,
        category: 'consultation'
      },
      {
        name: 'Cardiology Check-up',
        description: 'Heart health examination',
        price: 120,
        duration: 60,
        category: 'therapy'
      },
      {
        name: 'Dermatology Consultation',
        description: 'Skin health and treatment',
        price: 80,
        duration: 45,
        category: 'consultation'
      },
      {
        name: 'Pediatrics Check-up',
        description: "Children's health examination",
        price: 70,
        duration: 40,
        category: 'therapy'
      }
    ]);
    
    console.log('✅ Created 4 medical services');
    
    // Create appointments/records
    console.log('\n📅 Creating appointments...');
    
    await Record.create([
      {
        patientId: patient1._id,
        doctorId: doctor1._id,
        appointmentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        status: 'confirmed',
        reason: 'Annual heart checkup and blood pressure monitoring',
        symptoms: ['Fatigue', 'Occasional headaches', 'Chest discomfort'],
        duration: 60,
        price: 120
      },
      {
        patientId: patient2._id,
        doctorId: doctor2._id,
        appointmentDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        status: 'scheduled',
        reason: 'Child vaccination and health assessment',
        symptoms: ['Fever', 'Loss of appetite'],
        duration: 40,
        price: 70
      },
      {
        patientId: patient3._id,
        doctorId: doctor3._id,
        appointmentDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        status: 'confirmed',
        reason: 'Skin rash examination and treatment',
        symptoms: ['Itchy skin', 'Red patches', 'Dryness'],
        duration: 45,
        price: 80
      },
      {
        patientId: patient1._id,
        doctorId: doctor2._id,
        appointmentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        status: 'completed',
        reason: 'Follow-up after medication',
        symptoms: [],
        diagnosis: 'Hypertension stage 1',
        prescription: 'Lisinopril 10mg daily, Monitor blood pressure weekly',
        notes: 'Patient responding well to medication. Blood pressure improved from 150/95 to 130/85.',
        duration: 30,
        price: 50
      },
      {
        patientId: patient2._id,
        doctorId: doctor1._id,
        appointmentDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        status: 'completed',
        reason: 'Routine cardiac examination',
        symptoms: ['Palpitations', 'Shortness of breath'],
        diagnosis: 'Mild arrhythmia',
        prescription: 'Beta blockers as needed, Reduce caffeine intake',
        notes: 'Patient advised to maintain healthy lifestyle and regular exercise.',
        duration: 60,
        price: 120
      }
    ]);
    
    console.log('✅ Created 5 appointments');
    
    // Print summary
    console.log('\n📊 Database Seeding Complete!');
    console.log('='.repeat(50));
    console.log('📋 Test Users Created:');
    console.log('-'.repeat(50));
    console.log('Admin:', 'admin@medapp.com', '| Password: admin123');
    console.log('Doctor 1:', 'dr.smith@medapp.com', '| Password: doctor123 | Cardiology');
    console.log('Doctor 2:', 'dr.jones@medapp.com', '| Password: doctor456 | Pediatrics');
    console.log('Doctor 3:', 'dr.williams@medapp.com', '| Password: doctor789 | Dermatology');
    console.log('Patient 1:', 'john.doe@example.com', '| Password: patient123');
    console.log('Patient 2:', 'jane.doe@example.com', '| Password: patient456');
    console.log('Patient 3:', 'bob.smith@example.com', '| Password: patient789');
    console.log('='.repeat(50));
    console.log('\n🚀 You can now run: npm run dev');
    console.log('🌐 Open: http://localhost:3000');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Only run if called directly
if (require.main === module) {
  seedDatabase();
} else {
  module.exports = seedDatabase;
}