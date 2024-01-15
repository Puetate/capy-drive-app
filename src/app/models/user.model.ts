import { Career } from "./career.model";
import { Role } from "./role.model";

export enum Roles {
	'SUPER-ADMIN' = "SUPER-ADMIN",
	ADMIN = "ADMIN",
	SECRETARY = "SECRETARY",
}

export enum State {
	ACTIVE = "ACTIVO",
	INACTIVE = "INACTIVO",
}

export const enumUserState = Object.values(State);

export interface User {
	id: number,
	names: string,
	surnames: string,
	fullName?: string,
	phone: string,
	dni: string
	email: string,
	// status: boolean,
	roles: Role[] | string[],
	role?: string,
	password?: string,
	careers: Career[]| string[],
	career?: string,
}
