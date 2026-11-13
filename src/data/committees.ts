import type { Committee } from "@/lib/types";

type PortfolioDefinition = {
  id?: string;
  name: string;
  group?: "P5" | "Other Portfolios";
  team?: string;
  role?: string;
};

export const IPL_TEAMS = [
  "Chennai Super Kings",
  "Mumbai Indians",
  "Royal Challengers Bengaluru",
  "Kolkata Knight Riders",
  "Rajasthan Royals",
  "Delhi Capitals",
  "Punjab Kings",
  "Sunrisers Hyderabad",
  "Gujarat Titans",
  "Lucknow Super Giants",
] as const;

export const IPL_ROLES = [
  "Owner",
  "Co-Owner",
  "Head Coach",
  "Analyst",
  "Head of Finance",
  "PR Head",
] as const;

const IP_JOURNALIST_NUMBERS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 16, 17, 18, 19, 20, 25, 27,
] as const;

const CUSTOM_PORTFOLIOS: Record<string, PortfolioDefinition[]> = {
  // Lok Sabha (40 portfolios: 20 Ruling NDA vs 20 Opposition / Non-NDA)
  "lok-sabha": [
    { id: "lok-sabha-portfolio-5", name: "Gumma Thanuja Rani" },
    { id: "lok-sabha-portfolio-9", name: "Pemmasani Chandra Sekhar" },
    { id: "lok-sabha-portfolio-11", name: "Y. S. Avinash Reddy" },
    { id: "lok-sabha-portfolio-20", name: "Daggubati Purandeswari" },
    { id: "lok-sabha-portfolio-21", name: "P. V. Midhun Reddy" },
    { id: "lok-sabha-portfolio-22", name: "Kinjarapu Ram Mohan Naidu" },
    { id: "lok-sabha-portfolio-23", name: "Maddila Gurumoorthy" },
    { id: "lok-sabha-portfolio-28", name: "Kiren Rijiju" },
    { id: "lok-sabha-portfolio-31", name: "Rakibul Hussain" },
    { id: "lok-sabha-portfolio-32", name: "Sarbananda Sonowal" },
    { id: "lok-sabha-portfolio-35", name: "Gaurav Gogoi" },
    { id: "lok-sabha-portfolio-44", name: "Sudama Prasad" },
    { id: "lok-sabha-portfolio-45", name: "Abhay Kumar Sinha" },
    { id: "lok-sabha-portfolio-47", name: "Giriraj Singh" },
    { id: "lok-sabha-portfolio-49", name: "Sudhakar Singh" },
    { id: "lok-sabha-portfolio-51", name: "Jitan Ram Manjhi" },
    { id: "lok-sabha-portfolio-53", name: "Chirag Paswan" },
    { id: "lok-sabha-portfolio-54", name: "Surendra Prasad Yadav" },
    { id: "lok-sabha-portfolio-57", name: "Raja Ram Singh" },
    { id: "lok-sabha-portfolio-58", name: "Tariq Anwar" },
    { id: "lok-sabha-portfolio-60", name: "Mohammad Jawed" },
    { id: "lok-sabha-portfolio-64", name: "Rajiv Ranjan Singh" },
    { id: "lok-sabha-portfolio-67", name: "Vivek Thakur" },
    { id: "lok-sabha-portfolio-68", name: "Sanjay Jaiswal" },
    { id: "lok-sabha-portfolio-69", name: "Misa Bharti" },
    { id: "lok-sabha-portfolio-70", name: "Ravi Shankar Prasad" },
    { id: "lok-sabha-portfolio-71", name: "Rajesh Ranjan" },
    { id: "lok-sabha-portfolio-72", name: "Radha Mohan Singh" },
    { id: "lok-sabha-portfolio-73", name: "Shambhavi" },
    { id: "lok-sabha-portfolio-74", name: "Rajiv Pratap Rudy" },
    { id: "lok-sabha-portfolio-75", name: "Manoj Kumar" },
    { id: "lok-sabha-portfolio-76", name: "Lovely Anand" },
    { id: "lok-sabha-portfolio-80", name: "Nityanand Rai" },
    { id: "lok-sabha-portfolio-83", name: "Manish Tewari" },
    { id: "lok-sabha-portfolio-89", name: "Jyotsna Mahant" },
    { id: "lok-sabha-portfolio-92", name: "Brijmohan Agrawal" },
    { id: "lok-sabha-portfolio-95", name: "Kalaben Delkar" },
    { id: "lok-sabha-portfolio-96", name: "Patel Umeshbhai Babubhai" },
    { id: "lok-sabha-portfolio-99", name: "Bansuri Swaraj" },
    { id: "lok-sabha-portfolio-100", name: "Manoj Tiwari" },
  ],

  // Joint Parliamentary Committee (JPC) — 40 Portfolios (20 Ruling NDA vs 20 Opposition)
  jpc: [
    { id: "jpc-portfolio-1", name: "Narendra Modi" },
    { id: "jpc-portfolio-2", name: "Rahul Gandhi" },
    { id: "jpc-portfolio-3", name: "Amit Shah" },
    { id: "jpc-portfolio-4", name: "Mallikarjun Kharge" },
    { id: "jpc-portfolio-5", name: "Om Birla" },
    { id: "jpc-portfolio-6", name: "Jagdeep Dhankhar" },
    { id: "jpc-portfolio-7", name: "Nitin Gadkari" },
    { id: "jpc-portfolio-8", name: "Rajnath Singh" },
    { id: "jpc-portfolio-9", name: "S. Jaishankar" },
    { id: "jpc-portfolio-10", name: "Nirmala Sitharaman" },
    { id: "jpc-portfolio-11", name: "Piyush Goyal" },
    { id: "jpc-portfolio-12", name: "Dharmendra Pradhan" },
    { id: "jpc-portfolio-13", name: "Kiren Rijiju" },
    { id: "jpc-portfolio-14", name: "J. P. Nadda" },
    { id: "jpc-portfolio-15", name: "Shashi Tharoor" },
    { id: "jpc-portfolio-16", name: "Priyanka Gandhi Vadra" },
    { id: "jpc-portfolio-17", name: "Akhilesh Yadav" },
    { id: "jpc-portfolio-18", name: "Dimple Yadav" },
    { id: "jpc-portfolio-19", name: "Asaduddin Owaisi" },
    { id: "jpc-portfolio-20", name: "Supriya Sule" },
    { id: "jpc-portfolio-21", name: "Kanimozhi Karunanidhi" },
    { id: "jpc-portfolio-23", name: "K. C. Venugopal" },
    { id: "jpc-portfolio-24", name: "Gaurav Gogoi" },
    { id: "jpc-portfolio-26", name: "Jairam Ramesh" },
    { id: "jpc-portfolio-28", name: "Mahua Moitra" },
    { id: "jpc-portfolio-31", name: "Sanjay Raut" },
    { id: "jpc-portfolio-32", name: "Eknath Shinde" },
    { id: "jpc-portfolio-33", name: "Shrikant Shinde" },
    { id: "jpc-portfolio-34", name: "Chirag Paswan" },
    { id: "jpc-portfolio-35", name: "Jitan Ram Manjhi" },
    { id: "jpc-portfolio-36", name: "Tejashwi Yadav" },
    { id: "jpc-portfolio-38", name: "Nitish Kumar" },
    { id: "jpc-portfolio-39", name: "H. D. Kumaraswamy" },
    { id: "jpc-portfolio-43", name: "Raghav Chadha" },
    { id: "jpc-portfolio-44", name: "Sanjay Singh" },
    { id: "jpc-portfolio-46", name: "Sukhbir Singh Badal" },
    { id: "jpc-portfolio-50", name: "Omar Abdullah" },
    { id: "jpc-portfolio-57", name: "Kapil Sibal" },
    { id: "jpc-portfolio-58", name: "Abhishek Manu Singhvi" },
    { id: "jpc-portfolio-60", name: "Harivansh Narayan Singh" },
  ],

  // IPL Auction & Crisis (10 Teams x 6 Portfolios = 60 Portfolios)
  ipl: IPL_TEAMS.flatMap((team) =>
    IPL_ROLES.map((role) => ({
      name: `${team} — ${role}`,
      team: team,
      role: role,
    }))
  ),

  // UNW (40 Portfolios)
  unw: [
    { id: "unw-portfolio-1", name: "United States of America" },
    { id: "unw-portfolio-2", name: "United Kingdom" },
    { id: "unw-portfolio-3", name: "France" },
    { id: "unw-portfolio-4", name: "Germany" },
    { id: "unw-portfolio-5", name: "Russian Federation" },
    { id: "unw-portfolio-6", name: "China" },
    { id: "unw-portfolio-7", name: "India" },
    { id: "unw-portfolio-8", name: "Pakistan" },
    { id: "unw-portfolio-9", name: "Bangladesh" },
    { id: "unw-portfolio-10", name: "Nepal" },
    { id: "unw-portfolio-12", name: "Afghanistan" },
    { id: "unw-portfolio-13", name: "Iran" },
    { id: "unw-portfolio-15", name: "Israel" },
    { id: "unw-portfolio-16", name: "Palestine" },
    { id: "unw-portfolio-17", name: "Saudi Arabia" },
    { id: "unw-portfolio-18", name: "United Arab Emirates" },
    { id: "unw-portfolio-20", name: "Türkiye" },
    { id: "unw-portfolio-21", name: "Egypt" },
    { id: "unw-portfolio-27", name: "Kenya" },
    { id: "unw-portfolio-28", name: "Nigeria" },
    { id: "unw-portfolio-29", name: "South Africa" },
    { id: "unw-portfolio-38", name: "Ukraine" },
    { id: "unw-portfolio-40", name: "Sweden" },
    { id: "unw-portfolio-41", name: "Norway" },
    { id: "unw-portfolio-42", name: "Switzerland" },
    { id: "unw-portfolio-43", name: "Netherlands" },
    { id: "unw-portfolio-44", name: "Belgium" },
    { id: "unw-portfolio-45", name: "Spain" },
    { id: "unw-portfolio-46", name: "Italy" },
    { id: "unw-portfolio-48", name: "Australia" },
    { id: "unw-portfolio-49", name: "New Zealand" },
    { id: "unw-portfolio-50", name: "Japan" },
    { id: "unw-portfolio-51", name: "South Korea" },
    { id: "unw-portfolio-52", name: "Indonesia" },
    { id: "unw-portfolio-54", name: "Thailand" },
    { id: "unw-portfolio-56", name: "Philippines" },
    { id: "unw-portfolio-57", name: "Brazil" },
    { id: "unw-portfolio-58", name: "Mexico" },
    { id: "unw-portfolio-59", name: "Argentina" },
    { id: "unw-portfolio-60", name: "Canada" },
  ],

  // UNSC (40 Portfolios - Individual Delegation)
  unsc: [
    { id: "unsc-portfolio-1", name: "United States of America", group: "P5" },
    { id: "unsc-portfolio-2", name: "United Kingdom", group: "P5" },
    { id: "unsc-portfolio-3", name: "France", group: "P5" },
    { id: "unsc-portfolio-4", name: "Russian Federation", group: "P5" },
    { id: "unsc-portfolio-5", name: "China", group: "P5" },
    { id: "unsc-portfolio-6", name: "India" },
    { id: "unsc-portfolio-7", name: "Pakistan" },
    { id: "unsc-portfolio-8", name: "Japan" },
    { id: "unsc-portfolio-9", name: "Germany" },
    { id: "unsc-portfolio-10", name: "Brazil" },
    { id: "unsc-portfolio-11", name: "South Africa" },
    { id: "unsc-portfolio-12", name: "Nigeria" },
    { id: "unsc-portfolio-13", name: "Egypt" },
    { id: "unsc-portfolio-14", name: "Türkiye" },
    { id: "unsc-portfolio-15", name: "Iran" },
    { id: "unsc-portfolio-16", name: "Israel" },
    { id: "unsc-portfolio-17", name: "Palestine" },
    { id: "unsc-portfolio-18", name: "Saudi Arabia" },
    { id: "unsc-portfolio-19", name: "United Arab Emirates" },
    { id: "unsc-portfolio-20", name: "Qatar" },
    { id: "unsc-portfolio-21", name: "Iraq" },
    { id: "unsc-portfolio-22", name: "Afghanistan" },
    { id: "unsc-portfolio-26", name: "Myanmar" },
    { id: "unsc-portfolio-30", name: "South Korea" },
    { id: "unsc-portfolio-31", name: "North Korea" },
    { id: "unsc-portfolio-32", name: "Australia" },
    { id: "unsc-portfolio-34", name: "Canada" },
    { id: "unsc-portfolio-38", name: "Colombia" },
    { id: "unsc-portfolio-39", name: "Venezuela" },
    { id: "unsc-portfolio-40", name: "Cuba" },
    { id: "unsc-portfolio-41", name: "Ukraine" },
    { id: "unsc-portfolio-42", name: "Poland" },
    { id: "unsc-portfolio-44", name: "Norway" },
    { id: "unsc-portfolio-45", name: "Switzerland" },
    { id: "unsc-portfolio-46", name: "Netherlands" },
    { id: "unsc-portfolio-48", name: "Spain" },
    { id: "unsc-portfolio-49", name: "Italy" },
    { id: "unsc-portfolio-54", name: "Sudan" },
    { id: "unsc-portfolio-56", name: "Democratic Republic of the Congo" },
    { id: "unsc-portfolio-59", name: "Ghana" },
  ],

  // International Press (40 portfolios: 20 Journalists, 20 Photographers)
  ip: [
    ...IP_JOURNALIST_NUMBERS.map((num) => ({
      id: `ip-portfolio-${num}`,
      name: `Journalist ${String(num).padStart(2, "0")}`,
      team: "Journalist",
    })),
    ...Array.from({ length: 20 }, (_, i) => ({
      id: `ip-portfolio-${40 + i + 1}`,
      name: `Photographer ${String(i + 1).padStart(2, "0")}`,
      team: "Photographer",
    })),
  ],
};

