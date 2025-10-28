-- Verificar todos los datos en la base de datos
SELECT 'roles' as tabla, COUNT(*) as registros FROM roles
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'customers', COUNT(*) FROM customers
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'riders', COUNT(*) FROM riders
UNION ALL
SELECT 'vehicles', COUNT(*) FROM vehicles
UNION ALL
SELECT 'delivery_partners', COUNT(*) FROM delivery_partners
UNION ALL
SELECT 'rider_last_locations', COUNT(*) FROM rider_last_locations;

-- Detalles de usuarios
SELECT '--- USUARIOS ---' as info;
SELECT id, name, email, (SELECT name FROM roles WHERE roles.id = users.role_id) as role FROM users;

-- Detalles de riders
SELECT '--- RIDERS ---' as info;
SELECT r.id, u.name, u.email, r.status, r.phone FROM riders r JOIN users u ON r.user_id = u.id;
