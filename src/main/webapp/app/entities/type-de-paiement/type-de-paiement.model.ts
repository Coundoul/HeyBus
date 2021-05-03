export interface ITypeDePaiement {
  id?: number;
  paiement?: string;
}

export class TypeDePaiement implements ITypeDePaiement {
  constructor(public id?: number, public paiement?: string) {}
}

export function getTypeDePaiementIdentifier(typeDePaiement: ITypeDePaiement): number | undefined {
  return typeDePaiement.id;
}
