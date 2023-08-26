export const development = {
    dialect: 'sqlite',
    database: 'dev',
    storage: './database.sqlite3',
    logging: console.log
};

export const test = {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false
};