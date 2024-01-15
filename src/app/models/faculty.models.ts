import { Campus } from "./campus.model";



export interface Faculty {
	id: number | string,
	name: string,
	campus: Campus | number | string,
}
