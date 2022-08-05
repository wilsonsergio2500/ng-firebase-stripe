
export type ByIdType = { id: string };

export class CustomerIntializeAction {
  static readonly type = '[Customer] Initialize';
  constructor(public request: ByIdType) { }
}

export class CustomerSetAsLoadingAction {
    static type = '[Customer] Set As Loading';
}

export class CustomerSetAsDoneAction {
    static type = '[Customer] Set As Done';
}

