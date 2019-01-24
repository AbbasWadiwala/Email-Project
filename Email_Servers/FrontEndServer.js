var http = require('http');
var mysql = require('mysql');
var url = require('url');

var muleSoftPortNo = 8082;
var frontEndServerPortNo = 3003;
//var userserver = require('UserServer');

var server = http.createServer(function(Req,Res){
    Res.writeHead(200,{'content-type': 'text/html'});
    var myURL = url.parse(Req.url, true);
    const { headers, method, url2 } = Req;
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
        Res.write("<a href='http://localhost:" + frontEndServerPortNo + "/createaccount'> CREATE NEW ACCOUNT </a>");

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

        Res.write("</br>");

        Res.write("<form action='http://localhost:" + frontEndServerPortNo + "/compose' method='POST'>");
        Res.write("<input name='username' value=" + myURL.query.username + " type='hidden'>");
        Res.write("<input name='password'  value=" + myURL.query.password + " type='hidden'>");
        Res.write("<input type='submit' value='Compose New Email'>");
        Res.write("</form>");

        Res.end();
    }

    else if(myURL.pathname === '/inbox'){
        var chunkCount = 0;
        let body = [];
        Req.on('error', (err) => {
            console.error(err);
            Res.write("There was an Error");
            Res.end();
        }).on('data', (chunk) => {
            chunkCount++;
            console.log(chunkCount);
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            Res.write(body);
            Res.end();
        });      
    }

    else if(myURL.pathname === '/compose'){

        var chunkCount = 0;
        let body = [];
        Req.on('error', (err) => {
            console.error(err);
            Res.write("There was an Error");
            Res.end();
        }).on('data', (chunk) => {
            chunkCount++;
            console.log(chunkCount);
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            Res.write(body);

            var posOfLastEqualSign =  body.lastIndexOf("=");
            var usernameFromBody = "";
            var passwordFromBody = "";

            passwordFromBody = body.substring(posOfLastEqualSign+1,body.length);

            var posOfFirstAmpersandSign =  body.indexOf("&");
            usernameFromBody = body.substring(9,posOfFirstAmpersandSign);
            usernameFromBody = usernameFromBody.replace("%40","@");

            console.log(usernameFromBody);
            console.log(passwordFromBody);
        
            Res.write("<form action='http://localhost:" + muleSoftPortNo + "/compose' method='POST'>");
            Res.write("To: <input required name='to_user' type='email' maxlength='20'></br>");
            Res.write("Subject: <input  name='subject' type='text' maxlength='30'></br>");
            Res.write("Body: <textarea  name='body' rows='10' cols='50' maxlength='500'> ENTER YOUR EMAIL HERE </textarea></br>");
            Res.write("<input type='submit' value='Send Email'>");
            Res.write("<input name='from_user'  value=" + usernameFromBody + " type='hidden'>");
            Res.write("<input name='password'  value=" + passwordFromBody + " type='hidden'>");
            Res.write("</form>");
            Res.end();
            
        });   


        
    }

    else {
        console.log("Unknown Path");
        Res.end();
    }

}).listen(frontEndServerPortNo);

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