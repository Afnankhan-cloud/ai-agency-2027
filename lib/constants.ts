// ============================================================================
// Configurable Product, Legal, FAQ, and Placeholder Content Constants
// Vertex Digitals — AI Agency 2027
// ============================================================================

export const BRAND = {
  name: "Vertex Digitals",
  productTitle: "AI Agency 2027",
  productFullTitle: "AI Agency 2027 — Everything You Need to Start an AI Agency",
  tagline: "Built for the next generation of AI service builders.",
  bundleFilename: "AI-Agency-2027-Vertex-Digitals.zip"
} as const;

/**
 * Configurable legal & delivery terms.
 * Update these constants before final public launch once your legal terms are finalized.
 */
export const LEGAL_TERMS = {
  refundPolicyAnswer:
    "Because AI Agency 2027 is an instantly downloadable ZIP bundle containing full source workflows, workbooks, and the complete ebook, all sales are generally final once files are delivered. Before launch, Vertex Digitals may configure a conditional review window here—contact support with your order ID if you encounter a technical issue or accidental duplicate payment.",
  accessDurationAnswer:
    "Your one-time purchase grants ongoing personal access to the downloadable ZIP bundle you receive at checkout, so you can store, revisit, and use the ebook, workbooks, and n8n workflow templates without recurring subscription fees. Update policy and revision access terms can be finalized here prior to public launch.",
  termsSummary:
    "Placeholder Terms of Service: Purchases grant a single-user, non-transferable license for personal learning and building client automation systems. Redistribution, reselling, or republishing the bundle files as a competing digital product is prohibited. Replace with finalized legal terms before launch.",
  privacySummary:
    "Placeholder Privacy Policy: This storefront records only anonymous session-scoped page views, CTA clicks, and checkout starts—never IP addresses. Payment details are processed by Razorpay or Gumroad, and order records store customer email only when supplied by the payment provider. Replace with finalized privacy notice before launch."
} as const;

export interface WhatsInsideItem {
  id: string;
  badge: string;
  title: string;
  description: string;
  highlights: string[];
  accent: "violet" | "cyan" | "indigo" | "emerald";
}

export const WHATS_INSIDE_ITEMS: WhatsInsideItem[] = [
  {
    id: "ebook",
    badge: "01 • Core Roadmap",
    title: "Complete Ebook",
    description:
      "A clear, beginner-friendly roadmap for choosing an offer, packaging it, pricing it, and delivering real AI automation services.",
    highlights: [
      "Positioning & niche selection framework",
      "Tiered retainer & setup pricing models",
      "End-to-end delivery checklist"
    ],
    accent: "violet"
  },
  {
    id: "workbooks",
    badge: "02 • Execution Templates",
    title: "Practical Workbooks",
    description:
      "Turn ideas into action with templates for your niche, offer, outreach, discovery calls, and delivery process.",
    highlights: [
      "Offer & scope definition worksheet",
      "Cold outreach & follow-up scripts",
      "Discovery call & client onboarding sheets"
    ],
    accent: "cyan"
  },
  {
    id: "workflows",
    badge: "03 • JSON Blueprints",
    title: "10 Ready-to-Use n8n Workflows",
    description:
      "Start with proven workflow foundations instead of building every automation from scratch.",
    highlights: [
      "Lead capture, qualification & CRM routing",
      "AI inbox triage & appointment reminders",
      "Importable .json files with setup notes"
    ],
    accent: "indigo"
  },
  {
    id: "first-client",
    badge: "04 • Client Acquisition",
    title: "First Client Guide",
    description:
      "Follow a focused, step-by-step playbook to find prospects, start conversations, and close your first project.",
    highlights: [
      "Daily outreach & audit workflow",
      "Value-first audit Loom structure",
      "Simple proposal & close structure"
    ],
    accent: "emerald"
  }
];

export interface AudienceProfile {
  id: string;
  label: string;
  title: string;
  description: string;
}

