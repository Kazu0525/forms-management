// types/application.ts
export interface ApplicationForm {
  campaignId: string
  userId?: string
  fullName: string
  email: string
  phoneNumber?: string
  socialMediaAccount: string
  experience: 'beginner' | 'intermediate' | 'advanced'
  motivation: string
  websiteUrl?: string
  expectedTraffic: number
  additionalInfo?: string
}

export interface ApplicationStatus {
  id: string
  status: 'pending' | 'approved' | 'rejected' | 'under_review'
  appliedAt: Date
  reviewedAt?: Date
  reviewNotes?: string
}

export interface Campaign {
  id: string
  name: string
  company: string
  reward_amount: number
  description: string
  requirements: string[]
  category: string
  status: 'active' | 'paused' | 'completed'
}
