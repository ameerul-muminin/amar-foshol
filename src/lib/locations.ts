// Bangladesh Divisions and Districts with coordinates
// Format: { division: { district: { lat, lon } } }

export interface LocationCoordinates {
  lat: number;
  lon: number;
}

export interface District {
  name: string;
  nameBn: string;
  coordinates: LocationCoordinates;
}

export interface Division {
  name: string;
  nameBn: string;
  districts: District[];
}

export const divisions: Division[] = [
  {
    name: "Dhaka",
    nameBn: "ঢাকা",
    districts: [
      { name: "Dhaka", nameBn: "ঢাকা", coordinates: { lat: 23.8103, lon: 90.4125 } },
      { name: "Gazipur", nameBn: "গাজীপুর", coordinates: { lat: 23.9999, lon: 90.4203 } },
      { name: "Narayanganj", nameBn: "নারায়ণগঞ্জ", coordinates: { lat: 23.6238, lon: 90.5000 } },
      { name: "Tangail", nameBn: "টাঙ্গাইল", coordinates: { lat: 24.2513, lon: 89.9167 } },
      { name: "Kishoreganj", nameBn: "কিশোরগঞ্জ", coordinates: { lat: 24.4449, lon: 90.7766 } },
      { name: "Manikganj", nameBn: "মানিকগঞ্জ", coordinates: { lat: 23.8644, lon: 90.0047 } },
      { name: "Munshiganj", nameBn: "মুন্সিগঞ্জ", coordinates: { lat: 23.5422, lon: 90.5305 } },
      { name: "Narsingdi", nameBn: "নরসিংদী", coordinates: { lat: 23.9232, lon: 90.7176 } },
      { name: "Rajbari", nameBn: "রাজবাড়ী", coordinates: { lat: 23.7574, lon: 89.6444 } },
      { name: "Shariatpur", nameBn: "শরীয়তপুর", coordinates: { lat: 23.2423, lon: 90.4348 } },
      { name: "Faridpur", nameBn: "ফরিদপুর", coordinates: { lat: 23.6070, lon: 89.8429 } },
      { name: "Gopalganj", nameBn: "গোপালগঞ্জ", coordinates: { lat: 23.0050, lon: 89.8266 } },
      { name: "Madaripur", nameBn: "মাদারীপুর", coordinates: { lat: 23.1641, lon: 90.1897 } }
    ]
  },
  {
    name: "Chittagong",
    nameBn: "চট্টগ্রাম",
    districts: [
      { name: "Chittagong", nameBn: "চট্টগ্রাম", coordinates: { lat: 22.3569, lon: 91.7832 } },
      { name: "Cox's Bazar", nameBn: "কক্সবাজার", coordinates: { lat: 21.4272, lon: 92.0058 } },
      { name: "Rangamati", nameBn: "রাঙ্গামাটি", coordinates: { lat: 22.7324, lon: 92.2985 } },
      { name: "Bandarban", nameBn: "বান্দরবান", coordinates: { lat: 22.1953, lon: 92.2183 } },
      { name: "Khagrachhari", nameBn: "খাগড়াছড়ি", coordinates: { lat: 23.1193, lon: 91.9847 } },
      { name: "Feni", nameBn: "ফেনী", coordinates: { lat: 23.0159, lon: 91.3976 } },
      { name: "Lakshmipur", nameBn: "লক্ষ্মীপুর", coordinates: { lat: 22.9447, lon: 90.8282 } },
      { name: "Comilla", nameBn: "কুমিল্লা", coordinates: { lat: 23.4607, lon: 91.1809 } },
      { name: "Noakhali", nameBn: "নোয়াখালী", coordinates: { lat: 22.8696, lon: 91.0997 } },
      { name: "Brahmanbaria", nameBn: "ব্রাহ্মণবাড়িয়া", coordinates: { lat: 23.9571, lon: 91.1115 } },
      { name: "Chandpur", nameBn: "চাঁদপুর", coordinates: { lat: 23.2332, lon: 90.6712 } }
    ]
  },
  {
    name: "Rajshahi",
    nameBn: "রাজশাহী",
    districts: [
      { name: "Rajshahi", nameBn: "রাজশাহী", coordinates: { lat: 24.3745, lon: 88.6042 } },
      { name: "Bogra", nameBn: "বগুড়া", coordinates: { lat: 24.8465, lon: 89.3770 } },
      { name: "Pabna", nameBn: "পাবনা", coordinates: { lat: 24.0064, lon: 89.2372 } },
      { name: "Natore", nameBn: "নাটোর", coordinates: { lat: 24.4205, lon: 88.9942 } },
      { name: "Sirajganj", nameBn: "সিরাজগঞ্জ", coordinates: { lat: 24.4533, lon: 89.7006 } },
      { name: "Naogaon", nameBn: "নওগাঁ", coordinates: { lat: 24.7936, lon: 88.9318 } },
      { name: "Chapainawabganj", nameBn: "চাঁপাইনবাবগঞ্জ", coordinates: { lat: 24.5965, lon: 88.2775 } },
      { name: "Joypurhat", nameBn: "জয়পুরহাট", coordinates: { lat: 25.0968, lon: 89.0227 } }
    ]
  },
  {
    name: "Khulna",
    nameBn: "খুলনা",
    districts: [
      { name: "Khulna", nameBn: "খুলনা", coordinates: { lat: 22.8456, lon: 89.5403 } },
      { name: "Bagerhat", nameBn: "বাগেরহাট", coordinates: { lat: 22.6602, lon: 89.7895 } },
      { name: "Satkhira", nameBn: "সাতক্ষীরা", coordinates: { lat: 22.7185, lon: 89.0705 } },
      { name: "Jessore", nameBn: "যশোর", coordinates: { lat: 23.1634, lon: 89.2182 } },
      { name: "Jhenaidah", nameBn: "ঝিনাইদহ", coordinates: { lat: 23.5449, lon: 89.1539 } },
      { name: "Magura", nameBn: "মাগুরা", coordinates: { lat: 23.4855, lon: 89.4198 } },
      { name: "Narail", nameBn: "নড়াইল", coordinates: { lat: 23.1163, lon: 89.5840 } },
      { name: "Kushtia", nameBn: "কুষ্টিয়া", coordinates: { lat: 23.9013, lon: 89.1202 } },
      { name: "Chuadanga", nameBn: "চুয়াডাঙ্গা", coordinates: { lat: 23.6401, lon: 88.8410 } },
      { name: "Meherpur", nameBn: "মেহেরপুর", coordinates: { lat: 23.7979, lon: 88.6318 } }
    ]
  },
  {
    name: "Barishal",
    nameBn: "বরিশাল",
    districts: [
      { name: "Barishal", nameBn: "বরিশাল", coordinates: { lat: 22.7010, lon: 90.3535 } },
      { name: "Patuakhali", nameBn: "পটুয়াখালী", coordinates: { lat: 22.3596, lon: 90.3298 } },
      { name: "Bhola", nameBn: "ভোলা", coordinates: { lat: 22.6859, lon: 90.6482 } },
      { name: "Pirojpur", nameBn: "পিরোজপুর", coordinates: { lat: 22.5841, lon: 89.9720 } },
      { name: "Barguna", nameBn: "বরগুনা", coordinates: { lat: 22.1596, lon: 90.1121 } },
      { name: "Jhalokati", nameBn: "ঝালকাঠি", coordinates: { lat: 22.6406, lon: 90.1987 } }
    ]
  },
  {
    name: "Sylhet",
    nameBn: "সিলেট",
    districts: [
      { name: "Sylhet", nameBn: "সিলেট", coordinates: { lat: 24.8949, lon: 91.8687 } },
      { name: "Moulvibazar", nameBn: "মৌলভীবাজার", coordinates: { lat: 24.4829, lon: 91.7774 } },
      { name: "Habiganj", nameBn: "হবিগঞ্জ", coordinates: { lat: 24.3745, lon: 91.4155 } },
      { name: "Sunamganj", nameBn: "সুনামগঞ্জ", coordinates: { lat: 25.0658, lon: 91.3950 } }
    ]
  },
  {
    name: "Rangpur",
    nameBn: "রংপুর",
    districts: [
      { name: "Rangpur", nameBn: "রংপুর", coordinates: { lat: 25.7439, lon: 89.2752 } },
      { name: "Dinajpur", nameBn: "দিনাজপুর", coordinates: { lat: 25.6217, lon: 88.6354 } },
      { name: "Gaibandha", nameBn: "গাইবান্ধা", coordinates: { lat: 25.3285, lon: 89.5430 } },
      { name: "Kurigram", nameBn: "কুড়িগ্রাম", coordinates: { lat: 25.8073, lon: 89.6360 } },
      { name: "Lalmonirhat", nameBn: "লালমনিরহাট", coordinates: { lat: 25.9923, lon: 89.2847 } },
      { name: "Nilphamari", nameBn: "নীলফামারী", coordinates: { lat: 25.9317, lon: 88.8560 } },
      { name: "Panchagarh", nameBn: "পঞ্চগড়", coordinates: { lat: 26.3411, lon: 88.5541 } },
      { name: "Thakurgaon", nameBn: "ঠাকুরগাঁও", coordinates: { lat: 26.0336, lon: 88.4616 } }
    ]
  },
  {
    name: "Mymensingh",
    nameBn: "ময়মনসিংহ",
    districts: [
      { name: "Mymensingh", nameBn: "ময়মনসিংহ", coordinates: { lat: 24.7471, lon: 90.4203 } },
      { name: "Jamalpur", nameBn: "জামালপুর", coordinates: { lat: 24.9375, lon: 89.9372 } },
      { name: "Netrokona", nameBn: "নেত্রকোনা", coordinates: { lat: 24.8103, lon: 90.7276 } },
      { name: "Sherpur", nameBn: "শেরপুর", coordinates: { lat: 25.0204, lon: 90.0152 } }
    ]
  }
];

// Helper function to get districts by division
export function getDistrictsByDivision(divisionName: string): District[] {
  const division = divisions.find(d => d.name === divisionName || d.nameBn === divisionName);
  return division ? division.districts : [];
}

// Helper function to get coordinates by district
export function getCoordinates(divisionName: string, districtName: string): LocationCoordinates | null {
  const division = divisions.find(d => d.name === divisionName || d.nameBn === divisionName);
  if (!division) return null;
  
  const district = division.districts.find(d => d.name === districtName || d.nameBn === districtName);
  return district ? district.coordinates : null;
}