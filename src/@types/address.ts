export interface viaCepResponseType {
  bairro?: string
  cep?: string
  complemento: string
  ddd?: string
  gia?: string
  ibge?: string
  localidade?: string
  logradouro?: string
  siafi?: string
  uf?: string
  unidade?: string
  erro?: string
}

export interface ResponseAddress {
  id?: string
  postCode?: string
  street?: string
  number?: number
  neighborhood?: string
  city?: string
  state?: string
  compliment?: string
  latitude?: number
  longitude?: number
}
