/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Property } from "./propertyTypes";

// Real vacant-premises inventory sourced from the official Qashqadaryo regional
// administration reference document ("Qashqadaryo viloyatida mavjud bo'sh joylar
// to'g'risida ma'lumotnoma", imported 2026-08-29). Addresses, floor area, floor
// counts, internet availability, rental terms, map links and contact numbers are
// taken directly from that document. Interior details not covered by the source
// (exact room count, parking, AC, meeting rooms, utility costs, cadastre number)
// are left at 0 / false / "" and flagged in each description as unverified pending
// an on-site inspection -- they are NOT fabricated estimates.
export const SEED_PROPERTIES: Property[] = [
  {
    id: "prop-qshq-1",
    name: "Qarshi, 1-Mikrotuman - Bunyodkor ko'chasi 15",
    type: "Commercial Building",
    status: "Pending Verification",
    city: "Qarshi",
    district: "1-Mikrotuman",
    address: "Qarshi shahri, 1-mikrotuman, Bunyodkor ko'chasi 15-uy",
    monthlyRent: 2000,
    areaSqM: 1100,
    rooms: 0,
    parkingSpots: 0,
    internetSpeedMbps: 0,
    hasAC: false,
    hasMeetingRooms: false,
    availableDate: "2026-08-29",
    managerName: "Belgilanmagan",
    managerPhone: "+998 99 105 33 35",
    ownerName: "Qashqadaryo viloyat hokimiyati",
    ownerPhone: "+998 99 105 33 35",
    verified: false,
    coverImage: "/property-photos/prop-qshq-1/photo-1.jpg",
    images: [
      "/property-photos/prop-qshq-1/photo-1.jpg",
      "/property-photos/prop-qshq-1/photo-2.jpg",
      "/property-photos/prop-qshq-1/photo-3.jpg",
      "/property-photos/prop-qshq-1/photo-4.jpg"
    ],
    description: "Manzil: Qarshi shahri, 1-mikrotuman, Bunyodkor ko'chasi 15-uy. Bino maydoni 1100 m.kv, 4 qavat. Internet: mavjud (tezlik ko'rsatilmagan). Oylik ijara narxi: 2000 $ (rasmiy ro'yxatda ko'rsatilgan). Joylashuv: https://maps.app.goo.gl/ukRrnmnHdKzbpz4t9. Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-08-29 holatiga). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.",
    nearbyUniversities: [],
    nearbyResidents: [],
    nearbyTransit: [],
    cadastreNumber: "",
    inspectionReport: {
      status: "PENDING",
      inspectionDate: "",
      inspectorName: "",
      findings: "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.",
      notes: "Joyga tashrif buyurish kutilmoqda."
    },
    pipelineStage: "Found",
    timeline: [
      { stage: "Found", date: "2026-08-29", user: "Data Import", description: "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma)." }
    ],
    documents: [],
    utilities: {
      electricityCost: 0,
      waterCost: 0,
      internetCost: 0
    }
  },
  {
    id: "prop-qshq-2",
    name: "Qarshi, Qarloq Bog'ot MFY - Zardo'zli ko'chasi 26",
    type: "Commercial Building",
    status: "Pending Verification",
    city: "Qarshi",
    district: "Qarloq Bog'ot MFY",
    address: "Qarshi shahri, Qarloq Bog'ot MFY, Zardo'zli ko'chasi 26-uy",
    monthlyRent: undefined,
    areaSqM: 2900,
    rooms: 0,
    parkingSpots: 0,
    internetSpeedMbps: 0,
    hasAC: false,
    hasMeetingRooms: false,
    availableDate: "2026-08-29",
    managerName: "Belgilanmagan",
    managerPhone: "+998 97 222 00 08",
    ownerName: "Qashqadaryo viloyat hokimiyati",
    ownerPhone: "+998 97 222 00 08",
    verified: false,
    coverImage: "/property-photos/prop-qshq-2/photo-1.jpg",
    images: [
      "/property-photos/prop-qshq-2/photo-1.jpg",
      "/property-photos/prop-qshq-2/photo-2.jpg",
      "/property-photos/prop-qshq-2/photo-3.jpg",
      "/property-photos/prop-qshq-2/photo-4.jpg"
    ],
    description: "Manzil: Qarshi shahri, Qarloq Bog'ot MFY, Zardo'zli ko'chasi 26-uy. Bino maydoni 2900 m.kv, 5 qavat (mansard bilan). Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Joylashuv: https://maps.app.goo.gl/zmXUy1CjqgSnmgF7A. Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-08-29 holatiga). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.",
    nearbyUniversities: [],
    nearbyResidents: [],
    nearbyTransit: [],
    cadastreNumber: "",
    inspectionReport: {
      status: "PENDING",
      inspectionDate: "",
      inspectorName: "",
      findings: "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.",
      notes: "Joyga tashrif buyurish kutilmoqda."
    },
    pipelineStage: "Found",
    timeline: [
      { stage: "Found", date: "2026-08-29", user: "Data Import", description: "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma)." }
    ],
    documents: [],
    utilities: {
      electricityCost: 0,
      waterCost: 0,
      internetCost: 0
    }
  },
  {
    id: "prop-qshq-3",
    name: "Qarshi - Nasaf ko'chasi 176A",
    type: "Commercial Building",
    status: "Pending Verification",
    city: "Qarshi",
    district: "Qarshi",
    address: "Qarshi shahri, Nasaf ko'chasi 176A",
    monthlyRent: undefined,
    areaSqM: 300,
    rooms: 0,
    parkingSpots: 0,
    internetSpeedMbps: 0,
    hasAC: false,
    hasMeetingRooms: false,
    availableDate: "2026-08-29",
    managerName: "Belgilanmagan",
    managerPhone: "+998 91 322 40 72",
    ownerName: "Qashqadaryo viloyat hokimiyati",
    ownerPhone: "+998 91 322 40 72",
    verified: false,
    coverImage: "/property-photos/prop-qshq-3/photo-1.jpg",
    images: [
      "/property-photos/prop-qshq-3/photo-1.jpg",
      "/property-photos/prop-qshq-3/photo-2.jpg",
      "/property-photos/prop-qshq-3/photo-3.jpg",
      "/property-photos/prop-qshq-3/photo-4.jpg"
    ],
    description: "Manzil: Qarshi shahri, Nasaf ko'chasi 176A. Bino maydoni 300 m.kv, 3 qavat (2-3-qavatlardan foydalanish mumkin). Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Joylashuv: https://maps.app.goo.gl/FFAHkNBQ2t89JYEr9. Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-08-29 holatiga). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.",
    nearbyUniversities: [],
    nearbyResidents: [],
    nearbyTransit: [],
    cadastreNumber: "",
    inspectionReport: {
      status: "PENDING",
      inspectionDate: "",
      inspectorName: "",
      findings: "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.",
      notes: "Joyga tashrif buyurish kutilmoqda."
    },
    pipelineStage: "Found",
    timeline: [
      { stage: "Found", date: "2026-08-29", user: "Data Import", description: "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma)." }
    ],
    documents: [],
    utilities: {
      electricityCost: 0,
      waterCost: 0,
      internetCost: 0
    }
  },
  {
    id: "prop-qshq-4",
    name: "Qarshi, Qarloq Bog'ot MFY - 410-uy",
    type: "Commercial Building",
    status: "Pending Verification",
    city: "Qarshi",
    district: "Qarloq Bog'ot MFY",
    address: "Qarshi shahri, Qarloq Bog'ot MFY, Qarloq Bog'ot 410-uy",
    monthlyRent: undefined,
    areaSqM: 1800,
    rooms: 0,
    parkingSpots: 0,
    internetSpeedMbps: 0,
    hasAC: false,
    hasMeetingRooms: false,
    availableDate: "2026-08-29",
    managerName: "Belgilanmagan",
    managerPhone: "+998 97 229 17 47",
    ownerName: "Qashqadaryo viloyat hokimiyati",
    ownerPhone: "+998 97 229 17 47",
    verified: false,
    coverImage: "/property-photos/prop-qshq-4/photo-1.jpg",
    images: [
      "/property-photos/prop-qshq-4/photo-1.jpg",
      "/property-photos/prop-qshq-4/photo-2.jpg"
    ],
    description: "Manzil: Qarshi shahri, Qarloq Bog'ot MFY, Qarloq Bog'ot 410-uy. Bino maydoni 1800 m.kv, 4 qavat (2-3-4-qavatlardan foydalanish mumkin). Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Joylashuv: https://maps.app.goo.gl/zWpehuPGbUDtZ829A. Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-08-29 holatiga). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.",
    nearbyUniversities: [],
    nearbyResidents: [],
    nearbyTransit: [],
    cadastreNumber: "",
    inspectionReport: {
      status: "PENDING",
      inspectionDate: "",
      inspectorName: "",
      findings: "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.",
      notes: "Joyga tashrif buyurish kutilmoqda."
    },
    pipelineStage: "Found",
    timeline: [
      { stage: "Found", date: "2026-08-29", user: "Data Import", description: "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma)." }
    ],
    documents: [],
    utilities: {
      electricityCost: 0,
      waterCost: 0,
      internetCost: 0
    }
  },
  {
    id: "prop-qshq-5",
    name: "Qarshi, Qarloq Bog'ot MFY - Nasaf ko'chasi",
    type: "Commercial Building",
    status: "Pending Verification",
    city: "Qarshi",
    district: "Qarloq Bog'ot MFY",
    address: "Qarshi shahri, Qarloq Bog'ot MFY, Nasaf ko'chasi",
    monthlyRent: undefined,
    areaSqM: 900,
    rooms: 0,
    parkingSpots: 0,
    internetSpeedMbps: 0,
    hasAC: false,
    hasMeetingRooms: false,
    availableDate: "2026-08-29",
    managerName: "Belgilanmagan",
    managerPhone: "+998 91 220 10 00",
    ownerName: "Qashqadaryo viloyat hokimiyati",
    ownerPhone: "+998 91 220 10 00",
    verified: false,
    coverImage: "/property-photos/prop-qshq-5/photo-1.jpg",
    images: [
      "/property-photos/prop-qshq-5/photo-1.jpg",
      "/property-photos/prop-qshq-5/photo-2.jpg"
    ],
    description: "Manzil: Qarshi shahri, Qarloq Bog'ot MFY, Nasaf ko'chasi. Bino maydoni 900 m.kv, 4 qavat (2-3-4-qavatlardan foydalanish mumkin). Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Joylashuv: https://maps.app.goo.gl/hqfjoFWT8hic51296. Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-08-29 holatiga). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.",
    nearbyUniversities: [],
    nearbyResidents: [],
    nearbyTransit: [],
    cadastreNumber: "",
    inspectionReport: {
      status: "PENDING",
      inspectionDate: "",
      inspectorName: "",
      findings: "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.",
      notes: "Joyga tashrif buyurish kutilmoqda."
    },
    pipelineStage: "Found",
    timeline: [
      { stage: "Found", date: "2026-08-29", user: "Data Import", description: "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma)." }
    ],
    documents: [],
    utilities: {
      electricityCost: 0,
      waterCost: 0,
      internetCost: 0
    }
  },
  {
    id: "prop-qshq-6",
    name: "Qarshi, Mag'zon MFY - Nasaf ko'chasi 279",
    type: "Commercial Building",
    status: "Pending Verification",
    city: "Qarshi",
    district: "Mag'zon MFY",
    address: "Qarshi shahri, Mag'zon MFY, Nasaf ko'chasi 279-uy",
    monthlyRent: undefined,
    areaSqM: 300,
    rooms: 0,
    parkingSpots: 0,
    internetSpeedMbps: 0,
    hasAC: false,
    hasMeetingRooms: false,
    availableDate: "2026-08-29",
    managerName: "Belgilanmagan",
    managerPhone: "+998 99 655 44 46",
    ownerName: "Qashqadaryo viloyat hokimiyati",
    ownerPhone: "+998 99 655 44 46",
    verified: false,
    coverImage: "/property-photos/prop-qshq-6/photo-1.jpg",
    images: [
      "/property-photos/prop-qshq-6/photo-1.jpg",
      "/property-photos/prop-qshq-6/photo-2.jpg"
    ],
    description: "Manzil: Qarshi shahri, Mag'zon MFY, Nasaf ko'chasi 279-uy. Bino maydoni 300 m.kv, 2 qavat. Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Joylashuv: https://maps.app.goo.gl/FMHh3MeTytf3ukKj6. Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-08-29 holatiga). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.",
    nearbyUniversities: [],
    nearbyResidents: [],
    nearbyTransit: [],
    cadastreNumber: "",
    inspectionReport: {
      status: "PENDING",
      inspectionDate: "",
      inspectorName: "",
      findings: "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.",
      notes: "Joyga tashrif buyurish kutilmoqda."
    },
    pipelineStage: "Found",
    timeline: [
      { stage: "Found", date: "2026-08-29", user: "Data Import", description: "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma)." }
    ],
    documents: [],
    utilities: {
      electricityCost: 0,
      waterCost: 0,
      internetCost: 0
    }
  },
  {
    id: "prop-qshq-7",
    name: "Qarshi - Bunyodkor ko'chasi 5/6",
    type: "Office",
    status: "Pending Verification",
    city: "Qarshi",
    district: "Qarshi",
    address: "Qarshi shahri, Bunyodkor ko'chasi 5/6-uy (bino podvalida joylashgan)",
    monthlyRent: undefined,
    areaSqM: 80,
    rooms: 0,
    parkingSpots: 0,
    internetSpeedMbps: 0,
    hasAC: false,
    hasMeetingRooms: false,
    availableDate: "2026-08-29",
    managerName: "Panjiyev Ulug'bek (rektor)",
    managerPhone: "+998 90 426 83 93",
    ownerName: "Qashqadaryo viloyat hokimiyati",
    ownerPhone: "+998 90 426 83 93",
    verified: false,
    coverImage: "/property-photos/prop-qshq-7/photo-1.jpg",
    images: [
      "/property-photos/prop-qshq-7/photo-1.jpg",
      "/property-photos/prop-qshq-7/photo-2.jpg",
      "/property-photos/prop-qshq-7/photo-3.jpg",
      "/property-photos/prop-qshq-7/photo-4.jpg"
    ],
    description: "Manzil: Qarshi shahri, Bunyodkor ko'chasi 5/6-uy (bino podvalida joylashgan). Bino maydoni 80 m.kv, Bino 5 qavatli (taklif etilayotgan joy - podval qavatida). Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Joylashuv: https://maps.app.goo.gl/uQF3X9tCCvj7DPCw8. Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-08-29 holatiga). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.",
    nearbyUniversities: [],
    nearbyResidents: [],
    nearbyTransit: [],
    cadastreNumber: "",
    inspectionReport: {
      status: "PENDING",
      inspectionDate: "",
      inspectorName: "",
      findings: "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.",
      notes: "Joyga tashrif buyurish kutilmoqda."
    },
    pipelineStage: "Found",
    timeline: [
      { stage: "Found", date: "2026-08-29", user: "Data Import", description: "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma)." }
    ],
    documents: [],
    utilities: {
      electricityCost: 0,
      waterCost: 0,
      internetCost: 0
    }
  },
  {
    id: "prop-qshq-8",
    name: "Qarshi - Mustaqillik shox ko'chasi 225",
    type: "Office",
    status: "Pending Verification",
    city: "Qarshi",
    district: "Qarshi",
    address: "Qarshi shahri, Mustaqillik shox ko'chasi 225-uy (bino podvalida joylashgan)",
    monthlyRent: undefined,
    areaSqM: 72,
    rooms: 0,
    parkingSpots: 0,
    internetSpeedMbps: 0,
    hasAC: false,
    hasMeetingRooms: false,
    availableDate: "2026-08-29",
    managerName: "Samijon Domla",
    managerPhone: "+998 97 200 78 09",
    ownerName: "Qashqadaryo viloyat hokimiyati",
    ownerPhone: "+998 97 200 78 09",
    verified: false,
    coverImage: "/property-photos/prop-qshq-8/photo-1.jpg",
    images: [
      "/property-photos/prop-qshq-8/photo-1.jpg",
      "/property-photos/prop-qshq-8/photo-2.jpg",
      "/property-photos/prop-qshq-8/photo-3.jpg",
      "/property-photos/prop-qshq-8/photo-4.jpg"
    ],
    description: "Manzil: Qarshi shahri, Mustaqillik shox ko'chasi 225-uy (bino podvalida joylashgan). Bino maydoni 72 m.kv, Bino 5 qavatli (taklif etilayotgan joy - podval qavatida). Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Joylashuv: https://maps.app.goo.gl/SZhCtxQzt9e8rGon7. Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-08-29 holatiga). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.",
    nearbyUniversities: [],
    nearbyResidents: [],
    nearbyTransit: [],
    cadastreNumber: "",
    inspectionReport: {
      status: "PENDING",
      inspectionDate: "",
      inspectorName: "",
      findings: "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.",
      notes: "Joyga tashrif buyurish kutilmoqda."
    },
    pipelineStage: "Found",
    timeline: [
      { stage: "Found", date: "2026-08-29", user: "Data Import", description: "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma)." }
    ],
    documents: [],
    utilities: {
      electricityCost: 0,
      waterCost: 0,
      internetCost: 0
    }
  },
  {
    id: "prop-qshq-9",
    name: "Ko'kdala - Yettitom shaharchasi 2-uy",
    type: "Commercial Building",
    status: "Pending Verification",
    city: "Ko'kdala",
    district: "Yettitom shaharchasi",
    address: "Ko'kdala tumani, Yettitom shaharchasi, 2-uy (bino podvalida joy)",
    monthlyRent: undefined,
    areaSqM: 500,
    rooms: 0,
    parkingSpots: 0,
    internetSpeedMbps: 0,
    hasAC: false,
    hasMeetingRooms: false,
    availableDate: "2026-08-29",
    managerName: "Belgilanmagan",
    managerPhone: "+998 88 253 18 88",
    ownerName: "Qashqadaryo viloyat hokimiyati",
    ownerPhone: "+998 88 253 18 88",
    verified: false,
    coverImage: "/property-photos/prop-qshq-9/photo-1.jpg",
    images: [
      "/property-photos/prop-qshq-9/photo-1.jpg",
      "/property-photos/prop-qshq-9/photo-2.jpg",
      "/property-photos/prop-qshq-9/photo-3.jpg",
      "/property-photos/prop-qshq-9/photo-4.jpg"
    ],
    description: "Manzil: Ko'kdala tumani, Yettitom shaharchasi, 2-uy (bino podvalida joy). Bino maydoni 500 m.kv, Bino 3 qavatli (taklif etilayotgan joy - podval qavatida). Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Joylashuv: https://maps.app.goo.gl/8wSq9vnQL5k8TL1u5. Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-08-29 holatiga). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.",
    nearbyUniversities: [],
    nearbyResidents: [],
    nearbyTransit: [],
    cadastreNumber: "",
    inspectionReport: {
      status: "PENDING",
      inspectionDate: "",
      inspectorName: "",
      findings: "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.",
      notes: "Joyga tashrif buyurish kutilmoqda."
    },
    pipelineStage: "Found",
    timeline: [
      { stage: "Found", date: "2026-08-29", user: "Data Import", description: "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma)." }
    ],
    documents: [],
    utilities: {
      electricityCost: 0,
      waterCost: 0,
      internetCost: 0
    }
  },
  {
    id: "prop-qshq-10",
    name: "Qarshi - Geologlar ko'chasi 22/2 (Jurnalistlar uyi)",
    type: "Commercial Building",
    status: "Pending Verification",
    city: "Qarshi",
    district: "Qarshi",
    address: "Qarshi shahri, Geologlar ko'chasi 22/2-uy (Jurnalistlar uyi, bino podvalida joy)",
    monthlyRent: undefined,
    areaSqM: 3300,
    rooms: 0,
    parkingSpots: 0,
    internetSpeedMbps: 0,
    hasAC: false,
    hasMeetingRooms: false,
    availableDate: "2026-08-29",
    managerName: "Belgilanmagan",
    managerPhone: "Ko'rsatilmagan",
    ownerName: "Qashqadaryo viloyat hokimiyati",
    ownerPhone: "Ko'rsatilmagan",
    verified: false,
    coverImage: "/property-photos/prop-qshq-10/photo-1.jpg",
    images: [
      "/property-photos/prop-qshq-10/photo-1.jpg",
      "/property-photos/prop-qshq-10/photo-2.jpg",
      "/property-photos/prop-qshq-10/photo-3.jpg",
      "/property-photos/prop-qshq-10/photo-4.jpg"
    ],
    description: "Manzil: Qarshi shahri, Geologlar ko'chasi 22/2-uy (Jurnalistlar uyi, bino podvalida joy). Bino maydoni 3300 m.kv, Bino 3 qavatli (taklif etilayotgan joy - podval qavatida). Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Joylashuv: https://maps.app.goo.gl/SFXBmFzbEvtogXAM7. Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-08-29 holatiga). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.",
    nearbyUniversities: [],
    nearbyResidents: [],
    nearbyTransit: [],
    cadastreNumber: "",
    inspectionReport: {
      status: "PENDING",
      inspectionDate: "",
      inspectorName: "",
      findings: "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.",
      notes: "Joyga tashrif buyurish kutilmoqda."
    },
    pipelineStage: "Found",
    timeline: [
      { stage: "Found", date: "2026-08-29", user: "Data Import", description: "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma)." }
    ],
    documents: [],
    utilities: {
      electricityCost: 0,
      waterCost: 0,
      internetCost: 0
    }
  },
  {
    id: "prop-qshq-11",
    name: "Qarshi - Mustaqillik ko'chasi 7",
    type: "Commercial Building",
    status: "Pending Verification",
    city: "Qarshi",
    district: "Qarshi",
    address: "Qarshi shahri, Mustaqillik ko'chasi 7-uy",
    monthlyRent: undefined,
    areaSqM: 400,
    rooms: 0,
    parkingSpots: 0,
    internetSpeedMbps: 0,
    hasAC: false,
    hasMeetingRooms: false,
    availableDate: "2026-08-29",
    managerName: "Belgilanmagan",
    managerPhone: "Ko'rsatilmagan",
    ownerName: "Qashqadaryo viloyat hokimiyati",
    ownerPhone: "Ko'rsatilmagan",
    verified: false,
    coverImage: "/property-photos/prop-qshq-11/photo-1.jpg",
    images: [
      "/property-photos/prop-qshq-11/photo-1.jpg",
      "/property-photos/prop-qshq-11/photo-2.jpg",
      "/property-photos/prop-qshq-11/photo-3.jpg",
      "/property-photos/prop-qshq-11/photo-4.jpg"
    ],
    description: "Manzil: Qarshi shahri, Mustaqillik ko'chasi 7-uy. Bino maydoni 400 m.kv, 4 qavat. Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Joylashuv: https://maps.app.goo.gl/MHyE5xvXb1gcobEs9. Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-08-29 holatiga). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.",
    nearbyUniversities: [],
    nearbyResidents: [],
    nearbyTransit: [],
    cadastreNumber: "",
    inspectionReport: {
      status: "PENDING",
      inspectionDate: "",
      inspectorName: "",
      findings: "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.",
      notes: "Joyga tashrif buyurish kutilmoqda."
    },
    pipelineStage: "Found",
    timeline: [
      { stage: "Found", date: "2026-08-29", user: "Data Import", description: "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma)." }
    ],
    documents: [],
    utilities: {
      electricityCost: 0,
      waterCost: 0,
      internetCost: 0
    }
  },
];
