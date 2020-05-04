// load our app server using express somehow....
const express = require('express')
const app = express()
const mysql = require('mysql')

const bodyParser = require('body-parser')

//Set view engine to ejs
app.set("view engine", "ejs"); 

//Tell Express where we keep our index.ejs
app.set("views", __dirname + "/public"); 

app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static('./public'))

app.post('/createBrand', (req, res) => {
  
    const name = req.body.brandName;
    const price = req.body.avgPrice;
    
    const queryString = "INSERT INTO Brand (Brand, AvgPrice) VALUES (?, ?)"
  getConnection().query(queryString, [name, price], (err, results, fields) => {
    if (err) {
      console.log("Failed to insert new brand: " + err)
      res.sendStatus(500)
      return
    }
    console.log("Inserted a new brand");
    res.redirect('/');
    res.end()
  })
})

app.post('/createClothingItem', (req, res) => {
    const title = req.body.title;
    const brandName = req.body.brandName;
    const type = req.body.clothingType;
    const gender = req.body.gender;
    const price = req.body.price;
    const regularPrice = req.body.regularPrice;
    const rating = req.body.rating;
    
    const queryString = "INSERT INTO ClothingItem (Title, Brand, Type, Gender ,Price, RegularPrice, Rating) VALUES (?, ?, ?, ?, ?, ?, ?)"
    getConnection().query(queryString, [title, brandName, type, gender, price, regularPrice, rating], (err, results, fields) => {
    if (err) {
      console.log("Failed to insert new clothing item: " + err)
      res.sendStatus(500)
      return
    }
    console.log("Inserted a new clothing item");
    res.redirect('/');
    res.end()
  })
})

app.post('/createUser', (req, res) => {
  
    const name = req.body.name;
    const age = req.body.age;
    const dob = req.body.dob;
    const country = req.body.country;
    const address = req.body.address;
    const budget = req.body.budget;
    const avgExp = req.body.avg_expenditure;

    const queryString = "INSERT INTO User (Name, Age, DateOfBirth, Country, Address, AvgBudget, AvgExpenditure) VALUES (?, ?, ?, ?, ?, ?, ?)"
  getConnection().query(queryString, [name, age, dob, country, address, budget, avgExp], (err, results, fields) => {
    if (err) {
      console.log("Failed to insert new user: " + err)
      res.sendStatus(500)
      return
    }
    console.log("Inserted a new user with id: ");
    res.redirect('/');
    res.end()
  })
})
app.post('/editUser', (req, res) => {
    
    const id = req.body.id;
    const name = req.body.name;
    const age = req.body.age;
    const dob = req.body.dob;
    const country = req.body.country;
    const address = req.body.address;
    const budget = req.body.budget;
    const avgExp = req.body.avg_expenditure;

    const queryString = 
        `UPDATE User 
        SET 
            Name = ?, 
            Age = ?, 
            DateOfBirth = ?, 
            Country = ?,
            Address = ?,
            AvgBudget = ?,
            AvgExpenditure = ?
        WHERE 
            ID = ?`;
            
    getConnection().query(queryString, [name, age, dob, country, address, budget, avgExp, id], (err, results, fields) => {
    if (err) {
      console.log("Failed to update user: " + err)
      res.sendStatus(500)
      return
    }
    console.log("Updated user with id: ");
    res.redirect('/');
    res.end()
  })
})

function getConnection() {
  return mysql.createConnection({
    host: '127.0.0.1',
    user: 'databass411_kartik',
    password: 'Ss24045649',
    database: 'databass411_fashion',
    charset: 'utf8',
    multipleStatements: true,
  })
}

var reo ='<html><html><head><title>Query Result</title><script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css"><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap-theme.min.css"><script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"></script></head><body><div style="margin:100px;"><nav class="navbar navbar-inverse navbar-static-top"><div class="container"><a class="navbar-brand" href="/">Fashion Databass! </a><ul class="nav navbar-nav"><li class="active"><a href="/">Home</a></li><li><a href="/manage.html">Manage Database</a></li><li><a href="/users">Users</a></li><li><a href="/brands">Brands</a></li><li><a href="/clothes">Clothes</a></li></ul></div></nav>{${table}}</div></body></html>';