function generatePortfolios(committeeId: string): Committee["portfolios"] {
  const customPortfolios = CUSTOM_PORTFOLIOS[committeeId] ?? [];

  return customPortfolios.map((portfolio, i) => ({
    id: portfolio.id ?? `${committeeId}-portfolio-${i + 1}`,
    name: portfolio.name,
    group: portfolio.group,
    team: portfolio.team,
    role: portfolio.role,
  }));
}

export const committees: Committee[] = [
  {
    id: "ipl",
    name: "IPL",
    fullName: "Indian Premier League (Auction & Franchise Crisis)",
    agenda:
      "Strategic Player Bidding, Franchise Valuation, Financial Fair Play, and Real-Time Crisis Management in the Indian Premier League.",
    maxDelegates: 60,
    portfolios: generatePortfolios("ipl"),
    eligibility: "all",
    eligibilityLabel: "Open to School & College Delegates",
  },
  {
    id: "lok-sabha",
    name: "Lok Sabha",
    fullName: "Lok Sabha (House of the People)",
    agenda:
      "Evaluating the legislative roadmap for the implementation of a nationwide Uniform Civil Code (UCC) under Article 44, with special emphasis on gender justice and the preservation of personal laws.",
    maxDelegates: 40,
    portfolios: generatePortfolios("lok-sabha"),
    eligibility: "all",
    eligibilityLabel: "Open to School & College Delegates",
  },
  {
    id: "unsc",
    name: "UNSC",
    fullName: "United Nations Security Council",
    agenda:
      "Addressing the Expansion of Proxy Warfare Through State-Sponsored Non-State Armed Groups and Private Military Actors and Its Implications for International Peace and Security.",
    maxDelegates: 40,
    portfolios: generatePortfolios("unsc"),
    eligibility: "school_only",
    eligibilityLabel: "Restricted to School Students Only",
  },
  {
    id: "unw",
    name: "UNW",
    fullName: "UN Women",
    agenda:
      "Preventing the Use of Digital Platforms and Emerging Technologies for the Recruitment, Control, and Exploitation of Women and Girls in Transnational Human Trafficking.",
    maxDelegates: 40,
    portfolios: generatePortfolios("unw"),
    eligibility: "all",
    eligibilityLabel: "Open to School & College Delegates",
  },
  {
    id: "jpc",
    name: "JPC",
    fullName: "Joint Parliamentary Committee",
    agenda:
      "Deliberating upon the Ram Janmabhoomi Dispute: the Construction of the Shri Ram Janmabhoomi Mandir and its Socio-Political Implications for Communal Harmony in India.",
    maxDelegates: 40,
    portfolios: generatePortfolios("jpc"),
    eligibility: "school_only",
    eligibilityLabel: "Restricted to School Students Only",
  },
  {
    id: "ip",
    name: "IP",
    fullName: "International Press",
    agenda:
      "Representing the worldwide press corps: covering proceedings across all 5 summit committees, investigative reporting, press conferences, and live photojournalism.",
    maxDelegates: 40,
    portfolios: generatePortfolios("ip"),
    eligibility: "all",
    eligibilityLabel: "Open to School & College Delegates",
  },
];

export function getCommitteeById(id: string): Committee | undefined {
  return committees.find((c) => c.id === id);
}

export function getCommitteeIds(): string[] {
  return committees.map((c) => c.id);
}
