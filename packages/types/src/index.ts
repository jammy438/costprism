export interface User {
  id: string;
  name: string;
  email: string;
  orgId: string;
}

export interface Org {
  id: string;
  name: string;
}

export interface Connector {
  id: string;
  name: string;
  type: string;
  orgId: string;
}

export interface CostRow {
  id: string;
  connectorId: string;
  amount: number;
  currency: string;
  date: string;
}
