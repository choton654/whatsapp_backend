import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import Pusher from 'pusher';
import Messege from './messegeModel.js';

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());
const connection_url =
  'mongodb+srv://choton654:9804750147@cluster0-prdkh.mongodb.net/whatsapp_mern?w=majority&retryWrites=true';

try {
  mongoose.connect(connection_url, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
} catch (error) {
  console.error(error.message);
}

const db = mongoose.connection;

db.once('open', () => {
  console.log('db connected');

  const msgCollection = db.collection('messeges');
  const changeStream = msgCollection.watch();
  changeStream.on('change', (next) => {
    console.log(next);

    try {
      if (next.operationType === 'insert') {
        pusher.trigger('message', 'inserted', {
          _id: next.fullDocument._id,
          name: next.fullDocument.name,
          message: next.fullDocument.message,
          createdAt: next.fullDocument.createdAt,
          received: next.fullDocument.received,
        });
      }
    } catch (error) {
      console.error(error);
    }
  });
});

const pusher = new Pusher({
  appId: '1069607',
  key: '786af382185166632e6c',
  secret: '54b145a5b6c44c628469',
  cluster: 'ap2',
  encrypted: true,
});

app.get('/', (req, res) => {
  res.status(200).send('hello world');
});

app.post('/messege/new', (req, res) => {
  const messege = req.body;

  Messege.create(messege, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).json(data);
    }
  });
});

app.get('/messege/all', (req, res) => {
  Messege.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(data);
    }
  });
});

app.listen(PORT, () => console.log('Server is running'));
