export interface Portfolio {
  id: string;
  name: string;
  group?: "P5" | "Other Portfolios";
  team?: string;
}

export interface Committee {
  id: string;
  name: string;
  fullName: string;
  agenda: string;
  maxDelegates: number;
  portfolios: Portfolio[];
}

export interface EventTeamMember {
  id: string;
  name: string;
  role: string;
  image?: string;
}

export interface SummitEvent {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  time?: string;
  location: string;
  description: string;
  longDescription: string;
  committees: string[];
  brochureUrl?: string;
  team: EventTeamMember[];
  registrationOpen: boolean;
  price?: number;
  capacity?: number;
  features?: string[];
  mapEmbedUrl?: string;
  mapDirectionsUrl?: string;
  eventType?: "summit" | "picnic";
}

export interface DelegateProfile {
  name: string;
  phone: string;
  email: string;
  classYear: string;
  institution: string;
}

export interface RegistrationInput {
  name: string;
  phone: string;
  email: string;
  classYear: string;
  institution: string;
  committeePreferences?: [string, string, string];
  portfolioPreferences?: Record<string, [string, string, string]>;
  munExperience: string;
  reference: string;
  paymentScreenshot?: string;
  isUnscRegistration?: boolean;
  unscDelegate?: DelegateProfile | null;
  unscDelegatePortfolioPreferences?: [string, string, string];
  foodPreference?: string;
  notes?: string;
}

export interface Registration extends RegistrationInput {
  id: string;
  eventSlug: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
  assignedCommittee?: string;
  assignedPortfolio?: string;
  assignedAgenda?: string;
  rejectionReason?: string;
  foodPreference?: string;
  notes?: string;
}

export interface AvailabilitySnapshot {
  committees: Record<
    string,
    {
      total: number;
      taken: number;
      available: number;
      isFull: boolean;
    }
  >;
  portfolios: Record<
    string,
    Record<
      string,
      {
        taken: boolean;
      }
    >
  >;
}
