const knex = require('../db/knex');

module.exports = () => {
	return async (query, options) => {
		const perPage = options.perPage || 10;
		let page = options.page || 1;

		if (!(query === undefined)) {
			const countQuery = knex.count('* as total').from(query.clone().as('inner'));

			if (page < 1) {
				page = 1;
			}
			const offset = (page - 1) * perPage;
	
			query.offset(offset);
	
			if (perPage > 0) {
				query.limit(perPage);
			}
	
			const [result, countRows] = await Promise.all([
				query,
				countQuery
			]);
	
			const total = countRows[0].total;
	
			return {
				pagination: {
					currentPage: page,
					lastPage: Math.ceil(total / perPage)
				},
				result: result
			};
		} else {
			return {
				pagination: {
					currentPage: 1,
					lastPage: 1
				},
				result: []
			};
		}

	};
};
