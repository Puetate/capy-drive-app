import { Campus } from "./campus.model";



export interface Faculty {
	id: number,
	name: string,
	campus: Campus | number | string,
}
