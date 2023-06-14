const bancodedados = require('../bancodedados');
const { format } = require('date-fns');
let { banco, contas, depositos, saques, transferencias } = require('../bancodedados');



const depositar = (req, res) => {
    const { numero, valor } = req.body;

    if (!numero || !valor) {
        return res.status(400).json({ mensagem: 'Número da conta e valor do depósito devem ser informados.' });
    }

    const conta = contas.find((conta) => conta.numero === Number(numero));

    if (!conta) {
        return res.status(404).json({ mensagem: 'A conta bancária informada não existe.' });
    }

    if (Number(valor) <= 0) {
        return res.status(400).json({ mensagem: 'O valor do depósito deve ser maior que zero.' });
    }

    const deposito = {

        data: format(new Date(), "dd-MM-yyyy HH:mm:ss"),
        numero_conta: numero,
        valor: conta.saldo = + Number(valor)
    };

    depositos.push(deposito);
    return res.status(200).json(deposito);
};

const sacar = (req, res) => {
    const { numero, valor, senha } = req.body;
    const { contas, saques } = bancodedados;
    if (!numero || !valor || !senha) {
        return res.status(400).json({ mensagem: 'Número da conta, valor do depósito e senha  devem ser informados.' });
    }

    if (valor <= 0) {
        return res.status(400).json({ mensagem: 'O valor para saque deve ser maior que zero.' });
    }

    const conta = contas.find((conta) => Number(conta.numero) === Number(numero));

    if (!conta) {
        return res.status(404).json({ mensagem: 'A conta bancária informada não existe.' });
    }

    if (senha !== conta.usuario.senha) {
        return res.status(401).json({ mensagem: 'Senha inválida para a conta informada.' });
    }


    if (valor > conta.saldo) {


        return res.status(400).json({ mensagem: 'Saldo insuficiente para o saque.' });
    }
    conta.saldo -= valor;

    saques.push({

        data: format(new Date(), "dd-MM-yyyy HH:mm:ss"),
        numero_conta: numero,
        valor: Number(valor)
    });

    return res.status(200).json({ mensagem: "Saque realizado com sucesso!" });
};


const saldo = (req, res) => {

    const numero_conta = Number(req.query.numero);
    const senha = req.query.senha;


    if (!numero_conta) {
        return res.status(400).send({ mensagem: 'Número da conta é obrigatório.' });
    }
    if (!senha) {
        return res.status(400).send({ mensagem: 'Senha da Conta é obrigatório.' });
    }
    const contaEncontrada = contas.find((contas) => {
        return contas.numero === numero_conta;
    })

    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: 'A conta não encontrada' });
    }
    if (senha !== contaEncontrada.usuario.senha) {
        return res.status(401).send({ mensagem: 'Senha da conta incorreta.' });
    }

    return res.json({ saldo: contaEncontrada.saldo });

};
const transferir = (req, res) => {
    const { numeroOrigem, senhaOrigem, valor, numeroDestino } = req.body;

    if (!numeroOrigem || !senhaOrigem || !valor || !numeroDestino) {
        return res.status(400).json({ mensagem: 'Todos os campos devem ser informados.' });
    }

    const contaOrigem = contas.find(conta => {
        return Number(conta.numero) === Number(numeroOrigem)
    });

    if (!contaOrigem) {
        return res.status(404).json({ mensagem: 'Conta de origem não encontrada.' });
    }

    const contaDestino = contas.find(conta => {
        return Number(conta.numero) === Number(numeroDestino)
    })

    if (!contaDestino) {
        return res.status(404).json({ mensagem: 'Conta de destino não encontrada.' });
    }

    if (contaOrigem.usuario.senha !== senhaOrigem) {
        return res.status(401).json({ mensagem: 'Senha incorreta para a conta de origem.' });
    }

    if (contaOrigem.saldo < valor) {
        return res.status(400).json({ mensagem: 'Saldo insuficiente na conta de origem.' });
    }

    contaOrigem.saldo -= Number(valor);

    contaDestino.saldo += Number(valor);
    transferencias.push({

        data: format(new Date(), "dd-MM-yyyy HH:mm:ss"),
        numero_conta_origem: String(contaOrigem.numero),
        numero_conta_destino: String(contaDestino.numero),
        valor: Number(valor)
    });

    return res.json(transferencias);
};

const extrato = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta) {
        return res.status(400).send({ mensagem: 'Número da conta é obrigatório.' });
    }
    if (!senha) {
        return res.status(400).send({ mensagem: 'Senha da Conta é obrigatório.' });
    }
    const contaEncontrada = contas.find((contas) => {
        return Number(contas.numero) === Number(numero_conta);
    })

    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' });
    }
    if (senha !== contaEncontrada.usuario.senha) {
        return res.status(401).send({ mensagem: 'Senha da conta incorreta.' });
    }
    const extratoConta = {
        depositos: depositos.filter((deposito) => {
            return Number(deposito.numero_conta) === Number(numero_conta)
        }),
        saques: saques.filter((saque) => {
            return Number(saque.numero_conta) === Number(numero_conta)
        }),
        transferenciasEnviadas: transferencias.filter((transferencia) => {
            return Number(transferencia.numero_conta_origem) === Number(numero_conta)
        }),

        transferenciasRecebida: transferencias.filter((transferencia) => {
            return Number(transferencia.numero_conta_destino) === Number(numero_conta)
        })
    }
    return res.json(extratoConta);
}
module.exports = {
    banco, contas, depositar, sacar, saldo, transferir, saques, transferencias, extrato
};