export const AUDIENCE_PROFILES: AudienceProfile[] = [
  {
    id: "students",
    label: "Students",
    title: "Students who want a modern, valuable skill before graduation",
    description:
      "Replace generic theory with practical workflow systems and real business problem-solving you can demonstrate immediately."
  },
  {
    id: "freelancers",
    label: "Freelancers",
    title: "Freelancers who want to add AI automation services to what they already sell",
    description:
      "Package lead handling, follow-up, and ops automations alongside web, design, marketing, or dev work."
  },
  {
    id: "professionals",
    label: "Young Professionals",
    title: "Young professionals building a serious income stream outside their job",
    description:
      "Follow a structured weekend-friendly roadmap with ready-to-import workflows instead of endless experimentation."
  },
  {
    id: "side-hustlers",
    label: "Side Hustlers",
    title: "Side hustlers who want a focused business model—not another random course",
    description:
      "Skip hype and multi-hour fluff. Get the offer blueprint, templates, automations, and first-client plan in one ZIP."
  }
];

/**
 * PLACEHOLDER TESTIMONIAL CONTENT
 * ----------------------------------------------------------------------------
 * IMPORTANT: Do not fabricate real customers, names, or revenue claims.
 * Replace each entry below with verified buyer feedback after your first sales.
 */
export interface TestimonialSlot {
  id: string;
  slotLabel: string;
  audienceSegment: string;
  placeholderHeadline: string;
  placeholderBody: string;
  statusNote: string;
}

export const PLACEHOLDER_TESTIMONIALS: TestimonialSlot[] = [
  {
    id: "placeholder-slot-1",
    slotLabel: "Placeholder Slot 01",
    audienceSegment: "Student / Early Builder Feedback",
    placeholderHeadline: "Verified Buyer Review Slot — Pending Launch",
    placeholderBody:
      "Reserved for an authentic review from a student or first-time agency builder after launch. Update this entry in lib/constants.ts once real customer feedback arrives.",
    statusNote: "Placeholder content — replace post-launch"
  },
  {
    id: "placeholder-slot-2",
    slotLabel: "Placeholder Slot 02",
    audienceSegment: "Freelancer Feedback",
    placeholderHeadline: "Verified Buyer Review Slot — Pending Launch",
    placeholderBody:
      "Reserved for verified feedback from a freelancer adding AI automation workflows and n8n templates to their client service stack.",
    statusNote: "Placeholder content — replace post-launch"
  },
  {
    id: "placeholder-slot-3",
    slotLabel: "Placeholder Slot 03",
    audienceSegment: "Side Hustler / Operator Feedback",
    placeholderHeadline: "Verified Buyer Review Slot — Pending Launch",
    placeholderBody:
      "Reserved for real feedback from a young professional or side hustler using the workbook and first-client playbook.",
    statusNote: "Placeholder content — replace post-launch"
  }
];

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "receive-files",
    question: "How do I receive the files?",
    answer:
      "Immediately after completing payment through Razorpay (India) or Gumroad (International), you receive instant digital delivery of the complete ZIP bundle containing the ebook, practical workbooks, 10 n8n workflow files, and the first-client guide."
  },
  {
    id: "prior-experience",
    question: "Do I need prior AI or automation experience?",
    answer:
      "No prior coding or AI agency background is required. The ebook starts from fundamentals—explaining how business automation offers work, how to import and configure the included n8n workflows step by step, and how to pitch simple, useful systems to businesses."
  },
  {
    id: "tools-needed",
    question: "What tools will I need?",
    answer:
      "You only need a computer with internet access, a PDF/document reader for the ebook and workbooks, and an n8n account (self-hosted or n8n Cloud) plus API access for whichever AI model or business apps you connect when running workflows."
  },
  {
    id: "refund-policy",
    question: "What is the refund policy?",
    answer: LEGAL_TERMS.refundPolicyAnswer
  },
  {
    id: "lifetime-access",
    question: "Do I get lifetime access?",
    answer: LEGAL_TERMS.accessDurationAnswer
  }
];
