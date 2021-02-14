import { createConnection, MysqlError } from 'mysql';

const connection = createConnection({
	host: process.env.MYSQL_HOST,
	database: process.env.MYSQL_DB,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
});

/**
 * Creates a mySQL connection, runs the callback, then immediately closes the connection.
 * Done this way since most endpoints can be processed in the space of a single function,
 * and I don't want to have to remember to close the connection
 */
export const queryDb = <T extends unknown>(
	query: string,
	params?: (number | string)[]
): Promise<T | null> =>
	new Promise<T | null>(( resolve, reject ) => {
		const callback = ( err: MysqlError | null, results: T | null | undefined ) => {
			if ( err ) reject(err);
			resolve(results ?? null);
		}
		if ( params === undefined ) {
			connection.query(query, callback);
		} else {
			connection.query(query, params, callback);
		}
	}).finally(() => connection.end());