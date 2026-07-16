import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Hadith } from '../models/Hadith';
import { Announcement } from '../models/Announcement';
import { Charity } from '../models/Charity';
import { ContactInfo } from '../models/ContactInfo';
import { ArabicClass } from '../models/ArabicClass';

// Small inline Base64 SVG images representing Islamic geometric graphics for the carousel
const demoImages = [
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='100%' height='100%' fill='%230F5132'/><circle cx='200' cy='150' r='80' stroke='%23D4AF37' stroke-width='3' fill='none'/><path d='M200,20 L200,280 M50,150 L350,150' stroke='%23D4AF37' stroke-width='1.5' opacity='0.3'/><text x='50%' y='52%' font-family='serif' font-size='24' fill='%23D4AF37' text-anchor='middle'>Tajweed Lesson 1</text></svg>",
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='100%' height='100%' fill='%230A3D24'/><circle cx='200' cy='150' r='90' stroke='%23D4AF37' stroke-width='2' stroke-dasharray='5,5' fill='none'/><text x='50%' y='52%' font-family='serif' font-size='24' fill='%23D4AF37' text-anchor='middle'>Pronunciation Rules</text></svg>",
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='100%' height='100%' fill='%23124E3F'/><polygon points='200,50 250,150 350,150 270,220 300,320 200,250 100,320 130,220 50,150 150,150' fill='none' stroke='%23D4AF37' stroke-width='2'/><text x='50%' y='52%' font-family='serif' font-size='20' fill='%23D4AF37' text-anchor='middle'>Arabic Grammar</text></svg>"
];

export const seedDatabase = async (): Promise<void> => {
  try {
    // 1. Seed Admin User if none exist
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding default Admin credentials...');
      // Passwords are auto-hashed in pre-save hook, but let's hash it or create it directly
      await User.create({
        email: 'admin@masjid.com',
        password: 'admin123' // This will be auto-hashed by Mongoose pre-save hook
      });
      console.log('✔ Default Admin created: admin@masjid.com / admin123');
    }

    // 2. Seed Hadith if none exist
    const hadithCount = await Hadith.countDocuments();
    if (hadithCount === 0) {
      console.log('Seeding demo Hadith...');
      await Hadith.create({
        content: "Verily, actions are judged by intentions, and every person will have only what they intended.",
        source: "Sahih al-Bukhari & Sahih Muslim",
        active: true
      });
      console.log('✔ Demo Hadith seeded');
    }

    // 3. Seed Announcements if none exist
    const announcementCount = await Announcement.countDocuments();
    if (announcementCount === 0) {
      console.log('Seeding demo Announcements...');
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 5);

      await Announcement.create([
        {
          title: "Weekly Quran Study Circle",
          description: "Join us every Sunday after Isha prayer for our weekly Tafsir and Quranic sciences study circle. Everyone is welcome.",
          priority: "medium",
          pinned: true,
          expiryDate: tomorrow
        },
        {
          title: "Mosque Refurbishment Donations",
          description: "We are expanding the sister's section and repairing the main minaret. Please contribute generously through the Sadqah panel.",
          priority: "high",
          pinned: false,
          expiryDate: tomorrow
        }
      ]);
      console.log('✔ Demo Announcements seeded');
    }

    // 4. Seed Charity Details if none exist
    const charityCount = await Charity.countDocuments();
    if (charityCount === 0) {
      console.log('Seeding demo Charity Profile...');
      await Charity.create({
        upiId: "masjidfirdouse@sbi",
        accountName: "Masjid-E-Firdouse Trust",
        bankName: "State Bank of India",
        ifsc: "SBIN0004567",
        qrImage: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><rect width='100%' height='100%' fill='white'/><rect x='20' y='20' width='40' height='40' fill='black'/><rect x='140' y='20' width='40' height='40' fill='black'/><rect x='20' y='140' width='40' height='40' fill='black'/><rect x='50' y='50' width='100' height='100' fill='none' stroke='black' stroke-width='4'/><text x='50%' y='55%' font-family='sans-serif' font-size='10' fill='black' text-anchor='middle'>DEMO QR CODE</text></svg>"
      });
      console.log('✔ Demo Charity details seeded');
    }

    // 5. Seed Contact Information if none exist
    const contactCount = await ContactInfo.countDocuments();
    if (contactCount === 0) {
      console.log('Seeding demo Contact Profile...');
      await ContactInfo.create({
        phone: "+91 86322 12345",
        email: "contact@masjidfirdouse.com",
        address: "Ali Nagar, Guntur, Andhra Pradesh - 522001",
        whatsapp: "918632212345",
        youtube: "https://youtube.com/@masjidfirdouse",
        facebook: "https://facebook.com/masjidfirdouse"
      });
      console.log('✔ Demo Contact Details seeded');
    }

    // 6. Seed Arabic Classes if none exist
    const classCount = await ArabicClass.countDocuments();
    if (classCount === 0) {
      console.log('Seeding demo Arabic Classes blog posts...');
      await ArabicClass.create([
        {
          title: "Quranic Arabic Grammar for Beginners",
          description: "This comprehensive course is designed for beginners who want to read and understand the Quran. We cover Tajweed rules, grammar fundamentals, and pronunciation points. Classes are held in the main hall every Tuesday and Friday between Maghrib and Isha prayers.\n\nInstructor: Moulana Shaik Riyaz Saheb Miftahi.",
          videoUrl: "https://www.youtube.com/embed/5F_S2iLwPj0", // Sample Tajweed YouTube Lesson
          images: [demoImages[0], demoImages[1]]
        },
        {
          title: "Spoken Arabic and Daily Duas",
          description: "A fast-paced interactive class teaching conversational modern standard Arabic (Fusha) and morning/evening supplications. Great for youth and elder community members alike.\n\nAll study material is provided for free by the Maktab.",
          videoUrl: "https://www.youtube.com/embed/VlR7s49CqP8",
          images: [demoImages[2], demoImages[0]]
        }
      ]);
      console.log('✔ Demo Arabic Classes blog posts seeded');
    }

  } catch (error) {
    console.error(`Error seeding database: ${(error as Error).message}`);
  }
};
