<?php

declare(strict_types=1);

use App\Core\Router;

$router = new Router();

// ─── AUTH ───────────────────────────────────────────────────────────────────
$router->post('/api/auth/register', 'AuthController@register');
$router->post('/api/auth/login',    'AuthController@login');

// ─── PROPERTIES ─────────────────────────────────────────────────────────────
$router->get('/api/properties',             'PropertyController@index');
$router->get('/api/dashboard/stats',        'PropertyController@getDashboardStats', ['auth']);
$router->get('/api/properties/{id}',        'PropertyController@show');
$router->post('/api/properties',            'PropertyController@store', ['auth', 'role:proprietaire']);
$router->post('/api/properties/{id}/assign', 'PropertyController@assign', ['auth', 'role:admin']);
$router->put('/api/properties/{id}',        'PropertyController@update', ['auth']); // Propriétaire ou Agent
$router->delete('/api/properties/{id}',     'PropertyController@destroy', ['auth', 'role:admin']);

// ─── AGENT / MISSIONS ───────────────────────────────────────────────────────
$router->get('/api/agent/missions',         'PropertyController@missions', ['auth', 'role:agent']);
$router->post('/api/agent/validate/{id}',    'PropertyController@validate', ['auth', 'role:agent']);

// ─── DOCUMENTS ──────────────────────────────────────────────────────────────
$router->post('/api/documents/upload',      'DocumentController@upload', ['auth']);

// ─── TRANSACTIONS / ESCROW ──────────────────────────────────────────────────
$router->get('/api/transactions',           'TransactionController@index', ['auth']);
$router->post('/api/transactions',          'TransactionController@store', ['auth', 'role:acheteur']);
$router->post('/api/transactions/resolve',  'TransactionController@resolve', ['auth', 'role:admin']);

// ─── USER ──────────────────────────────────────────────────────────────────
$router->put('/api/user/profile',           'UserController@updateProfile', ['auth']);

// ─── ADMIN ──────────────────────────────────────────────────────────────────
$router->post('/api/admin/agents',          'AdminController@createAgent', ['auth', 'role:admin']);
$router->get('/api/admin/agents',           'AdminController@listAgents', ['auth', 'role:admin']);
$router->put('/api/admin/agents/{id}',      'AdminController@updateAgent', ['auth', 'role:admin']);
$router->post('/api/admin/agents/{id}/reset-password', 'AdminController@resetAgentPassword', ['auth', 'role:admin']);
$router->delete('/api/admin/agents/{id}',    'AdminController@deleteAgent', ['auth', 'role:admin']);
$router->get('/api/admin/properties',       'PropertyController@adminList', ['auth', 'role:admin']);

// ─── DISPATCH ───────────────────────────────────────────────────────────────
$router->dispatch($method, $uri);
