import database from "./db_connection.js";

export const newUserSave = async (saveData) => {
    const query = `
    INSERT INTO save_data (user_id, last_xpos, last_ypos, timer, save_datetime, is_slime_defeated) 
    VALUES (:user_id, :last_xpos, :last_ypos, :timer, :save_datetime, :is_slime_defeated);
    `;

  const params = saveData;

  const result = await database.query(query, params);
  return result[0].insertId !== undefined;
}

export const setUserSave = async (saveData) => {
    const query = `
        UPDATE save_data SET last_xpos = :last_xpos, last_ypos = :last_ypos, timer = :timer, 
        save_datetime = :save_datetime, is_slime_defeated = :is_slime_defeated
        WHERE user_id = :user_id;
      `;
  
    const result = await database.query(query, saveData);
    return result[0].affectedRows !== 0;
}

export const getUserSave = async (user_id) => {
  const query = `
  SELECT 
    last_xpos,
    last_ypos,
    save_datetime,
    is_slime_defeated,
    timer
  FROM save_data
  WHERE user_id = :user_id
`;

const result = await database.query(query, { user_id });
return result[0][0];
}