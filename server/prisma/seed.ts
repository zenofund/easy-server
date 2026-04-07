import { PrismaClient } from '@prisma/client';
<<<<<<< HEAD
import bcrypt from 'bcryptjs';
=======
>>>>>>> c0d2170c979d123d4ebc2bcf6dc243b6f785be73

const prisma = new PrismaClient();

async function main() {
<<<<<<< HEAD
  console.log('Start seeding ...');

  const adminHashedPassword = await bcrypt.hash('Huce2026@@##', 10);
  const commonHashedPassword = await bcrypt.hash('password123', 10);

  // Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'superhero@huceautos.com' },
    update: {
      password: adminHashedPassword,
      role: 'ADMIN',
    },
    create: {
      email: 'superhero@huceautos.com',
      password: adminHashedPassword,
      firstName: 'Super',
      lastName: 'Hero',
      role: 'ADMIN',
      verified: true,
    },
  });

  console.log(`Created admin with id: ${admin.id}`);

  // Create Seller
  const seller = await prisma.user.upsert({
    where: { email: 'seller@example.com' },
    update: {},
    create: {
      email: 'seller@example.com',
      password: commonHashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'SELLER',
      verified: true,
      sellerProfile: {
        create: {
          type: 'INDIVIDUAL',
          address: '123 Lagos Way',
          verified: true
        }
      }
    },
  });

  console.log(`Created seller with id: ${seller.id}`);

  // Create Buyer
  const buyerPassword = await bcrypt.hash('Buyer123', 10);
  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@example.com' },
    update: {},
    create: {
      email: 'buyer@example.com',
      password: buyerPassword,
      firstName: 'Test',
      lastName: 'Buyer',
      role: 'BUYER',
      verified: true,
    },
  });

  console.log(`Created buyer with id: ${buyer.id}`);

  // Create Cars
  const carsData = [
    {
      title: 'Toyota Camry 2020',
      description: 'Clean foreign used Toyota Camry 2020. Full option with reverse camera and leather seats.',
      price: 15000000,
      year: 2020,
      make: 'Toyota',
      model: 'Camry',
      mileage: 25000,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      bodyType: 'Sedan',
      color: 'Silver',
      condition: 'Foreign Used',
      // status will be set in create
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=250&fit=crop',
        'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400&h=250&fit=crop'
      ]),
      features: JSON.stringify(['Leather Seats', 'Reverse Camera', 'Bluetooth', 'Alloy Wheels'])
    },
    {
      title: 'Mercedes-Benz C300 2018',
      description: 'Tokunbo Mercedes Benz C300 4Matic. Accident free, buy and drive.',
      price: 22000000,
      year: 2018,
      make: 'Mercedes-Benz',
      model: 'C300',
      mileage: 40000,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      bodyType: 'Sedan',
      color: 'Black',
      condition: 'Foreign Used',
      // status will be set in create
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&h=250&fit=crop'
      ]),
      features: JSON.stringify(['Panoramic Roof', 'AMG Kit', 'Keyless Entry'])
    },
    {
      title: 'Lexus RX 350 2016',
      description: 'Lexus RX 350 Full Option. Navigation, thumbstart, power boot.',
      price: 18500000,
      year: 2016,
      make: 'Lexus',
      model: 'RX 350',
      mileage: 55000,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      bodyType: 'SUV',
      color: 'White',
      condition: 'Nigerian Used',
      // status will be set in create
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=250&fit=crop'
      ]),
      features: JSON.stringify(['Power Boot', 'Navigation', 'Thumbstart'])
    },
    {
      title: 'Honda Accord 2019',
      description: 'Sport trim Honda Accord. Very clean engine and gear.',
      price: 13000000,
      year: 2019,
      make: 'Honda',
      model: 'Accord',
      mileage: 30000,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      bodyType: 'Sedan',
      color: 'Blue',
      condition: 'Foreign Used',
      // status will be set in create
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=250&fit=crop'
      ]),
      features: JSON.stringify(['Sport Mode', 'Lane Assist', 'CarPlay'])
    }
  ];

  for (const car of carsData) {
    // Check if car already exists by title to avoid duplicates on re-seed
    const existingCar = await prisma.car.findFirst({
      where: { title: car.title, sellerId: seller.id }
    });

    if (!existingCar) {
      const createdCar = await prisma.car.create({
        data: {
          ...car,
          sellerId: seller.id,
          status: 'AVAILABLE'
        }
      });
      console.log(`Created car: ${createdCar.title}`);
    } else {
      console.log(`Car already exists: ${car.title}`);
    }
  }

  console.log('Seeding finished.');
