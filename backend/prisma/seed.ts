import { PrismaClient, Role, TaskStatus, LeadStage, ContractFrequency } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Create Default Demo Tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo-pest' },
    update: {},
    create: {
      name: 'PestGuard Indonesia (Demo)',
      slug: 'demo-pest',
      email: 'contact@pestguard.id',
      phone: '021-5550199',
      address: 'Jl. Sudirman No. 45, Jakarta Selatan',
    },
  });

  console.log(`Tenant created: ${tenant.name} (${tenant.id})`);

  // 2. Create Users (Admin, Supervisor, Technician)
  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: 'admin@pestguard.id',
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Budi (Admin)',
      email: 'admin@pestguard.id',
      passwordHash,
      role: Role.TENANT_ADMIN,
      phone: '081234567890',
    },
  });

  const supervisor = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: 'supervisor@pestguard.id',
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Ahmad (Supervisor)',
      email: 'supervisor@pestguard.id',
      passwordHash,
      role: Role.SUPERVISOR,
      phone: '081234567891',
    },
  });

  const technician = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: 'teknisi@pestguard.id',
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Rian Pratama (Teknisi Lapangan)',
      email: 'teknisi@pestguard.id',
      passwordHash,
      role: Role.TECHNICIAN,
      phone: '081234567892',
    },
  });

  console.log('Users created: Admin, Supervisor, Technician (Password: password123)');

  // 3. Service Catalogs
  const services = [
    {
      code: 'GENERAL_PEST',
      name: 'General Pest Control (Semut, Kecoa, Lalat)',
      description: 'Perawatan rutin indoor dan outdoor untuk hama permukiman.',
      defaultWarrantyDays: 30,
      basePrice: 750000,
    },
    {
      code: 'TERMITE_CONTROL',
      name: 'Anti Rayap (Termite Barrier & Baiting)',
      description: 'Penanganan rayap tanah dan rayap kayu dengan metode barrier dan baiting.',
      defaultWarrantyDays: 365,
      basePrice: 3500000,
    },
    {
      code: 'RODENT_CONTROL',
      name: 'Rodent Management (Pengendalian Tikus)',
      description: 'Pemasangan baiting box, snap trap, dan pemantauan jalur tikus.',
      defaultWarrantyDays: 60,
      basePrice: 900000,
    },
    {
      code: 'FUMIGATION',
      name: 'Fumigasi Gudang & Komoditas',
      description: 'Fumigasi gas berstandar ekspor/karantina.',
      defaultWarrantyDays: 14,
      basePrice: 5000000,
    },
  ];

  for (const s of services) {
    await prisma.serviceCatalog.upsert({
      where: {
        tenantId_code: {
          tenantId: tenant.id,
          code: s.code,
        },
      },
      update: {},
      create: {
        tenantId: tenant.id,
        ...s,
      },
    });
  }

  // 4. Sample Customer & Location
  const customer = await prisma.customer.create({
    data: {
      tenantId: tenant.id,
      name: 'Resto Sedap Rasa',
      companyName: 'PT Kuliner Nusantara',
      email: 'manager@sedaprasa.co.id',
      phone: '08119876543',
      locations: {
        create: {
          branchName: 'Cabang Senopati',
          address: 'Jl. Senopati No. 12, Kebayoran Baru, Jakarta Selatan',
          latitude: -6.2297,
          longitude: 106.8075,
          geofenceRadius: 100,
          picName: 'Pak Doni (Store Manager)',
          picPhone: '08119876543',
        },
      },
    },
    include: {
      locations: true,
    },
  });

  const location = customer.locations[0];

  // 5. Sample Task for today
  await prisma.task.create({
    data: {
      tenantId: tenant.id,
      customerId: customer.id,
      customerLocationId: location.id,
      technicianId: technician.id,
      taskNumber: 'TSK-2026-0001',
      status: TaskStatus.ASSIGNED,
      scheduledDate: new Date(),
      timeSlot: '09:00 - 11:00 WIB',
      priority: 'HIGH',
    },
  });

  console.log('✅ Seed finished successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
