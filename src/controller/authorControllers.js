const jwt = require('jsonwebtoken');
const authorModule = require('../modules/authorModule');


/*------------------------------------------------------------------------------------------
 ## Author APIs /authors
 -> Create an author - atleast 5 authors
 -> Create a author document from request body. Endpoint: BASE_URL/authors
------------------------------------------------------------------------------------------ */


const createAuthor = async function (req, res) {
    try {
        const reqAuthor = req.body;
        if (Object.keys(reqAuthor).length == 0) {
            return res.status(400).send({
                status: false,
                msg: "Body is required"
            })
        }
        // false cases...
        if (!reqAuthor.fname) return res.status(400).send({
            status: false,
            msg: "First Name must be required!"
        })

        if (!reqAuthor.lname) return res.status(400).send({
            status: false,
            msg: "Last Name must be required!"
        })

        if (!reqAuthor.title) return res.status(400).send({
            status: false,
            msg: "Title must be required!"
        })

        if (!reqAuthor.email) return res.status(400).send({
            status: false,
            msg: "Email must be required!"
        })

        if (!reqAuthor.password) return res.status(400).send({
            status: false,
            msg: "Password must be required!"
        })


        const saveData = await authorModule.create(reqAuthor)
        if (!saveData) return res.status(500).send({
            status: false,
            msg: "Can't save something went wrong"
        })
        res.status(201).send({
            status: true,
            data: saveData
        })

    } catch (err) {
        console.log(err.message)
        res.status(500).send({
            status: false,
            msg: err.message
        })
    }
}

const authorLogin = async function (req, res) {
    try {
        if (Object.keys(req.body).length == 0) return res.status(400).send({
            status: false,
            msg: "body not present"
        })

        let email = req.body.email
        let password = req.body.password

        if (!email) return res.status(400).send({
            status: false,
            msg: "email not present"
        })

        if (!password) return res.status(400).send({
            status: false,
            msg: "password not present"
        })

        let findAuthor = await authorModule.findOne({
                email: email,
                password: password
            })
            .catch(error => null);

        if (!findAuthor) return res.status(401).send({
            status: false,
            msg: "email & password not valid"
        })

        //jwt.sign token creation
        const token = jwt.sign({
            authorId: findAuthor._id.toString()
        }, 'Group 27');

        res.status(200).send({
            status: true,
            data: token
        })
    } catch (err) {
        console.log(err.message)
        res.status(500).send({
            status: false,
            msg: err.message
        })
    }
}


module.exports.createAuthor = createAuthor
module.exports.authorLogin = authorLogin