=======
  const templates = [
    {
      title: 'Tenancy Agreement (Residential)',
      category: 'Property',
      sub_category: 'Lease',
      description: 'Standard residential tenancy agreement for Nigeria.',
      structure: {
        landlord_name: { label: 'Landlord Name', type: 'text', placeholder: 'Full name of landlord' },
        tenant_name: { label: 'Tenant Name', type: 'text', placeholder: 'Full name of tenant' },
        property_address: { label: 'Property Address', type: 'text', placeholder: 'Full address of the property' },
        rent_amount: { label: 'Rent Amount', type: 'text', placeholder: 'Annual rent amount' },
        start_date: { label: 'Start Date', type: 'date', placeholder: 'Commencement date' },
        duration: { label: 'Duration', type: 'text', placeholder: 'e.g., 1 year' }
      },
      system_prompt: 'Draft a standard Nigerian Residential Tenancy Agreement. Include covenants for landlord and tenant, rent review clause, and termination clause.'
    },
    {
      title: 'Power of Attorney (General)',
      category: 'Corporate',
      sub_category: 'Agency',
      description: 'General Power of Attorney appointing an agent.',
      structure: {
        donor_name: { label: 'Donor Name', type: 'text', placeholder: 'Person giving power' },
        donee_name: { label: 'Donee Name', type: 'text', placeholder: 'Person receiving power' },
        powers: { label: 'Powers Granted', type: 'textarea', placeholder: 'List specific powers granted...' }
      },
      system_prompt: 'Draft a General Power of Attorney under Nigerian law. Ensure it is by deed if it relates to land.'
    },
    {
      title: 'Employment Contract',
      category: 'Corporate',
      sub_category: 'HR',
      description: 'Standard employment contract for permanent staff.',
      structure: {
        employer_name: { label: 'Employer Name', type: 'text', placeholder: 'Company name' },
        employee_name: { label: 'Employee Name', type: 'text', placeholder: 'Full name of employee' },
        position: { label: 'Position', type: 'text', placeholder: 'Job title' },
        salary: { label: 'Salary', type: 'text', placeholder: 'Annual/Monthly salary' },
        probation_period: { label: 'Probation Period', type: 'text', placeholder: 'e.g., 3 months' }
      },
      system_prompt: 'Draft a standard Employment Contract compliant with the Nigerian Labour Act.'
    },
    {
      title: 'Affidavit of Change of Name',
      category: 'Litigation',
      sub_category: 'Affidavit',
      description: 'Affidavit for changing name.',
      structure: {
        deponent_old_name: { label: 'Old Name', type: 'text', placeholder: 'Previous full name' },
        deponent_new_name: { label: 'New Name', type: 'text', placeholder: 'New full name' },
        reason: { label: 'Reason', type: 'text', placeholder: 'Reason for change (e.g., marriage)' }
      },
      system_prompt: 'Draft an Affidavit of Change of Name for the Nigerian High Court registry.'
    },
    {
      title: 'Deed of Assignment',
      category: 'Property',
      sub_category: 'Conveyance',
      description: 'Transfer of ownership of land.',
      structure: {
        assignor_name: { label: 'Assignor Name', type: 'text', placeholder: 'Seller' },
        assignee_name: { label: 'Assignee Name', type: 'text', placeholder: 'Buyer' },
        property_description: { label: 'Property Description', type: 'textarea', placeholder: 'Detailed description of the land' },
        consideration: { label: 'Consideration', type: 'text', placeholder: 'Purchase price' }
      },
      system_prompt: 'Draft a Deed of Assignment for land transfer in Nigeria. Include receipt clause and indemnity.'
    }
  ];

  for (const t of templates) {
    const exists = await prisma.legalTemplate.findFirst({ where: { title: t.title } });
    if (!exists) {
      await prisma.legalTemplate.create({ data: t });
      console.log(`Created template: ${t.title}`);
    }
  }
>>>>>>> c0d2170c979d123d4ebc2bcf6dc243b6f785be73
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
