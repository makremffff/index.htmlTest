// server.js  (يمكنك حفظه مكان القديم أو استخدامه في Vercel)
const express=require('express');
const cors=require('cors');
const app=express();
app.use(cors());
app.use(express.json());

const users=new Map();
const ensure=id=>{
  if(!users.has(id))users.set(id,{
    clicks:0,usdt:0,counter:30,auto:false,left:3*3600,
    lastMyst:0,lastQuick:0,joined:false
  });
};
app.get('/api/user/:id',(req,res)=>{
  const id=Number(req.params.id);ensure(id);res.json(users.get(id));
});
app.post('/api/user/:id',(req,res)=>{
  const id=Number(req.params.id);ensure(id);Object.assign(users.get(id),req.body);res.json({ok:true});
});
// health check
app.get('/',(_q,r)=>r.send('OK'));
module.exports=app;
