const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const User = require('../../models/User');
const { SECRET_KEY } = require('../../config');
const {alidateRegisterInputs, validateRegisterInputs} = require ('../../util/validators');

module.exports = {
    Mutation: {
        async register(parent,
            {
                registerInput: { username, email, password, confirmPassword }
            },
            context, 
            info) {
            // : Validate user data
            const {valid, errors } = validateRegisterInputs(
                username,
                email,
                password,
                confirmPassword
            )
            if (!valid) {
                throw new UserInputError('Error', {errors});
            }
            // : Make sure user doesn't already exit
            const user =  await User.findOne({ username })

            if (user)
            {
                throw new UserInputError('Username is taken',{
                    errors:{
                        username: 'This username is taken'
                    }
                })
            }
            //  hash password and create an auth token
            password = await bcrypt.hash(password,12);

            const newUser =  new User({
                username,
                password,
                email,
                createdAt: new Date().toISOString()
            });

            const res =  await newUser.save();

            const token = jwt.sign({
                id: res.id,
                email: res.email,
                username: res.username
            }, SECRET_KEY, { expiresIn: '1h'})

            return {
                ...res._doc,
                id: res._id,
                token
            }


        }
    }
}