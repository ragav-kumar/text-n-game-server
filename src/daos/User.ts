import { User } from "../api";
import { queryDb } from "@daos/db";

const table = "user" as const;

type NewUser = {
	username: string;
	email: string;
	password: string;
}

export const get = (id: number) => queryDb<User>(`SELECT * from ${table} WHERE id=?`, [id]);
export const insert = async ({ username, email, password }:NewUser) => {
	return !! await queryDb<boolean>(
		`INSERT INTO ${table} (username, password, email) VALUES (?, ?, ?)`,
		[ username, password, email ]
	);
}
