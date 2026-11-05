export interface OwnerSummery {
  ownerId: string
  ownerName: string
  nic: string
  tel: string
  email: string
}

export interface HostelSummary {
  hostelId: string
  name: string
  address: string
  tel: string
  email: string
  location: string
}

export interface HostelResponse extends HostelSummary {
  ownerSummery: OwnerSummery
}
