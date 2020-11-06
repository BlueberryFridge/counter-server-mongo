const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const Counter = require('./CounterModel');

const app = express();
const port = process.env.PORT || 3001;
const countId = process.env.COUNT_DOC_ID;


//------------------- connection to MongoDB Atlas ------------------//
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
        .catch(err => console.error(`MongoDB connection error: ${err.message}`));
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use(cors());
app.use(morgan('dev'));

app.get('/count', (req, res, next) => 
    Counter.findById(countId)
           .exec((err, result) => {
                if(err) next(err);
                res.json({currentCount: result.count, id: result._id});
           })
);
app.post('/count/:count', (req, res, next) => {
    const newCount = new Counter({_id: countId, count: req.params.count});

    Counter.findByIdAndUpdate(countId, newCount, {}, (err, updatedCount) => {
        if(err) next(err);
        res.json(updatedCount);
    });
});

app.listen(port, () => console.log(`Server started at port ${port}`));