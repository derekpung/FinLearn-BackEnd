// Import mysql package to connect to mysql server
const mysql = require("mysql");
// Import dotenv to import properties from .env file
const dotenv = require("dotenv").config();

var request = require('request');

// Define properties to be used for mysql connection
const properties = {
  host: `${process.env.DBHOST}`,
  port: process.env.DBPORT,
  user: `${process.env.DBUSER}`,
  password: `${process.env.DBPASSWD}`,
  database: `${process.env.DBNAME}`,
};

// Create a connection object which will hold the connection to cloud mysql server.
let connection = mysql.createConnection(properties);

// Attempt to connect with the mysql server.
// If connection fails, print the error message. Otherwise, print the success message.
connection.connect((errors) => {
  if (errors) {
    console.log("Couldn't connect to the MySQL Server. Error: " + errors);
  } else {
    console.log("Connected to MySQL successfully!");
    connection.query(`DROP TABLE course`, 
        (errors, results) => {
            if (errors) throw errors;
        }
    );
    console.log("Dropped table course");

    connection.query(
        `create table course(
            id VARCHAR(14) NOT NULL,
            title VARCHAR(100) NOT NULL,
            category VARCHAR(50) NOT NULL,
            description VARCHAR(1000) NOT NULL,
            objective VARCHAR(2000) NOT NULL,
            duration FLOAT NOT NULL,
            provider VARCHAR(50) NOT NULL,
            provider_info VARCHAR(800) NOT NULL,
            earnings INT NOT NULL,
            image_link VARCHAR(200),
            video_link VARCHAR(200),
            quiz_q1 VARCHAR(200),
            quiz_a1 BOOLEAN,
            quiz_q2 VARCHAR(200),
            quiz_a2 BOOLEAN,
            quiz_q3 VARCHAR(200),
            quiz_a3 BOOLEAN,
            quiz_q4 VARCHAR(200),
            quiz_a4 BOOLEAN,
            quiz_q5 VARCHAR(200),
            quiz_a5 BOOLEAN,
            PRIMARY KEY (id)
        )`, 
        (errors, results) => {
            if (errors) throw errors;
        }
    );
    console.log("Created table course");

    var options = {
    'method': 'GET',
    'url': 'https://public-api.ssg-wsg.sg/courses/directory/TGS-2020507496',
    'headers': {
        'Authorization': `${process.env.SFTOKEN}`
    },
    form: {

    }
    };

    request(options, function (error, response) {
    if (error) throw new Error(error);
    const obj = JSON.parse(response.body);
    //   console.log(obj.data.courses[0].areaOfTrainings[0].description);

    connection.query(
        `insert into course 
        (id,title,category,description,objective,duration,provider,provider_info,earnings) 
        values 
        ('${obj.data.courses[0].referenceNumber}',
        '${obj.data.courses[0].title}',
        '${obj.data.courses[0].areaOfTrainings[0].description}',
        '${obj.data.courses[0].content}',
        '${obj.data.courses[0].objective}',
        '${obj.data.courses[0].totalTrainingDurationHour}',
        '${obj.data.courses[0].trainingProviderAlias}',
        '${obj.data.courses[0].trainingProvider.aboutUs}',
        '${Math.ceil(obj.data.courses[0].totalCostOfTrainingPerTrainee/100)}')`,
        (errors, results) => {
                if (errors) throw errors;
            }
        );

        if(obj.data.courses[0].referenceNumber == 'TGS-2020507496')
        {
            connection.query(
                `UPDATE
                course
                SET
                image_link = 'https://images.unsplash.com/photo-1519995451813-39e29e054914?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
                video_link = 'https://www.youtube.com/watch?v=SSo_EIwHSd4',
                quiz_q1 = 'Blockchain is the same as bitcoin.',
                quiz_a1 = false,
                quiz_q2 = 'Multiple people can access a record simultaneously when it is on a blockchain.',
                quiz_a2 = true,
                quiz_q3 = 'Records cannot be altered once they are submitted on a blockchain.',
                quiz_a3 = true,
                quiz_q4 = 'It is possible to program a blockchain to record transactions automatically.',
                quiz_a4 = true,
                quiz_q5 = 'All blockchains are fully public.',
                quiz_a5 = false
                WHERE
                id = 'TGS-2020507496'`,
                (errors, results) => {
                        if (errors) throw errors;
                    }
            );
        }
        console.log(`Inserted course ${obj.data.courses[0].referenceNumber}: ${obj.data.courses[0].title}`);
    });

    connection.query(`DROP TABLE user`, 
        (errors, results) => {
            if (errors) throw errors;
        }
    );
    console.log("Dropped table user");

    connection.query(
        `create table user(
        id VARCHAR(40) NOT NULL,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(50) NOT NULL,
        signup TIMESTAMP NOT NULL DEFAULT 0,
        verified BOOLEAN NOT NULL,
        wallet INT NOT NULL,
        PRIMARY KEY (id)
    )`, 
        (errors, results) => {
            if (errors) throw errors;
        }
    );
    console.log("Created table user");

    connection.query(`DROP TABLE transaction`, 
        (errors, results) => {
            if (errors) throw errors;
        }
    );
    console.log("Dropped table transaction");

    connection.query(
        `create table transaction(
        id SMALLINT UNSIGNED AUTO_INCREMENT NOT NULL,
        signup TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        completed TIMESTAMP DEFAULT 0,
        user VARCHAR(40) NOT NULL REFERENCES user(id),
        course VARCHAR(14) NOT NULL REFERENCES course(id),
        PRIMARY KEY (id)
    )`, 
        (errors, results) => {
            if (errors) throw errors;
        }
    );
    console.log("Created table transaction");
  }
});

// Export the connection object so that it could be used in other code files.
module.exports = {
  connection,
};

