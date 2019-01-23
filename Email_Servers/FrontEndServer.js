var http = require('http');
var mysql = require('mysql');
var url = require('url');

var muleSoftPortNo = 8082;
//var userserver = require('UserServer');

var server = http.createServer(function(Req,Res){
    Res.writeHead(200,{'content-type': 'text/html'});
    var myURL = url.parse(Req.url, true);
    console.log(myURL.pathname);
    if(myURL.pathname === '/login'){
       Res.write("<form action='http://localhost:" + muleSoftPortNo + "/login' method='POST'>");
       Res.write("User Name: <input  required name='username' type='email'>");
       Res.write("Password: <input required name='password' type='password'>");
       Res.write("<input type='submit' value='Login'>");
       Res.write("</form>");
       Res.end();

    }

    else if(myURL.pathname === '/retrylogin'){
        console.log("Failed Login");
        Res.write("<form action='http://localhost:" + muleSoftPortNo + "/login' method='POST'>");
        Res.write("User Name: <input required name='username' type='email'>");
        Res.write("Password: <input required name='password' type='password'>");
        Res.write("<input type='submit' value='Login'>");        
        Res.write("</form>");

        Res.write("INVALID USERNAME OR PASSWORD </br>");
        Res.write("<a href='http://localhost:" + "3003" + "/createaccount'> CREATE NEW ACCOUNT </a>");

        Res.end();

    }

    else if(myURL.pathname === '/createaccount'){
        Res.write("<form action='http://localhost:" + muleSoftPortNo + "/createaccount' method='POST'>");
        Res.write("User Name: <input required name='username' type='email'>");
        Res.write("Password: <input required name='password' type='password'>");
        Res.write("Confirm Password: <input required name='confirmpassword' type='password'>");
        Res.write("<input type='submit' value='Create Account'>");
        Res.write("</form>");
        Res.end();

    }

    else if(myURL.pathname === '/success'){
        console.log("Successful Login"); 
        Res.write("Successful Login");

        Res.write("<form action='http://localhost:" + muleSoftPortNo + "/inbox' method='POST'>");
        Res.write("<input name='username' value=" + myURL.query.username + " type='hidden'>");
        Res.write("<input name='password'  value=" + myURL.query.password + " type='hidden'>");
        Res.write("<input type='submit' value='View Inbox'>");
        Res.write("</form>");

        Res.end();
    }

    else if(myURL.pathname === '/inbox'){
        
        Res.write("Inbox");
        
        Res.end();
    }

    else {
        console.log("Unknown Path");
        Res.end();
    }

}).listen(3003);

function connection(){
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'emails',
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