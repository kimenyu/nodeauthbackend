const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: [true, "Email already exists"],
        lowercase: true,  // Convert email to lowercase
        trim: true,       // Remove leading and trailing whitespaces
        validate: {
            validator: function (value) {
                // Validate email format
                // You can use a more sophisticated email validation library or regex if needed
                return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
            },
            message: "Please provide a valid email",
        },
    },
    
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: [6, "Password should be at least 6 characters long"],
        trim: true,  // Remove leading and trailing whitespaces
    },
});

// module.exports = mongoose.model("Users", UserSchema);


module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);