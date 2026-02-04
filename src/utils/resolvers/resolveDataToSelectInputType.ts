import type { ResponseCustomer } from '@/@types/responseValues/customerResponse'
import type { ResponseEstablishment } from '@/@types/responseValues/establishmentResponse'
import type { ResponseMedicine } from '@/@types/responseValues/medicineResponse'
import type { ResponsePet } from '@/@types/responseValues/petResponse'
import type { ResponseProfessional } from '@/@types/responseValues/professionalResponse'
import type { EstablishmentType } from '@/pages/estabelecimento/incluir/index.page'
import type { DocumentType } from '@/pages/profissional/documento/index.page'
import type { UnityFromEstablishmentResponse } from '@/pages/profissional/editar/[id].page'

export const resolveEstablishmentTypesToSelectInputType = (
  data: EstablishmentType[],
) => {
  const establishmentTypes = data.map((item) => {
    return { text: item.name, value: item.id }
  })

  return establishmentTypes
}

export const resolveDocumentTypesToSelectInputType = (data: DocumentType[]) => {
  const documentTypes = data.map((item) => {
    return { text: item.name, value: item.id }
  })

  return documentTypes
}

export const resolveUnityListToSelectInputType = (
  data: UnityFromEstablishmentResponse[] | null,
) => {
  if (data) {
    const unityList = data.map((item) => {
      return { text: item.name, value: item.id }
    })

    return unityList
  }

  return null
}

export const resolveEstablishmentListToSelectInputType = (
  data: ResponseEstablishment[] | null,
) => {
  if (data) {
    const establishmentList = data.map((item) => {
      return { text: item.name, value: item.id }
    })

    return establishmentList
  }

  return null
}

export const resolveProfessionalsListToSelectInputType = (
  data: ResponseProfessional[] | null,
) => {
  if (data) {
    const professionalsList = data.map((item) => {
      return { text: item.name, value: item.id }
    })

    return professionalsList
  }

  return null
}

export const resolveCustomersListToSelectInputType = (
  data: ResponseCustomer[] | null,
) => {
  if (data) {
    const patientsList = data.map((item) => {
      return { text: item.name, value: item.id }
    })

    return patientsList
  }

  return null
}

export const resolvePetsListToSelectInputType = (
  data: ResponsePet[] | null,
) => {
  if (data) {
    const petsList = data.map((item) => {
      return { text: item.petName, value: item.id }
    })

    return petsList
  }

  return null
}

export const resolveMedicineListToSelectInputType = (
  data: ResponseMedicine[] | null,
) => {
  if (data) {
    const medicinesList = data.map((item) => {
      return { text: item.name, value: item.id }
    })

    return medicinesList
  }

  return null
}
