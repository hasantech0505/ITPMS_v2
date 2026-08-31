/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  ERPBuilding, 
  ERPAsset, 
  ERPMaintenance, 
  ERPUtility, 
  ERPReservation, 
  ERPInspection, 
  ERPContract 
} from "./infraTypes";

export const SEED_BUILDINGS: ERPBuilding[] = [
  {
    id: "bld-hq",
    name: "Tashkent Headquarters Complex",
    code: "HQ-TSH",
    address: "108 Amir Temur Avenue, Tashkent, Uzbekistan",
    region: "Tashkent City",
    district: "Yunusabad District",
    coordinates: "41.3409, 69.2867",
    constructionYear: 2022,
    floors: 8,
    totalArea: 12000,
    totalOffices: 45,
    capacity: 800,
    parkingSpots: 250,
    meetingRooms: 6,
    status: "ACTIVE",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=450&fit=crop",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=450&fit=crop"
    ],
    virtualTourUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=450&fit=crop",
    documents: ["cadastre_hq_signed.pdf", "fire_safety_permit_2026.pdf"],
    floorPlans: ["HQ_FLOOR_1_LAYOUT.pdf", "HQ_FLOOR_2_LAYOUT.pdf"],
    emergencyContacts: ["Fire Dept: 101", "Security Hub: +998 71 200 01 02"],
    managerName: "Sardor Kasimov",
    managerPhone: "+998 90 900 11 22",
    cadastreNumber: "14:22:08:01:04:0091"
  },
  {
    id: "bld-blocka",
    name: "Samarkand Regional IT Hub",
    code: "HUB-SKD",
    address: "15 Bustonsaray Street, Samarkand",
    region: "Samarkand Region",
    district: "Samarkand City",
    coordinates: "39.6508, 66.9654",
    constructionYear: 2023,
    floors: 4,
    totalArea: 5500,
    totalOffices: 20,
    capacity: 350,
    parkingSpots: 80,
    meetingRooms: 3,
    status: "ACTIVE",
    images: [
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=450&fit=crop"
    ],
    documents: ["samarkand_permit_signed.pdf"],
    floorPlans: ["SAMARKAND_FLOOR_PLAN.pdf"],
    emergencyContacts: ["MES Hub: 101", "Desk: +998 66 120 45 45"],
    managerName: "Jasur Nematov",
    managerPhone: "+998 94 444 55 66",
    cadastreNumber: "18:02:12:04:01:0023"
  },
  {
    id: "bld-blockb",
    name: "Bukhara Digital Academy Block",
    code: "HUB-BKH",
    address: "8 M. Ikbol Street, Bukhara",
    region: "Bukhara Region",
    district: "Bukhara City",
    coordinates: "39.7747, 64.4286",
    constructionYear: 2024,
    floors: 3,
    totalArea: 3200,
    totalOffices: 12,
    capacity: 200,
    parkingSpots: 40,
    meetingRooms: 2,
    status: "ACTIVE",
    images: [
      "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=800&h=450&fit=crop"
    ],
    documents: ["bukhara_cadastre.pdf"],
    floorPlans: ["BUKHARA_ACADEMY_MAP.pdf"],
    emergencyContacts: ["Security Bukhara: +998 65 220 10 10"],
    managerName: "Alisher Pulatov",
    managerPhone: "+998 93 121 34 56",
    cadastreNumber: "20:01:05:03:02:0115"
  },
  {
    id: "bld-blockc",
    name: "Fergana Valley Export Outpost",
    code: "HUB-FRG",
    address: "126 Al-Ferganiy Street, Fergana",
    region: "Fergana Region",
    district: "Fergana City",
    coordinates: "40.3864, 71.7897",
    constructionYear: 2024,
    floors: 3,
    totalArea: 4000,
    totalOffices: 15,
    capacity: 250,
    parkingSpots: 50,
    meetingRooms: 2,
    status: "ACTIVE",
    images: [
      "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&h=450&fit=crop"
    ],
    documents: ["fergana_hub_docs.pdf"],
    floorPlans: ["FERGANA_FLOORPLAN.pdf"],
    emergencyContacts: ["MES Emergency: 101"],
    managerName: "Nozimjon Soliev",
    managerPhone: "+998 97 777 88 99",
    cadastreNumber: "30:05:02:01:05:0042"
  },
  {
    id: "bld-blockd",
    name: "Khorezm Tech Incubation Facility",
    code: "HUB-KHZ",
    address: "44 Al-Khwarizmi Street, Urgench",
    region: "Khorezm Region",
    district: "Urgench City",
    coordinates: "41.5500, 60.6333",
    constructionYear: 2025,
    floors: 2,
    totalArea: 2200,
    totalOffices: 8,
    capacity: 150,
    parkingSpots: 30,
    meetingRooms: 1,
    status: "UNDER_CONSTRUCTION",
    images: [
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=450&fit=crop"
    ],
    documents: ["khorezm_blueprint.pdf"],
    floorPlans: [],
    emergencyContacts: ["Urgench MES: 101"],
    managerName: "Mansurbek Sobirov",
    managerPhone: "+998 99 999 00 11",
    cadastreNumber: "25:01:03:02:04:0018"
  }
];

