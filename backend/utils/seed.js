require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Donor = require('../models/Donor');
const BloodRequest = require('../models/BloodRequest');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bloodconnect';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB at:', mongoUri);

    // Clear existing collections
    await User.deleteMany({});
    await Donor.deleteMany({});
    await BloodRequest.deleteMany({});
    console.log('[Seed] Cleared existing data.');

    // 1. Create Admin
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@bloodconnect.org',
      password: 'Password@123',
      phone: '+91 9876543210',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isActive: true
    });
    console.log('[Seed] Admin account created: admin@bloodconnect.org / Password@123');

    // 2. Create Recipients
    const recipientData = [
      {
        name: 'Rahul Sharma',
        email: 'rahul.recipient@gmail.com',
        password: 'Password@123',
        phone: '+91 9123456780',
        role: 'recipient',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        isActive: true
      },
      {
        name: 'Pooja Verma',
        email: 'pooja.recipient@gmail.com',
        password: 'Password@123',
        phone: '+91 9123456781',
        role: 'recipient',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        isActive: true
      },
      {
        name: 'Dr. Suresh Nair',
        email: 'dr.suresh@apollohospital.org',
        password: 'Password@123',
        phone: '+91 9123456782',
        role: 'recipient',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
        isActive: true
      }
    ];

    const recipients = await User.create(recipientData);
    console.log(`[Seed] Created ${recipients.length} recipient users.`);

    // 3. Create Donors (12 diverse donors)
    const donorsList = [
      {
        user: {
          name: 'Aarav Patel',
          email: 'aarav.donor@gmail.com',
          password: 'Password@123',
          phone: '+91 9811223344',
          role: 'donor',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          isActive: true
        },
        donor: {
          bloodGroup: 'O+',
          dateOfBirth: new Date('1996-05-14'),
          gender: 'Male',
          address: '42 MG Road, Indiranagar',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560038',
          isAvailable: true,
          lastDonationDate: new Date('2026-06-10')
        }
      },
      {
        user: {
          name: 'Priya Iyer',
          email: 'priya.donor@gmail.com',
          password: 'Password@123',
          phone: '+91 9822334455',
          role: 'donor',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
          isActive: true
        },
        donor: {
          bloodGroup: 'O-', // Universal Donor
          dateOfBirth: new Date('1998-11-20'),
          gender: 'Female',
          address: '15 Park Street, Flat 3B',
          city: 'Kolkata',
          state: 'West Bengal',
          pincode: '700016',
          isAvailable: true,
          lastDonationDate: new Date('2026-03-15')
        }
      },
      {
        user: {
          name: 'Vikram Malhotra',
          email: 'vikram.donor@gmail.com',
          password: 'Password@123',
          phone: '+91 9833445566',
          role: 'donor',
          avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
          isActive: true
        },
        donor: {
          bloodGroup: 'A+',
          dateOfBirth: new Date('1993-02-18'),
          gender: 'Male',
          address: '88 Marine Drive, Nariman Point',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400020',
          isAvailable: true,
          lastDonationDate: new Date('2026-08-01')
        }
      },
      {
        user: {
          name: 'Ananya Deshmukh',
          email: 'ananya.donor@gmail.com',
          password: 'Password@123',
          phone: '+91 9844556677',
          role: 'donor',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
          isActive: true
        },
        donor: {
          bloodGroup: 'A-',
          dateOfBirth: new Date('1995-09-05'),
          gender: 'Female',
          address: '102 FC Road, Shivajinagar',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411005',
          isAvailable: true,
          lastDonationDate: new Date('2026-01-20')
        }
      },
      {
        user: {
          name: 'Rohan Gupta',
          email: 'rohan.donor@gmail.com',
          password: 'Password@123',
          phone: '+91 9855667788',
          role: 'donor',
          avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
          isActive: true
        },
        donor: {
          bloodGroup: 'B+',
          dateOfBirth: new Date('1992-07-28'),
          gender: 'Male',
          address: '74 Connaught Place',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001',
          isAvailable: true,
          lastDonationDate: new Date('2026-05-12')
        }
      },
      {
        user: {
          name: 'Sneha Reddy',
          email: 'sneha.donor@gmail.com',
          password: 'Password@123',
          phone: '+91 9866778899',
          role: 'donor',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          isActive: true
        },
        donor: {
          bloodGroup: 'B-',
          dateOfBirth: new Date('1997-04-12'),
          gender: 'Female',
          address: '22 Banjara Hills, Road No 12',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500034',
          isAvailable: false, // Currently resting/unavailable
          lastDonationDate: new Date('2026-09-25')
        }
      },
      {
        user: {
          name: 'Karthik Sundaram',
          email: 'karthik.donor@gmail.com',
          password: 'Password@123',
          phone: '+91 9877889900',
          role: 'donor',
          avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
          isActive: true
        },
        donor: {
          bloodGroup: 'AB+', // Universal Recipient
          dateOfBirth: new Date('1994-12-30'),
          gender: 'Male',
          address: '55 Anna Nagar East',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600102',
          isAvailable: true,
          lastDonationDate: new Date('2026-04-05')
        }
      },
      {
        user: {
          name: 'Meera Chawla',
          email: 'meera.donor@gmail.com',
          password: 'Password@123',
          phone: '+91 9888990011',
          role: 'donor',
          avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
          isActive: true
        },
        donor: {
          bloodGroup: 'AB-',
          dateOfBirth: new Date('1999-03-22'),
          gender: 'Female',
          address: '33 SG Highway, Bodakdev',
          city: 'Ahmedabad',
          state: 'Gujarat',
          pincode: '380054',
          isAvailable: true,
          lastDonationDate: new Date('2026-02-18')
        }
      },
      {
        user: {
          name: 'Arjun Sen',
          email: 'arjun.donor@gmail.com',
          password: 'Password@123',
          phone: '+91 9899001122',
          role: 'donor',
          avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
          isActive: true
        },
        donor: {
          bloodGroup: 'O+',
          dateOfBirth: new Date('1991-08-16'),
          gender: 'Male',
          address: '19 Koramangala 4th Block',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560034',
          isAvailable: true,
          lastDonationDate: null
        }
      },
      {
        user: {
          name: 'Divya Nair',
          email: 'divya.donor@gmail.com',
          password: 'Password@123',
          phone: '+91 9900112233',
          role: 'donor',
          avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
          isActive: true
        },
        donor: {
          bloodGroup: 'A+',
          dateOfBirth: new Date('1996-10-09'),
          gender: 'Female',
          address: '14 Viman Nagar',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411014',
          isAvailable: true,
          lastDonationDate: new Date('2026-07-20')
        }
      },
      {
        user: {
          name: 'Manish Tiwari',
          email: 'manish.donor@gmail.com',
          password: 'Password@123',
          phone: '+91 9911223344',
          role: 'donor',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
          isActive: true
        },
        donor: {
          bloodGroup: 'B+',
          dateOfBirth: new Date('1990-06-25'),
          gender: 'Male',
          address: '61 Gomti Nagar',
          city: 'Lucknow',
          state: 'Uttar Pradesh',
          pincode: '226010',
          isAvailable: false,
          lastDonationDate: new Date('2026-10-01')
        }
      },
      {
        user: {
          name: 'Kavita Joshi',
          email: 'kavita.donor@gmail.com',
          password: 'Password@123',
          phone: '+91 9922334455',
          role: 'donor',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          isActive: true
        },
        donor: {
          bloodGroup: 'O-',
          dateOfBirth: new Date('1997-01-14'),
          gender: 'Female',
          address: '9 Rohini Sector 14',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110085',
          isAvailable: true,
          lastDonationDate: new Date('2026-05-19')
        }
      }
    ];

    const createdDonors = [];
    for (const item of donorsList) {
      const user = await User.create(item.user);
      const donor = await Donor.create({
        ...item.donor,
        userId: user._id
      });
      createdDonors.push({ user, donor });
    }
    console.log(`[Seed] Created ${createdDonors.length} donors with associated profiles.`);

    // 4. Create Blood Requests (6 realistic requests)
    const requestsData = [
      {
        requesterId: recipients[0]._id,
        patientName: 'Kishore Sharma',
        contactNumber: '+91 9123456780',
        bloodGroup: 'O+',
        unitsRequired: 2,
        hospitalName: 'Manipal Hospital, Old Airport Road',
        address: '98 HAL Old Airport Rd, Kodihalli',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560017',
        requiredDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        additionalNotes: 'Patient undergoing cardiac surgery tomorrow morning. Urgent need for fresh O+ units.',
        priority: 'Emergency',
        status: 'Accepted',
        donorResponses: [
          {
            donorId: createdDonors[0].donor._id, // Aarav Patel (O+)
            donorUserId: createdDonors[0].user._id,
            response: 'Accepted',
            respondedAt: new Date(Date.now() - 3600 * 1000),
            message: 'I can reach Manipal Hospital by 9 AM tomorrow.'
          }
        ]
      },
      {
        requesterId: recipients[1]._id,
        patientName: 'Sunita Verma',
        contactNumber: '+91 9123456781',
        bloodGroup: 'A-',
        unitsRequired: 3,
        hospitalName: 'Ruby Hall Clinic, Pune',
        address: '40 Sassoon Rd, Sangamvadi',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001',
        requiredDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
        additionalNotes: 'Critical platelet and whole blood requirement due to severe dengue complication.',
        priority: 'Emergency',
        status: 'Pending',
        donorResponses: []
      },
      {
        requesterId: recipients[2]._id,
        patientName: 'Anil Sengupta',
        contactNumber: '+91 9123456782',
        bloodGroup: 'B+',
        unitsRequired: 1,
        hospitalName: 'AIIMS New Delhi',
        address: 'Sri Aurobindo Marg, Ansari Nagar',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110029',
        requiredDate: new Date(Date.now() + 72 * 60 * 60 * 1000),
        additionalNotes: 'Scheduled orthopedic joint replacement surgery.',
        priority: 'Normal',
        status: 'Fulfilled',
        donorResponses: [
          {
            donorId: createdDonors[4].donor._id, // Rohan Gupta (B+)
            donorUserId: createdDonors[4].user._id,
            response: 'Accepted',
            respondedAt: new Date(Date.now() - 86400 * 1000 * 2),
            message: 'Donated blood at AIIMS blood bank successfully.'
          }
        ]
      },
      {
        requesterId: recipients[0]._id,
        patientName: 'Geeta Nair',
        contactNumber: '+91 9123456780',
        bloodGroup: 'AB-',
        unitsRequired: 2,
        hospitalName: 'Apollo Hospitals, Greams Road',
        address: '21 Greams Lane, Thousand Lights',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600006',
        requiredDate: new Date(Date.now() + 12 * 60 * 60 * 1000),
        additionalNotes: 'Emergency oncology therapy transfusion. Rare blood group required.',
        priority: 'Emergency',
        status: 'Pending',
        donorResponses: []
      },
      {
        requesterId: recipients[1]._id,
        patientName: 'Mohit Agarwal',
        contactNumber: '+91 9123456781',
        bloodGroup: 'O-',
        unitsRequired: 2,
        hospitalName: 'Fortis Memorial Research Institute',
        address: 'Sector 44, Opposite HUDA City Centre',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '122002',
        requiredDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        additionalNotes: 'Trauma accident victim emergency transfusion.',
        priority: 'Urgent',
        status: 'Donor Found',
        donorResponses: [
          {
            donorId: createdDonors[11].donor._id, // Kavita Joshi (O-)
            donorUserId: createdDonors[11].user._id,
            response: 'Accepted',
            respondedAt: new Date(Date.now() - 7200 * 1000),
            message: 'Available to donate, on the way to hospital.'
          }
        ]
      },
      {
        requesterId: recipients[2]._id,
        patientName: 'Tanvi Shah',
        contactNumber: '+91 9123456782',
        bloodGroup: 'A+',
        unitsRequired: 1,
        hospitalName: 'Lilavati Hospital & Research Centre',
        address: 'A-791, Bandra Reclamation, Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050',
        requiredDate: new Date(Date.now() - 86400 * 1000 * 5),
        additionalNotes: 'Post-operative recovery blood transfusion.',
        priority: 'Normal',
        status: 'Fulfilled',
        donorResponses: [
          {
            donorId: createdDonors[2].donor._id, // Vikram Malhotra (A+)
            donorUserId: createdDonors[2].user._id,
            response: 'Accepted',
            respondedAt: new Date(Date.now() - 86400 * 1000 * 6),
            message: 'Donation completed.'
          }
        ]
      }
    ];

    await BloodRequest.create(requestsData);
    console.log(`[Seed] Created ${requestsData.length} blood requests.`);

    console.log('\n======================================================');
    console.log(' SEEDING COMPLETED SUCCESSFULLY!');
    console.log(' Credentials for testing:');
    console.log(' 1. Admin: admin@bloodconnect.org / Password@123');
    console.log(' 2. Donor (Bangalore, O+): aarav.donor@gmail.com / Password@123');
    console.log(' 3. Donor (Kolkata, O-): priya.donor@gmail.com / Password@123');
    console.log(' 4. Donor (Mumbai, A+): vikram.donor@gmail.com / Password@123');
    console.log(' 5. Recipient: rahul.recipient@gmail.com / Password@123');
    console.log(' 6. Recipient: pooja.recipient@gmail.com / Password@123');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();
