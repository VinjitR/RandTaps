const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const User = require('../../models/User');
const { SECRET_KEY } = require('../../config');
const {validateLoginInput, validateRegisterInputs} = require ('../../util/validators');

function generateToken(user){
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_KEY, { expiresIn: '1h'})
}


module.exports = {
    Mutation: {
        async login( parent, {username, password} , context, info){
            const {errors,valid} = validateLoginInput(username, password);
            if (!valid) {
                throw new UserInputError('Error', {errors});
            }
            const user = await User.findOne({username})
            if (!user){
                errors.general = 'User not found';
                throw new UserInputError('User not found',{errors})
            }
            const match =  await bcrypt.compare( password, user.password );
            if (!match){
                errors.general = 'Wrong credentials';
                throw new UserInputError('Wrong credentials',{errors})
            }
            
            const token = generateToken(user);
            return {
                ...user._doc,
                id: user._id,
                token
            }
        },

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

            const resUser =  await newUser.save();

            const token = generateToken(resUser);

            return {
                ...resUser._doc,
                id: resUser._id,
                token
            }


        }
    }
}