export const SEED_ASSETS: ERPAsset[] = [
  {
    id: "ast-1",
    name: "Developer Server ASUS ROG Strix",
    serialNumber: "SN-ASUS-99214A",
    category: "Computers",
    purchaseDate: "2025-04-10",
    warrantyExpiry: "2027-04-10",
    condition: "EXCELLENT",
    assignedOfficeId: "off-1",
    assignedOfficeNumber: "101",
    assignedUserId: "u-1",
    assignedUserName: "Shakhrukh Alimov (Paymart)",
    purchaseCost: 1450,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=200&fit=crop",
    maintenanceHistory: ["Memory upgraded to 64GB DDR5 on June 1st."]
  },
  {
    id: "ast-2",
    name: "HQ Edge Core Cisco Router",
    serialNumber: "SN-CISCO-88124X",
    category: "Networking Equipment",
    purchaseDate: "2022-09-01",
    warrantyExpiry: "2027-09-01",
    condition: "GOOD",
    assignedOfficeId: "off-3",
    assignedOfficeNumber: "201",
    assignedUserId: "u-2",
    assignedUserName: "Alexander Shmilo (Exadel)",
    purchaseCost: 3200,
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=200&fit=crop",
    maintenanceHistory: ["Firmware patch applied by Dilshod on July 10th."]
  },
  {
    id: "ast-3",
    name: "Interactive Smart Projector Epson",
    serialNumber: "SN-EPSON-4412B",
    category: "Projectors",
    purchaseDate: "2023-01-15",
    warrantyExpiry: "2026-01-15",
    condition: "FAIR",
    assignedOfficeId: "off-3",
    assignedOfficeNumber: "201",
    assignedUserId: "u-2",
    assignedUserName: "Exadel Conference Room",
    purchaseCost: 1800,
    image: "",
    maintenanceHistory: ["Bulb replaced on Oct 2025."]
  },
  {
    id: "ast-4",
    name: "Ergonomic Standing Desk Dual Motor",
    serialNumber: "SN-DESK-0012",
    category: "Furniture",
    purchaseDate: "2025-04-01",
    warrantyExpiry: "2028-04-01",
    condition: "EXCELLENT",
    assignedOfficeId: "off-1",
    assignedOfficeNumber: "101",
    assignedUserId: "u-1",
    assignedUserName: "Paymart Developer",
    purchaseCost: 450,
    image: "",
    maintenanceHistory: []
  },
  {
    id: "ast-5",
    name: "Samsung Multi-Split AC Unit 18k BTU",
    serialNumber: "SN-AC-SAMS-110",
    category: "Air Conditioning",
    purchaseDate: "2022-05-15",
    warrantyExpiry: "2025-05-15",
    condition: "GOOD",
    assignedOfficeId: "off-6",
    assignedOfficeNumber: "104",
    assignedUserId: "u-3",
    assignedUserName: "General Facilities",
    purchaseCost: 950,
    image: "",
    maintenanceHistory: ["Cleaning filter on May 10th."]
  },
  {
    id: "ast-6",
    name: "Dell PowerEdge R750 Enterprise Server",
    serialNumber: "SN-DELL-SRV99",
    category: "Servers",
    purchaseDate: "2021-12-10",
    warrantyExpiry: "2026-12-10",
    condition: "GOOD",
    assignedOfficeId: "off-5",
    assignedOfficeNumber: "301",
    assignedUserId: "u-1",
    assignedUserName: "EPAM Dev Team",
    purchaseCost: 12500,
    image: "",
    maintenanceHistory: ["OS Upgrade on June 12th."]
  }
];

