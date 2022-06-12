const express =  require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const Store = require('./models/store');
mongoose.connect('mongodb+srv://uthekarsh:1kDXiSFq9ADCOREr@cluster0.8h2fj.mongodb.net/?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(express.json({ limit: '50mb'}));

app.get('/api/stores',(req,res)=> {
    Store.find({}, (err,stores)=>{
        if(err)
            res.status(500).send(err);
        else
            res.status(200).send(stores);
    })
})

app.listen(port, () => console.log(`App listening at http://localhost:${port}`))

app.post('/api/stores',(req,res)=>{
    var dbStores = [];
    let stores = req.body;
    stores.forEach((store) => {
        dbStores.push({
            storeName: store.name,
            phoneNumber: store.phoneNumber,
            address: store.address,
            openStatusText: store.openStatusText,
            addressLines: store.addressLines,
            location: {
                type: 'Point',
                coordinates: [
                    store.coordinates.longitude,
                    store.coordinates.latitude
                ]
            }
        })
    });
    Store.create(dbStores,(err, stores)=>{
        if(err){
            res.status(500).send(err);
        }
        else{
            res.status(200).send(stores);
        }
    })
});

app.delete('/api/stores',(req,res)=>{
    Store.deleteMany({},(err)=>{
        res.status(200).send(err);
    })
})
