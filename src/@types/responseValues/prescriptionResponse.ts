import type { ResponseAddress } from '../address'

export interface ResponsePrescriptionHasMedicine {
  prescriptionId: string
  medicineId: string
  medicineName?: string
  totalAmount: string
  dosage: string
  administrationWay:
    | 'ORAL'
    | 'SUBLINGUAL'
    | 'BUCAL'
    | 'RETAL'
    | 'VAGINAL'
    | 'INTRAVENOSA'
    | 'INTRAMUSCULAR'
    | 'SUBCUTANEA'
    | 'INTRADERMICA'
    | 'INALATORIA'
    | 'NASALOFTALMICA'
    | 'OTOLOGICA'
    | 'TOPICA'
    | 'TRANSDERMICA'
    | 'INTRA_ARTICULAR'
    | 'INTRAPERITONEAL'
    | 'EPIDURAL'
    | 'INTRATECAL'
    | 'INTRACARDIACA'
    | 'URETRAL'
}

export interface ResponsePrescription {
  id: string
  emissionDate: string
  expirationDate: string
  observation?: string
  prescriptionType: string

  establishmentPrescription: string
  establishmentName?: string
  establishmentPhone?: string
  establishmentAddress?: ResponseAddress

  patientPrescription?: string
  patientName?: string
  patientCpf?: string
  patientDocument?: string

  tutorPrescription?: string
  tutorName?: string
  tutorCpf?: string
  tutorDocument?: string

  petPrescription?: string
  petName?: string
  petSpecie?: string

  professionalPrescription: string
  professionalName?: string
  professionalCpf?: string
  professionalDocument?: string

  medicinePrescribedList: ResponsePrescriptionHasMedicine[]
}