export const SEED_MAINTENANCE: ERPMaintenance[] = [
  {
    id: "maint-1",
    category: "Air Conditioner",
    title: "Air Conditioner leaking and making noise",
    description: "The AC unit in block B Room 104 is dripping water and the compressor fan is making loud rattling noises. Overdue service.",
    priority: "HIGH",
    status: "OPEN",
    assignedEngineer: "Yodgor Hakimov",
    createdAt: "2026-07-11",
    officeId: "off-6",
    officeNumber: "104",
    buildingBlock: "BLOCK_B",
    beforePhoto: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=300&fit=crop",
    afterPhoto: "",
    completionReport: "",
    timeline: [
      { status: "OPEN", date: "2026-07-11T09:00:00Z", note: "Ticket logged by Admin" }
    ]
  },
  {
    id: "maint-2",
    category: "Internet",
    title: "Fiber Optic Line Splicing Required",
    priority: "CRITICAL",
    status: "IN_PROGRESS",
    assignedEngineer: "Dilshod Karimov",
    createdAt: "2026-07-10",
    officeId: "off-5",
    officeNumber: "301",
    buildingBlock: "BLOCK_A",
    description: "Bandwidth in Block A Room 301 is experiencing 80% packet loss. Suspect outdoor fiber line scratch.",
    beforePhoto: "",
    afterPhoto: "",
    completionReport: "",
    timeline: [
      { status: "OPEN", date: "2026-07-10T08:30:00Z", note: "Reported by EPAM Team" },
      { status: "IN_PROGRESS", date: "2026-07-11T14:00:00Z", note: "Engineer dispatched with splicing equipment" }
    ]
  },
  {
    id: "maint-3",
    category: "Painting",
    title: "Re-painting lobby and wall scratches",
    priority: "LOW",
    status: "RESOLVED",
    assignedEngineer: "Otabek Turdiev",
    createdAt: "2026-07-01",
    officeId: "off-1",
    officeNumber: "101",
    buildingBlock: "BLOCK_HQ",
    description: "Minor wall scratches in Room 101 after paymart moved heavy desk drawers.",
    beforePhoto: "",
    afterPhoto: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=300&fit=crop",
    completionReport: "Scratches sanded, primed, and coated with 2 layers of premium white latex paint. Approved by tenant.",
    timeline: [
      { status: "OPEN", date: "2026-07-01T10:00:00Z", note: "Logged" },
      { status: "RESOLVED", date: "2026-07-02T16:30:00Z", note: "Work finished and inspected." }
    ]
  }
];

export const SEED_UTILITIES: ERPUtility[] = [
  {
    id: "utl-1",
    buildingBlock: "BLOCK_HQ",
    month: "April 2026",
    electricity: { kwh: 4500, cost: 540 },
    water: { m3: 120, cost: 90 },
    internet: { mbps: 1000, cost: 200 },
    heating: { gcal: 15, cost: 225 }
  },
  {
    id: "utl-2",
    buildingBlock: "BLOCK_HQ",
    month: "May 2026",
    electricity: { kwh: 5200, cost: 624 },
    water: { m3: 135, cost: 101 },
    internet: { mbps: 1000, cost: 200 },
    heating: { gcal: 5, cost: 75 }
  },
  {
    id: "utl-3",
    buildingBlock: "BLOCK_HQ",
    month: "June 2026",
    electricity: { kwh: 7800, cost: 936 },
    water: { m3: 160, cost: 120 },
    internet: { mbps: 1000, cost: 200 },
    heating: { gcal: 0, cost: 0 }
  }
];

export const SEED_RESERVATIONS: ERPReservation[] = [
  {
    id: "resv-1",
    roomName: "Lobby Training Room A",
    buildingBlock: "BLOCK_HQ",
    floor: 1,
    reservedBy: "Timur Umarov",
    residentName: "MedIQ",
    date: "2026-07-13",
    startTime: "10:00",
    endTime: "11:30",
    purpose: "HealthTech Regional Triage Demonstration",
    status: "APPROVED",
    recurring: false
  },
  {
    id: "resv-2",
    roomName: "HQ Floor 2 Conference Room",
    buildingBlock: "BLOCK_HQ",
    floor: 2,
    reservedBy: "Bekzod Gafurov",
    residentName: "OneSoft Technologies",
    date: "2026-07-14",
    startTime: "14:00",
    endTime: "16:00",
    purpose: "CRM Architecture Kickoff",
    status: "PENDING",
    recurring: false
  }
];

