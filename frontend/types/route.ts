
export interface IRoute {
  _id: string;
  name: string;
  stops: { _id?: string; name: string; sequence: number }[]; 
  createdAt: string;
  updatedAt: string;
}

export interface RouteStop {
  _id?: string;
  name: string;
  sequence: number;
}

export interface RouteFormData {
  name: string;
  stops: RouteStop[]; 
  distance: number;
}
