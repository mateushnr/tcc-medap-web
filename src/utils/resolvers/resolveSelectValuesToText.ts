import {
  documentTypeStatus,
  establishmentStatus,
  establishmentTargetCustomers,
  establishmentTypeAvailableForOptions,
  establishmentTypes,
  establishmentTypeStatus,
  medicineForUse,
  medicinePharmaceuticalForm,
  medicinePrescribedAdministrationWay,
  medicineRegulatoryCategory,
  petSex,
  petSize,
  professionalRoles,
  unityStatus,
  unityTargetCustomers,
  unityTypes,
} from '../constants/selectInputData'

export const resolveEstablishmentTargetCustomerValue = (value: string) => {
  const matchingOption = establishmentTargetCustomers.find((option) => {
    return option.value === value
  })

  return matchingOption?.text
}

export const resolveEstablishmentStatusValue = (value: string) => {
  const matchingOption = establishmentStatus.find((option) => {
    return option.value === value
  })

  return matchingOption?.text
}

export const resolveEstablishmentTypesValue = (value: string) => {
  const matchingOption = establishmentTypes.find((option) => {
    return option.value === value
  })

  return matchingOption?.text
}

// Unity resolvers

export const resolveUnityTargetCustomerValue = (value: string) => {
  const matchingOption = unityTargetCustomers.find((option) => {
    return option.value === value
  })

  return matchingOption?.text
}

export const resolveUnityStatusValue = (value: string) => {
  const matchingOption = unityStatus.find((option) => {
    return option.value === value
  })

  return matchingOption?.text
}

export const resolveUnityTypesValue = (value: string) => {
  const matchingOption = unityTypes.find((option) => {
    return option.value === value
  })

  return matchingOption?.text
}

export const resolveProfessionalRolesValue = (value: string) => {
  const matchingOption = professionalRoles.find((option) => {
    return option.value === value
  })

  return matchingOption?.text
}

// Establishment Types resolvers

export const resolveEstablishmentTypeStatusValue = (value: string) => {
  const matchingOption = establishmentTypeStatus.find((option) => {
    return option.value === value
  })

  return matchingOption?.text
}

export const resolveEstablishmentTypeAvailableForValue = (value: string) => {
  const matchingOption = establishmentTypeAvailableForOptions.find((option) => {
    return option.value === value
  })

  return matchingOption?.text
}

// Document Types resolvers

export const resolveDocumentTypeStatusValue = (value: string) => {
  const matchingOption = documentTypeStatus.find((option) => {
    return option.value === value
  })

  return matchingOption?.text
}

// Medicine resolvers

export const resolvePrescribedAdministrationWayValue = (
  value: string | undefined,
) => {
  const matchingOption = medicinePrescribedAdministrationWay.find((option) => {
    return option.value === value
  })

  return matchingOption?.text
}

export const resolveMedicineStatusValue = (value: string) => {
  const matchingOption = documentTypeStatus.find((option) => {
    return option.value === value
  })

  return matchingOption?.text
}

export const resolveMedicinePharmaceuticalFormValue = (value: string) => {
  const matchingOption = medicinePharmaceuticalForm.find((option) => {
    return option.value === value
  })

  return matchingOption?.text
}

export const resolveMedicineRegulatoryCategoryValue = (
  value: string | undefined,
) => {
  const matchingOption = medicineRegulatoryCategory.find((option) => {
    return option.value === value
  })

  return matchingOption?.text
}

export const resolveMedicineForUseValue = (value: string) => {
  const matchingOption = medicineForUse.find((option) => {
    return option.value === value
  })

  return matchingOption?.text
}

// Pet resolvers

export const resolvePetSizeValue = (value: string) => {
  const matchingOption = petSize.find((option) => {
    return option.value === value
  })

  return matchingOption?.text
}

export const resolvePetSexValue = (value: string) => {
  const matchingOption = petSex.find((option) => {
    return option.value === value
  })

  return matchingOption?.text
}
