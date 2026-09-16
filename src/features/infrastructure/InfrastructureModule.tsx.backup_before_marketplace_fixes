/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Building, 
  MapPin, 
  UserCheck, 
  Sliders, 
  Maximize2, 
  DollarSign, 
  AlertCircle,
  X,
  FileSpreadsheet,
  Calendar,
  Briefcase,
  Wrench,
  Zap,
  ShieldCheck,
  FileText,
  Signature,
  Search,
  TrendingUp,
  Activity,
  Upload,
  Plus,
  CheckCircle,
  Clock,
  Info,
  QrCode,
  Download,
  Map as MapIcon,
  ChevronRight,
  ClipboardCheck,
  Check,
  AlertTriangle,
  Flame,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Printer,
  Grid,
  Eye,
  ArrowUpDown,
  Share2,
  Trash2,
  Edit,
  CheckSquare,
  FileDown,
  ChevronLeft,
  Filter,
  SlidersHorizontal,
  Video,
  Phone,
  User,
  Compass,
  Heart
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { Office, BuildingBlock, Startup, Resident, OfficeStatus, KASHKADARYA_DISTRICTS } from "../../types";
import PhotoUploader from "../../components/PhotoUploader";
import { Property, PropertyTimelineItem, PropertyDocument } from "./propertyTypes";
import { useLanguage } from "../../lib/LanguageContext";
import ExportImportManager from "../../components/ExportImportManager";
import KashkadaryaRealEstateMap from "./KashkadaryaRealEstateMap";

interface InfrastructureModuleProps {
  offices: Office[];
  startups: Startup[];
  residents: Resident[];
  properties: Property[];
  onUpdateOffice: (id: string, officePayload: Partial<Office>) => Promise<void>;
  onAddProperty: (payload: Partial<Property>) => Promise<any>;
  onUpdateProperty: (id: string, payload: Partial<Property>) => Promise<void>;
  userRole: string;
  onSyncState?: () => void;
}

const DEFAULT_NEW_PROP: Partial<Property> = {
  name: "",
  type: "Office",
  status: "Available for Rent",
  city: "Qarshi",
  district: "Mustaqillik District",
  address: "",
  monthlyRent: 1500,
  purchasePrice: 150000,
  areaSqM: 180,
  rooms: 5,
  parkingSpots: 10,
  internetSpeedMbps: 500,
  hasAC: true,
  hasMeetingRooms: true,
  availableDate: "2026-07-20",
  managerName: "Hasan Abdukarimov",
  managerPhone: "+998 90 123 45 67",
  ownerName: "",
  ownerPhone: "",
  verified: false,
  description: "",
  nearbyUniversities: [],
  nearbyResidents: [],
  nearbyTransit: [],
  cadastreNumber: "",
  coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80",
  images: []
};

type ActiveTab = "dashboard" | "marketplace" | "matcher" | "pipeline" | "vault" | "import-export";

