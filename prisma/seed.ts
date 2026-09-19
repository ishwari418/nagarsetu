import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const WARDS = [
  "Ward 1 - Station Road",
  "Ward 2 - Shirdi Road",
  "Ward 3 - Market Yard",
  "Ward 4 - Sanjivani Nagar",
];

async function main() {
  await prisma.complaintStatusHistory.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      firstName: "Meera",
      lastName: "Kulkarni",
      email: "admin@nagarsetu.gov",
      phone: "9000000001",
      password: await bcrypt.hash("Admin@123", 10),
      role: "CITY_ADMIN",
      country: "India",
      state: "Maharashtra",
      district: "Ahilyanagar",
      city: "Kopargaon",
      ward: "Municipal Headquarters",
      address: "Nagar Parishad Building, Station Road",
      pinCode: "423601",
    },
  });

  const citizenPassword = await bcrypt.hash("Citizen@123", 10);

  const citizens = await Promise.all(
    [
      ["Ishwari", "Pawar", "ishwari@example.com", "9812345670", "Female", WARDS[3]],
      ["Rohan", "Deshmukh", "rohan@example.com", "9812345671", "Male", WARDS[0]],
      ["Sneha", "Jadhav", "sneha@example.com", "9812345672", "Female", WARDS[2]],
    ].map(([firstName, lastName, email, phone, gender, ward]) =>
      prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          phone,
          gender,
          password: citizenPassword,
          role: "CITIZEN",
          country: "India",
          state: "Maharashtra",
          district: "Ahilyanagar",
          city: "Kopargaon",
          ward,
          address: "Near Sanjivani College Road",
          pinCode: "423603",
        },
      })
    )
  );

  const samples = [
    {
      category: "Water",
      title: "No water supply for the last four days",
      description:
        "The whole lane has had no municipal water since Monday morning. Around forty households are buying tanker water.",
      priority: "HIGH",
      status: "IN_PROGRESS",
      days: 4,
    },
    {
      category: "Roads",
      title: "Large pothole near the bus stop",
      description:
        "A deep pothole has opened at the junction. Two-wheelers skid every evening, especially after rain.",
      priority: "MEDIUM",
      status: "UNDER_REVIEW",
      days: 12,
    },
    {
      category: "Waste",
      title: "Garbage not collected from the market corner",
      description:
        "The collection van has not come for a week. The pile has spread onto the footpath and smells strongly.",
      priority: "HIGH",
      status: "SUBMITTED",
      days: 7,
    },
    {
      category: "Drainage",
      title: "Open drain overflowing onto the street",
      description:
        "The drain near the school gate overflows every morning. Children walk through the water to reach the gate.",
      priority: "HIGH",
      status: "RESOLVED",
      days: 9,
    },
    {
      category: "Street Infrastructure",
      title: "Streetlights off on the entire stretch",
      description:
        "Six streetlights between the temple and the water tank have been off for three nights.",
      priority: "MEDIUM",
      status: "IN_PROGRESS",
      days: 3,
    },
    {
      category: "Pollution",
      title: "Construction dust from the plot behind the colony",
      description:
        "Debris is being cut without any water spray. Dust settles inside homes through the day.",
      priority: "LOW",
      status: "SUBMITTED",
      days: 2,
    },
    {
      category: "Public Health",
      title: "Mosquito breeding in the stagnant pond",
      description:
        "Water has been standing since the last rain. Several families in the lane report fever cases.",
      priority: "MEDIUM",
      status: "UNDER_REVIEW",
      days: 6,
    },
  ];

  const flow = ["SUBMITTED", "UNDER_REVIEW", "IN_PROGRESS", "RESOLVED"];
  const notes: Record<string, string> = {
    SUBMITTED: "Complaint received by the ward office.",
    UNDER_REVIEW: "Ward officer verifying the report on site.",
    IN_PROGRESS: "Work order issued to the maintenance team.",
    RESOLVED: "Work completed and closed by the ward office.",
  };

  let seq = 1;
  for (let i = 0; i < samples.length; i++) {
    const s = samples[i];
    const citizen = citizens[i % citizens.length];
    const createdAt = new Date(Date.now() - (samples.length - i) * 36 * 60 * 60 * 1000);

    const complaint = await prisma.complaint.create({
      data: {
        complaintNumber: `NGR-${new Date().getFullYear()}-${String(seq++).padStart(6, "0")}`,
        citizenId: citizen.id,
        category: s.category,
        title: s.title,
        description: s.description,
        city: "Kopargaon",
        ward: citizen.ward!,
        address: "Near Sanjivani College Road, Kopargaon",
        latitude: 19.8762,
        longitude: 74.4776,
        issueStartDate: new Date(Date.now() - s.days * 24 * 60 * 60 * 1000),
        daysAffected: s.days,
        priority: s.priority,
        status: s.status,
        createdAt,
        updatedAt: createdAt,
      },
    });

    const upto = flow.indexOf(s.status);
    for (let step = 0; step <= upto; step++) {
      await prisma.complaintStatusHistory.create({
        data: {
          complaintId: complaint.id,
          status: flow[step],
          note: notes[flow[step]],
          updatedBy: step === 0 ? `${citizen.firstName} ${citizen.lastName}` : `${admin.firstName} ${admin.lastName}`,
          createdAt: new Date(createdAt.getTime() + step * 8 * 60 * 60 * 1000),
        },
      });
    }
  }

  console.log("Seeded: 1 admin, 3 citizens, 7 complaints.");
  console.log("Admin   -> admin@nagarsetu.gov / Admin@123");
  console.log("Citizen -> ishwari@example.com / Citizen@123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
