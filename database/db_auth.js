import database from "./db_connection.js";

export const register = async (credentials) => {
  const query = `
        INSERT INTO user (username, email, password, date_created)
        VALUES (:username, :email, :password, :date)
    `;
  const params = credentials;

  const result = await database.query(query, params);
  return result[0].insertId !== undefined;
};

export const getUserByEmail = async (email) => {
  const query = `
        SELECT 
          user_id,
          username,
          password,
          has_save
        FROM user
        WHERE email = :email
    `;
  const params = { email };

  const result = await database.query(query, params);
  return result[0][0];
};

export const getUserSave = async (user_id) => {
  const query = `
  SELECT 
    last_xpos,
    last_ypos,
    save_datetime,
    is_slime_defeated
  FROM save_data
  WHERE user_id = :user_id
`;

const result = await database.query(query, { user_id });
return result[0][0];
}