export default function InfrastructureModule({ 
  offices, 
  startups, 
  residents, 
  properties,
  onUpdateOffice, 
  onAddProperty,
  onUpdateProperty,
  userRole,
  onSyncState
}: InfrastructureModuleProps) {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedMatchCompany, setSelectedMatchCompany] = useState<string>("");
  
  // Advanced Filter state
  const [filterCity, setFilterCity] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterPriceRange, setFilterPriceRange] = useState(5000);
  const [filterMinArea, setFilterMinArea] = useState(0);
  const [filterAC, setFilterAC] = useState(false);
  const [filterMeetingRooms, setFilterMeetingRooms] = useState(false);
  const [filterVerifiedOnly, setFilterVerifiedOnly] = useState(false);

  // Property comparison state
  const [comparedPropertyIds, setComparedPropertyIds] = useState<string[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  // Detail View: Categories of photos
  const [activeGalleryCategory, setActiveGalleryCategory] = useState<string>("All");
  const [isFullscreenGallery, setIsFullscreenGallery] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  // Interactive Map Focus Property
  const [mapFocusedPropertyId, setMapFocusedPropertyId] = useState<string>("prop-1");

  // Scheduler state
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("2026-07-16");
  const [scheduleTime, setScheduleTime] = useState("14:30");
  const [scheduleNotes, setScheduleNotes] = useState("Need to check Server room space and cooling capacity.");
  const [scheduleSignedName, setScheduleSignedName] = useState("");
  const signatureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawingSignature, setIsDrawingSignature] = useState(false);

  // Image Upload Simulator
  const [dragOverActive, setDragOverActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [selectedUploadCategory, setSelectedUploadCategory] = useState("Office");

  // Import Simulator state
  const [importDragActive, setImportDragActive] = useState(false);
  const [importData, setImportData] = useState<any[] | null>(null);
  const [importValidated, setImportValidated] = useState(false);
  const [importNotification, setImportNotification] = useState("");

  // Create Property modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProp, setNewProp] = useState<Partial<Property>>(DEFAULT_NEW_PROP);

  // Calculate Metrics for Dashboard
  const availableCount = properties.filter(p => p.status.includes("Available")).length;
  const rentCount = properties.filter(p => p.status === "Available for Rent" || p.status === "Rent & Sale").length;
  const saleCount = properties.filter(p => p.status === "Available for Sale" || p.status === "Rent & Sale").length;
  const reservedCount = properties.filter(p => p.status === "Reserved").length;
  const occupiedCount = properties.filter(p => p.status === "Occupied").length;
  const verifiedCount = properties.filter(p => p.verified).length;
  const pendingVerifyCount = properties.filter(p => p.status === "Pending Verification").length;
  
  const totalRentSum = properties.reduce((acc, p) => acc + (p.monthlyRent || 0), 0);
  const avgMonthlyRent = properties.filter(p => p.monthlyRent).length > 0 
    ? Math.round(totalRentSum / properties.filter(p => p.monthlyRent).length) 
    : 0;

  const totalAreaSum = properties.reduce((acc, p) => acc + p.areaSqM, 0);
  const avgPropertySize = Math.round(totalAreaSum / properties.length);

  // Region breakdown for Recharts Pie/Bar across Kashkadarya districts
  const regionsData = KASHKADARYA_DISTRICTS.map(city => {
    const cityProps = properties.filter(p => p.city === city || p.district === city);
    return {
      name: city,
      value: cityProps.length,
      avgRent: cityProps.length > 0 ? Math.round(cityProps.reduce((sum, p) => sum + (p.monthlyRent || 0), 0) / cityProps.length) : 0,
      avgArea: cityProps.length > 0 ? Math.round(cityProps.reduce((sum, p) => sum + p.areaSqM, 0) / cityProps.length) : 0
    };
  });

  const COLORS = ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];

  // Filtering properties
  const filteredProperties = properties.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = (p.name || "").toLowerCase().includes(q) || 
                          (p.address || "").toLowerCase().includes(q) ||
                          (p.district || "").toLowerCase().includes(q);
    const matchesCity = filterCity === "ALL" || p.city === filterCity;
    const matchesType = filterType === "ALL" || p.type === filterType;
    const matchesStatus = filterStatus === "ALL" || p.status === filterStatus;
    const matchesPrice = (p.monthlyRent || 0) <= filterPriceRange || (p.purchasePrice || 0) <= filterPriceRange * 100;
    const matchesArea = p.areaSqM >= filterMinArea;
    const matchesAC = !filterAC || p.hasAC;
    const matchesMeeting = !filterMeetingRooms || p.hasMeetingRooms;
    const matchesVerify = !filterVerifiedOnly || p.verified;
    return matchesSearch && matchesCity && matchesType && matchesStatus && matchesPrice && matchesArea && matchesAC && matchesMeeting && matchesVerify;
  });

  // Export & Import Columns Schema for Commercial Property Marketplace
  const propertyExportColumns = [
    { key: "name", label: "Property Name", required: true, type: "string" as const },
    { key: "type", label: "Property Type", required: true, type: "string" as const },
    { key: "status", label: "Status", required: true, type: "string" as const },
    { key: "city", label: "City / District", required: true, type: "string" as const },
    { key: "address", label: "Full Address", type: "string" as const },
    { key: "areaSqM", label: "Area (Sq. Meters)", type: "number" as const },
    { key: "monthlyRent", label: "Monthly Rent (USD)", type: "currency" as const },
    { key: "purchasePrice", label: "Purchase Price (USD)", type: "currency" as const },
    { key: "rooms", label: "Room Count", type: "number" as const },
    { key: "parkingSpots", label: "Parking Spots", type: "number" as const },
    { key: "internetSpeedMbps", label: "Internet Speed (Mbps)", type: "number" as const },
    { key: "managerName", label: "Property Manager Name", type: "string" as const },
    { key: "managerPhone", label: "Manager Phone", type: "phone" as const },
    { key: "cadastreNumber", label: "Cadastre Number", type: "string" as const }
  ];

  // Toggle Property Comparison selection
  const handleToggleCompare = (id: string) => {
    if (comparedPropertyIds.includes(id)) {
      setComparedPropertyIds(prev => prev.filter(pId => pId !== id));
    } else {
      if (comparedPropertyIds.length >= 4) {
        alert("You can compare up to 4 properties simultaneously.");
        return;
      }
      setComparedPropertyIds(prev => [...prev, id]);
    }
  };

  // Move properties across stages (Property pipeline)
  const handleMovePipelineStage = (id: string, direction: "next" | "prev") => {
    const pipelineOrder: Property["pipelineStage"][] = [
      "Found", "Inspection", "Documents", "Verified", "Published", "Recommended", "Reserved", "Occupied"
    ];
    const p = properties.find(pr => pr.id === id);
    if (!p) return;
    const curIndex = pipelineOrder.indexOf(p.pipelineStage);
    let nextIndex = curIndex + (direction === "next" ? 1 : -1);
    if (nextIndex < 0 || nextIndex >= pipelineOrder.length) return;
    const nextStage = pipelineOrder[nextIndex];

    // Sync Property Status with Pipeline stage
    let nextStatus = p.status;
    let nextVerified = p.verified;
    if (nextStage === "Verified") {
      nextVerified = true;
    }
    if (nextStage === "Published") {
      nextStatus = "Available for Rent";
      nextVerified = true;
    }
    if (nextStage === "Reserved") {
      nextStatus = "Reserved";
    }
    if (nextStage === "Occupied") {
      nextStatus = "Occupied";
    }

    const updatedTimelineItem: PropertyTimelineItem = {
      stage: nextStage,
      date: new Date().toISOString().split("T")[0],
      user: "Hasan Abdukarimov",
      description: `Advanced property status to ${nextStage}`
    };

    onUpdateProperty(id, {
      pipelineStage: nextStage,
      status: nextStatus,
      verified: nextVerified,
      timeline: [...p.timeline, updatedTimelineItem]
    });
  };

  // Digital signature draw controls
  const startDrawingSignature = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawingSignature(true);
  };

  const drawSignature = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingSignature) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.strokeStyle = "#4f46e5";
    ctx.lineWidth = 2.5;
    ctx.stroke();
  };

  const clearSignatureCanvas = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Triggering visual scheduler viewings
  const executeViewingSchedule = () => {
    if (!selectedProperty || !scheduleSignedName) {
      alert("Please enter the representative name and draw signature.");
      return;
    }
    
    // Log in property history timeline
    onUpdateProperty(selectedProperty.id, {
      status: "Reserved",
      pipelineStage: "Reserved",
      timeline: [
        ...selectedProperty.timeline,
        {
          stage: "Reserved",
          date: scheduleDate,
          user: "Hasan Abdukarimov",
          description: `Scheduled site visit on ${scheduleDate} at ${scheduleTime} for company representative ${scheduleSignedName}.`
        }
      ]
    });
    setSelectedProperty(prev => prev ? { ...prev, status: "Reserved", pipelineStage: "Reserved" } : null);

    // Alert successful placement/reservation
    alert(`Placement Reservation locked! viewing scheduled on ${scheduleDate} at ${scheduleTime}. Documents generated.`);
    setScheduleModalOpen(false);
    setScheduleSignedName("");
    if (onSyncState) onSyncState();
  };

  // Image upload mock logic
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverActive(true);
  };

  const handleDragLeave = () => {
    setDragOverActive(false);
  };

  const handleDropImage = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      simulateImageUpload(e.dataTransfer.files[0].name);
    }
  };

  const simulateImageUpload = (fileName: string) => {
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null) return 0;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploadProgress(null);
            const newMockUrl = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80";
            setUploadedPhotos(prevPhotos => [...prevPhotos, newMockUrl]);
            // If viewing a property, add image to its collection
            if (selectedProperty) {
              onUpdateProperty(selectedProperty.id, { images: [...selectedProperty.images, newMockUrl] });
              setSelectedProperty(prev => prev ? { ...prev, images: [...prev.images, newMockUrl] } : null);
            }
          }, 600);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  // Import mock Excel properties logic
  const handleImportDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setImportDragActive(true);
  };

  const handleImportDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setImportDragActive(false);
    // Simulate reading mock real estate properties database
    setImportData([
      { row: 1, name: "Chilanzar Tech Hub", address: "36 Bunyodkor Ave, Tashkent", type: "Technology Park", size: 520, rent: 4100, duplicate: false },
      { row: 2, name: "Amir Temur Tech Tower", address: "108 Amir Temur Ave, Tashkent", type: "Business Center", size: 450, rent: 3500, duplicate: true },
      { row: 3, name: "Kokand Digital Space", address: "42 Istiqlol St, Kokand", type: "Coworking Space", size: 190, rent: 1100, duplicate: false }
    ]);
  };

  const executeCommitImport = () => {
    if (!importData) return;
    const addedCount = importData.filter(d => !d.duplicate).length;
    
    const newImportedProperties: Property[] = importData
      .filter(d => !d.duplicate)
      .map((d, index) => ({
        id: `imported-${Date.now()}-${index}`,
        name: d.name,
        type: d.type,
        status: "Available for Rent",
        city: d.address.includes("Tashkent") ? "Tashkent" : "Fergana",
        district: "Sourced Import District",
        address: d.address,
        monthlyRent: d.rent,
        areaSqM: d.size,
        rooms: 6,
        parkingSpots: 10,
        internetSpeedMbps: 300,
        hasAC: true,
        hasMeetingRooms: true,
        availableDate: "2026-07-20",
        managerName: "Nozimjon Soliev",
        managerPhone: "+998 97 777 88 99",
        ownerName: "Import Owner",
        ownerPhone: "+998 90 999 00 11",
        verified: true,
        coverImage: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80",
        images: ["https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80"],
        description: "Imported from Excel bulk uploader logs. High premium internet and cooling fully pre-verified.",
        nearbyUniversities: ["Inha University", "TUIT"],
        nearbyResidents: ["Imported Company Partners"],
        nearbyTransit: ["Nearest Bus Transit"],
        cadastreNumber: `CAD-IMP-00${index}`,
        inspectionReport: {
          status: "PASSED",
          inspectionDate: "2026-07-10",
          inspectorName: "Bulk Engine Validator",
          findings: "Pre-checked by database imports",
          notes: "Success"
        },
        pipelineStage: "Published",
        timeline: [{ stage: "Found", date: "2026-07-12", user: "Importer AI", description: "Uploaded and mapped into property index catalog." }],
        documents: [],
        utilities: { electricityCost: 120, waterCost: 40, internetCost: 80 }
      }));

    newImportedProperties.forEach(p => onAddProperty(p));
    setImportNotification(`Successfully imported ${addedCount} verified property profiles! Mapped ${importData.filter(d => d.duplicate).length} duplicate rows back into logs.`);
    setImportData(null);
    setTimeout(() => setImportNotification(""), 5000);
  };

  // Recommendation matcher calculation
  const getRecommendationScore = (property: Property, residentOrStartup: any) => {
    if (!residentOrStartup) return 0;
    let score = 100;
    
    // Check location
    const targetCity = residentOrStartup.legalAddress?.split(",").pop()?.trim() || "Tashkent";
    if ((property.city || "").toLowerCase() !== targetCity.toLowerCase() && targetCity !== "Tashkent") {
      score -= 20;
    }
    
    // Check budget
    const targetBudget = residentOrStartup.revenue ? (residentOrStartup.revenue / 12) * 0.1 : 3000; // estimated rent budget
    if (property.monthlyRent && property.monthlyRent > targetBudget) {
      const budgetDiff = ((property.monthlyRent - targetBudget) / targetBudget) * 100;
      score -= Math.min(30, Math.round(budgetDiff));
    }
    
    // Check capacity
    const employees = residentOrStartup.employeesCount || residentOrStartup.employees || 10;
    const estimatedCapacity = property.areaSqM / 8; // approx 8m2 per developer
    if (estimatedCapacity < employees) {
      score -= 25;
    }

    return Math.max(40, score);
  };

  const getActiveMatchCompany = () => {
    if (!selectedMatchCompany) return null;
    if (selectedMatchCompany.startsWith("st-")) {
      return startups.find(s => s.id === selectedMatchCompany);
    }
    return residents.find(r => r.id === selectedMatchCompany);
  };

  const matchedCompany = getActiveMatchCompany();
  const matchedList = matchedCompany 
    ? properties
        .map(p => ({
          property: p,
          score: getRecommendationScore(p, matchedCompany)
        }))
        .sort((a, b) => b.score - a.score)
    : [];

  // Create Property execute
  // Shared save handler for both "Register Sourced Property" (create) and
  // "Edit / Verify Property" (update) -- editingPropertyId set means we're
  // updating an existing record in place rather than minting a new one.
  const handleSaveProperty = () => {
    if (!newProp.name || !newProp.address) {
      alert("Please provide the property name and physical address.");
      return;
    }

    if (editingPropertyId) {
      const existing = properties.find(p => p.id === editingPropertyId);
      if (!existing) return;

      const verifiedNow = !!newProp.verified;
      const wasVerified = existing.verified;
      const updates: Partial<Property> = {
        name: newProp.name,
        type: newProp.type as any,
        status: newProp.status as any,
        city: newProp.city || existing.city,
        district: newProp.district || existing.district,
        address: newProp.address,
        monthlyRent: newProp.monthlyRent,
        purchasePrice: newProp.purchasePrice,
        areaSqM: newProp.areaSqM ?? existing.areaSqM,
        rooms: newProp.rooms ?? existing.rooms,
        parkingSpots: newProp.parkingSpots ?? existing.parkingSpots,
        internetSpeedMbps: newProp.internetSpeedMbps ?? existing.internetSpeedMbps,
        hasAC: !!newProp.hasAC,
        hasMeetingRooms: !!newProp.hasMeetingRooms,
        availableDate: newProp.availableDate || existing.availableDate,
        ownerName: newProp.ownerName || existing.ownerName,
        ownerPhone: newProp.ownerPhone || existing.ownerPhone,
        verified: verifiedNow,
        coverImage: newProp.coverImage || existing.coverImage,
        images: (newProp.images && newProp.images.length > 0) ? newProp.images : existing.images,
        description: newProp.description || existing.description,
        cadastreNumber: newProp.cadastreNumber || existing.cadastreNumber,
        timeline: (verifiedNow && !wasVerified)
          ? [...existing.timeline, {
              stage: "Verified",
              date: new Date().toISOString().split("T")[0],
              user: "Hasan Abdukarimov",
              description: "Property details corrected and marked verified after on-site visit."
            }]
          : existing.timeline
      };

      onUpdateProperty(editingPropertyId, updates);
      setSelectedProperty(prev => (prev && prev.id === editingPropertyId) ? { ...prev, ...updates } : prev);
      setShowCreateModal(false);
      setEditingPropertyId(null);
      alert(`Saved verification updates for "${newProp.name}".`);
      if (onSyncState) onSyncState();
      return;
    }

    const created: Property = {
      id: `prop-${Date.now()}`,
      name: newProp.name,
      type: newProp.type as any,
      status: newProp.status as any,
      city: newProp.city || "Qarshi",
      district: newProp.district || "Mustaqillik District",
      address: newProp.address,
      monthlyRent: newProp.monthlyRent,
      purchasePrice: newProp.purchasePrice,
      areaSqM: newProp.areaSqM || 150,
      rooms: newProp.rooms || 4,
      parkingSpots: newProp.parkingSpots || 5,
      internetSpeedMbps: newProp.internetSpeedMbps || 100,
      hasAC: !!newProp.hasAC,
      hasMeetingRooms: !!newProp.hasMeetingRooms,
      availableDate: newProp.availableDate || "2026-07-20",
      managerName: "Hasan Abdukarimov",
      managerPhone: "+998 90 123 45 67",
      ownerName: newProp.ownerName || "Private Landlord",
      ownerPhone: newProp.ownerPhone || "+998 90 100 20 30",
      verified: !!newProp.verified,
      coverImage: newProp.coverImage || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80",
      images: (newProp.images && newProp.images.length > 0) ? newProp.images : [newProp.coverImage || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80"],
      description: newProp.description || "A gorgeous technology-first commercial property verified specifically for tech residents.",
      nearbyUniversities: ["Qarshi State University", "TUIT Qarshi Branch"],
      nearbyResidents: ["Kashkadarya Developers Guild"],
      nearbyTransit: ["Qarshi Central Bus Station"],
      cadastreNumber: newProp.cadastreNumber || "22:04:12:05:01:0023",
      inspectionReport: {
        status: "PASSED",
        inspectionDate: new Date().toISOString().split("T")[0],
        inspectorName: "Hasan Abdukarimov",
        findings: "Safety inspections completed during initial property verification",
        notes: "Perfect structural condition"
      },
      pipelineStage: "Verified",
      timeline: [{ stage: "Found", date: new Date().toISOString().split("T")[0], user: "Hasan Abdukarimov", description: "Discovered and logged via property web-builder" }],
      documents: [],
      utilities: { electricityCost: 150, waterCost: 50, internetCost: 100 }
    };

    onAddProperty(created);
    setShowCreateModal(false);
    alert(`Successfully registered "${created.name}" property profile. Re-routing into catalog.`);
    if (onSyncState) onSyncState();
  };

  // Opens the shared property form pre-filled for editing/verifying an
  // existing property (used by the "Edit / Verify Property" button in the
  // detail view -- staff use this to record on-site verification results).
  const handleEditPropertyClick = (property: Property) => {
    setNewProp({
      name: property.name,
      type: property.type,
      status: property.status,
      city: property.city,
      district: property.district,
      address: property.address,
      monthlyRent: property.monthlyRent,
      purchasePrice: property.purchasePrice,
      areaSqM: property.areaSqM,
      rooms: property.rooms,
      parkingSpots: property.parkingSpots,
      internetSpeedMbps: property.internetSpeedMbps,
      hasAC: property.hasAC,
      hasMeetingRooms: property.hasMeetingRooms,
      availableDate: property.availableDate,
      ownerName: property.ownerName,
      ownerPhone: property.ownerPhone,
      verified: property.verified,
      description: property.description,
      nearbyUniversities: property.nearbyUniversities,
      nearbyResidents: property.nearbyResidents,
      nearbyTransit: property.nearbyTransit,
      cadastreNumber: property.cadastreNumber,
      coverImage: property.coverImage,
      images: property.images
    });
    setEditingPropertyId(property.id);
    setShowCreateModal(true);
  };

  // Export spreadsheet visual simulation
  const handleExportFile = (format: string) => {
    alert(`Formatting ${format.toUpperCase()} reports... File download initialized.`);
  };

  return (
    <div id="property-marketplace-root" className="space-y-6">
      
      {/* Upper Property Command Post Banner */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-slate-900 text-white p-6 rounded-2xl gap-4 shadow-xl shadow-slate-900/10 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-emerald-600 rounded-full text-[9px] font-extrabold uppercase tracking-widest text-emerald-50">PROPERTY PORTAL</span>
            <span className="text-slate-400 text-xs font-mono">v6.0 Uzbekistan</span>
          </div>
          <h1 className="text-2xl font-black mt-1 tracking-tight flex items-center gap-2">
            🏢 {t("IT Park Property Marketplace")}
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            {t("A comprehensive commercial real estate catalog designed specifically to discover, verify, match, and recommend modern visual properties for local tech startups, international IT exporters, and BPO investors in Uzbekistan.")}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center">
          {/* Quick search input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={t("Quick search properties, districts...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-400 rounded-xl py-2 pl-9 pr-4 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-2.5 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Property Marketplace Export & Upload Manager */}
          <ExportImportManager
            module="properties"
            moduleTitle="Property Marketplace Catalog"
            data={filteredProperties}
            columns={propertyExportColumns}
            userRole={userRole as any}
            onImportCompleted={(importedRecords) => {
              if (importedRecords && importedRecords.length > 0) {
                const newProps: Property[] = importedRecords.map((rec, idx) => ({
                  id: `imp-prop-${Date.now()}-${idx}`,
                  name: rec.name || rec.propertyName || "Imported Commercial Property",
                  type: rec.type || "Office",
                  status: rec.status || "Available for Rent",
                  city: rec.city || "Qarshi",
                  district: rec.district || rec.city || "Qarshi",
                  address: rec.address || "Kashkadarya Region",
                  monthlyRent: Number(rec.monthlyRent) || 1200,
                  purchasePrice: Number(rec.purchasePrice) || 120000,
                  areaSqM: Number(rec.areaSqM) || 150,
                  rooms: Number(rec.rooms) || 4,
                  parkingSpots: Number(rec.parkingSpots) || 8,
                  internetSpeedMbps: Number(rec.internetSpeedMbps) || 500,
                  hasAC: rec.hasAC !== undefined ? Boolean(rec.hasAC) : true,
                  hasMeetingRooms: rec.hasMeetingRooms !== undefined ? Boolean(rec.hasMeetingRooms) : true,
                  availableDate: rec.availableDate || new Date().toISOString().split("T")[0],
                  managerName: rec.managerName || "Hasan Abdukarimov",
                  managerPhone: rec.managerPhone || "+998 90 123 45 67",
                  ownerName: rec.ownerName || "Commercial Property Owner",
                  ownerPhone: rec.ownerPhone || "+998 75 222 33 44",
                  description: rec.description || "Imported commercial property in Kashkadarya IT Park Ecosystem.",
                  nearbyUniversities: ["Karshi State University"],
                  nearbyResidents: ["Epam Systems"],
                  nearbyTransit: ["City Bus Station"],
                  cadastreNumber: rec.cadastreNumber || `CAD-${Math.floor(100000 + Math.random() * 900000)}`,
                  coverImage: rec.coverImage || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80",
                  images: [],
                  timeline: [],
                  documents: [],
                  verified: true,
                  inspectionReport: {
                    status: "PASSED",
                    inspectionDate: new Date().toISOString().split("T")[0],
                    inspectorName: "IT Park Inspector",
                    findings: "Property verified and compliant with tech workplace standards.",
                    notes: "Ready for tenant occupancy."
                  },
                  pipelineStage: "Verified",
                  utilities: {
                    electricityCost: 120,
                    waterCost: 40,
                    internetCost: 80
                  }
                }));
                newProps.forEach(p => onAddProperty(p));
                if (onSyncState) onSyncState();
              }
            }}
          />

          <button
            onClick={() => {
              setNewProp(DEFAULT_NEW_PROP);
              setEditingPropertyId(null);
              setShowCreateModal(true);
            }}
            className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>{t("Add New Sourced Property")}</span>
          </button>
        </div>
      </div>

      {/* Main Multi-Tab Navigation Rail */}
      <div className="flex flex-wrap gap-2.5 bg-slate-100 p-1.5 rounded-2xl overflow-x-auto border border-slate-200">
        {(
          [
            { id: "dashboard", label: "Executive BI Dashboard", icon: Sliders },
            { id: "marketplace", label: "Properties Marketplace Explorer", icon: Compass },
            { id: "matcher", label: "Resident Recommendation Matcher", icon: UserCheck },
            { id: "pipeline", label: "Lifecycle Pipeline Board", icon: Activity },
            { id: "vault", label: "Legal Document Vault", icon: FileText },
            { id: "import-export", label: "Bulk Import & Reporting", icon: FileSpreadsheet }
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              id={`prop-tab-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                isActive 
                  ? "bg-white text-emerald-600 shadow-md shadow-emerald-600/5 font-black border border-emerald-50/50" 
                  : "text-slate-600 hover:bg-slate-200 hover:text-slate-800"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
              <span>{t(tab.label)}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB VIEW DISPATCH */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: EXECUTIVE BI DASHBOARD */}
          {activeTab === "dashboard" && (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              
              {/* Executive Indicators Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">{t("TOTAL LISTINGS")}</span>
                  <span className="text-2xl font-black text-slate-800 font-mono mt-1 block">{properties.length}</span>
                  <span className="text-[9px] text-slate-500 block mt-1">{t("Properties Indexed")}</span>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">{t("AVAILABLE FOR RENT")}</span>
                  <span className="text-2xl font-black text-emerald-600 font-mono mt-1 block">{rentCount}</span>
                  <span className="text-[9px] text-emerald-500 block mt-1">{t("Ready for IT Exporters")}</span>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">{t("PROPERTIES FOR SALE")}</span>
                  <span className="text-2xl font-black text-indigo-600 font-mono mt-1 block">{saleCount}</span>
                  <span className="text-[9px] text-indigo-500 block mt-1">{t("Assets for investment")}</span>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">{t("RESERVED & OCCUPIED")}</span>
                  <span className="text-2xl font-black text-amber-600 font-mono mt-1 block">{reservedCount + occupiedCount}</span>
                  <span className="text-[9px] text-amber-500 block mt-1">
                    {reservedCount} {t("Reserved")}, {occupiedCount} {t("Occupied")}
                  </span>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs col-span-2 md:col-span-1">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">{t("AVERAGE RENT")}</span>
                  <span className="text-xl font-black text-slate-800 font-mono mt-1 block">${(avgMonthlyRent || 0).toLocaleString()}/mo</span>
                  <span className="text-[9px] text-slate-500 block mt-1">{t("across Kashkadarya")}</span>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs col-span-2 md:col-span-1">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">{t("AVERAGE SIZE")}</span>
                  <span className="text-xl font-black text-slate-800 font-mono mt-1 block">{avgPropertySize} m²</span>
                  <span className="text-[9px] text-slate-500 block mt-1">{t("commercial footprint")}</span>
                </div>
              </div>

              {/* Kashkadarya Interactive Property Map Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Real Google Maps & Interactive Geographic Map Component */}
                <KashkadaryaRealEstateMap
                  properties={properties}
                  focusedPropertyId={mapFocusedPropertyId}
                  onSelectProperty={setSelectedProperty}
                  onFocusProperty={setMapFocusedPropertyId}
                />


                {/* Regional and District Statistics */}
                <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-xs">
                  <div>
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b pb-2 mb-3 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      {t("Geographic Hub Capacity")}
                    </h3>
                    <div className="h-44 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={regionsData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#64748b" }} />
                          <YAxis tick={{ fontSize: 9, fill: "#64748b" }} />
                          <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                          <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]}>
                            {regionsData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">{t("Properties by City / District")}</span>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      {regionsData.map((r, idx) => (
                        <div key={r.name} className="flex justify-between items-center p-2 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="font-bold text-slate-700 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                            {t(r.name)}
                          </span>
                          <span className="font-mono text-slate-500 font-extrabold">{r.value} {t("listings")}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recently Sourced Properties Flow */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b pb-2 mb-4">{t("Recently Sourced Kashkadarya Properties")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {properties.slice(0, 3).map(p => (
                    <div key={p.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <img src={p.coverImage} className="w-12 h-12 rounded-lg object-cover bg-slate-200" alt="" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-slate-800 truncate">{p.name}</h4>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{t(p.city)}, {p.district}</p>
                        <span className="text-[9px] text-slate-500 font-semibold block mt-1">{t("Sourced:")} {p.timeline[0]?.date}</span>
                      </div>
                      <button
                        onClick={() => setSelectedProperty(p)}
                        className="text-[10px] text-emerald-600 font-extrabold hover:underline cursor-pointer"
                      >
                        {t("View")}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 2: PROPERTIES MARKETPLACE EXPLORER */}
          {activeTab === "marketplace" && (
            <motion.div key="marketplace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              
              {/* Filter and Advanced settings block */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-4">
                <div className="flex flex-wrap gap-3 items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Filter className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">{t("Advanced Marketplace Filters")}</h3>
                  </div>
                  <button
                    onClick={() => {
                      setFilterCity("ALL");
                      setFilterType("ALL");
                      setFilterStatus("ALL");
                      setFilterPriceRange(5000);
                      setFilterMinArea(0);
                      setFilterAC(false);
                      setFilterMeetingRooms(false);
                      setFilterVerifiedOnly(false);
                    }}
                    className="text-[10px] font-bold text-slate-500 hover:text-emerald-600 hover:underline transition-all"
                  >
                    {t("Reset All Filters")}
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 text-xs">
                  {/* City filter */}
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider mb-1">{t("Location/City")}</label>
                    <select
                      value={filterCity}
                      onChange={(e) => setFilterCity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-700 cursor-pointer"
                    >
                      <option value="ALL">{t("All Cities")}</option>
                      <option value="Qarshi">{t("Qarshi")}</option>
                      <option value="Shahrisabz">{t("Shahrisabz")}</option>
                      <option value="Kitob">{t("Kitob")}</option>
                      <option value="Koson">{t("Koson")}</option>
                      <option value="G'uzor">{t("G'uzor")}</option>
                      <option value="Kamashi">{t("Kamashi")}</option>
                    </select>
                  </div>

                  {/* Property type */}
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider mb-1">{t("Property Type")}</label>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-700 cursor-pointer"
                    >
                      <option value="ALL">{t("All Types")}</option>
                      <option value="Office">{t("Office")}</option>
                      <option value="Business Center">{t("Business Center")}</option>
                      <option value="Coworking Space">{t("Coworking Space")}</option>
                      <option value="Commercial Building">{t("Commercial Building")}</option>
                      <option value="Private Office">{t("Private Office")}</option>
                      <option value="Warehouse">{t("Warehouse")}</option>
                      <option value="Technology Park">{t("Technology Park")}</option>
                    </select>
                  </div>

                  {/* Property Status */}
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider mb-1">{t("Status")}</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-700 cursor-pointer"
                    >
                      <option value="ALL">{t("All Statuses")}</option>
                      <option value="Available for Rent">{t("Available for Rent")}</option>
                      <option value="Available for Sale">{t("Available for Sale")}</option>
                      <option value="Rent & Sale">{t("Rent & Sale")}</option>
                      <option value="Reserved">{t("Reserved")}</option>
                      <option value="Occupied">{t("Occupied")}</option>
                    </select>
                  </div>

                  {/* Area slider */}
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider mb-1">{t("Min Area")} ({filterMinArea} m²)</label>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="50"
                      value={filterMinArea}
                      onChange={(e) => setFilterMinArea(Number(e.target.value))}
                      className="w-full accent-emerald-600 mt-2.5"
                    />
                  </div>

                  {/* Max monthly rent */}
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider mb-1">{t("Max Rent")} (${filterPriceRange}/mo)</label>
                    <input
                      type="range"
                      min="1000"
                      max="10000"
                      step="500"
                      value={filterPriceRange}
                      onChange={(e) => setFilterPriceRange(Number(e.target.value))}
                      className="w-full accent-emerald-600 mt-2.5"
                    />
                  </div>

                  {/* Quick checks */}
                  <div className="flex flex-col gap-1.5 justify-center pt-2">
                    <label className="flex items-center gap-1.5 text-[10px] text-slate-600 font-bold cursor-pointer">
                      <input type="checkbox" checked={filterAC} onChange={() => setFilterAC(!filterAC)} className="rounded text-emerald-600 cursor-pointer focus:ring-emerald-500" />
                      <span>{t("Has A/C")}</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-[10px] text-slate-600 font-bold cursor-pointer">
                      <input type="checkbox" checked={filterMeetingRooms} onChange={() => setFilterMeetingRooms(!filterMeetingRooms)} className="rounded text-emerald-600 cursor-pointer focus:ring-emerald-500" />
                      <span>{t("Has Meeting Rms")}</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Property Comparison Dock / Bar */}
              {comparedPropertyIds.length > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-3">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-700">
                      {t("Property comparison:")} <strong className="text-emerald-700 font-black">{comparedPropertyIds.length} {t("properties selected")}</strong>
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setComparedPropertyIds([])}
                      className="text-[10px] font-bold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-3 py-1.5 rounded-lg transition-all"
                    >
                      {t("Clear Selection")}
                    </button>
                    <button
                      onClick={() => setShowComparisonModal(true)}
                      className="text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg transition-all"
                    >
                      {t("Open Comparison Matrix")}
                    </button>
                  </div>
                </div>
              )}

              {/* Bento Grid style beautiful cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map(p => {
                  const isCompared = comparedPropertyIds.includes(p.id);
                  return (
                    <div key={p.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
                      
                      {/* Image header with relative status badge */}
                      <div className="h-52 relative overflow-hidden bg-slate-900">
                        <img src={p.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" alt="" />
                        
                        {/* Overlay status block */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${
                            p.status === "Available for Rent" ? "bg-emerald-600 text-white" :
                            p.status === "Available for Sale" ? "bg-indigo-600 text-white" :
                            p.status === "Rent & Sale" ? "bg-cyan-600 text-white" :
                            p.status === "Reserved" ? "bg-amber-500 text-white animate-pulse" : "bg-slate-500 text-white"
                          }`}>
                            {t(p.status)}
                          </span>
                          
                          {p.verified && (
                            <span className="text-[8px] bg-emerald-100 text-emerald-800 font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              <span>{t("VERIFIED")}</span>
                            </span>
                          )}
                        </div>

                        {/* Top-right heart bookmark and compare toggle */}
                        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                          <button
                            onClick={() => handleToggleCompare(p.id)}
                            className={`p-2 rounded-full border shadow-sm transition-all cursor-pointer ${
                              isCompared ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white/80 border-slate-200 text-slate-700 hover:bg-white"
                            }`}
                            title={t("Compare property")}
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Cost tag absolute */}
                        <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-xs text-white px-3 py-1 rounded-lg text-xs font-mono font-black border border-slate-800">
                          {p.monthlyRent ? `$${p.monthlyRent.toLocaleString()}/mo` : p.purchasePrice ? `$${p.purchasePrice.toLocaleString()}` : "Price on request"}
                        </div>
                      </div>

                      {/* Info body */}
                      <div className="p-4 space-y-3">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">{t(p.type)} &bull; {t(p.city)}</span>
                          <h3 className="font-extrabold text-slate-800 text-sm mt-0.5 truncate">{p.name}</h3>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span className="truncate">{p.address}</span>
                          </p>
                        </div>

                        {/* Highlights parameters row */}
                        <div className="grid grid-cols-4 gap-1 text-[10px] text-slate-500 border-t border-b border-slate-100 py-2.5 font-semibold">
                          <div>
                            <span className="text-slate-400 block text-[8px] uppercase">{t("Space")}</span>
                            <span className="text-slate-800 font-bold">{p.areaSqM} m²</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[8px] uppercase">{t("Rooms")}</span>
                            <span className="text-slate-800 font-bold">{p.rooms} {t("Rms")}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[8px] uppercase">{t("Internet")}</span>
                            <span className="text-slate-800 font-bold">{p.internetSpeedMbps}M</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[8px] uppercase">{t("Parking")}</span>
                            <span className="text-slate-800 font-bold">{p.parkingSpots} {t("Bay")}</span>
                          </div>
                        </div>

                        {/* Infrastructure Manager and Date */}
                        <div className="flex justify-between items-center text-[10px]">
                          <div className="flex items-center gap-1.5 text-slate-600 font-bold">
                            <User className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{p.managerName}</span>
                          </div>
                          <span className="text-slate-400">{t("Available:")} {p.availableDate}</span>
                        </div>
                      </div>

                      {/* Footer actions */}
                      <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex gap-2">
                        <button
                          onClick={() => setSelectedProperty(p)}
                          className="flex-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-extrabold text-[10px] py-2 rounded-xl transition-all cursor-pointer text-center"
                        >
                          {t("View Profile & Specs")}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProperty(p);
                            setScheduleModalOpen(true);
                          }}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] py-2 rounded-xl transition-all cursor-pointer text-center shadow-xs"
                        >
                          {t("Book & Lease")}
                        </button>
                      </div>

                    </div>
                  );
                })}
                {filteredProperties.length === 0 && (
                  <div className="col-span-full py-16 text-center text-slate-400 text-xs bg-slate-50 border border-slate-200 rounded-2xl">
                    <Compass className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <span>{t("No property profiles match current selection queries. Try clearing filters.")}</span>
                  </div>
                )}
              </div>

            </motion.div>
          )}

          {/* TAB 3: RESIDENT RECOMMENDATION MATCHER */}
          {activeTab === "matcher" && (
            <motion.div key="matcher" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              
              {/* Resident selector block */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    IT Park Resident Placement Matcher Engine
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Select a startup, BPO exporter, or international enterprise to find the highest matching commercial properties in Uzbekistan.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Select Enterprise Client</label>
                    <select
                      value={selectedMatchCompany}
                      onChange={(e) => setSelectedMatchCompany(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-700 cursor-pointer"
                    >
                      <option value="">-- Choose Company Profile --</option>
                      <optgroup label="Residents (IT Exporters)">
                        {residents.map(r => (
                          <option key={r.id} value={r.id}>{r.companyName} &bull; export: ${(r.exportVolume || 0).toLocaleString()} USD</option>
                        ))}
                      </optgroup>
                      <optgroup label="Startups Hub">
                        {startups.map(s => (
                          <option key={s.id} value={s.id}>{s.name} &bull; employees: {s.employees}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                </div>
              </div>

              {/* Match calculations and recommendations list */}
              {matchedCompany && matchedList.length > 0 && (
                <div className="space-y-6">
                  
                  {/* Client profile highlights badge */}
                  <div className="bg-emerald-950 text-white p-5 rounded-2xl border border-emerald-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <span className="text-[9px] bg-emerald-800 text-emerald-100 font-black px-2.5 py-0.5 rounded-full uppercase">Target Client Profile</span>
                      <h4 className="text-lg font-black text-white mt-1">{(matchedCompany as any).companyName || (matchedCompany as any).name}</h4>
                      <p className="text-xs text-slate-300 mt-1">
                        Located: {(matchedCompany as any).legalAddress || "Tashkent"} &bull; Team: {(matchedCompany as any).employeesCount || (matchedCompany as any).employees || 10} agents
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="bg-emerald-900/40 p-3 rounded-xl border border-emerald-800/60">
                        <span className="text-emerald-300 block text-[8px] uppercase font-bold">Estimated Budget</span>
                        <span className="font-bold text-white">${((matchedCompany as any).revenue ? Math.round(((matchedCompany as any).revenue / 12) * 0.1) : 2500).toLocaleString()}/mo</span>
                      </div>
                      <div className="bg-emerald-900/40 p-3 rounded-xl border border-emerald-800/60">
                        <span className="text-emerald-300 block text-[8px] uppercase font-bold">Suggested Area</span>
                        <span className="font-bold text-white">{((matchedCompany as any).employeesCount || (matchedCompany as any).employees || 10) * 8} m² min</span>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations Cards listing */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {matchedList.slice(0, 3).map(({ property, score }) => (
                      <div key={property.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
                        <div className="p-4 space-y-4">
                          
                          {/* Circular match percentage gauge */}
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-extrabold uppercase tracking-widest bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full">Automated Placement</span>
                            <div className="flex items-center gap-1">
                              <span className={`text-xs font-black ${score >= 90 ? "text-emerald-600" : "text-amber-500"}`}>{score}% Match</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <img src={property.coverImage} className="w-14 h-14 rounded-lg object-cover" alt="" />
                            <div className="min-w-0">
                              <h4 className="font-bold text-xs text-slate-800 truncate">{property.name}</h4>
                              <p className="text-[10px] text-slate-400 truncate">{property.city} &bull; {property.areaSqM} m²</p>
                              <span className="text-xs font-black text-emerald-600 mt-1 block">${property.monthlyRent}/mo</span>
                            </div>
                          </div>

                          {/* Match reasoning */}
                          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[10px] text-slate-600 space-y-1">
                            <div className="flex items-center gap-1 text-slate-500">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span>Region matching: {property.city === "Tashkent" ? "Excellent" : "Sourced regional alignment"}</span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-500">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span>Size matches requested team headcount density standards</span>
                            </div>
                          </div>
                        </div>

                        {/* Fast reservation trigger */}
                        <div className="p-3 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex gap-2">
                          <button
                            onClick={() => setSelectedProperty(property)}
                            className="flex-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-[10px] py-2 rounded-xl transition-all cursor-pointer text-center"
                          >
                            Explore Property
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProperty(property);
                              setScheduleModalOpen(true);
                            }}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] py-2 rounded-xl transition-all cursor-pointer text-center"
                          >
                            Schedule viewing
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}
              {!selectedMatchCompany && (
                <div className="py-20 text-center bg-slate-50 border border-slate-200 rounded-2xl text-slate-400 text-xs">
                  <UserCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <span>Choose an active company to initialize automatic recommendation matches.</span>
                </div>
              )}

            </motion.div>
          )}

          {/* TAB 4: LIFECYCLE PIPELINE BOARD */}
          {activeTab === "pipeline" && (
            <motion.div key="pipeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Uzbekistan Property Lifecycle Pipeline</h3>
                <p className="text-[10px] text-slate-400">Track and advance sourced properties through inspection, verification, and placement states.</p>
              </div>

              {/* Kanban board structure */}
              <div className="flex gap-4 overflow-x-auto pb-4">
                {(
                  [
                    { id: "Found", label: "Property Found", bg: "bg-slate-100 border-slate-200 text-slate-700" },
                    { id: "Inspection", label: "Property Inspection", bg: "bg-amber-50 border-amber-200 text-amber-800" },
                    { id: "Documents", label: "Docs Collected", bg: "bg-blue-50 border-blue-200 text-blue-800" },
                    { id: "Verified", label: "Verified Portal", bg: "bg-indigo-50 border-indigo-200 text-indigo-800" },
                    { id: "Published", label: "Published Available", bg: "bg-emerald-50 border-emerald-200 text-emerald-800" },
                    { id: "Reserved", label: "Reserved Placing", bg: "bg-orange-50 border-orange-200 text-orange-800" },
                    { id: "Occupied", label: "Leased Occupied", bg: "bg-slate-50 border-slate-300 text-slate-600" }
                  ] as const
                ).map(stage => {
                  const stageProperties = properties.filter(p => p.pipelineStage === stage.id);
                  return (
                    <div key={stage.id} className="w-72 shrink-0 bg-slate-50/70 p-3 rounded-2xl border border-slate-200 flex flex-col justify-between min-h-[400px]">
                      <div>
                        {/* Column Header */}
                        <div className={`p-2 rounded-xl border ${stage.bg} flex justify-between items-center mb-3`}>
                          <span className="font-extrabold text-[10px] uppercase tracking-wider">{stage.label}</span>
                          <span className="font-mono text-[10px] font-black">{stageProperties.length}</span>
                        </div>

                        {/* Cards within Column */}
                        <div className="space-y-2.5">
                          {stageProperties.map(p => (
                            <div key={p.id} className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2 text-xs">
                              <div className="flex gap-2">
                                <img src={p.coverImage} className="w-10 h-10 rounded-md object-cover bg-slate-100" alt="" />
                                <div className="min-w-0">
                                  <h4 className="font-bold text-slate-800 truncate text-[11px]">{p.name}</h4>
                                  <span className="text-[9px] text-slate-400 font-mono block">{p.city} &bull; {p.areaSqM}m²</span>
                                </div>
                              </div>
                              <p className="text-[10px] text-slate-500 font-mono">
                                {p.monthlyRent ? `$${p.monthlyRent}/mo` : p.purchasePrice ? `$${p.purchasePrice.toLocaleString()}` : "Price on request"}
                              </p>

                              {/* Navigation buttons to change stages */}
                              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                                <button
                                  onClick={() => handleMovePipelineStage(p.id, "prev")}
                                  className="text-[9px] text-slate-400 hover:text-slate-800 cursor-pointer disabled:opacity-30 font-bold"
                                  title="Previous Stage"
                                >
                                  &larr; Prev
                                </button>
                                <button
                                  onClick={() => setSelectedProperty(p)}
                                  className="text-[9px] font-bold text-emerald-600 hover:underline cursor-pointer"
                                >
                                  Profile
                                </button>
                                <button
                                  onClick={() => handleMovePipelineStage(p.id, "next")}
                                  className="text-[9px] text-emerald-600 hover:text-emerald-800 cursor-pointer disabled:opacity-30 font-bold"
                                  title="Next Stage"
                                >
                                  Next &rarr;
                                </button>
                              </div>
                            </div>
                          ))}
                          {stageProperties.length === 0 && (
                            <div className="py-8 text-center text-slate-400 text-[10px] font-medium italic border border-dashed border-slate-200 rounded-xl">
                              No properties in this stage
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </motion.div>
          )}

          {/* TAB 5: LEGAL DOCUMENT VAULT */}
          {activeTab === "vault" && (
            <motion.div key="vault" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    Government Cadastre & Property Deed Vault
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Secure, legal cloud storage for ownership documents, inspection reports, and digital lease agreements.</p>
                </div>
                <button
                  onClick={() => alert("Redirecting to Gov.uz cadastre auth integration...")}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all"
                >
                  Gov.uz Integration
                </button>
              </div>

              {/* Document items list table */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4">Document Name</th>
                      <th className="py-3 px-4">Related Property</th>
                      <th className="py-3 px-4">Document Type</th>
                      <th className="py-3 px-4">Size</th>
                      <th className="py-3 px-4">Uploaded At</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {properties.flatMap(p => p.documents.map((doc, idx) => ({ ...doc, propName: p.name, uniqueId: `${p.id}-${idx}` }))).map(doc => (
                      <tr key={doc.uniqueId} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 text-slate-800 font-bold flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-indigo-500" />
                          <span>{doc.name}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-bold">{doc.propName}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-700">
                            {doc.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500">{doc.size}</td>
                        <td className="py-3 px-4 font-mono text-slate-400">{doc.uploadedAt}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleExportFile(doc.name)}
                            className="text-[10px] text-emerald-600 font-bold hover:underline"
                          >
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </motion.div>
          )}

          {/* TAB 6: BULK IMPORT & REPORTING */}
          {activeTab === "import-export" && (
            <motion.div key="import-export" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              
              {/* Export panel */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b pb-2 flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-emerald-600" />
                  Excel & PDF Real-Estate Export Hub
                </h3>
                <p className="text-[11px] text-slate-400">Export filtered property lists, regional cadastre metrics, or specific property profiles into standard format templates.</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <button onClick={() => handleExportFile("xlsx")} className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 font-bold cursor-pointer text-slate-700">
                    <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
                    <span className="text-[11px]">Excel Export</span>
                  </button>
                  <button onClick={() => handleExportFile("pdf")} className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 font-bold cursor-pointer text-slate-700">
                    <FileText className="w-6 h-6 text-rose-500" />
                    <span className="text-[11px]">PDF Document</span>
                  </button>
                  <button onClick={() => handleExportFile("csv")} className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 font-bold cursor-pointer text-slate-700">
                    <CheckSquare className="w-6 h-6 text-blue-500" />
                    <span className="text-[11px]">CSV Spreadsheet</span>
                  </button>
                  <button onClick={() => handleExportFile("pptx")} className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 font-bold cursor-pointer text-slate-700">
                    <Sliders className="w-6 h-6 text-orange-500" />
                    <span className="text-[11px]">PPT Slide Deck</span>
                  </button>
                  <button onClick={() => window.print()} className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 font-bold cursor-pointer text-slate-700">
                    <Printer className="w-6 h-6 text-slate-600" />
                    <span className="text-[11px]">Print Paper Form</span>
                  </button>
                </div>
              </div>

              {/* Import Excel Block */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b pb-2 flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-emerald-600" />
                  Excel Commercial Properties Database Bulk Import
                </h3>

                {importNotification && (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-[11px] font-semibold">
                    {importNotification}
                  </div>
                )}

                {/* Import drag and drop area */}
                <div
                  onDragOver={handleImportDragOver}
                  onDragLeave={() => setImportDragActive(false)}
                  onDrop={handleImportDrop}
                  className={`border-2 border-dashed rounded-2xl p-10 text-center flex flex-col items-center justify-center cursor-pointer transition-all ${
                    importDragActive ? "border-emerald-500 bg-emerald-50/50" : "border-slate-200 hover:border-slate-300"
                  }`}
                  onClick={() => simulateImageUpload("properties_database.xlsx")}
                >
                  <FileSpreadsheet className="w-10 h-10 text-slate-400 mb-3" />
                  <span className="text-xs font-bold text-slate-700">Drag & Drop real estate XLS database or click to simulate upload</span>
                  <span className="text-[10px] text-slate-400 mt-1">Accepts .xlsx, .csv, and standard real estate formats.</span>
                </div>

                {/* Import Validation Preview grid */}
                {importData && (
                  <div className="border border-slate-200 rounded-xl overflow-hidden space-y-3 p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-400 uppercase font-black">Spreadsheet Pre-Import Validation & Duplicate Detection</span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-bold">3 Rows Mapped</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[10px] font-semibold text-slate-600">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-400">
                            <th className="p-2">Row No</th>
                            <th className="p-2">Name</th>
                            <th className="p-2">Address</th>
                            <th className="p-2">Space (m²)</th>
                            <th className="p-2">Rent ($)</th>
                            <th className="p-2">Schema Check</th>
                            <th className="p-2">Duplicate Detection</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono">
                          {importData.map(row => (
                            <tr key={row.row} className={row.duplicate ? "bg-amber-50/50" : ""}>
                              <td className="p-2 font-bold">{row.row}</td>
                              <td className="p-2 text-slate-800">{row.name}</td>
                              <td className="p-2 truncate max-w-[200px]">{row.address}</td>
                              <td className="p-2">{row.size} m²</td>
                              <td className="p-2">${row.rent}</td>
                              <td className="p-2">
                                <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                                  <Check className="w-3.5 h-3.5" />
                                  VALID
                                </span>
                              </td>
                              <td className="p-2">
                                {row.duplicate ? (
                                  <span className="text-amber-600 font-extrabold bg-amber-100 px-1.5 py-0.5 rounded uppercase text-[8px]">
                                    Duplicate address
                                  </span>
                                ) : (
                                  <span className="text-emerald-600 font-extrabold bg-emerald-100 px-1.5 py-0.5 rounded uppercase text-[8px]">
                                    Unique row
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-end gap-2.5 pt-3">
                      <button
                        onClick={() => setImportData(null)}
                        className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-3.5 py-2 rounded-lg"
                      >
                        Abort Import
                      </button>
                      <button
                        onClick={executeCommitImport}
                        className="text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg"
                      >
                        Commit Verified Rows
                      </button>
                    </div>

                  </div>
                )}
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* MODAL OVERLAY: DETAILED PROPERTY PROFILE VIEW */}
      {selectedProperty && !scheduleModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal header row */}
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[9px] bg-emerald-600 text-white px-2 py-0.5 rounded font-black uppercase">{selectedProperty.status}</span>
                <h3 className="font-extrabold text-sm text-white">{selectedProperty.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditPropertyClick(selectedProperty)}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-all cursor-pointer border border-indigo-500/30"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit / Verify Property</span>
                </button>
                <button onClick={() => { setSelectedProperty(null); setActiveGalleryIndex(0); }} className="text-slate-400 hover:text-white cursor-pointer p-1 rounded-full hover:bg-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable details body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700">
              
              {/* Visual image showcase & carousel gallery */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Active cover photo frame with fullscreen zoom button */}
                <div className="md:col-span-2 space-y-2">
                  <div className="h-72 relative bg-slate-100 rounded-2xl overflow-hidden">
                    <img src={selectedProperty.images[activeGalleryIndex] || selectedProperty.coverImage} className="w-full h-full object-cover" alt="" />
                    <button
                      onClick={() => setIsFullscreenGallery(true)}
                      className="absolute bottom-3 right-3 p-2 bg-slate-950/80 backdrop-blur-xs rounded-lg text-white font-bold hover:bg-slate-900 transition-all text-[10px] flex items-center gap-1 shadow-md border border-slate-800"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Fullscreen View</span>
                    </button>
                  </div>
                  
                  {/* Category tabs & active thumbnails carousel row */}
                  <div className="flex gap-2.5 overflow-x-auto py-1">
                    {selectedProperty.images.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveGalleryIndex(idx)}
                        className={`w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                          idx === activeGalleryIndex ? "border-emerald-600 shadow-sm scale-95" : "border-transparent opacity-80"
                        }`}
                      >
                        <img src={imgUrl} className="w-full h-full object-cover" alt="" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Drag and Drop Upload Area for additional photos */}
                <div className="md:col-span-1 flex flex-col justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="space-y-3">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Drag & Drop Upload additional Property Photos</span>
                    
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-slate-400 block uppercase">Photo Category</label>
                      <select
                        value={selectedUploadCategory}
                        onChange={(e) => setSelectedUploadCategory(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-1.5 font-bold text-slate-700 cursor-pointer text-[10px]"
                      >
                        <option value="Exterior">Exterior</option>
                        <option value="Interior">Interior</option>
                        <option value="Office">Office</option>
                        <option value="Meeting Rooms">Meeting Rooms</option>
                        <option value="Reception">Reception</option>
                        <option value="Parking">Parking</option>
                      </select>
                    </div>

                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDropImage}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                        dragOverActive ? "border-emerald-500 bg-emerald-50" : "border-slate-200 hover:border-slate-300"
                      }`}
                      onClick={() => simulateImageUpload("photo.jpg")}
                    >
                      <Upload className="w-8 h-8 text-slate-400 mb-2" />
                      <span className="text-[10px] font-bold text-slate-600">Simulate photo upload</span>
                    </div>

                    {uploadProgress !== null && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[8px] font-bold text-slate-400">
                          <span>Compressing Image...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full transition-all duration-150" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <span className="text-[9px] text-slate-400 text-center block mt-3">Supports JPG, PNG with auto-image compression validation.</span>
                </div>

              </div>

              {/* Specifications parameters details block */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Specs overview details */}
                <div className="md:col-span-2 space-y-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                    <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider border-b pb-1.5 flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-emerald-600" />
                      General Commercial Profile Specs
                    </h4>
                    
                    <p className="text-slate-600 font-medium leading-relaxed">{selectedProperty.description}</p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
                      <div className="p-3 bg-white rounded-xl border border-slate-100">
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Usable Footprint</span>
                        <span className="font-bold text-slate-700 font-mono">{selectedProperty.areaSqM} m² area</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-100">
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Total Rooms</span>
                        <span className="font-bold text-slate-700 font-mono">{selectedProperty.rooms} modular offices</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-100">
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Fiber Link</span>
                        <span className="font-bold text-slate-700 font-mono">{selectedProperty.internetSpeedMbps} Mbps redundant</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-100">
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Parking Capacity</span>
                        <span className="font-bold text-slate-700 font-mono">{selectedProperty.parkingSpots} private bays</span>
                      </div>
                    </div>
                  </div>

                  {/* Owner, nearby universities, transit parameters */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                      <span className="text-slate-400 text-[10px] font-bold block uppercase tracking-wider">Owner Contact Info</span>
                      <div className="text-xs font-bold text-slate-800">{selectedProperty.ownerName}</div>
                      <div className="text-xs font-semibold text-slate-600 font-mono flex items-center gap-1 mt-1">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{selectedProperty.ownerPhone}</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                      <span className="text-slate-400 text-[10px] font-bold block uppercase tracking-wider">Property Cadastre Registry</span>
                      <div className="text-xs font-extrabold text-slate-800 font-mono">{selectedProperty.cadastreNumber}</div>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-black block mt-2.5 uppercase tracking-wider text-center">GOVERNMENT CADASTRE VERIFIED</span>
                    </div>
                  </div>

                  {/* Facilities Nearby universities, transits lists */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                      <span className="text-slate-400 text-[9px] font-bold block uppercase tracking-wider">Nearby Universities</span>
                      {selectedProperty.nearbyUniversities.map((uni, idx) => (
                        <div key={idx} className="flex items-center gap-1 font-bold text-slate-600 text-[10px]">
                          <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span>{uni}</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                      <span className="text-slate-400 text-[9px] font-bold block uppercase tracking-wider">Public Transit Stations</span>
                      {selectedProperty.nearbyTransit.map((tran, idx) => (
                        <div key={idx} className="flex items-center gap-1 font-bold text-slate-600 text-[10px]">
                          <MapIcon className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span>{tran}</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                      <span className="text-slate-400 text-[9px] font-bold block uppercase tracking-wider">Active Tech Residents</span>
                      {selectedProperty.nearbyResidents.map((res, idx) => (
                        <div key={idx} className="flex items-center gap-1 font-bold text-slate-600 text-[10px]">
                          <Briefcase className="w-3 h-3 text-indigo-500 shrink-0" />
                          <span>{res}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Step-by-Step Historical Timeline & Inspection Logs */}
                <div className="md:col-span-1 space-y-4">
                  
                  {/* Inspection checks */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                    <span className="text-slate-400 text-[10px] font-bold block uppercase tracking-wider">IT Park Safety & Audits Logs</span>
                    <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-100 text-[10px]">
                      <span className="font-bold text-slate-700">Audit Grade:</span>
                      <span className="font-black text-emerald-600">PASSED EXCELLENT</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-semibold italic">
                      "Redundant electrical boxes support continuous generator transitions during regional grids peaks. Acoustics noise levels registered inside margins."
                    </p>
                    <span className="text-[9px] text-slate-400 block">Inspected on: {selectedProperty.inspectionReport.inspectionDate} &bull; {selectedProperty.inspectionReport.inspectorName}</span>
                  </div>

                  {/* Historical trace timeline */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <span className="text-slate-400 text-[10px] font-bold block uppercase tracking-wider">Uzbekistan Property Sourcing Trace</span>
                    
                    <div className="space-y-3.5 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-200">
                      {selectedProperty.timeline.map((event, idx) => (
                        <div key={idx} className="flex items-start gap-3 relative z-10 text-[11px]">
                          <span className="w-4.5 h-4.5 rounded-full bg-emerald-600 text-white font-mono text-[9px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-800">{event.stage}</span>
                              <span className="text-[9px] text-slate-400 font-mono">{event.date}</span>
                            </div>
                            <p className="text-slate-500 text-[10px] mt-0.5 leading-relaxed">{event.description}</p>
                            <span className="text-[9px] text-slate-400 font-bold">Authorized by: {event.user}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Modal actions footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2.5 shrink-0">
              <button
                onClick={() => setSelectedProperty(null)}
                className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-extrabold text-xs px-5 py-2.5 rounded-xl cursor-pointer transition-all"
              >
                Close Profile Panel
              </button>
              <button
                onClick={() => setScheduleModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl cursor-pointer transition-all shadow-md shadow-emerald-600/10"
              >
                Book site viewing & Lease
              </button>
            </div>

          </motion.div>
        </div>
      )}

      {/* FULLSCREEN ZOOM IMAGE CAROUSEL OVERLAY */}
      {isFullscreenGallery && selectedProperty && (
        <div className="fixed inset-0 bg-slate-950/95 z-50 flex flex-col justify-between p-4">
          <div className="flex justify-between items-center text-white text-xs font-bold p-2">
            <span>{selectedProperty.name} &bull; Image {activeGalleryIndex + 1} of {selectedProperty.images.length}</span>
            <button
              onClick={() => setIsFullscreenGallery(false)}
              className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active fullscreen photo frame */}
          <div className="flex-1 flex items-center justify-center relative p-4">
            <button
              onClick={() => setActiveGalleryIndex(prev => prev === 0 ? selectedProperty.images.length - 1 : prev - 1)}
              className="absolute left-4 p-3 bg-slate-800/80 rounded-full text-white hover:bg-slate-700 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <img
              src={selectedProperty.images[activeGalleryIndex]}
              className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
              alt=""
            />
            <button
              onClick={() => setActiveGalleryIndex(prev => prev === selectedProperty.images.length - 1 ? 0 : prev + 1)}
              className="absolute right-4 p-3 bg-slate-800/80 rounded-full text-white hover:bg-slate-700 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Carousel preview strip footer */}
          <div className="flex justify-center gap-2 overflow-x-auto py-3">
            {selectedProperty.images.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActiveGalleryIndex(idx)}
                className={`w-16 h-12 rounded-md overflow-hidden shrink-0 border-2 transition-all ${
                  idx === activeGalleryIndex ? "border-emerald-500 scale-95" : "border-transparent opacity-50"
                }`}
              >
                <img src={imgUrl} className="w-full h-full object-cover" alt="" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* COMPARISON MATRIX MODAL */}
      {showComparisonModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="font-bold text-xs uppercase tracking-wider">IT Park Commercial Property Comparison Matrix</h3>
              <button onClick={() => setShowComparisonModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-x-auto p-6 text-xs text-slate-700">
              <div className="min-w-[600px] grid grid-cols-5 gap-4">
                
                {/* Column header side panel parameters labels */}
                <div className="col-span-1 space-y-4 font-bold border-r pr-4 text-slate-400 uppercase tracking-wider pt-24 text-[9px] flex flex-col gap-8">
                  <div>Region / City</div>
                  <div>Monthly Lease Rent</div>
                  <div>Purchase price</div>
                  <div>Commercial area</div>
                  <div>Total offices</div>
                  <div>A/C Splitters</div>
                  <div>Dedicated line</div>
                  <div>Sourced manager</div>
                </div>

                {/* Sourced compare profiles */}
                {comparedPropertyIds.map(pId => {
                  const target = properties.find(p => p.id === pId);
                  if (!target) return null;
                  return (
                    <div key={target.id} className="col-span-1 text-center space-y-4 border-r last:border-r-0 px-2">
                      <div className="flex flex-col items-center">
                        <img src={target.coverImage} className="w-16 h-12 rounded-lg object-cover bg-slate-100" alt="" />
                        <h4 className="font-extrabold text-slate-800 text-[11px] mt-2 truncate max-w-full">{target.name}</h4>
                        <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase mt-1">{target.type}</span>
                      </div>

                      <div className="font-bold text-emerald-600 pt-3">${target.monthlyRent ? `${target.monthlyRent}/mo` : "N/A"}</div>
                      <div className="font-bold text-indigo-600">${target.purchasePrice ? target.purchasePrice.toLocaleString() : "N/A"}</div>
                      <div className="font-bold text-slate-700">{target.areaSqM} m² area</div>
                      <div className="font-bold text-slate-700">{target.rooms} modulars</div>
                      <div className="font-bold text-slate-700 flex justify-center">{target.hasAC ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-rose-500" />}</div>
                      <div className="font-mono font-bold text-slate-700">{target.internetSpeedMbps} Mbps fiber</div>
                      <div className="text-slate-500 truncate text-[10px] font-bold">{target.managerName}</div>
                    </div>
                  );
                })}

              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowComparisonModal(false)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2 rounded-xl"
              >
                Done
              </button>
            </div>

          </motion.div>
        </div>
      )}

      {/* MODAL: SCHEDULE SITE VIEWING & DIGITAL SIGNATURE */}
      {scheduleModalOpen && selectedProperty && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="font-bold text-xs uppercase tracking-wider">Placement viewing scheduler & Lease Reservation</h3>
              <button onClick={() => setScheduleModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-slate-700">
              
              <div className="flex gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <img src={selectedProperty.coverImage} className="w-16 h-12 rounded-lg object-cover bg-slate-200" alt="" />
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-800 text-xs">{selectedProperty.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">{selectedProperty.city} &bull; Monthly Rent: ${selectedProperty.monthlyRent}/mo</p>
                  <span className="text-[9px] text-slate-500 font-semibold block mt-1">Sourced manager: {selectedProperty.managerName}</span>
                </div>
              </div>

              {/* Form entries */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Target Viewing Date</label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Target Viewing Time</label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Audit or Viewing Instructions / Notes</label>
                <textarea
                  value={scheduleNotes}
                  onChange={(e) => setScheduleNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-700"
                  placeholder="E.g. Specific electrical power checks..."
                />
              </div>

              {/* Visual Digital Signature block */}
              <div className="space-y-2 border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Placement Representative signature</span>
                  <button onClick={clearSignatureCanvas} className="text-[9px] font-bold text-slate-500 hover:text-rose-600">Clear Pad</button>
                </div>
                
                <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl overflow-hidden relative">
                  <canvas
                    ref={signatureCanvasRef}
                    onMouseDown={startDrawingSignature}
                    onMouseMove={drawSignature}
                    onMouseUp={() => setIsDrawingSignature(false)}
                    onMouseLeave={() => setIsDrawingSignature(false)}
                    className="w-full h-32 cursor-crosshair bg-slate-50"
                  />
                  <span className="absolute bottom-2 right-3 text-[8px] text-slate-400 font-mono tracking-widest pointer-events-none uppercase font-extrabold">DIGITAL SIGNATURE PAD</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Representative legal Name</label>
                  <input
                    type="text"
                    value={scheduleSignedName}
                    onChange={(e) => setScheduleSignedName(e.target.value)}
                    placeholder="E.g. Hasan Abdukarimov"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-700"
                  />
                </div>
              </div>

            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 shrink-0">
              <button
                onClick={() => setScheduleModalOpen(false)}
                className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
              >
                Abort
              </button>
              <button
                onClick={executeViewingSchedule}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer shadow-md shadow-emerald-600/10"
              >
                Authorize Placement
              </button>
            </div>

          </motion.div>
        </div>
      )}

      {/* CREATE / REGISTER NEW PROPERTY MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="font-bold text-xs uppercase tracking-wider">
                {editingPropertyId ? "Edit / Verify Property Profile" : "Register Sourced Uzbekistan Property Profile"}
              </h3>
              <button onClick={() => { setShowCreateModal(false); setEditingPropertyId(null); }} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-slate-700">
              
              {/* Basic spec parameters row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Property Name</label>
                  <input
                    type="text"
                    value={newProp.name}
                    onChange={(e) => setNewProp(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="E.g. Bunyodkor Tech Tower"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Property Type</label>
                  <select
                    value={newProp.type}
                    onChange={(e) => setNewProp(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-700"
                  >
                    <option value="Office">Office</option>
                    <option value="Business Center">Business Center</option>
                    <option value="Coworking Space">Coworking Space</option>
                    <option value="Commercial Building">Commercial Building</option>
                    <option value="Private Office">Private Office</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Technology Park">Technology Park</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">City/Region</label>
                  <select
                    value={newProp.city}
                    onChange={(e) => setNewProp(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-700"
                  >
                    {KASHKADARYA_DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">District</label>
                  <select
                    value={newProp.district}
                    onChange={(e) => setNewProp(prev => ({ ...prev, district: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-700"
                  >
                    {KASHKADARYA_DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Physical Address</label>
                <input
                  type="text"
                  value={newProp.address}
                  onChange={(e) => setNewProp(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="E.g. 108 Amir Temur Avenue, Tashkent"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-700"
                />
              </div>

              {/* Pricing & Area specs */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Monthly Lease Rent ($)</label>
                  <input
                    type="number"
                    value={newProp.monthlyRent}
                    onChange={(e) => setNewProp(prev => ({ ...prev, monthlyRent: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Purchase asset Price ($)</label>
                  <input
                    type="number"
                    value={newProp.purchasePrice}
                    onChange={(e) => setNewProp(prev => ({ ...prev, purchasePrice: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Commercial Area (m²)</label>
                  <input
                    type="number"
                    value={newProp.areaSqM}
                    onChange={(e) => setNewProp(prev => ({ ...prev, areaSqM: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-700 font-mono"
                  />
                </div>
              </div>

              {/* Hardware specifications */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Redundant Internet (Mbps)</label>
                  <input
                    type="number"
                    value={newProp.internetSpeedMbps}
                    onChange={(e) => setNewProp(prev => ({ ...prev, internetSpeedMbps: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Government Cadastre Number</label>
                  <input
                    type="text"
                    value={newProp.cadastreNumber}
                    onChange={(e) => setNewProp(prev => ({ ...prev, cadastreNumber: e.target.value }))}
                    placeholder="E.g. 14:22:08:01:04:0091"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-700 font-mono"
                  />
                </div>
              </div>

              {/* Verification & physical specs -- what on-site staff correct after inspecting a "Pending Verification" property */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-3.5">
                <span className="text-amber-700 text-[10px] font-extrabold block uppercase tracking-wider">Verification & Physical Specs</span>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Room Count</label>
                    <input
                      type="number"
                      value={newProp.rooms ?? 0}
                      onChange={(e) => setNewProp(prev => ({ ...prev, rooms: Number(e.target.value) }))}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-bold text-slate-700 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Parking Spots</label>
                    <input
                      type="number"
                      value={newProp.parkingSpots ?? 0}
                      onChange={(e) => setNewProp(prev => ({ ...prev, parkingSpots: Number(e.target.value) }))}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-bold text-slate-700 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Available From</label>
                    <input
                      type="date"
                      value={newProp.availableDate || ""}
                      onChange={(e) => setNewProp(prev => ({ ...prev, availableDate: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-bold text-slate-700 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Marketplace Status</label>
                    <select
                      value={newProp.status}
                      onChange={(e) => setNewProp(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-bold text-slate-700"
                    >
                      <option value="Pending Verification">Pending Verification</option>
                      <option value="Available for Rent">Available for Rent</option>
                      <option value="Available for Sale">Available for Sale</option>
                      <option value="Rent & Sale">Rent & Sale</option>
                      <option value="Reserved">Reserved</option>
                      <option value="Occupied">Occupied</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="flex items-end gap-4 pb-1">
                    <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!newProp.hasAC}
                        onChange={(e) => setNewProp(prev => ({ ...prev, hasAC: e.target.checked }))}
                        className="w-3.5 h-3.5"
                      />
                      Has AC
                    </label>
                    <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!newProp.hasMeetingRooms}
                        onChange={(e) => setNewProp(prev => ({ ...prev, hasMeetingRooms: e.target.checked }))}
                        className="w-3.5 h-3.5"
                      />
                      Meeting Rooms
                    </label>
                    <label className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!newProp.verified}
                        onChange={(e) => setNewProp(prev => ({ ...prev, verified: e.target.checked }))}
                        className="w-3.5 h-3.5"
                      />
                      Verified on-site
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Property Owner Fullname</label>
                  <input
                    type="text"
                    value={newProp.ownerName}
                    onChange={(e) => setNewProp(prev => ({ ...prev, ownerName: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Owner Contact Number</label>
                  <input
                    type="text"
                    value={newProp.ownerPhone}
                    onChange={(e) => setNewProp(prev => ({ ...prev, ownerPhone: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Detailed Description</label>
                <textarea
                  value={newProp.description}
                  onChange={(e) => setNewProp(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-700"
                  placeholder="Describe electrical safety boxes, cooling, nearby park areas..."
                />
              </div>

              {/* PROPERTY COVER PHOTO & GALLERY ASSETS SECTION */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3.5">
                <span className="text-slate-500 text-[10px] font-extrabold block uppercase tracking-wider">Property Visual Assets & Cover Photo</span>
                
                {/* Visual Cover Photo Preview Row */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="w-28 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0 relative shadow-sm">
                    {newProp.coverImage ? (
                      <img src={newProp.coverImage} className="w-full h-full object-cover" alt="Property Cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[10px] text-slate-400 font-bold p-1 text-center">
                        No Photo Selected
                      </div>
                    )}
                    <div className="absolute top-1 left-1 bg-slate-900/80 text-[8px] text-white px-1 py-0.5 rounded uppercase font-black tracking-widest font-mono">
                      PREVIEW
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-1.5 w-full">
                    <label className="text-[9px] font-bold text-slate-400 block uppercase">Custom Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newProp.coverImage || ""}
                        onChange={(e) => setNewProp(prev => ({ ...prev, coverImage: e.target.value, images: [e.target.value] }))}
                        placeholder="Paste any Unsplash or external image URL..."
                        className="flex-1 bg-white border border-slate-200 rounded-xl p-2 font-mono text-[10px] text-slate-700"
                      />
                      {newProp.coverImage && (
                        <button
                          type="button"
                          onClick={() => setNewProp(prev => ({ ...prev, coverImage: "", images: [] }))}
                          className="bg-slate-200 hover:bg-rose-100 hover:text-rose-600 font-bold text-[10px] px-3 rounded-xl transition-all"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Real drag & drop / click-to-browse upload, saved on the server under
                    public/property-photos/<property-id>/ and served back immediately. */}
                <PhotoUploader
                  category="property-photos"
                  folder={editingPropertyId || "new-property-pending"}
                  onUploaded={(urls) => setNewProp(prev => ({
                    ...prev,
                    coverImage: urls[0],
                    images: [...(prev.images || []), ...urls],
                  }))}
                />

                {/* Pre-selected Premium Presets Grid */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold text-slate-400 block uppercase">Or Select from High-Res Presets</span>
                  <div className="grid grid-cols-6 gap-2">
                    {[
                      { url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80", label: "Glass Tower" },
                      { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=150&auto=format&fit=crop&q=80", label: "Coworking" },
                      { url: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=150&auto=format&fit=crop&q=80", label: "Oasis Office" },
                      { url: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=150&auto=format&fit=crop&q=80", label: "Loft Outpost" },
                      { url: "https://images.unsplash.com/photo-1582298538104-fc2c0a5a017f?w=150&auto=format&fit=crop&q=80", label: "BPO Lab" },
                      { url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=150&auto=format&fit=crop&q=80", label: "Tech Hub" }
                    ].map((preset, pIdx) => {
                      const isSelected = newProp.coverImage === preset.url.split("?")[0] + "?w=800&auto=format&fit=crop&q=80";
                      return (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => {
                            const mainUrl = preset.url.split("?")[0] + "?w=800&auto=format&fit=crop&q=80";
                            setNewProp(prev => ({ ...prev, coverImage: mainUrl, images: [mainUrl] }));
                          }}
                          className={`relative h-11 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                            isSelected ? "border-emerald-500 ring-2 ring-emerald-500/20 scale-95" : "border-slate-200 opacity-80 hover:opacity-100 hover:border-slate-400"
                          }`}
                        >
                          <img src={preset.url} className="w-full h-full object-cover" alt="" />
                          <div className="absolute inset-0 bg-slate-900/10 hover:bg-transparent"></div>
                          {isSelected && (
                            <div className="absolute inset-0 flex items-center justify-center bg-emerald-600/25">
                              <Check className="w-4 h-4 text-white drop-shadow-md" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 shrink-0">
              <button
                onClick={() => { setShowCreateModal(false); setEditingPropertyId(null); }}
                className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProperty}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer"
              >
                {editingPropertyId ? "Save Verification Updates" : "Authorize and Publish"}
              </button>
            </div>

          </motion.div>
        </div>
      )}

    </div>
  );
}
