export type UrgencyBand = 'low' | 'medium' | 'high';

export type FlowStepId =
  | 'symptom'
  | 'tooth_area'
  | 'pain_score'
  | 'swelling_or_limited_opening'
  | 'has_rtg'
  | 'main_objection'
  | 'preferred_contact_time'
  | 'lead_capture';

export type FlowOption = {
  value: string;
  label: string;
  description?: string;
  feedback?: string;
  urgent?: boolean;
};

export type FlowStep = {
  id: FlowStepId;
  type: 'choice' | 'slider' | 'lead';
  eyebrow?: string;
  question: string;
  helper?: string;
  options?: FlowOption[];
  min?: number;
  max?: number;
  skipWhenUrgent?: boolean;
};

export type TriageAnswers = {
  symptom?: string;
  tooth_area?: string;
  pain_score: number;
  swelling_or_limited_opening?: string;
  has_rtg?: string;
  main_objection?: string;
  preferred_contact_time?: string;
  name: string;
  phone: string;
  consent_contact: boolean;
  consent_symptoms: boolean;
};

export type LeadScoringResult = {
  leadScore: number;
  urgencyBand: UrgencyBand;
  leadPriority: UrgencyBand;
  urgentLabel: 'PILNE' | null;
};

export type FlowFinalMessage = {
  title: string;
  body: string;
};

export type FlowConfig = {
  service: string;
  variant: string;
  domain: string;
  location: string;
  webhookUrl: string;
  intro: {
    eyebrow: string;
    title: string;
    localTitle: (localArea: string) => string;
    description: string;
    cta: string;
  };
  steps: FlowStep[];
  finalMessages: Record<UrgencyBand, FlowFinalMessage>;
};
