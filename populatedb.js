// to use, use 'node populatedb.js <MONGO_URI>'
const userArgs = process.argv.slice(2);
const mongoURI = userArgs[0];

const mongoose = require('mongoose');
const CounterModel = require('./CounterModel');

mongoose.connect(mongoURI, {useUnifiedTopology: true, useNewUrlParser: true});
mongoose.connection.on('error', console.error.bind(`MongoDB connection error:`));

async function createCount() {
    const newCount = new CounterModel({count: 0});

    await newCount.save(err => {
        if(err) {
            console.log(`Something went wrong: ${err.message}`);
            return;
        }
        console.log(`Counter successfully added: ${newCount}`);
        console.log('Closing MongoDB connection...');
        mongoose.connection.close();
        console.log('mongodb connection closed');
    });
}

createCount();