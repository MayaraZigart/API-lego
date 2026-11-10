
// Importando as bibliotecas
require('dotenv').config();

const express = require('express');
const {MongoClient, ObjectId} = require('mongodb');

// Criando a conexão com o banco:
const app = express();
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.log('ERRO: MONGO_URI não foi encontrada no arquivo .env');
    process.exit(1);
}

const client = new MongoClient(MONGO_URI);
const legos = client.db('lego').collection('conjuntos');

// Criando os métodos HTTP:
app.post('/legos', async(req,res)=>{
    const novoLego = await legos.insertOne(req.body);
    res.status(201).json(novoLego);
});

app.get('/legos', async(req,res)=>{
    const listaLegos = await legos.find().toArray();
    res.json(listaLegos);
});

app.get('/legos/:id', async(req,res)=>{
    const legoEspecifico = await legos.findOne({_id: new ObjectId(req.params.id)});
    res.json(legoEspecifico);
});

app.put('/legos/:id', async(req,res)=>{
    const legoAtualizado = await legos.updateOne(
        {_id: new ObjectId(req.params.id)},
        {$set: req.body}
    );
    res.json(legoAtualizado);
});

app.delete('/legos/:id', async(req,res)=>{
    const legoDeletado = await legos.deleteOne({_id: new ObjectId(req.params.id)});
    res.json(legoDeletado);
});

// Conectando ao MongoDB:
client.connect()
    .then(()=>{
        console.log('CONECTADO AO MONGODB');
        app.listen(3000, ()=>console.log('API RODANDO NA PORTA 3000'));
    })
    .catch((erro)=>console.log('ERRO AO CONECTAR', erro.message));
