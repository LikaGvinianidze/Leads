
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('sources').del()
    .then(function () {
      // Inserts seed entries
      return knex('sources').insert([
        {name: 'სოციალური ქსელის მეშვეობით'},
        {name: 'რეკლამის საშუალებით'},
        {name: 'ახლობლისგან'},
        {name: 'სხვა'}
      ]);
    });
};