function genTable(rows, cols, folder) {
    var table =''; //to store html table
      //create html table with data from res.
    for(var i=0; i<rows.length; i++) {
        myObj = rows[i];
        var prim_key;
        var k = 0;
        for( var j in myObj ) {
            if (myObj.hasOwnProperty(j)) {
                if(k == 0) {
                    prim_key = myObj[j]
                    table += '<td><a href = /'+folder+'/edit/'+ myObj[j] +' >' + myObj[j] +'</a></td>';
                }
                else
                    table += '<td>' + myObj[j] +'</td>';
            }
            k = k+1;
        }
        table += '<td><a href = /'+folder+'/delete/'+ prim_key +' >delete</a></td>';
        table += '</tr>'
    }
    table_head = '<table border="1"><tr>';
    for(var j = 0; j < cols.length; j ++) {
        table_head += '<th>' + cols[j].name + '</th>';
    }
    table = table_head + '</tr>'+ table +'</table>';
    return table;
}


function genTable2(rows, cols) {
    var table ='';
    for(var i=0; i<rows.length; i++) {
        myObj = rows[i];
        for( var j in myObj ) {
            if (myObj.hasOwnProperty(j)) {
                table += '<td>' + myObj[j] +'</td>';
            }
        }
        table += '</tr>'
    }
    table_head = '<table border="1"><tr>';
    for(var j = 0; j < cols.length; j ++) {
        table_head += '<th>' + cols[j].name + '</th>';
    }
    table = table_head + '</tr>'+ table +'</table>';
    return table;
}

app.get('/users/:id', (req, res) => {
    console.log("Fetching user with id: " + req.params.id)
    
    const connection = getConnection()
    
    const userId = req.params.id
    const queryString = "SELECT * FROM User WHERE id = ?"
    connection.query(queryString, [userId], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for users: " + err)
      res.sendStatus(500)
      return
      // throw err
    }

    console.log("I think we fetched users successfully")

    const users = rows.map((row) => {
      return {name: row.Name, age: row.Age, dob: row.DateOfBirth, country: row.Country, address: row.Address, budget: row.AvgBudget, avgExp: row.AvgExpenditure}
    })

    res.json(users)
    })
})
app.get('/users/edit/:id', (req, res) => {
    console.log("Fetching user with id: " + req.params.id)
    
    const connection = getConnection()
    
    const userId = req.params.id
    const queryString = "SELECT * FROM User WHERE id = ?"
    connection.query(queryString, [userId], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for users: " + err)
      res.sendStatus(500)
      return
      // throw err
    }

    console.log("I think we fetched users successfully")

    const users = rows.map((row) => {
      return {name: row.Name, age: row.Age, dob: row.DateOfBirth, country: row.Country, address: row.Address, budget: row.AvgBudget, avgExp: row.AvgExpenditure, id:row.ID}
    })

    res.render("editUser", users[0]);
    })
})

app.get('/users/delete/:id', (req, res) => {
    console.log("Fetching user with id: " + req.params.id);
    
    const connection = getConnection();
    
    const userId = req.params.id;
    const queryString = "DELETE FROM User WHERE ID = ?";
    connection.query(queryString, [userId], (err, result) => {
    if (err) {
      console.log("Failed to query for users: " + err);
      res.sendStatus(500);
      return;
      // throw err
    }
    // res.write('Item deleted');
    console.log("Number of records deleted: " + result.affectedRows);
    res.redirect('/users');
    })
})


// app.get('/brands/:id', (req, res) => {
//     console.log("Fetching brand with id: " + req.params.name)
    
//     const connection = getConnection()
    
