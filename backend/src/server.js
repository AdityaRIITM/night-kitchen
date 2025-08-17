import http from 'http';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';

import authRouter from './src/routes/auth.js';
import menuRouter from './src/routes/menu.js';
import orderRouter from './src/routes/orders.js';
import adminRouter from './src/routes/admin.js';
import paymentRouter from './src/routes/payments.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_ORIGIN?.split(',') || '*', credentials: true }
});

// Attach io to app
app.set('io', io);

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN?.split(',') || '*',
  credentials: true,
}));

// Connect DB
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("Missing MONGO_URI in env");
  process.exit(1);
}
mongoose.connect(MONGO_URI).then(()=>console.log("MongoDB connected")).catch(err=>{console.error(err); process.exit(1);});

// Routes
app.get('/', (req,res)=>res.json({ok:true,message:'Night Kitchen API'}));
app.use('/api/auth', authRouter);
app.use('/api/menu', menuRouter);
app.use('/api/orders', orderRouter);
app.use('/api/admin', adminRouter);
app.use('/api/payments', paymentRouter);

// Socket connections
io.on('connection', (socket)=>{
  // client can join order room to receive status updates
  socket.on('join-order', (orderId)=>{
    socket.join(`order:${orderId}`);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, ()=>console.log(`API listening on :${PORT}`));
