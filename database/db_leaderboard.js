import database from "./db_connection.js";

export const getLeaderboardData = async (saveData) => {
    const query = `
    SELECT username, times
    FROM completed_runs
    JOIN user USING (user_id)
    ORDER BY times ASC
    LIMIT 8;
    `;

  const params = saveData;

  const result = await database.query(query, params);
  return result[0]
}