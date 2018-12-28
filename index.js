
let express = require('express');
let router= require('./routes/index');
let config= require('./config/dev');
let app = express();
//ram testing purpose
///jdjajjjjajsjdsjdjajsd
app.use('/',router);
app.listen(config.port,(error)=>{
    if(error) console.log('error' +error); else console.log(`server running on the port ${config.port}`);
});
