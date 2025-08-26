import { Pool } from 'pg'

const pool = new Pool({
  user: process.env.DB_USER || 'vuala_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'vuala_ondemand',
  password: process.env.DB_PASSWORD || 'vuala_password_2024',
  port: parseInt(process.env.DB_PORT || '5432'),
})

export default pool
