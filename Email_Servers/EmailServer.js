var http = require('http');
var mysql = require('mysql');
var url = require('url');

var server = http.createServer( function(Req,Res){
    Res.writeHead(200, {'content-type': 'application/json'});
    var myURL = url.parse(Req.url, true);
    console.log(myURL.pathname);
    
    if(myURL.pathname === '/inbox'){
        var conn = connection();
        console.log("Username: " + myURL.query.username);
        console.log("Password: " + myURL.query.password);
        conn.query("select * from users where username='" + myURL.query.username + "' and password='" + myURL.query.password +"';", function(error,data){
            
            
            if(data.length){
                
                conn.query("select * from emails where to_user='" + myURL.query.username +"';", function(error, data){
                    var table = "<table>";
                    table += "<th> INBOX </th>";
                    table += "<tr> <td> Sender</td> <td> Subject</td> <td> Body </td> <td> Date Received </td> </tr>"
                    if(!error){
                        console.log(data);
                        if(data.length){
                            data.forEach(function (record){
                                table += "<tr>";
                                table += "<td>" +record.from_user+ "</td> <td>" + record.subject + "</td> <td>" + record.body + "</td> <td>" + record.date_time + "</td>" ;
                                table += "</tr>";                             
                            });
                            Res.write(JSON.stringify({ "status" : "success", "table" : table }));
                            Res.end();
                        } 
                        else{
                            Res.write("Inbox Is Empty"); 
                            Res.end();
                        }   
                    }
                    else{
                        Res.end();
                        throw error;
                    }
                                   
                })

            }
            else{
                Res.write(JSON.stringify({ "status" : "wrong-credentials" })); 
                Res.end();
            }
            
        });

        
    }
    
    else{
        Res.write(JSON.stringify({ "status" : "wrong-path" }));
        Res.end(); 
    }

}).listen(3005);

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