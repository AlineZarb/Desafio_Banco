const express = require('express');
const { cadastrarUsuario, listarContas, excluirConta, atualizarCadastro } = require('./controladores/contas');
const { depositar, sacar, saldo, transferir, extrato } = require('./controladores/operacoes');


const rotas = express();

rotas.get('/contas', listarContas);// ?senha=Cubos123Bank
rotas.post('/contas', cadastrarUsuario);
rotas.put('/contas/:numeroConta', atualizarCadastro);
rotas.delete('/contas/:numeroConta', excluirConta);
rotas.post('/transacoes/depositar', depositar);
rotas.post('/transacoes/sacar', sacar);
rotas.get('/contas/saldo', saldo); //saldo?numero_conta=1&senha=123
rotas.post('/transacoes/transferir', transferir);
rotas.get('/contas/extrato', extrato);  //extrato?numero_conta=1&senha=123
module.exports =
    rotas;