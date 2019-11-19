import dbInterface from '../index';
import { getColumns, getFields } from '../../utils/db_utils/queryUtil';


// Add item to a table
export const createItem = async (table, data) => {
	const values = Object.values(data);
	const keys = Object.keys(data).map(val => `"${val}"`);
	const columns = getColumns(keys);
	const query = {
		text: `INSERT INTO ${table}(
      ${keys.toString()}
    ) VALUES(${columns}) RETURNING *`,
		values
	};
	try {
		const { rows } = await dbInterface.query(query);
		return { error: null, result: rows[0] };
	} catch (error) {
		return { error: error.message, result: null };
	}
};

// UPDATE table_name
// SET column1 = value1, column2 = value2...., columnN = valueN
// WHERE[condition];

// Update a single item
export const updateItem = async (table, id, data) => {
	const values = Object.values(data);
	const keys = Object.keys(data).map(val => `"${val}"`);
	const columns = getColumns(keys);
	const query = {
		text: `UPDATE ${table} SET (${keys.toString()}) = (${columns}) WHERE id='${id}' RETURNING *`,
		values,
	};
	try {
		const { rows } = await dbInterface.query(query);
		return { error: null, result: rows[0] };
	} catch (error) {
		return { error: error.message };
	}
};

// Delete an item
export const deleteItem = async (table, id) => {
	const query = {
		text: `DELETE FROM ${table} WHERE id=$1 `,
		values: [id]
	};
	try {
		const { rowCount } = await dbInterface.query(query);
		return { error: null, result: rowCount };
	} catch (error) {
		return { error: error.message };
	}
};

// Get a single item from db, expect a single key value pair option
export const getItem = async (table, option) => {
	const value = Object.values(option);
	const key = Object.keys(option)[0];
	const query = {
		text: `SELECT * FROM ${table} WHERE ${key}=$1`,
		values: value
	};
	try {
		const { rows } = await dbInterface.query(query);
		return { error: null, result: rows[0] };
		//return { error: null, result: formater(table, rows) };
	} catch (error) {
		return { error: error.message };
	}
};

// Get items froom the database
export const getItems = async (table, condition = null, option = null) => {
	const value = condition ? Object.values(condition) : null;
	const key = condition ? Object.keys(condition).toString() : null;
	const query = !condition
		? { text: `SELECT * FROM ${table}` }
		: {
			text: `SELECT * FROM ${table} WHERE ${key}=$1 ${option ? `AND ${option[0]}='${option[1]}'` : ''}`,
			values: value
		};
	try {
		const { rows } = await dbInterface.query(query);
		return { error: null, result: rows };
	} catch (error) {
		return { error: error.message };
	}
};

// export const getItemsBetween = async (table, item, condition, option = null) => {
// 	const values = Object.values(condition);
// 	const query = {
// 		text: ` SELECT * FROM ${table} WHERE ${item} BETWEEN ${values[0]} AND ${values[1]} ${option
// 			? `AND ${option[0]}='${option[1]}'`
// 			: ''}`
// 	};
// 	try {
// 		const { rows } = await dbInterface.query(query);
// 		return { error: null, result: formater(table, rows) };
// 	} catch (error) {
// 		return { error: error.message };
// 	}
// };
