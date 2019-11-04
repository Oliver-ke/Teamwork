import dbInterface from '../index';
import getColumns from '../../utils/db_utils/getCollumns';
import formater from '../../utils/db_utils/formater';

// Add item to a table
export const createItem = async (table, data) => {
	const values = Object.values(data);
	const keys = Object.keys(data);
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

// Update a single item
export const updateItem = async (table, id, update) => {
	const key = Object.keys(update).toString();
	const value = Object.values(update).toString();
	const query = {
		text: `UPDATE ${table} SET ${key}=$2 WHERE id=$1 RETURNING *`,
		values: [ id, value ]
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
		values: [ id ]
	};
	try {
		const { rowCount } = await dbInterface.query(query);
		return { error: null, result: rowCount };
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

		return { error: null, result: formater(table, rows) };
	} catch (error) {
		return { error: error.message };
	}
};

export const getItemsBetween = async (table, item, condition, option = null) => {
	const values = Object.values(condition);
	const query = {
		text: ` SELECT * FROM ${table} WHERE ${item} BETWEEN ${values[0]} AND ${values[1]} ${option
			? `AND ${option[0]}='${option[1]}'`
			: ''}`
	};
	try {
		const { rows } = await dbInterface.query(query);
		return { error: null, result: formater(table, rows) };
	} catch (error) {
		return { error: error.message };
	}
};
