const bancodedados = require('../bancodedados');
let { contas, identificadorContas } = require('../bancodedados');

const listarContas = (req, res) => {
    const { contas, banco } = bancodedados;
    const senhaBanco = req.query.senha;

    if (!senhaBanco) {
        return res.send('Senha do banco é obrigatória.');
    }

    if (senhaBanco !== banco.senha) {
        return res.status(401).send('Senha do banco incorreta.');
    }

    return res.json(contas);

};


const cadastrarUsuario = (req, res) => {
    let { nome, email, cpf, telefone, data_nascimento, senha } = req.body

    if (!nome) {
        return res.status(404).json({
            "mensagem": "Informe o nome do cliente"
        })
    }

    if (!email) {
        return res.status(404).json({
            "mensagem": "Informe o e-mail do cliente"
        })
    }

    if (!cpf) {
        return res.status(400).json({
            "mensagem": "Informe o cpf do cliente"
        })
    }
    if (!telefone) {
        return res.status(400).json({
            "mensagem": "Informe o telefone do cliente"
        })
    }

    if (!data_nascimento) {
        return res.status(400).json({
            "mensagem": "Informe a data de nascimento do cliente"
        })
    }
    if (!senha) {
        return res.status(400).json({
            "mensagem": "Informe a senha do cliente"
        })
    }


    let cpfJaExistente = contas.find(conta => conta.usuario.cpf === cpf);

    if (cpfJaExistente) {

        return res.json('mensagem:Já existe cliente cadastrado com o CPF informado')
    }

    let emailJaExistente = contas.find((conta) => {
        return conta.usuario.email === email
    })

    if (emailJaExistente) {
        return res.json("mensagem: Já existe cliente cadastrado com o e-mail informado");
    }


    const conta = {
        numero: identificadorContas++,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }

    }

    contas.push(conta);
    return res.status(201).send(conta);
}

const atualizarCadastro = (req, res) => {
    const { nome, email, cpf, telefone, data_nascimento, senha } = req.body;
    const { numero } = req.params;
    if (!nome || !email || !cpf || !telefone || !data_nascimento || !senha) {
        return res.status(400).json({ mensagem: 'Os dados a ser alterados devem ser informados.' });
    }

    const conta = contas.find((conta) => Number(conta.numero) === Number(numero));

    if (!conta) {
        return res.status(404).json({ mensagem: 'A conta não existe.' });
    }

    const cpfJaExistente = contas.find((conta) => conta.usuario.cpf === cpf);

    if (cpfJaExistente && Number(numero) !== Number(cpfJaExistente.numero)) {
        return res.json({ mensagem: 'Já existe cliente cadastrado com o CPF informado' });
    }

    const emailJaExistente = contas.find((conta) => conta.usuario.email === email);

    if (emailJaExistente && Number(numero) !== Number(emailJaExistente.numero)) {
        return res.json({ mensagem: 'Já existe cliente cadastrado com o e-mail informado' });
    }


    conta.usuario = {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha
    }
    return res.status(200).send({ mensagem: 'Cadastro atualizado com sucesso.' });
}
const excluirConta = (req, res) => {
    const { numero } = req.params;

    let excluirC = contas.find((contas) => {
        return contas.numero === Number(numero);
    })

    if (excluirC.saldo !== 0) {
        return res.status(400).json({
            mensagem:
                'Não é possível excluir a conta com saldo diferente de zero.'
        });
    }

    if (!excluirC) {
        return res.status(404).json({ mensagem: 'A conta não existe.' });
    }
    contas = contas.filter((contas) => {
        return contas.numero !== Number(numero);
    });

    return res.json({ mensagem: 'Conta excluída com sucesso!.' });
}
module.exports = {
    listarContas, cadastrarUsuario,
    atualizarCadastro, excluirConta, contas
}