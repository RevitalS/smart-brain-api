const handleRegister = (req,res, db, bcrypt) => {

    function validateEmail(email) 
    {
        var re = /\S+@\S+.\S/;
        return re.test(email);  
    }

    const  {email, name, password} = req.body;
    if (!email || ! name || ! password) {
        return res.status(400).json('incorrect form submission');
    } 
    if (!validateEmail(email)) {
        return res.status(400).json('invalid email');
    }

        db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid){
                return db.select('*').from('users')
                .where('email', '=', email)
                .then(user => {
                    res.json(user[0])
                    })
                }
            })
        


    const hash = bcrypt.hashSync(password);

    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail =>{
           return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0],
                name: name,
                joined: new Date()
            })
            .then(user => {
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register'));

    
}

module.exports = {
    handleRegister: handleRegister
};