export const SEED_INSPECTIONS: ERPInspection[] = [
  {
    id: "insp-1",
    buildingBlock: "BLOCK_HQ",
    type: "FIRE_SAFETY",
    inspectionDate: "2026-05-10",
    inspectorName: "Major Rustam Gulyamov",
    inspectorAgency: "Ministry of Emergency Situations (MES)",
    status: "PASSED",
    findings: "All fire extinguishers are fully pressurized, in-date, and accessible. Alarm sensors are active. Sprinkler heads clear.",
    recommendations: "Ensure emergency exit labels in basement are equipped with batteries that charge continuously.",
    certificateUrl: "MES-FIRE-HQ-2026.pdf",
    documents: ["safety_signoff_hq.pdf"]
  },
  {
    id: "insp-2",
    buildingBlock: "BLOCK_HQ",
    type: "BUILDING_INTEGRITY",
    inspectionDate: "2026-06-18",
    inspectorName: "Sardor Khodjaev",
    inspectorAgency: "State Construction Control Inspectorate",
    status: "PASSED",
    findings: "Elevator hoist cable load-balancing certified. Basement load beams showed zero expansion.",
    recommendations: "Conduct the next standard generator load audit in December 2026.",
    certificateUrl: "CONSTR-CERT-2026.pdf",
    documents: []
  }
];

export const SEED_CONTRACTS: ERPContract[] = [
  {
    id: "ctr-1",
    contractNumber: "ITP-CTR-2025-0012",
    tenantId: "st-1",
    tenantName: "Paymart Uz",
    officeId: "off-1",
    officeNumber: "101",
    buildingBlock: "BLOCK_HQ",
    contractType: "LEASE",
    startDate: "2025-04-01",
    endDate: "2026-04-01",
    monthlyRentUSD: 2400,
    status: "EXPIRED",
    documentUrl: "paymart_lease_fully_signed.pdf",
    digitalSignature: "Shakhrukh_Alimov_PAYMART_SIG_88921",
    signedAt: "2025-03-20T11:00:00",
    payments: [
      { date: "2025-04-01", amount: 2400, invoiceNo: "INV-10023", status: "PAID" },
      { date: "2025-05-01", amount: 2400, invoiceNo: "INV-10156", status: "PAID" }
    ]
  },
  {
    id: "ctr-2",
    contractNumber: "ITP-CTR-2021-0005",
    tenantId: "res-1",
    tenantName: "EPAM Systems Uzbekistan",
    officeId: "off-5",
    officeNumber: "301",
    buildingBlock: "BLOCK_A",
    contractType: "LEASE",
    startDate: "2021-01-01",
    endDate: "2031-01-01",
    monthlyRentUSD: 10000,
    status: "ACTIVE",
    documentUrl: "epam_10year_lease.pdf",
    digitalSignature: "Renat_Akhtyamov_EPAM_SIG_111",
    signedAt: "2020-12-01T15:30:00",
    payments: [
      { date: "2026-06-01", amount: 10000, invoiceNo: "INV-22001", status: "PAID" },
      { date: "2026-07-01", amount: 10000, invoiceNo: "INV-22340", status: "PAID" }
    ]
  },
  {
    id: "ctr-3",
    contractNumber: "ITP-CTR-2023-0010",
    tenantId: "res-2",
    tenantName: "Exadel East LLC",
    officeId: "off-3",
    officeNumber: "201",
    buildingBlock: "BLOCK_HQ",
    contractType: "LEASE",
    startDate: "2023-01-01",
    endDate: "2028-01-01",
    monthlyRentUSD: 7000,
    status: "ACTIVE",
    documentUrl: "exadel_signed_agreement.pdf",
    digitalSignature: "Alexander_Shmilo_EXADEL_SIG_2023",
    signedAt: "2022-12-15T09:15:00",
    payments: [
      { date: "2026-06-01", amount: 7000, invoiceNo: "INV-21950", "status": "PAID" },
      { date: "2026-07-01", amount: 7000, invoiceNo: "INV-22288", "status": "PAID" }
    ]
  }
];
