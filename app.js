const express = require('express');
const config = require('config');
const path = require('path');
const cors = require('cors');
const errorMiddleware = require('./middleware/error-middleware');
const cookieParser = require('cookie-parser');
const PORT = config.get('port') || 5000;
const app = express();
app.use(express.json({extended:true}));
app.use(cookieParser());
app.use(cors());
app.use(express.static('image'));
//routes
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/masters', require('./routes/masters.routes'));
app.use('/api/master_events', require('./routes/master_events.routes'));
app.use('/api/roles', require('./routes/roles.routes'));
app.use('/api/organizations', require('./routes/organizations.routes'));
app.use('/api/organization_clients', require('./routes/organization_clients.routes'));
app.use(errorMiddleware);

app.use('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.status(200).send('OK');
    next();
})
if(process.env.NODE_ENV === 'production'){
    app.use('/', express.static(path.join(__dirname, 'client', 'build' )));
    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname,'client','build', 'index.html'))
    })
}

async function start(){
    try{
        const dbSequelize = require('./models');
        const db = dbSequelize.sequelize;
        db.authenticate()
            .then(() => console.log('database connected'))
            .catch(err => console.log('Error: ' + err));
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    }
    catch(e){
        console.log('Server Error',e.message);
        process.exit(1);
    }
}

start();