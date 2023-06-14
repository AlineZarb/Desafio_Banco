const express = require('express');
const { cadastrarUsuario, listarContas, excluirConta, atualizarCadastro } = require('./controladores/contas');
const { depositar, sacar, saldo, transferir, extrato } = require('./controladores/operacoes');


const rotas = express();

rotas.get('/conta', listarContas); //conta?senha=Cubos123Bank
rotas.post('/cadastrar', cadastrarUsuario);
rotas.put('/contas/:numero', atualizarCadastro);
rotas.delete('/cadastrar/:numero', excluirConta);
rotas.post('/depositar', depositar);
rotas.post('/sacar', sacar);
rotas.get('/contas/saldo', saldo); //?numero_conta=1&senha=123
rotas.post('/transferencia/transferir', transferir);
rotas.get('/contas/extrato', extrato);
module.exports =
    rotas;