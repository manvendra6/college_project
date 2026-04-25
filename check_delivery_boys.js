import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userModel from './server/src/Models/user.model.js';

dotenv.config({ path: './server/src/.env' });

async function checkDeliveryBoys() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    const deliveryBoys = await userModel.find({ role: 'delivery Boy' });
    console.log('Delivery Boys found:', deliveryBoys.length);
    deliveryBoys.forEach(boy => console.log(`- ${boy.fullName} (${boy.email})`));
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkDeliveryBoys();
