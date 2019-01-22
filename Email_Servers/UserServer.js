var http = require('http');
var mysql = require('mysql');
var url = require('url');

var server = http.createServer( function(Req,Res){
    Res.writeHead(200, {'content-type': 'application/json'});
    var myURL = url.parse(Req.url, true);
    console.log(myURL.pathname);
    
    if(myURL.pathname === '/login'){
        var conn = connection();
        console.log("Username: " + myURL.query.username + ", Password: " + myURL.query.password);
        var passwordToString = myURL.query.password + "";
        console.log(passwordToString);
        conn.query("select * from users where username='" + myURL.query.username + "' and password='" + passwordToString +"';", function(error,data){
            if(data.length){                
                Res.write(JSON.stringify({ "status" : "true" }));                
                Res.end();
            }
            else{
                Res.write(JSON.stringify({ "status" : "false" }));   
                Res.end();
            }
            
        })
    }
    else if(myURL.pathname === '/createaccount'){
        var conn = connection();
        console.log("Username: " + myURL.query.username + ", Password: " + myURL.query.password);
        
        conn.query("insert into users (id, username,password) values(NULL, '" + myURL.query.username + "','" + myURL.query.password +"')", function(error,data){
            console.log(data);
            if(!error){                
                Res.write(JSON.stringify({ "status" : "success" }));                
                Res.end();
            }
            else{
                Res.write(JSON.stringify({ "status" : "failed" }));   
                Res.end();
            }
            
        })
    }
    else{
        Res.write(JSON.stringify({ "status" : "wrong path" }));   
        Res.end(); 
    }

}).listen(3002);

function connection(){
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'email_db',
        port: '3306',
    });   
    conn.connect(function(error){
        if(error){
            console.log(error);
            throw error;
        }
        else{
            console.log("Connected to the Database successfully");
           
        }
    });
    return conn;
}