/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("points").del();
  await knex("points").insert([
    {
      x: 106.0672384,
      y: -6.123776753,
      ratio: 1.355359425,
      orientation: 28.52462604,
      user_id: 1, // Sesuaikan dengan id user admin yang ada di tabel users
    },
    {
      x: 105.9642776,
      y: -6.210724042,
      ratio: 1.189905989,
      orientation: 40.60715914,
      user_id: 1,
    },
    {
      x: 106.2136696,
      y: -6.304082349,
      ratio: 0.900732336,
      orientation: 43.20340397,
      user_id: 1,
    },
    {
      x: 105.9338341,
      y: -6.490859629,
      ratio: 2.349573948,
      orientation: 27.78074745,
      user_id: 1,
    },
    {
      x: 105.7126249,
      y: -6.685625218,
      ratio: 0.896506642,
      orientation: 61.39112196,
      user_id: 1,
    },
    {
      x: 106.2222605,
      y: -6.599143811,
      ratio: 1.356077983,
      orientation: 44.98078031,
      user_id: 1,
    },
    {
      x: 106.3063171,
      y: -6.826795712,
      ratio: 2.271592732,
      orientation: 74.77721506,
      user_id: 1,
    },
    {
      x: 106.5404982,
      y: -6.542069693,
      ratio: 0.280797693,
      orientation: 81.06100108,
      user_id: 1,
    },
    {
      x: 106.5404982,
      y: -6.542069693,
      ratio: 0.456072381,
      orientation: 93.37543539,
      user_id: 1,
    },
  ]);
};