//     const brandId = req.params.brand
//     const queryString = "SELECT * FROM Brand WHERE id = ?"
//     connection.query(queryString, [brandId], (err, rows, fields) => {
//     if (err) {
//       console.log("Failed to query for users: " + err)
//       res.sendStatus(500)
//       return
//       // throw err
//     }

//     const users = rows.map((row) => {
//       return {name: row.Brand, average_: row.AvgBudget, avgExp: row.AvgExpenditure}
//     })

//     res.json(users)
//     })
// })

app.get('/recommend/:id', (req, res) => {
    console.log("Generating recommendation for user with id: " + req.params.id)
    
    const connection = getConnection()
    
    const userId = req.params.id
    const queryString = `
	CREATE TEMPORARY TABLE like_rank AS 
	SELECT similar.UserID,count(*) AS rank 
	FROM Likes AS target
	JOIN Likes AS similar ON target.ClothingID = similar.ClothingID AND target.UserID != similar.UserID AND ((target.Rating < 3 AND similar.Rating < 3) OR (target.Rating >=3 AND similar.Rating >=3)) 
	WHERE target.UserID = ? 
	GROUP BY similar.UserID; 

	SELECT similar.ClothingID, SUM(like_rank.rank) AS total_rank 
	FROM like_rank 
	JOIN Likes similar ON like_rank.UserID = similar.UserID 
	LEFT JOIN Likes AS target ON target.UserID = ? AND target.ClothingID = similar.ClothingID 
	WHERE target.ClothingID IS null 
	GROUP BY similar.ClothingID 
	ORDER BY total_rank desc 
	LIMIT 10;`
    var q = connection.query(queryString, [userId, userId], (err, rows, cols) => {
    if (err) {
      console.log("Failed to query for recommendations: " + err)
      res.write(q.sql + err);
      res.end();
      //res.sendStatus(500)
      return
      // throw err
    }
    //if(){
    //  res.write("scooby");
    //  res.end();
    //  return
    //}
    //var table = genTable2(rows, cols); //to store html table
    //var new_reo = reo.replace('{${table}}', table);
    //res.write(rows, 'utf-8');
    //res.end();
    const clothing = rows.map((row) => {
    	return {clothingID: row.ClothingID}  
    })
    res.json(clothing);
    })
})

app.get("/users", (req, res) => {
    var connection = getConnection();
    var queryString = "SELECT * FROM User";
    connection.query(queryString, (err, rows, cols) => {
    if (err) {
      console.log("Failed to query for users: " + err)
      res.sendStatus(500)
      return
    }
    var table = genTable(rows, cols, 'users'); //to store html table
    new_reo = reo.replace('{${table}}', table);
    res.write(new_reo, 'utf-8');
    
    res.end();
    // connection.release(); //Done with mysql connection
  })
})

app.get("/brands", (req, res) => {
    var connection = getConnection();
    var queryString = "SELECT * FROM Brand";
    connection.query(queryString, (err, rows, cols) => {
    if (err) {
      console.log("Failed to query for brands: " + err)
      res.sendStatus(500)
      return
    }
    var table = genTable(rows, cols, 'brands'); //to store html table
    new_reo = reo.replace('{${table}}', table);
    res.write(new_reo, 'utf-8');
    res.end();
    // connection.release(); //Done with mysql connection
  })
})

app.get("/clothes", (req, res) => {
    var connection = getConnection();
    var queryString = "SELECT * FROM ClothingItem";
    connection.query(queryString, (err, rows, cols) => {
    if (err) {
      console.log("Failed to query for clothes: " + err)
      res.sendStatus(500)
      return
    }
    var table = genTable(rows, cols, 'clothes'); //to store html table
    new_reo = reo.replace('{${table}}', table);
    res.write(new_reo, 'utf-8');
    res.end();
    // connection.release(); //Done with mysql connection
  })
})

app.get("/", (req, res) => {
    console.log("Responding to root route")
    res.sendFile(path.join(__dirname+'/index.html'));
})

// localhost:3003
app.listen(3003, () => {
    console.log("Server is up and listening on 3003...")
})
