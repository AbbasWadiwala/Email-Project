var http = require('http');
var mysql = require('mysql');
var url = require('url');

var muleSoftPortNo = 8082;
//var userserver = require('UserServer');

var server = http.createServer(function(Req,Res){
    Res.writeHead(200,{'content-type': 'text/html'});
    var myurl = url.parse(Req.url, true);
    console.log(myurl.pathname);
    if(myurl.pathname === '/login'){
       Res.write("<form action='http://localhost:" + muleSoftPortNo + "/login' method='POST'>");
       Res.write("User Name: <input  required name='username' type='email'>");
       Res.write("Password: <input required name='password' type='password'>");
       Res.write("<input type='submit' value='Login'>");
       Res.write("</form>")

    }

    else if(myurl.pathname === '/retrylogin'){
        Res.write("<form action='http://localhost:" + muleSoftPortNo + "/login' method='POST'>");
        Res.write("User Name: <input required name='username' type='email'>");
        Res.write("Password: <input required name='password' type='password'>");
        Res.write("<input type='submit' value='Login'>");
        Res.write("INVALID USERNAME OR PASSWORD")
        Res.write("<a href:'http://localhost:" + muleSoftPortNo + "/createaccount'> CREATE NEW ACCOUNT </a>")
        Res.write("</form>")

    }

    else if(myurl.pathname === '/createaccount'){
        Res.write("<form action='http://localhost:" + muleSoftPortNo + "/createaccount' method='POST'>");
        Res.write("User Name: <input required name='username' type='email'>");
        Res.write("Password: <input required name='password' type='password'>");
        Res.write("Confirm Password: <input required name='confirmpassword' type='password'>");
        Res.write("<input type='submit' value='Create Account'>");
        Res.write("</form>")


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