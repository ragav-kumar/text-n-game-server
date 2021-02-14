declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: 'development' | 'production';
			MYSQL_HOST: string;
			MYSQL_DB: string;
			MYSQL_USER: string;
			MYSQL_PASSWORD: string;
		}
	}
}

export {}